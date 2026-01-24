"use client";

import { Refs } from "../types";

export interface PictureProps {
    /**
     * [REQUIRED]
     * 
     * Fallback image src to be used if no Source matches.
     */
    src: string;
    /**
     * [OPTIONAL]
     * 
     * Fallback image srcSet to be used if no Source matches.
     */
    srcSet?: string;
    /**
     * [OPTIONAL]
     * [ACCESSIBILITY]
     *
     * Accessible alternative text for the image.
     * If ommited, the image will be marked as decorative.
     */
    alt?: string;
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
    /**
     * [OPTIONAL]
     *
     * Display overlays for debugging purposes.
     */
    debug?: boolean;
};
export const Picture = ({ src, srcSet, alt, refs, debug }: PictureProps) => {

    return (
        <>
            <div
                ref={refs?.picture} className={`better-cover ${debug ? "--debug" : ""}`.trim()}
                inert={debug || (alt && alt !== "") ? undefined : true}
            >
                <picture>
                    <img
                        ref={refs?.image}
                        srcSet={srcSet ?? undefined}
                        src={src}
                        alt={alt ?? ""}
                    />
                </picture>
                {(refs?.focusZone || debug) && (
                    <>
                        <div ref={refs?.focusZone} className={`better-cover__focus-zone`} />
                    </>
                )}
                <div ref={refs?.targetZone} className={`better-cover__target-zone`} />
            </div>
        </>
    )
}