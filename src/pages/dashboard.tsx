import { useAuth } from '@/hooks/use-auth';
import { api } from '@/services/api';
import { useEffect } from 'react';

export default function Dashboard() {
	const { user } = useAuth();

	useEffect(() => {
		api.get('/me').then((response) => console.log(response));
	}, []);

	return <h1>Dashboard: {user?.email}</h1>;
}
