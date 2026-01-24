"use client";

import { Refs } from "../types";

export interface PictureProps {
    /**
     * [OPTIONAL]
     * 
     * Pass React refs to selected elements within the Picture component.
     * 
     * ```
     * refs = {  
     *   picture?: React.RefObject<HTMLDivElement> | undefined;  
     *   targetZone?: React.RefObject<HTMLDivElement> | undefined;  
     *   focusZone?: React.RefObject<HTMLDivElement> | undefined;  
     *   image?: React.RefObject<HTMLImageElement> | undefined;  
     * }
     * ```
     */
    refs?: Refs;
};
export const Picture = ({ refs }: PictureProps) => {
    return (
        <>
            <div ref={refs?.picture} style={{ position: "relative" }}>
                <picture style={{ display: "block", position: "absolute", inset: 0 }}>
                    <img />
                </picture>
            </div>
        </>
    )
}