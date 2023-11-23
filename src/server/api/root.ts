import type { GetServerSidePropsContext } from "next";

import { siteRouter } from "@/server/api/routers/site";
import { userRouter } from "@/server/api/routers/user";
import { uploadRouter } from "@/server/api/routers/upload";
import { createTRPCRouter } from "@/server/api/trpc";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    site: siteRouter,
    user: userRouter,
    upload: uploadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export function to create router caller
export const createCaller = async (context: GetServerSidePropsContext) => {
    // Get session
    const authRequest = auth.handleRequest(context);
    const session = await authRequest.validate();

    // Return caller
    return appRouter.createCaller({
        session,
        db
    });
}
