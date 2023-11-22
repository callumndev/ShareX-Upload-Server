import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { discord } from "@lucia-auth/oauth/providers";
import { prisma } from "@lucia-auth/adapter-prisma";
import "lucia/polyfill/node";

import { db } from "@/server/db";
import { env } from "@/env.mjs";

export const auth = lucia({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	adapter: prisma(db),
	env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
	middleware: nextjs_future(),
	getUserAttributes: (data) => {
		return {
			discordUsername: data.username,
			avatar: data.avatar,
		};
	}
});

export const discordAuth = discord(auth, {
	clientId: env.DISCORD_CLIENT_ID,
	clientSecret: env.DISCORD_CLIENT_SECRET,
	redirectUri: env.DISCORD_REDIRECT_URI,
	scope: ['identify']
});

export type Auth = typeof auth;
