import { XCircleIcon } from '@heroicons/react/20/solid'

import toast from 'react-hot-toast';

export default function ToastError({
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
                className={`${visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-red shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="w-full rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{title}</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{message}</p>
                            </div>

                            <div className="mt-4">
                                <div className="-mx-2 -my-1.5 flex">
                                    <button
                                        type="button"
                                        className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
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
