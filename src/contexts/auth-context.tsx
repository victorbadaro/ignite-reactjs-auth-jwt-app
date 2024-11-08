import { api } from '@/services/api-client';
import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { type ReactNode, createContext, useEffect, useState } from 'react';

type User = {
	email: string;
	permissions: string[];
	roles: string[];
};

type SignInCredentials = {
	email: string;
	password: string;
};

type AuthContextData = {
	signIn: (credentials: SignInCredentials) => Promise<void>;
	user: User;
	isAuthenticated: boolean;
};

type AuthProviderProps = {
	children: ReactNode;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function signOut() {
	destroyCookie(undefined, 'ignite-reactjs-auth-jwt-app.token');
	destroyCookie(undefined, 'ignite-reactjs-auth-jwt-app.refreshToken');

	Router.push('/');
}

function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User>(null);
	const isAuthenticated = !!user;

	useEffect(() => {
		const { 'ignite-reactjs-auth-jwt-app.token': token } = parseCookies();

		if (token) {
			api
				.get('/me')
				.then((response) => {
					const { email, permissions, roles } = response.data;

					setUser({ email, permissions, roles });
				})
				.catch(() => {
					signOut();
				});
		}
	}, []);

	async function signIn({ email, password }: SignInCredentials) {
		try {
			const response = await api.post('/sessions', {
				email,
				password
			});

			const { token, refreshToken, permissions, roles } = response.data;

			setCookie(undefined, 'ignite-reactjs-auth-jwt-app.token', token, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			});
			setCookie(undefined, 'ignite-reactjs-auth-jwt-app.refreshToken', refreshToken, {
				maxAge: 60 * 60 * 24 * 30, // 30 days
				path: '/'
			});

			setUser({
				email,
				permissions,
				roles
			});

			api.defaults.headers.Authorization = `Bearer ${token}`;

			Router.push('/dashboard');
		} catch (error) {
			console.log(error);
		}
	}

	return <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider, signOut };
