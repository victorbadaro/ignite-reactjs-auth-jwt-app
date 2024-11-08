import { AuthTokenError } from '@/services/errors/auth-token-error';
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { destroyCookie, parseCookies } from 'nookies';

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
		const cookies = parseCookies(ctx);

		if (!cookies['ignite-reactjs-auth-jwt-app.token']) {
			return {
				redirect: {
					destination: '/',
					permanent: false
				}
			};
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
