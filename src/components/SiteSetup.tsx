import { InformationCircleIcon, UserCircleIcon } from '@heroicons/react/24/solid'

import toast from 'react-hot-toast';

import { useEffect, useState } from "react";

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import ToastError from '@/components/ToastError';
import ToastSuccess from '@/components/ToastSuccess';

import { api } from '@/utils/api';

export default function SiteSetup() {
    const [domain, setDomain] = useState("");
    const [userID, setUserID] = useState("");
    const [username, setUsername] = useState("");
    const [image, setImage] = useState("");
    const [registrationRequests, setRegistrationRequests] = useState(true);
    const [allowSubmit, setAllowSubmit] = useState(true);

    const router = useRouter();
    const { data: sessionData, status: sessionStatus } = useSession();

    const {
        mutate: setupSiteMutate,
        status: setupSiteMutateStatus,
        error: setupSiteError,
        isLoading: setupSiteMutateLoading,
        isIdle: setupSiteMutateIdle,
        data: setupSiteMutateData
    } = api.site.setup.useMutation();
    const siteDomain = api.site.getCurrentDomain.useQuery();

    useEffect(() => {
        // Wait until status has finished loading
        if (siteDomain.status != 'loading') {
            // Check success status
            if (siteDomain.status == 'success' && domain == "") {
                setDomain(siteDomain.data);
            }
        }

        // Wait until status has finished loading
        if (sessionStatus != 'loading') {
            // Check authenticated status
            if (sessionStatus == 'authenticated' && username == "") {
                setUserID(sessionData.user.id);
                setUsername(sessionData.user.name!);
                setImage(sessionData.user.image!);
            }
        }
    }, [siteDomain, domain, sessionStatus, username, sessionData?.user.name, sessionData?.user.image, sessionData?.user.id])

    useEffect(() => {
        if (setupSiteError) {
            toast.custom((t) => (
                <ToastError
                    id={t.id}
                    visible={t.visible}
                    title="Save error"
                    message={setupSiteError.message}
                />
            ));
        } else if (setupSiteMutateStatus == 'success') {
            setAllowSubmit(false);

            toast.custom((t) => (
                <ToastSuccess
                    id={t.id}
                    visible={t.visible}
                    title="Save success"
                    message="Successfully saved site setup. Refreshing page..."
                />
            ));

            const refreshTimer = setTimeout(() => {
                router.reload();
            }, 2000);

            // Clear the timer if the component unmounts
            return () => {
                clearTimeout(refreshTimer);
            };
        }
    }, [router, setupSiteError, setupSiteMutateData, setupSiteMutateIdle, setupSiteMutateStatus])

    const onSetupSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setupSiteMutate({
            superAdmin: userID,
            allowRegistrationRequests: registrationRequests,
        });
    }

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="mx-auto max-w-3xl">
                    <div className="space-y-10 divide-y divide-gray-900/10">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                            <div className="px-4 sm:px-0">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Site Setup</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    You are seeing this page because the site has not been previously setup.
                                    You will only need to do this once.
                                </p>

                                <div className="rounded-md bg-blue-50 p-4 mt-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3 flex-1 md:flex md:justify-between">
                                            <p className="text-sm text-blue-700">The site domain is controlled from the <span className='font-bold'>SITE_DOMAIN</span> environment variable.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form
                                className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
                                onSubmit={onSetupSubmit}
                            >
                                <div className="px-4 py-6 sm:p-8">
                                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-4">
                                            <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                                                Website
                                            </label>
                                            <div className="mt-2">
                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">https://</span>
                                                    <input
                                                        type="text"
                                                        name="website"
                                                        id="website"
                                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                        value={domain}
                                                        disabled={true} // Site domain is controlled through the env variable
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                Super admin user
                                            </label>
                                            <div className="mt-2 flex items-center gap-x-3">
                                                {
                                                    (!image || image == "") ?
                                                        <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" /> :
                                                        <Image
                                                            className="inline-block h-10 w-10 rounded-full"
                                                            src={image}
                                                            alt="user avatar"
                                                            width={48}
                                                            height={48}
                                                        />
                                                }
                                                <p>{username}</p>

                                                <button
                                                    type="button"
                                                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                    onClick={() => signOut()}
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-span-full">
                                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                                Allow registration requests
                                            </label>
                                            <div className="relative flex items-start mt-1">
                                                <div className="flex h-6 items-center">
                                                    <input
                                                        id="comments"
                                                        aria-describedby="comments-description"
                                                        name="comments"
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        checked={registrationRequests}
                                                        onChange={(e) => setRegistrationRequests(e.target.checked)}
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm leading-6">
                                                    <label htmlFor="comments" className="font-medium text-gray-900">
                                                        Registration {registrationRequests ? "enabled" : "disabled"}
                                                    </label>
                                                    <p id="comments-description" className="text-gray-500">
                                                        Allow users to submit registration requests when they login for the first time.
                                                        Only site admins can view and approve registration requests.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                        disabled={setupSiteMutateLoading || !allowSubmit}
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
