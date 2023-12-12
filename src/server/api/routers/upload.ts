import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

import { z } from "zod";

export const uploadRouter = createTRPCRouter({
    getRecent: protectedProcedure
        .input(z.string().optional())
        .query(async ({ input }) => {
            return await db.upload.findMany({
                where: input ? {
                    user: {
                        id: input,
                    }
                } : undefined,
                take: 4,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    createdAt: true,

                    user: {
                        select: {
                            username: true,
                            avatar: true,
                        },
                    },
                },
            })
        }),
});
