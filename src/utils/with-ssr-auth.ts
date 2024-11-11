import { AuthTokenError } from '@/services/errors/auth-token-error';
import decode from 'jwt-decode';
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { validateUserPermissions } from './validate-user-permissions';

type WithSSRAuthOptions = {
	permissions?: string[];
	roles?: string[];
};

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions): GetServerSideProps {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx);
		const token = cookies['ignite-reactjs-auth-jwt-app.token'];

		if (!token) {
			return {
				redirect: {
					destination: '/',
					permanent: false
				}
			};
		}

		if (options) {
			const user = decode<{ permissions: string[]; roles: string[] }>(token);
			const { permissions, roles } = options;

			const userHasValidPermissions = validateUserPermissions({
				user,
				permissions,
				roles
			});

			if (!userHasValidPermissions) {
				return {
					redirect: {
						destination: '/dashboard',
						permanent: false
					}
				};
			}
		}

		try {
			return await fn(ctx);
		} catch (error) {
			if (error instanceof AuthTokenError) {
				destroyCookie(ctx, 'ignite-reactjs-auth-jwt-app.token');
				destroyCookie(ctx, 'ignite-reactjs-auth-jwt-app.refreshToken');

				return {
					redirect: {
						destination: '/',
						permanent: false
					}
				};
			}
		}
	};
}
