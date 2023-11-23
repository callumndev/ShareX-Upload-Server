import { CheckCircleIcon } from "@heroicons/react/20/solid"

import toast from "react-hot-toast";

export default function ToastSuccess({
    id,
    visible,
    title,
    message,
}: {
    id: string;
    visible: boolean;
    title: string;
    message: string;
}) {
    return (
        <>
            <div
                className={`${visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-red shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="w-full rounded-md bg-green-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">{title}</h3>
                            <div className="mt-2 text-sm text-green-700">
                                <p>{message}</p>
                            </div>
                            <div className="mt-4">
                                <div className="-mx-2 -my-1.5 flex">
                                    <button
                                        type="button"
                                        className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                        onClick={() => toast.dismiss(id)}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
