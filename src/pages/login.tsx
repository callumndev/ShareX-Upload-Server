import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { auth } from "@/server/auth";

import { login } from "@/utils/auth/actions";

export const getServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<
    GetServerSidePropsResult<Record<string, never>>
> => {
    // Get session
    const authRequest = auth.handleRequest(context);
    const session = await authRequest.validate();

    // Redirect to home if logged in
    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        };
    }

    return {
        props: {}
    }
}

interface LoginQuery {
    origin?: string;
}

export default function Login() {
    const router = useRouter();
    const query: LoginQuery = router.query;

    return (
        <>
            <Head>
                <title>Login Required!</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-indigo-600">403</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Forbidden</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">You are required to login to view this resource.</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="#"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => void login(query.origin)}
                        >
                            Login
                        </a>
                    </div>
                </div>
            </main>

        </>
    );
}
