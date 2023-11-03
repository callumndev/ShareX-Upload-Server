import { Toaster } from "react-hot-toast";

import { useEffect, useState } from "react";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import SiteSetup from "@/components/SiteSetup";
import Loading from "@/components/Loading";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    const settings = api.site.getSettings.useQuery();

    const [showSiteLoading, setShowSiteLoading] = useState(false);
    const [showSetup, setShowSetup] = useState(false);

    useEffect(() => {
        // If loading
        if (settings.status == 'loading') {
            // If we haven't showed loading before, then show it
            if (!showSiteLoading) {
                setShowSiteLoading(true);
            }
            // Request was a success
        } else if (settings.status == 'success') {
            // Check if site has not been setup before
            if (!showSetup && (!settings.data || !settings.data.setup)) {
                // Show site setup
                setShowSetup(true);
            }

            setShowSiteLoading(false);

            // Request failed
        } else if (settings.status == 'error') {
            setShowSetup(false);
            setShowSiteLoading(false);
        }
    }, [settings.status]);

    return (
        <SessionProvider session={session}>
            <Toaster />
            {
                showSiteLoading ?
                    <Loading message="Checking site setup..." /> :
                    (
                        (showSetup) ?
                            <SiteSetup /> :
                            <Component {...pageProps} />
                    )
            }
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
