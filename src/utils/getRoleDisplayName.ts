export default function getRoleDisplayName(role: string): string {
    switch (role.toLowerCase()) {
        case "superadmin":
            return "Super Admin"

        case "admin":
            return "Admin"

        case "user":
            return "User"

        default:
            return "Unknown"
    }
}
