import { type ReactNode, createContext } from 'react';

type SignInCredentials = {
	email: string;
	password: string;
};

type AuthContextData = {
	signIn: (credentials: SignInCredentials) => Promise<void>;
	isAuthenticated: boolean;
};

type AuthProviderProps = {
	children: ReactNode;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
	const isAuthenticated = false;

	async function signIn({ email, password }: SignInCredentials) {
		console.log({ email, password });
	}

	return <AuthContext.Provider value={{ signIn, isAuthenticated }}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
