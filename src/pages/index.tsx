import Head from "next/head";
import Link from "next/link";
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    InferGetServerSidePropsType
} from "next";

import type { User } from "lucia";

import { auth } from "@/server/auth";
import { createCaller } from "@/server/api/root";

import Layout from "@/components/Layout";

import loginRedirectWithOrigin from "@/utils/auth/loginRedirectWithOrigin";

export const getServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<
    GetServerSidePropsResult<{
        user: User;
    }>
> => {
    // Get session
    const authRequest = auth.handleRequest(context);
    const session = await authRequest.validate();

    // Redirect to login if not logged in
    if (!session)
        return loginRedirectWithOrigin(context);

    // Create API caller
    const apiCaller = await createCaller(context);

    // Get site settings
    const settings = await apiCaller.site.getSettings();

    // Redirect to setup if not set up
    if (!settings?.setup) {
        return {
            redirect: {
                destination: '/setup',
                permanent: false
            }
        }
    }

    return {
        props: {
            user: session.user
        }
    }
};

export default function Home(
    { user }:
        InferGetServerSidePropsType<typeof getServerSideProps>
) {
    return (
        <>
            <Layout user={user}>
                <Head>
                    <title>Create T3 App</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
                        </h1>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                            <Link
                                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                                href="https://create.t3.gg/en/usage/first-steps"
                                target="_blank"
                            >
                                <h3 className="text-2xl font-bold">First Steps →</h3>
                                <div className="text-lg">
                                    Just the basics - Everything you need to know to set up your
                                    database and authentication.
                                </div>
                            </Link>
                            <Link
                                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                                href="https://create.t3.gg/en/introduction"
                                target="_blank"
                            >
                                <h3 className="text-2xl font-bold">Documentation →</h3>
                                <div className="text-lg">
                                    Learn more about Create T3 App, the libraries it uses, and how
                                    to deploy it.
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>
            </Layout>
        </>
    );
}
