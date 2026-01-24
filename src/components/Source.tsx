"use client";

import * as React from "react";
import { Rectangle, Size, SourceNativeAttributes } from "../types";
import { PictureElement as Picture } from "../../test/Picture2";

/**
 * Props for the {@link Source} component used within the {@link Picture}.
 *
 * As the Source's images are object to scaling, it is recommended to provide images with a higher resolution factor than normal.  
 * _E. g. for a displayed image size of 800x600 pixels, provide a 1200x900 pixels image for better quality after transform._
 */
export interface SourceProps extends SourceNativeAttributes {
    /**
     * [REQUIRED]
     *
     * Size of the image in pixels, based on the 1x image resolution.
     *
     * @example {width: 800, height: 600}
     */
    size: Size;
    /**
     * [REQUIRED]
     *
     * Defines a focusZone {@link Rectangle} for the Source, which gets tried against the defined {@link Picture} safeZone.  
     * Values are written in pixels based on the 1x image resolution.
     *
     * @example {x: 10, y: 20, width: 100, height: 50}
     */
    focusZone: Rectangle;
    /**
     * [OPTIONAL]
     * [ACCESSIBILITY]
     *
     * Overwrite a given alternative text of the image when this Source is used.
     */
    alt?: string;
}

/**
 * Source component to be used within {@link Picture}.  
 * 
 * Its srcSet **must only contain images of the same aspect ratio**.  
 * If different aspect ratios are needed, use individual Source components with media queries.
 */
export const Source = ({ size, focusZone, alt, ...props }: SourceProps) => {

    return (
        <>
            <source
                data-size={JSON.stringify(size)}
                data-focuszone={JSON.stringify(focusZone)}
                data-alt={alt ? alt : undefined}
                {...props}
            />
        </>
    )
};

/**
 * Source component to be used within {@link Picture}.  
 * 
 * Its srcSet **must only contain images of the same aspect ratio**.  
 * If different aspect ratios are needed, use individual Source components with media queries.
 */
export type SourceElement = React.ReactElement<SourceProps, typeof Source>;
