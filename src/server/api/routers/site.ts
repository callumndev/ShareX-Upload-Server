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
            superAdmin: z.string(),
            allowRegistrationRequests: z.boolean(),
        }))
        .mutation(async ({ input }) => {
            try {
                // Get current site settings
                const storageSettings = await db.siteSettings.findUnique({
                    where: {
                        site: env.SITE_DOMAIN,
                    }
                });

                // Check if the site has already been setup
                if (storageSettings?.setup) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "This site has already been setup.",
                    });
                }

                // New site settings
                const settings = {
                    setup: true,
                    superadmin: input.superAdmin,
                    allowRegistrationRequests: input.allowRegistrationRequests,
                }

                // Update or create new settings for the site
                await db.siteSettings.upsert({
                    where: {
                        site: env.SITE_DOMAIN,
                    },
                    update: settings,
                    create: {
                        site: env.SITE_DOMAIN,
                        ...settings,
                    },
                });
            } catch (e) {
                console.error(`Error saving site settings for site "${env.SITE_DOMAIN}":`, e);
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
