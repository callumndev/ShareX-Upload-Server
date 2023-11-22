import type { NextApiRequest } from "next";

/**
 * Returns true if the origin is valid, false otherwise.
 * An origin is valid if it is a valid URL and the host matches the host of the app.
 * @param req NextApiRequest
 * @param origin string
 * @returns boolean whether the origin is valid
 */
export default function validateLoginOrigin(req: NextApiRequest, origin: string): boolean {
    const protocol: "https" | "http" = req.headers['x-forwarded-proto'] == 'https' ? 'https' : 'http';

    try {
        const originURL = new URL(origin);

        // Check protocol mismatch
        if (originURL.protocol != `${protocol}:`)
            return false;

        // Check host mismatch
        if (originURL.host != req.headers.host)
            return false;

        // Valid origin
        return true;
    } catch (e) {
        return false;
    }
}
