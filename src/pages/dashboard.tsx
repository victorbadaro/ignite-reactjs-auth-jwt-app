import { Can } from '@/components/can';
import { useAuth } from '@/hooks/use-auth';
import { setupAPIClient } from '@/services/api';
import { api } from '@/services/api-client';
import { withSSRAuth } from '@/utils/with-ssr-auth';
import { useEffect } from 'react';

export default function Dashboard() {
	const { user, signOut } = useAuth();

	useEffect(() => {
		api
			.get('/me')
			.then((response) => console.log(response))
			.catch((error) => console.log(error));
	}, []);

	return (
		<>
			<h1>Dashboard: {user?.email}</h1>

			<button type="button" onClick={signOut}>
				Sign out
			</button>

			<Can permissions={['metrics.list']}>
				<div>Métricas</div>
			</Can>
		</>
	);
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
	const apiClient = setupAPIClient(ctx);
	const response = await apiClient.get('/me');

	console.log(response);

	return {
		props: {}
	};
});
