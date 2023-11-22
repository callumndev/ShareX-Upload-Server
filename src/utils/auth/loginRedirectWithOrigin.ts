import type { GetServerSidePropsContext } from "next";

import { buildUrl } from 'build-url-ts';

/**
 * Returning the result of this function from getServerSideProps will redirect the user
 * to the login page with the origin query parameter set to the current page
 * @param ctx GetServerSidePropsContext
 * @returns object to return from getServerSideProps
 */
export default function loginRedirectWithOrigin(ctx: GetServerSidePropsContext) {
    const protocol: "https" | "http" = ctx.req.headers['x-forwarded-proto'] == 'https' ? 'https' : 'http';
    const host = `${protocol}://${ctx.req.headers.host}`;

    return {
        redirect: {
            destination: buildUrl(host, {
                path: "login",
                queryParams: {
                    // Automatically URL encoded
                    origin: `${host}${ctx.resolvedUrl}`,
                },
            }),
            permanent: false,
        },
    }
}
