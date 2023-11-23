import { type AppType } from "next/app";
import { useRouter } from "next/router";

import { NextIntlClientProvider } from "next-intl";

import { Toaster } from "react-hot-toast";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType = ({
    Component,
    pageProps,
}) => {
    const router = useRouter();

    return (
        <>
            <NextIntlClientProvider
                locale={router.locale}
            >
                <Toaster />
                <Component {...pageProps} />
            </NextIntlClientProvider>
        </>
    )
}

export default api.withTRPC(MyApp);
