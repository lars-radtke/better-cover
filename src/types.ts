import { SourceHTMLAttributes } from "react";

/**
 * Maps React DOM refs to their corresponding {@link Picture} component elements.
 *
 * _Keys do not correlate to HTML element names._
 */
export type Refs = {
  picture?: React.RefObject<HTMLDivElement>;
  targetZone?: React.RefObject<HTMLDivElement>;
  focusZone?: React.RefObject<HTMLDivElement>;
  image?: React.RefObject<HTMLImageElement>;
};

/**
 * {@link Xcoordinate|X} coordinate of an element.
 */
export interface Xcoordinate {
  /**
   * X coordinate in pixels.
   */
  x: number;
}

/**
 * {@link Ycoordinate|Y} coordinate of an element.
 */
export interface Ycoordinate {
  /**
   * Y coordinate in pixels.
   */
  y: number;
}

/**
 * {@link Position} of an element composed of {@link Xcoordinate|X} and {@link Ycoordinate|Y} coordinates.
 */
export interface Position extends Xcoordinate, Ycoordinate {}

/**
 * {@link Height} of an element.
 */
export interface Height {
  /**
   * Height of an element in pixels.
   */
  height: number;
}

/**
 * {@link Width} of an element.
 */
export interface Width {
  /**
   * Width of an element in pixels.
   */
  width: number;
}

/**
 * {@link Size} of an element composed of {@link Width} and {@link Height}.
 */
export interface Size extends Width, Height {}

/**
 * {@link Rectangle} defined by a {@link Position} and a {@link Size}.
 */
export interface Rectangle extends Position, Size {}

/**
 * {@link Screen} information including {@link Size}, device pixel ratio and orientation.
 */
export interface Screen extends Size {
  /**
   * Device pixel ratio.
   */
  dpr: number;
  /**
   * Orientation of the screen.
   */
  orientation: "portrait" | "landscape";
}

/**
 * Native attributes for the HTMLSourceElement.
 *
 * Omits attributes that conflict with or are handled by Better Cover.
 */
export type SourceNativeAttributes = Omit<
  SourceHTMLAttributes<HTMLSourceElement>,
  "type" | "src" | "sizes" | "height" | "width"
>;

/**
 * {@link Transform} information composed of {@link Position} and scale factor.
 */
export interface Transform extends Position {
  /**
   * Scale factor applied to the element.
   */
  scale: number;
}
