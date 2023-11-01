import { Toaster } from "react-hot-toast";

import { useEffect, useState } from "react";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import SiteSetup from "@/components/SiteSetup";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    const settings = api.site.getSettings.useQuery();
    const [showSetup, setShowSetup] = useState(false);

    useEffect(() => {
        // Wait until status has finished loading
        if (settings.status != 'loading') {
            // Check success status
            if (settings.status == 'success' && !showSetup) {
                // Check if site has not been setup before
                if (!settings.data || !settings.data.setup)
                    setShowSetup(true);
            }
        }
    }, [showSetup, settings.data, settings.status]);

    return (
        <SessionProvider session={session}>
            <Toaster />
            {
                (showSetup) ?
                    <SiteSetup /> :
                    <Component {...pageProps} />
            }
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
