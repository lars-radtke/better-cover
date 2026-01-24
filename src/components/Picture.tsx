"use client";

import { Refs } from "../types";
import { pruneRefs } from "../utils/pruneRefs";

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

    const prunedRefs = pruneRefs(refs);

    return (
        <>
            <div ref={prunedRefs?.picture} style={{ position: "relative" }}>
                <picture style={{ display: "block", position: "absolute", inset: 0 }}>
                    <img ref={prunedRefs?.image} />
                </picture>
                {prunedRefs?.focusZone && (
                    <>
                        <div ref={prunedRefs.focusZone} style={{ position: "absolute" }} />
                    </>
                )}
                <div ref={prunedRefs?.targetZone} style={{ position: "absolute" }} />
            </div>
        </>
    )
}