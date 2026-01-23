# Better Cover

Better Cover is a React component for building image elements _with aim assist_.

## Getting started
Better Cover requires <b>React v18.2.0 or later.</b>
```bash
npm install better-cover
```
### Import components
```ts
import { Picture, Source } from "better-cover";
```

## Props
### Picture
- `children`: Array (required)  
Array of [Source elements](#source).  
_At least one Source must be provided._

- `className`: String  
CSS style classes applied to the top level component.  
_The top level component is the area to be covered._

- `targetZoneClassName`: String  
CSS style classes applied to the Focus Zone.  
_If no styles are provided, the Focus Zone always covers the whole height and width of the top level component._

- `alt`: String  
Accessible alternate text for the rendered image. If omitted, the image is exposed as 'decorative' within the accessibility tree.  
_Can be overwritten by [Source elements](#source) even when omitted._

- `loading`: 'eager' | 'lazy'  
Loading behaviour of the rendered image.  
_Defaults to `'lazy'`._

- `debug`: Boolean  
Display overlays highlighting the Safe Zone and Focus Zone.
_Defaults to `false`._

### Source
- `srcSet`: String (required)  
Comma-separated list of one or more image URLs and their **pixel density** descriptors.  
  <div style="padding: 16px 24px 8px 24px; border: 1px solid orange; border-radius: 8px; background-color: rgba(255, 140, 0, 0.05); margin-bottom: 1rem;">
    <p style="display: flex; gap: 8px">
   <span>⚠️</span><span><b>Important</b></span>
    </p>
  <p>Sources with <b>width descriptiors</b> will be omitted.</p>
  </div>
  <div style="padding: 16px 24px 8px 24px; border: 1px solid orange; border-radius: 8px; background-color: rgba(255, 140, 0, 0.05); margin-bottom: 1rem;">
    <p style="display: flex; gap: 8px">
   <span>⚠️</span><span><b>Important</b></span>
    </p>
  <p>An individual Source's images must be of the same aspect ratio.</p>
  <p>If you require differently sized images, use separate Source Elements with individual <code>media</code> attributes.</p>
  </div>

- `size`: Object (required)  
Width and height of the image in pixels.  
_Based on the 1x resolution._

- `focusZone`: Object (required)  
X and Y Position and width and height of the Focus Zone in pixels.  
_Based on the 1x resolution._

- `media`: String  
Specify the Source's [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries).

- `alt`: String  
Overwrites [Picture's](#picture) default alternative text while the Source is active.  
_If provided, it exposes the image within the accessibility tree even when it wasn't previously._


## License
MIT
