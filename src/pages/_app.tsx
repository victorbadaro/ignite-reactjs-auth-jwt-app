import { AuthProvider } from '@/contexts/auth-context';
import type { AppProps } from 'next/app';

import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	);
}
