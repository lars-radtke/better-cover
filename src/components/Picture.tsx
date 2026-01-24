"use client";

import { Refs } from "../types";
import { trimString } from "../utils/trimString";
import { Source, SourceElement } from "./Source";

/**
 * Props for the {@link Picture} component.
 */
export interface PictureProps {
    /**
     * [REQUIRED]
     *
     * Source Elements to be used within the Picture component.
     * At least one Source component must be provided.
     */
    children: SourceElement | [SourceElement, ...SourceElement[]];
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
     *
     * CSS class names to apply to the Picture component.
     */
    className?: string;
    /**
     * [OPTIONAL]
     *
     * CSS class names to apply to the targetZone element.
     */
    targetZoneClassName?: string;
    /**
     * [OPTIONAL]
     *
     * CSS class names to apply to the focusZone element.
     * 
     * Passing class names here causes the focusZone element to be rendered.
     */
    focusZoneClassName?: string;
    /**
     * [OPTIONAL]
     *
     * CSS class names to apply to the image element.
     */
    imageClassName?: string;
    /**
     * [OPTIONAL]  
     * [ACCESSIBILITY]
     *
     * Accessible alternative text for the image.
     * 
     * If omitted, the image will be marked as decorative.
     */
    alt?: string;
    /**
     * [OPTIONAL]
     *
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#loading Loading behavior} of the image.
     *
     * Defaults to `lazy`.
     */
    loading?: "eager" | "lazy";
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

export const Picture = ({
    src,
    srcSet,
    className,
    targetZoneClassName,
    focusZoneClassName,
    imageClassName,
    alt,
    loading = "lazy",
    refs, debug
}: PictureProps) => {

    const PictureCSS = trimString([
        "better-cover",
        className,
        debug && "--debug"
    ].join(" "));

    const FocusZoneCSS = trimString([
        "better-cover__focus-zone",
        focusZoneClassName
    ].join(" "));

    const TargetZoneCSS = trimString([
        "better-cover__target-zone",
        targetZoneClassName
    ].join(" "));

    return (
        <>
            <div
                ref={refs?.picture}
                className={PictureCSS}
                inert={debug || (alt && alt !== "") ? undefined : true}
            >
                <picture>
                    <img
                        ref={refs?.image}
                        srcSet={srcSet ?? undefined}
                        src={src}
                        alt={alt ?? ""}
                        loading={loading}
                        className={imageClassName ? imageClassName : undefined}
                    />
                </picture>
                {(refs?.focusZone || debug || focusZoneClassName) && (
                    <>
                        <div
                            ref={refs?.focusZone}
                            className={FocusZoneCSS}
                        />
                    </>
                )}
                <div
                    ref={refs?.targetZone}
                    className={TargetZoneCSS}
                />
            </div>
        </>
    )
}

export type PictureElement = React.ReactElement<PictureProps, typeof Picture>;