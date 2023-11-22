/**
 * Redirects the user to the login API with the origin parameter.
 * @param origin string (optional). Defaults to '/' (index). The page to redirect to after login.
 * @returns void
 */
export function login(origin?: string) {
    if (!origin)
        origin = '/' // index

    // Only run on client
    if (typeof window == 'undefined')
        return;

    // Redirect to login API
    window.location.href = "/api/auth/login?origin=" + encodeURIComponent(origin); // make from
}

/**
 * Sends a logout request to the logout API to clear the session and redirect to the home page.
 * @returns void
 */
export async function logout() {
    // POST to logout API
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        redirect: "manual"
    });

    // 0 status code means redirect
    if (response.status === 0) {
        // Only run on client
        if (typeof window == 'undefined')
            return;

        // Redirect to home page
        window.location.href = "/";
    }
}
