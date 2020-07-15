import React from 'react';
import Card from 'reactium_modules/@atomic-reactor/toolkit/Content/Card';
import Docs from 'reactium_modules/@atomic-reactor/toolkit/Content/Docs';
import Markdown from 'reactium_modules/@atomic-reactor/toolkit/Markdown';

/**
 * -----------------------------------------------------------------------------
 * Overview
 * Write up something about the style guide or remove all of this and make
 * this a component that shows off something flashy!
 * -----------------------------------------------------------------------------
 */
const content = `
### Overview

Add some content about this design system by editing:

${'```javascript'}
/src/app/toolkit/overview/index.js
${'```'}

Need help on how to create Design System elements?

[Design System Documentation](https://reactium.io/docs/guide/design-system).

#### Code Example
${'```javascript'}
console.log('Put some code here if you want to show some examples of how to do stuff');
${'```'}
`;

/**
 * -----------------------------------------------------------------------------
 * DO NOT EDIT BELOW HERE
 * -----------------------------------------------------------------------------
 */
const Comp = Toolkit => () => (
    <Markdown theme={Toolkit.prefs.codeColor.all}>{content}</Markdown>
);

const Overview = ({ getState }) => {
    return (
        <Card title={'Reactium Style Guide'}>
            <Docs
                component={Comp(getState().toolkit)}
                id={'overview'}
                visible={true}
            />
        </Card>
    );
};

export default Overview;
