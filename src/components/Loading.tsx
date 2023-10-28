export default function Loading(
    { message }: { message?: string; }
) {
    return (
        <>
            <div className="flex items-center justify-center min-h-screen p-5 bg-gray-100 min-w-screen">
                <div className="flex flex-col items-center">
                    <div className="flex space-x-2 animate-pulse">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    </div>

                    {message && (
                        <p className="mt-2 text-gray-700 text-lg">{message}</p>
                    )}
                </div>
            </div>
        </>
    );
}
