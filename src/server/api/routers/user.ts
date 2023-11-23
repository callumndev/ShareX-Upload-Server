import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
    getUploadCount: protectedProcedure.query(async ({ ctx }) => {
        return await db.upload.count({
            where: {
                user_id: ctx.session.user.userId
            },
        });
    }),

    getLastUploadDate: protectedProcedure.query(async ({ ctx }) => {
        const lastUpload = await db.upload.findFirst({
            where: {
                user_id: ctx.session.user.userId
            },
            orderBy: {
                createdAt: "desc"
            },
        });

        return lastUpload?.createdAt ?? null;
    }),

    getJoinedDate: protectedProcedure.query(async ({ ctx }) => {
        const user = await db.user.findUnique({
            where: {
                id: ctx.session.user.userId
            },
        });

        return user?.joinedAt ?? null;
    }),
});
