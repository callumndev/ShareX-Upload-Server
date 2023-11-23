import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const uploadRouter = createTRPCRouter({
    getRecent: protectedProcedure.query(async () => {
        return await db.upload.findMany({
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
