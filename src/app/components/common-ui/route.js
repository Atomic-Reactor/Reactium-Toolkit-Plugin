import Reactium from 'reactium-core/sdk';
import { Toolkit } from 'reactium_modules/@atomic-reactor/toolkit/src';

export default {
    exact: true,
    component: Toolkit,
    path: ['/'],
    order: Reactium.Enums.priority.lowest
};
