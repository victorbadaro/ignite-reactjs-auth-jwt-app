import { useAuth } from '@/hooks/use-auth';
import type { GetServerSideProps } from 'next';
import { type FormEvent, useState } from 'react';

import styles from '@/styles/Home.module.css';
import { parseCookies } from 'nookies';

export default function Home() {
	const { signIn } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const data = {
			email,
			password
		};

		await signIn(data);
	}

	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
			<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />

			<button type="submit">Entrar</button>
		</form>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const cookies = parseCookies(ctx);

	if (cookies['ignite-reactjs-auth-jwt-app.token']) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false
			}
		};
	}

	return {
		props: {}
	};
};
