import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

import Loading from "@/components/Loading";

export default function RequireLogin(
    { children }: { children: ReactNode; }
) {
    const { status } = useSession();
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        // Wait until status has finished loading
        if (status != 'loading') {
            // Check authenticated status
            if (status == 'authenticated' && !isAuthed) {
                setIsAuthed(true);
            } else if (status == 'unauthenticated') {
                signIn().catch(console.error);
            }
        }
    }, [status, isAuthed])

    // Show loading
    if (!isAuthed) {
        return <Loading message="Checking session..." />;
    }

    // Show contents
    return children;
}
