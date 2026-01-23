/**
 * {@link Xcoordinate|X} coordinate of an element.
 */
export interface Xcoordinate {
  /**
   * Depending on the use case, may be presenting a pixel or percentage value.
   */
  x: number;
}

/**
 * {@link Ycoordinate|Y} coordinate of an element.
 */
export interface Ycoordinate {
  /**
   * Depending on the use case, may be presenting a pixel or percentage value.
   */
  y: number;
}

/**
 * {@link Position} of an element in a 2D plane composed of {@link Xcoordinate|X} and {@link Ycoordinate|Y} coordinates.
 */
export interface Position extends Xcoordinate, Ycoordinate {}

/**
 * {@link Height} of an element.
 */
export interface Height {
  /**
   * Depending on the use case, may be presenting a pixel or percentage value.
   */
  height: number;
}

/**
 * {@link Width} of an element.
 */
export interface Width {
  /**
   * Depending on the use case, may be presenting a pixel or percentage value.
   */
  width: number;
}

/**
 * {@link Size} of an element in a 2D plane composed of {@link Width} and {@link Height}.
 */
export interface Size extends Width, Height {}

/**
 * {@link Rectangle} defined by a {@link Position} and a {@link Size}.
 */
export interface Rectangle extends Position, Size {}
