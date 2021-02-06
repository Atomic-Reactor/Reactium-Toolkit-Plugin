import React from 'react';
import { __, useHookComponent } from 'reactium-core/sdk';

const docs = `
# Title
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Some **bold**, *italic*, ~~strike~~, and ${'`code`'} text

${'```<div>markup</div>```'}

> Block quote
`;

export default () => {
    const { Element, Markdown } = useHookComponent('RTK');

    return (
        <Element title={__('Button Docs')} className='pt-xs-64 px-xs-40'>
            <Markdown value={docs} />
        </Element>
    );
};
