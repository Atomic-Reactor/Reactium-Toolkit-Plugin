import Reactium from 'reactium-core/sdk';
import { Toolkit } from 'reactium_modules/@atomic-reactor/toolkit';

export default {
    exact: true,
    path: ['/'],
    component: Toolkit,
    order: Reactium.Enums.priority.lowest
};
