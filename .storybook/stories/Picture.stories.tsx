import type { Meta, StoryObj } from '@storybook/react';

import { Picture } from '../../src/components/Picture';
import { Source } from '../../src/components/Source';

const baseUrl = 'https://picsum.photos/';

const meta: Meta<typeof Picture> = {
    component: Picture,
    args: {
        debug: false,
    },
    argTypes: {
        debug: { control: 'boolean' },
    }
};
export default meta;

type Story = StoryObj<typeof Picture>;

export const Portrait: Story = {
    render: () => {
        const size = { width: 800, height: 1200 };
        const focusZone = { x: 200, y: 400, width: 200, height: 300 };
        const src = `${baseUrl}${size.width}/${size.height}`;
        const srcSet = [
            `${baseUrl}${size.width}/${size.height} 1x`,
            `${baseUrl}${size.width * 2}/${size.height * 2} 2x`
        ].join(', ');

        return (
            <Picture
                className="h75p w75p"
                targetZoneClassName="w50p h75p t50x l50x"
                alt="Portrait sample"
                src={src}
                srcSet={srcSet}
            >
                <Source
                    srcSet={srcSet}
                    size={size}
                    focusZone={focusZone}
                    media="(orientation: portrait)"
                />
            </Picture>
        );
    },
};

export const Landscape: Story = {
    render: () => {
        const size = { width: 1200, height: 800 };
        const focusZone = { x: 400, y: 200, width: 300, height: 200 };
        const src = `${baseUrl}${size.width}/${size.height}`;
        const srcSet = [
            `${baseUrl}${size.width}/${size.height} 1x`,
            `${baseUrl}${size.width * 2}/${size.height * 2} 2x`
        ].join(', ');

        return (
            <Picture
                className="h75p w75p"
                targetZoneClassName="w50p h75p t50x l50x"
                alt="Landscape sample"
                src={src}
                srcSet={srcSet}
            >
                <Source
                    srcSet={srcSet}
                    size={size}
                    focusZone={focusZone}
                    media="(orientation: landscape)"
                />
            </Picture>
        );
    },
};

export const MultiSource: Story = {
    render: () => {
        const size1 = { width: 800, height: 800 };
        const focusZone1 = { x: 200, y: 200, width: 200, height: 150 };
        const src1 = `${baseUrl}${size1.width}/${size1.height}`;
        const srcSet1 = [
            `${baseUrl}${size1.width}/${size1.height} 1x`,
            `${baseUrl}${size1.width * 2}/${size1.height * 2} 2x`
        ].join(', ');

        const size2 = { width: 1000, height: 1000 };
        const focusZone2 = { x: 300, y: 300, width: 300, height: 200 };
        const srcSet2 = [
            `${baseUrl}${size2.width}/${size2.height} 1x`,
            `${baseUrl}${size2.width * 2}/${size2.height * 2} 2x`
        ].join(', ');

        return (
            <Picture
                className="h75p w75p"
                targetZoneClassName="w50p h75p t50x l50x"
                alt="Multi source sample"
                src={src1}
                srcSet={srcSet1}
            >
                <Source
                    srcSet={srcSet1}
                    size={size1}
                    focusZone={focusZone1}
                    media="(orientation: portrait)"
                />
                <Source
                    srcSet={srcSet2}
                    size={size2}
                    focusZone={focusZone2}
                    media="(orientation: landscape)"
                />
            </Picture>
        );
    },
};