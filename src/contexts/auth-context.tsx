import { api } from '@/services/api';
import Router from 'next/router';
import { setCookie } from 'nookies';
import { type ReactNode, createContext, useState } from 'react';

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

function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User>(null);
	const isAuthenticated = !!user;

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

			Router.push('/dashboard');
		} catch (error) {
			console.log(error);
		}
	}

	return <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
