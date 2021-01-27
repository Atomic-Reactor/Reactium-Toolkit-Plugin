/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin: Toolkit
 * -----------------------------------------------------------------------------
 */

import SDK from './sdk';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Toolkit } from './index';
import Reactium from 'reactium-core/sdk';
import MenuButton from './Header/MenuButton';
import HeaderLogo from './Header/Logo';

Reactium.Toolkit = Reactium.Toolkit || SDK;

Reactium.Plugin.register('ReactiumToolkit').then(() => {
    Reactium.Component.register('RTK', { Toolkit, Icon });
    Reactium.Component.register('RTKLOGO', Logo);

    Reactium.Toolkit.Toolbar.register('RTKMENUBTN', {
        align: Reactium.Toolkit.Toolbar.align.left,
        component: MenuButton,
        order: Reactium.Enums.priority.lowest,
    });

    Reactium.Toolkit.Toolbar.register('RTKLOGO', {
        align: Reactium.Toolkit.Toolbar.align.right,
        component: HeaderLogo,
        order: Reactium.Enums.priority.lowest,
    });
});
