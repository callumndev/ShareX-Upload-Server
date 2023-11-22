import type { NextApiRequest, NextApiResponse } from "next";

import { parseCookie, serializeCookie } from "lucia/utils";
import { OAuthRequestError } from "@lucia-auth/oauth";

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

	// Get code & state cookie
	const cookies = parseCookie(req.headers.cookie ?? "");
	const storedState = cookies.discord_oauth_state;
	const state = req.query.state;
	const code = req.query.code;

	// Check the state value matches the value that was issued before the Discord OAuth login
	// https://discord.com/developers/docs/topics/oauth2#state-and-security
	if (
		(!storedState || !state) || // Check we have two valid states
		storedState != state || // Check the two states match
		typeof code != 'string' // Check we have a valid code
	) {
		res.status(400).end();
		return;
	}

	try {
		// Validate callback
		const { discordUser, getExistingUser, createUser } = await discordAuth.validateCallback(code);

		// New user data
		const userData = {
			attributes: {
				username: discordUser.username,
				avatar: "https://cdn.discordapp.com/avatars/" + discordUser.id + "/" + discordUser.avatar + ".png",
			}
		}

		// User populated later - either existing or new
		let user;

		// Attempt to get existing user
		const existingUser = await getExistingUser();
		if (existingUser) {
			// Update existing user
			user = await auth.updateUserAttributes(existingUser.userId, userData.attributes);
		} else {
			// Create new user
			user = await createUser(userData);
		}

		// Create a session for the user
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});

		// Set session data
		authRequest.setSession(session);

		// Get existing response cookies
		const resCookies: string[] = res.getHeader('Set-Cookie') as string[] ?? [];

		// Delete state cookie
		resCookies.push(serializeCookie("discord_oauth_state", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV == "production",
			path: "/",
			maxAge: 0
		}));

		// Check if there is an origin to redirect the user to for this state
		let redirect = "/";
		const origin = cookies["discord_oauth_origin_" + state];
		if (origin) {
			// Validate origin is from this site
			if (validateLoginOrigin(req, origin)) {
				// Set redirect
				redirect = origin;

				// Delete origin cookie
				resCookies.push(serializeCookie("discord_oauth_origin_" + state, "", {
					httpOnly: true,
					secure: process.env.NODE_ENV == "production",
					path: "/",
					maxAge: 0
				}));
			}
		}

		// Redirect the user
		res
			.status(302)
			// Set response cookies
			.setHeader("Set-Cookie", resCookies)
			// Set redirect location
			.setHeader("Location", redirect)
			.end();
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			// Received an invalid OAuth code
			res.status(400).end();
			return;
		}

		// Internal server error
		res.status(500).end();
	}
}
