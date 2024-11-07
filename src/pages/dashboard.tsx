import { useAuth } from '@/hooks/use-auth';

export default function Dashboard() {
	const { user } = useAuth();

	return <h1>Dashboard: {user?.email}</h1>;
}
