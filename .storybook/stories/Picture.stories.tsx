import type { Meta, StoryObj } from "@storybook/react";
import { Picture } from "../../src/components/Picture";
import { Source, SourceElement } from '../../src/components/Source';

const baseUrl = "/example";

const Examples = {
    "landscape": {
        "url": `${baseUrl}-landscape`,
        "size": { width: 5568, height: 3712 },
        "focusZones": {
            "artPiece": {
                x: 2486,
                y: 0,
                width: 1396,
                height: 1548,
                alt: "A rough sketch of a person's face, with broad areas of red and soft pale blue laid in underneath."
            },
            "console": {
                x: 1357,
                y: 2156,
                width: 474,
                height: 199,
                alt: "A game console from a well-known Japanese brand."
            },
            "plush": {
                x: 3345,
                y: 2686,
                width: 400,
                height: 555,
                alt: "A plush toy modeled after a YouTuber’s cat."
            }
        },
    },
    "portrait": {
        "url": `${baseUrl}-portrait`,
        "size": { width: 3637, height: 5456 },
        "focusZones": {
            "artPiece": {
                x: 1414,
                y: 358,
                width: 1420,
                height: 1927,
                alt: "A rough sketch of a person's face, with broad areas of red and soft pale blue laid in underneath."
            },
            "console": {
                x: 270,
                y: 2900,
                width: 494,
                height: 203,
                alt: "A game console from a well-known Japanese brand."
            },
            "plush": {
                x: 2301,
                y: 3427,
                width: 412,
                height: 555,
                alt: "A plush toy modeled after a YouTuber’s cat."
            }
        },
    }
}

type Focus = keyof typeof Examples.landscape.focusZones;

const Landscape3x = (focus: Focus) => <Source
    key="landscape-3x"
    media="(min-width: 1920px)"
    srcSet={`${Examples.landscape.url}@3x.jpg, ${Examples.landscape.url}@4x.jpg 1.5x, ${Examples.landscape.url}@5x.jpg 2x`}
    alt={Examples.landscape.focusZones[focus].alt}
    size={{ width: Examples.landscape.size.width, height: Examples.landscape.size.height }}
    focusZone={Examples.landscape.focusZones[focus]}
/>
const Landscape2x = (focus: Focus) => <Source
    key="landscape-2x"
    media="(min-width: 768px)"
    srcSet={`${Examples.landscape.url}@2x.jpg, ${Examples.landscape.url}@3x.jpg 1.5x, ${Examples.landscape.url}@4x.jpg 2x`}
    alt={Examples.landscape.focusZones[focus].alt}
    size={{ width: Examples.landscape.size.width, height: Examples.landscape.size.height }}
    focusZone={Examples.landscape.focusZones[focus]}
/>
const Landscape1x = (focus: Focus) => <Source
    key="landscape-1x"
    media="(max-width: 767px)"
    srcSet={`${Examples.landscape.url}@1x.jpg, ${Examples.landscape.url}@2x.jpg 1.5x, ${Examples.landscape.url}@3x.jpg 2x`}
    alt={Examples.landscape.focusZones[focus].alt}
    size={{ width: Examples.landscape.size.width, height: Examples.landscape.size.height }}
    focusZone={Examples.landscape.focusZones[focus]}
/>

const Portrait3x = (focus: Focus) => <Source
    key="portrait-3x"
    media="(min-width: 1920px)"
    srcSet={`${Examples.portrait.url}@3x.jpg, ${Examples.portrait.url}@4x.jpg 1.5x, ${Examples.portrait.url}@5x.jpg 2x`}
    alt={Examples.portrait.focusZones[focus].alt}
    size={{ width: Examples.portrait.size.width, height: Examples.portrait.size.height }}
    focusZone={Examples.portrait.focusZones[focus]}
/>

const Portrait2x = (focus: Focus) => <Source
    key="portrait-2x"
    media="(min-width: 768px)"
    srcSet={`${Examples.portrait.url}@2x.jpg, ${Examples.portrait.url}@3x.jpg 1.5x, ${Examples.portrait.url}@4x.jpg 2x`}
    alt={Examples.portrait.focusZones[focus].alt}
    size={{ width: Examples.portrait.size.width, height: Examples.portrait.size.height }}
    focusZone={Examples.portrait.focusZones[focus]}
/>
const Portrait1x = (focus: Focus) => <Source
    key="portrait-1x"
    media="(max-width: 768px)"
    srcSet={`${Examples.portrait.url}@1x.jpg, ${Examples.portrait.url}@2x.jpg 1.5x, ${Examples.portrait.url}@3x.jpg 2x`}
    alt={Examples.portrait.focusZones[focus].alt}
    size={{ width: Examples.portrait.size.width, height: Examples.portrait.size.height }}
    focusZone={Examples.portrait.focusZones[focus]}
/>

type StoryArgs = React.ComponentProps<typeof Picture> & {
    target: Focus;
    off: boolean;
};

const meta = {
    component: Picture,
    args: {
        debug: false,
        target: "artPiece",
        off: false,
        src: `${baseUrl}-landscape@1x.jpg`,
    },
    argTypes: {
        debug: { control: "boolean" },
        off: { control: "boolean" },
        targetZoneClassName: {
            description: "Required CSS classes to apply to the TargetZone. For easier testing, a selection of fixed values is provided.",
            control: "inline-radio",
            options: ["top-half", "right-half", "bottom-half", "left-half", "vertical-center", "horizontal-center", "center", "full"],
            mapping: {
                "top-half": "example-top-half",
                "right-half": "example-right-half",
                "bottom-half": "example-bottom-half",
                "left-half": "example-left-half",
                "vertical-center": "example-vertical-center",
                "horizontal-center": "example-horizontal-center",
                "center": "example-center",
                "full": "example-full",
            }
        },
        target: {
            control: "radio",
            options: ["artPiece", "console", "plush"],
            description: "Select which focus zone to target within the image."
        },
        className: { table: { disable: true } },
        children: { table: { disable: true } },
        src: { table: { disable: true } },
        srcSet: { table: { disable: true } },
        focusZoneClassName: { table: { disable: true } },
        imageClassName: { table: { disable: true } },
        alt: { table: { disable: true } },
        loading: { table: { disable: true } },
        refs: { table: { disable: true } },
    }
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
    render: (args) => {
        const { target, off, ...pictureProps } = args;
        const sources = [
            Landscape3x(target),
        ];
        return (
            <Picture {...pictureProps}>
                {!!off && sources}
            </Picture>
        );
    },
};