import type { NextApiRequest, NextApiResponse } from "next";

import { auth } from "@/server/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Only allow POST requests
	if (req.method != "POST") {
		res.status(405).end();
		return;
	}

	// Get session
	const authRequest = auth.handleRequest({ req, res });
	const session = await authRequest.validate();

	// Check if there is already no session, so we don't need to logout again
	if (!session) {
		res.status(401).send("Unauthorized");
		return;
	}

	// Invalidate the current session
	await auth.invalidateSession(session.sessionId);

	// Delete the session cookie
	authRequest.setSession(null);

	// Redirect to home page
	res.redirect(302, "/").end();
}
