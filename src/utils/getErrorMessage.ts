import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

export default function getErrorMessage(e: unknown) {
    let msg: string;

    /**
     * Prisma errors
     */
    if (
        e instanceof PrismaClientKnownRequestError ||
        e instanceof PrismaClientUnknownRequestError ||
        e instanceof PrismaClientRustPanicError ||
        e instanceof PrismaClientInitializationError ||
        e instanceof PrismaClientValidationError
    ) {
        msg = `${e.name}. Check server console for details.`;
    }

    /**
     * Other
     */
    else if (e instanceof Error) {
        msg = e.message;
    } else {
        msg = "Unknown";
    }

    return msg;
}
