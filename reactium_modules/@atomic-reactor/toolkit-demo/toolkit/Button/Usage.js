import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

export default () => {
    const { Element } = useHookComponent('RTK');
    return <Element>Button Component</Element>;
};
