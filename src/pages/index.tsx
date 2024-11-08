import { useAuth } from '@/hooks/use-auth';
import { type FormEvent, useState } from 'react';

import styles from '@/styles/Home.module.css';
import { withSSRGuest } from '@/utils/with-ssr-guest';

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

export const getServerSideProps = withSSRGuest(async () => {
	return {
		props: {}
	};
});
