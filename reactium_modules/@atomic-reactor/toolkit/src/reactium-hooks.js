/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin: Toolkit
 * -----------------------------------------------------------------------------
 */
import SDK from './sdk';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Toolkit } from './index';
import Brand from './Sidebar/Brand';
import Element from './Content/Element';
import Reactium from 'reactium-core/sdk';
import MenuLink from './Sidebar/MenuLink';
import MenuToggle from './Toolbar/MenuToggle';

Reactium.Toolkit = Reactium.Toolkit || SDK;

Reactium.Plugin.register('ReactiumToolkit').then(() => {

    Reactium.Component.register('RTKLOGO', Logo);
    Reactium.Component.register('RTKBRAND', Brand);
    Reactium.Component.register('RTKMENULINK', MenuLink);
    Reactium.Component.register('RTK', { Element, Icon, Toolkit });

    Reactium.Hook.register('plugin-ready', () => {
        const BrandComp = Reactium.Component.get('RTKBRAND');

        Reactium.Zone.addComponent({
            id: 'Brand',
            component: BrandComp,
            zone: 'sidebar-brand',
            order: Reactium.Enums.priority.highest,
        });

        // ---------------------------------------------------------------------
        // Toolbar Buttons
        // ---------------------------------------------------------------------
        Reactium.Toolkit.Toolbar.register('menutoggle-left', {
            align: Reactium.Toolkit.Toolbar.align.left,
            component: MenuToggle,
            order: Reactium.Enums.priority.highest,
        });

        Reactium.Toolkit.Toolbar.register('menutoggle-right', {
            align: Reactium.Toolkit.Toolbar.align.right,
            component: MenuToggle,
            order: Reactium.Enums.priority.highest,
        });

        Reactium.Toolkit.Sidebar.register('overview', {
            order: 0,
            exact: true,
            url: '/toolkit',
            component: MenuLink,
            children: 'Overview',
            'aria-label': 'Overview',
        });
    });
});
