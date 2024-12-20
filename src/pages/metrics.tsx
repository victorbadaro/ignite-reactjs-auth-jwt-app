import { setupAPIClient } from '@/services/api';
import { withSSRAuth } from '@/utils/with-ssr-auth';

export default function Metrics() {
	return (
		<>
			<h1>Metrics</h1>
		</>
	);
}

export const getServerSideProps = withSSRAuth(
	async (ctx) => {
		const apiClient = setupAPIClient(ctx);
		const response = await apiClient.get('/me');

		console.log(response.data);

		return {
			props: {}
		};
	},
	{
		permissions: ['metrics.list3'],
		roles: ['administrator']
	}
);
