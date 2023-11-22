import type { NextApiRequest, NextApiResponse } from "next";

import { serializeCookie } from "lucia/utils";

import { auth, discordAuth } from "@/server/auth";

import validateLoginOrigin from "@/utils/auth/validateLoginOrigin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Only allow GET requests
	if (req.method != "GET") {
		res.status(405).end();
		return;
	}

	// Get session
	const authRequest = auth.handleRequest({ req, res });
	const session = await authRequest.validate();

	// Check if there is already a valid session (already logged in)
	if (session) {
		res.status(302).setHeader("Location", "/").end();
		return;
	}

	// Get Discord auth URL and state
	const [url, state] = await discordAuth.getAuthorizationUrl();

	// Cookies to set on response
	const cookies: string[] = [
		// Store state cookie for callback
		serializeCookie("discord_oauth_state", state, {
			httpOnly: true,
			secure: process.env.NODE_ENV == "production",
			path: "/",
			maxAge: 60 * 60
		})
	];

	// Get origin query param
	const origin = req.query.origin;
	if (typeof origin == "string") {
		// Validate origin is from this site
		if (validateLoginOrigin(req, origin)) {
			// Build origin cookie
			const originCookie = serializeCookie("discord_oauth_origin_" + state, origin, {
				httpOnly: true,
				secure: process.env.NODE_ENV == "production",
				path: "/",
				maxAge: 60 * 60,
			});

			// Add origin cookie to cookies
			cookies.push(originCookie);
		}
	}

	// Create redirect response
	res
		.status(302)
		// Set state cookie
		.setHeader("Set-Cookie", cookies)
		// Redirect to Discord auth url
		.setHeader("Location", url.toString())
		.end();
}
