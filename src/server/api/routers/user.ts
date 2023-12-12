import { z } from "zod";

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

    getAllUsers: protectedProcedure.query(async () => {
        return await db.user.findMany({
            select: {
                // User data
                id: true,
                username: true,
                joinedAt: true,
                role: true,
                banned: true,

                // Select the upload count
                _count: {
                    select: {
                        uploads: true,
                    },
                },

                // Select the most recent upload
                uploads: {
                    // Select the upload ID and creation date
                    select: {
                        id: true,
                        createdAt: true,
                    },
                    // Order by creation date, newest first
                    orderBy: {
                        createdAt: "desc"
                    },
                    // Only take the first result
                    take: 1,
                },
            },
        });
    }),

    getUserByID: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ input }) => {
            return await db.user.findUnique({
                where: {
                    id: input.id
                },
                select: {
                    // User data
                    id: true,
                    avatar: true,
                    username: true,
                    joinedAt: true,
                    role: true,
                    banned: true,

                    // Select the upload count
                    _count: {
                        select: {
                            uploads: true,
                            receivedRapSheets: true,
                            issuedRapSheets: true,
                        },
                    },

                    // Select the most recent upload
                    uploads: {
                        // Select the upload ID and creation date
                        select: {
                            id: true,
                            createdAt: true,
                        },
                        // Order by creation date, newest first
                        orderBy: {
                            createdAt: "desc"
                        },
                        // Only take the first result
                        take: 1,
                    },

                    // Select the rap sheets received for this user
                    receivedRapSheets: {
                        // Order by occurrence date, newest first
                        orderBy: {
                            occurredAt: "desc"
                        },

                        // Select the issuing user
                        select: {
                            id: true,
                            type: true,

                            reason: true,
                            duration: true,
                            occurredAt: true,

                            issuer: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatar: true,
                                },
                            },

                            recipient: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatar: true,
                                },
                            },
                        },
                    },

                    // Select the rap sheets issued by this user
                    issuedRapSheets: {
                        // Order by occurrence date, newest first
                        orderBy: {
                            occurredAt: "desc"
                        },

                        // Select the issuing user
                        select: {
                            id: true,
                            type: true,

                            reason: true,
                            duration: true,
                            occurredAt: true,

                            issuer: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatar: true,
                                },
                            },

                            recipient: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
            });
        }),

    deleteSessionsByID: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .mutation(async ({ input }) => {
            await db.session.deleteMany({
                where: {
                    user_id: input.id
                },
            });
        }),

    unbanUserByID: protectedProcedure
        .input(z.object({
            id: z.string(),
            reason: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            await db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    banned: false,
                },
            });

            await db.rapSheet.create({
                data: {
                    type: "UNBAN",

                    reason: input.reason,

                    issuer: {
                        connect: {
                            id: ctx.session.user.userId,
                        },
                    },

                    recipient: {
                        connect: {
                            id: input.id,
                        },
                    },
                },
            });
        }),

    banUserByID: protectedProcedure
        .input(z.object({
            id: z.string(),
            reason: z.string().optional(),
            duration: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            await db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    banned: true,
                },
            });

            await db.rapSheet.create({
                data: {
                    type: "BAN",

                    reason: input.reason,
                    duration: input.duration,

                    issuer: {
                        connect: {
                            id: ctx.session.user.userId,
                        },
                    },

                    recipient: {
                        connect: {
                            id: input.id,
                        },
                    },
                },
            });
        }),
});
