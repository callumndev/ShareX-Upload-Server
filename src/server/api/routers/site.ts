import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

import { env } from "@/env.mjs";

import getErrorMessage from "@/utils/getErrorMessage";

export const siteRouter = createTRPCRouter({
    getCurrentDomain: protectedProcedure.query(() => env.SITE_DOMAIN),

    setup: protectedProcedure
        .input(z.object({
            siteDomain: z.string(),
            superAdmin: z.string(),
            allowRegistration: z.boolean(),
        }))
        .mutation(async ({ input }) => {
            try {
                const settings = {
                    setup: true,
                    superadmin: input.superAdmin,
                    allowRegistration: input.allowRegistration,
                }

                await db.siteSettings.upsert({
                    where: {
                        site: env.SITE_DOMAIN,
                        setup: false,
                    },
                    update: settings,
                    create: {
                        site: env.SITE_DOMAIN,
                        ...settings,
                    },
                });
            } catch (e) {
                console.error(`Error saving site settings for site '${env.SITE_DOMAIN}':`, e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: getErrorMessage(e),
                });
            }
        }),

    getSettings: protectedProcedure.query(async () => {
        const settings = await db.siteSettings.findUnique({
            where: {
                site: env.SITE_DOMAIN
            }
        });
        return settings;
    }),
});
