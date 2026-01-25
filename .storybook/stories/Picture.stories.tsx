import type { Meta, StoryObj } from '@storybook/react';

import { Picture } from '../../src/components/Picture';
import { Source } from '../../src/components/Source';

const baseUrl = 'https://picsum.photos/';

type CustomArgs = {
    sizeWidth: number;
    sizeHeight: number;
    focusZoneX: number;
    focusZoneY: number;
    focusZoneWidth: number;
    focusZoneHeight: number;
};

const meta = {
    component: Picture,
    args: {
        debug: true,
        className: 'h75p w75p',
        targetZoneClassName: 'w50p h75p t50x l50x',
        focusZoneClassName: '',
        imageClassName: '',
        alt: 'Sample image',
        loading: 'lazy',
        sizeWidth: 1600,
        sizeHeight: 900,
        focusZoneX: 100,
        focusZoneY: 100,
        focusZoneWidth: 400,
        focusZoneHeight: 300,
    },
    argTypes: {
        className: { control: 'text' },
        targetZoneClassName: { control: 'text' },
        focusZoneClassName: { control: 'text' },
        imageClassName: { control: 'text' },
        alt: { control: 'text' },
        loading: { control: { type: 'select' }, options: ['lazy', 'eager'] },
        debug: { control: 'boolean' },
        sizeWidth: { control: { type: 'number', min: 1 }, name: 'Source size.width' },
        sizeHeight: { control: { type: 'number', min: 1 }, name: 'Source size.height' },
        focusZoneX: { control: { type: 'number', min: 0 }, name: 'Source focusZone.x' },
        focusZoneY: { control: { type: 'number', min: 0 }, name: 'Source focusZone.y' },
        focusZoneWidth: { control: { type: 'number', min: 1 }, name: 'Source focusZone.width' },
        focusZoneHeight: { control: { type: 'number', min: 1 }, name: 'Source focusZone.height' },
    },
    render: (args) => {
        const {
            sizeWidth,
            sizeHeight,
            focusZoneX,
            focusZoneY,
            focusZoneWidth,
            focusZoneHeight,
            ...pictureProps
        } = args as typeof args & CustomArgs;

        const src = `${baseUrl}${sizeWidth}/${sizeHeight}`;
        const srcSet = [
            `${baseUrl}${sizeWidth}/${sizeHeight} 1x`,
            `${baseUrl}${sizeWidth * 2}/${sizeHeight * 2} 2x`
        ].join(', ');

        return (
            <Picture
                {...pictureProps}
                src={src}
            >
                <Source
                    srcSet={srcSet}
                    size={{ width: sizeWidth, height: sizeHeight }}
                    focusZone={{
                        x: focusZoneX,
                        y: focusZoneY,
                        width: focusZoneWidth,
                        height: focusZoneHeight,
                    }}
                    alt={args.alt}
                />
            </Picture>
        );
    },
} as Meta<typeof Picture & CustomArgs>; // <-- type assertion here

export default meta;
type Story = StoryObj<typeof Picture & CustomArgs>;

export const Default: Story = {
};