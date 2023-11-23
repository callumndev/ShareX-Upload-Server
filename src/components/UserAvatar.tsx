import Image from "next/image";
import type { ImageProps } from "next/image";

import { useState } from "react";

import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function UserAvatar(
    {
        src, className, size,
        fallbackClassName
    }:
        {
            src: ImageProps["src"];
            className: ImageProps["className"];
            size: ImageProps["width"];
            fallbackClassName: ImageProps["className"];
        }
) {
    const [useFallback, setUseFallback] = useState(false);

    return !useFallback ? (
        <>
            <Image
                className={className}

                // Image source
                src={src}
                alt="user avatar"

                // Controls the size of the image returned
                // from Next.js' image optimization
                width={size}
                height={size}

                // Called on error - show fallback
                onError={() => setUseFallback(true)}
            />
        </>
    ) : (
        // Fallback
        <>
            <UserCircleIcon className={fallbackClassName} />
        </>
    )
}
