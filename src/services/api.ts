import { signOut } from '@/contexts/auth-context';
import axios, { type AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

type AxiosErrorResponse = {
	code?: string;
};

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

export const api = axios.create({
	baseURL: 'http://localhost:3333',
	headers: {
		Authorization: `Bearer ${cookies['ignite-reactjs-auth-jwt-app.token']}`
	}
});

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError<AxiosErrorResponse>) => {
		if (error.response.status === 401) {
			if (error.response.data?.code === 'token.expired') {
				cookies = parseCookies();

				const { 'ignite-reactjs-auth-jwt-app.refreshToken': refreshToken } = cookies;
				const originalConfig = error.config;

				if (!isRefreshing) {
					isRefreshing = true;

					api
						.post('/refresh', { refreshToken })
						.then((response) => {
							const { token } = response.data;

							setCookie(undefined, 'ignite-reactjs-auth-jwt-app.token', token, {
								maxAge: 60 * 60 * 24 * 30, // 30 days
								path: '/'
							});
							setCookie(undefined, 'ignite-reactjs-auth-jwt-app.refreshToken', response.data.refreshToken, {
								maxAge: 60 * 60 * 24 * 30, // 30 days
								path: '/'
							});

							api.defaults.headers.Authorization = `Bearer ${token}`;

							failedRequestsQueue.forEach((request) => request.onSuccess(token));
							failedRequestsQueue = [];
						})
						.catch((error) => {
							failedRequestsQueue.forEach((request) => request.onFailure(error));
							failedRequestsQueue = [];
						})
						.finally(() => {
							isRefreshing = false;
						});
				}

				return new Promise((resolve, reject) => {
					failedRequestsQueue.push({
						onSuccess: (token: string) => {
							originalConfig.headers.Authorization = `Bearer ${token}`;

							resolve(api(originalConfig));
						},
						onFailure: (error: AxiosError) => {
							reject(error);
						}
					});
				});
			}

			signOut();
		}

		return Promise.reject(error);
	}
);
