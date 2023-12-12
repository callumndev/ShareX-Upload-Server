import { useEffect, useState } from "react";

import moment from "moment";

import UserAvatar from "@/components/UserAvatar";

import { api, type UploadGetRecentOutput } from "@/utils/api";

export default function RecentUploads({
    userID,
}: {
    userID?: string;
}) {
    const recentUploadsQuery = api.upload.getRecent.useQuery(userID);

    const [recentUploads, setRecentUploads] = useState<UploadGetRecentOutput>([]);

    useEffect(() => {
        // Recent uploads
        if (recentUploadsQuery.fetchStatus == "idle" && recentUploadsQuery.isSuccess) {
            setRecentUploads(recentUploadsQuery.data);
        }
    }, [recentUploadsQuery])


    return (
        <>
            <section aria-labelledby="recent-uploads-title">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                        <h2 className="text-base font-medium text-gray-900" id="recent-uploads-title">
                            {userID ? "Recent uploads" : "Recent site uploads"}
                        </h2>
                        {
                            recentUploads.length ?
                                <RecentUserUploadsList uploads={recentUploads} /> :
                                <EmptyRecentUploads userID={userID} />
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

function EmptyRecentUploads({
    userID,
}: {
    userID?: string;
}) {
    return (
        <>
            <p className="mt-2 text-sm text-gray-500">
                {
                    !userID && (
                        <>
                            Recent uploads from all users across the site will appear here.
                        </>
                    )
                }{" "}
                There are currently no uploads to display.
            </p>
        </>
    )
}

function RecentUserUploadsList({
    uploads
}: {
    uploads: UploadGetRecentOutput;
}) {

    return (
        <>
            <div className="mt-6 flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {uploads.map(upload => (
                        <li key={upload.id} className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <UserAvatar
                                        src={upload.user.avatar}
                                        className="h-8 w-8 rounded-full"
                                        size={32}
                                        fallbackClassName="h-8 w-8 text-gray-300"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900">{upload.user.username}</p>
                                    <p className="truncate text-sm text-gray-500">{moment(upload.createdAt).fromNow()}</p>
                                </div>
                                <div>
                                    <a
                                        href="#"
                                        className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        View
                                    </a>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-6">
                <a
                    href="/uploads"
                    className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    View all
                </a>
            </div>
        </>
    )
}