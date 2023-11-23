import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react"

import type { User } from "lucia";

import Nav, { navigation } from "@/components/Nav";

export default function Layout(
    { children, user, hideNavigation = false }:
        {
            children: ReactNode;
            user: User;
            hideNavigation?: boolean;
        }
) {
    const router = useRouter();
    const currentNav = navigation.find(nav => nav.route == router.route);

    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        // Set page title
        if (currentNav) {
            setPageTitle(currentNav.pageTitle);
        }
    }, [currentNav])

    return (
        <>
            <div className="min-h-full">
                {/* Nav */}
                {
                    !hideNavigation && (
                        <Nav user={user} />
                    )
                }

                {/* Page */}
                <div className="py-10">
                    {/* Header */}
                    <header>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">{pageTitle}</h1>
                        </div>
                    </header>

                    {/* Content */}
                    <main>
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
