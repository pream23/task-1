'use client'

import { cn, getFileIcon } from '@/lib/utils';
import Image from 'next/image';
import React, { useState } from 'react'

interface Props {
    type: string;
    url?: string;
    extension: string;
    imageClassName?: string;
    className?: string;
}

export const Thumbnail = ({
    type,
    extension,
    url = "",
    imageClassName,
    className,
}: Props) => {


    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const isImageByExtension = extension && imageExtensions.includes(extension.toLowerCase());
    const isImage = ((type === "image" || isImageByExtension) && extension !== "svg" && url && url.trim() !== "");



    return (
        <figure className={cn("thumbnail", className)}>
            <Image
                src={isImage ? url : getFileIcon(extension, type)}
                alt="thumbnail"
                width={100}
                height={100}
                className={cn(
                    "size-8 object-contain",
                    imageClassName,
                    isImage && "thumbnail-image",
                )}
            />
        </figure>


    );
};
