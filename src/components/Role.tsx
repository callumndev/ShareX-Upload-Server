import getRoleDisplayName from "@/utils/getRoleDisplayName";

export default function Role(
    { role }: { role: string; }
) {
    const className = getRoleSpanClassName(role);
    const displayName = getRoleDisplayName(role);

    return (
        <span className={className}>
            {displayName}
        </span>
    )
}

function getRoleSpanClassName(role: string): string {
    switch (role.toLowerCase()) {
        case "superadmin":
            return "inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10";
        case "admin":
            return "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10";
        case "user":
            return "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20";
        default:
            return "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10";
    }
}
