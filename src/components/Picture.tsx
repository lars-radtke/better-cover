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
    /**
     * [OPTIONAL]
     *
     * Display overlays for debugging purposes.
     */
    debug?: boolean;
};
export const Picture = ({ refs, debug }: PictureProps) => {

    return (
        <>
            <div ref={refs?.picture} className={`better-cover ${debug ? "--debug" : ""}`.trim()}>
                <picture>
                    <img ref={refs?.image} />
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