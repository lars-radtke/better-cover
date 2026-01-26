"use client";

import React, { useLayoutEffect } from "react";
import { Refs } from "../types";
import { isValidSource } from "../utils/isValidSource";
import { trimString } from "../utils/trimString";
import { SourceElement } from "./Source";
import { useElementRect } from "../hooks/useElementRect";
import { useScreen } from "../hooks/useScreen";
import { useActiveSource } from "../hooks/useActiveSource";
import { transform } from "../utils/imageTransform";

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
     * [REQUIRED]
     *
     * CSS class names to apply to the Picture component.
     */
    className: string;
    /**
     * [REQUIRED]
     *
     * CSS class names to apply to the targetZone element.
     */
    targetZoneClassName: string;
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
     * Pass React refs to inner elements within the Picture component.
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

/**
 * [ BETTER COVER ]
 * 
 * {@link Picture} component.
 * 
 * [Required props]
 * @param children - Source Elements to be used within the Picture component.
 * @param src - Fallback image src to be used if no Source matches.
 * @param srcSet - Fallback image srcSet to be used if no Source matches.
 * @param className - CSS class names to apply to the Picture component.
 * @param targetZoneClassName - CSS class names to apply to the targetZone element.
 * @param focusZoneClassName - CSS class names to apply to the focusZone element.
 * @param imageClassName - CSS class names to apply to the image element.
 * @param alt - Accessible alternative text for the image.
 * @param loading - Loading behavior of the image.
 * @param refs - Pass React refs to selected elements within the Picture component.
 * @param debug - Display overlays for debugging purposes.
 */
export const Picture = ({
    children,
    src,
    srcSet,
    className = "",
    targetZoneClassName = "",
    focusZoneClassName = "",
    imageClassName = "",
    alt,
    loading = "lazy",
    refs,
    debug = false
}: PictureProps) => {

    // Dev mode checks
    const isDev =
        typeof process.env.NODE_ENV === "undefined" || process.env.NODE_ENV !== "production";
    const validChildren = React.Children.toArray(children).filter(isValidSource);
    if (validChildren.length === 0 && isDev)
        console.error("[Better Cover] No valid Source components provided as children to Picture element.");

    // Prepare CSS class names
    const PictureCSS = trimString([
        "better-cover",
        className,
        debug ? "--debug" : ""
    ].join(" "));

    const FocusZoneCSS = trimString([
        "better-cover__focus-zone",
        focusZoneClassName
    ].join(" "));

    const TargetZoneCSS = trimString([
        "better-cover__target-zone",
        targetZoneClassName
    ].join(" "));

    const ImageCSS = trimString([
        "better-cover__image",
        imageClassName,
        validChildren.length === 0 ? "--fallback" : ""
    ].join(" "));

    // create required refs if not provided
    const pictureRef = refs?.picture ?? React.useRef<HTMLDivElement>(null);
    const targetZoneRef = refs?.targetZone ?? React.useRef<HTMLDivElement>(null);
    const focusZoneRef = refs?.focusZone ?? React.useRef<HTMLDivElement>(null);
    const imageRef = refs?.image ?? React.useRef<HTMLImageElement>(null);

    // initialize observers
    const screen = useScreen();
    const pictureRect = useElementRect(pictureRef);
    const targetRect = useElementRect(targetZoneRef);
    const activeSource = useActiveSource(validChildren);

    // ✨ Let the Magic start ✨
    useLayoutEffect(() => {
        if (
            validChildren.length === 0 ||
            !pictureRect ||
            !targetRect ||
            !activeSource?.props.size ||
            !activeSource?.props.focusZone ||
            !imageRef.current
        ) return;

        const { width: imageW, height: imageH } = activeSource.props.size;
        const focusZone = activeSource.props.focusZone;

        const coverZone = { x: 0, y: 0, width: pictureRect.width, height: pictureRect.height };

        const targetZone = {
            x: targetRect.x - pictureRect.x,
            y: targetRect.y - pictureRect.y,
            width: targetRect.width,
            height: targetRect.height,
        };

        const { scale, x, y } = transform(coverZone, targetZone, imageW, imageH, focusZone);

        const img = imageRef.current;

        img.style.width = `${imageW}px`;
        img.style.height = `${imageH}px`;
        img.style.maxWidth = "none";
        img.style.maxHeight = "none";

        img.style.transformOrigin = "0 0";
        img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

        if (focusZoneRef.current) {
            const focus = focusZoneRef.current;
            focus.style.left = `${focusZone.x * scale + x}px`;
            focus.style.top = `${focusZone.y * scale + y}px`;
            focus.style.width = `${focusZone.width * scale}px`;
            focus.style.height = `${focusZone.height * scale}px`;
        }
    }, [
        screen,
        validChildren,
        pictureRect,
        targetRect,
        activeSource,
        focusZoneRef,
        imageRef
    ])

    return (
        <>
            <div
                ref={pictureRef}
                className={PictureCSS}
                inert={debug || (alt && alt !== "") ? undefined : true}
            >
                <picture>
                    {validChildren}
                    <img
                        ref={imageRef}
                        srcSet={srcSet ?? undefined}
                        src={src}
                        alt={alt ?? ""}
                        loading={loading}
                        className={ImageCSS}
                    />
                </picture>
                {validChildren.length !== 0 && (
                    <>
                        {(debug || focusZoneClassName) && (
                            <>
                                <div
                                    ref={focusZoneRef}
                                    className={FocusZoneCSS}
                                />
                            </>
                        )}
                        <div
                            ref={targetZoneRef}
                            className={TargetZoneCSS}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export type PictureElement = React.ReactElement<PictureProps, typeof Picture>;