import Head from "next/head";
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    InferGetServerSidePropsType
} from "next";
import { useEffect, useState } from "react";

import type { User } from "lucia";

import { auth } from "@/server/auth";
import { createCaller } from "@/server/api/root";

import Layout from "@/components/Layout";

import loginRedirectWithOrigin from "@/utils/auth/loginRedirectWithOrigin";
import { type UserGetAllUsersOutput, api } from "@/utils/api";

import { DataTable } from "./data-table";
import { columns } from "./columns"

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
                destination: "/setup",
                permanent: false
            }
        }
    }

    return {
        props: {
            user: session.user
        }
    }
}

export default function Home(
    { user }:
        InferGetServerSidePropsType<typeof getServerSideProps>
) {
    const [allUsersData, setAllUsersData] = useState<UserGetAllUsersOutput>([]);

    const allUsers = api.user.getAllUsers.useQuery()


    useEffect(() => {
        // All users
        if (allUsers.fetchStatus == "idle" && allUsers.isSuccess) {
            setAllUsersData(allUsers.data);
        }
    }, [allUsers])


    return (
        <Layout user={user}>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <DataTable columns={columns} data={allUsersData} />
        </Layout>
    )
}
