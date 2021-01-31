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
import { MenuToggle, ToolbarTitle } from './Toolbar';

Reactium.Toolkit = Reactium.Toolkit || SDK;

Reactium.Plugin.register('ReactiumToolkit').then(() => {

    Reactium.Component.register('RTKLOGO', Logo);
    Reactium.Component.register('RTKBRAND', Brand);
    Reactium.Component.register('RTKMENULINK', MenuLink);
    Reactium.Component.register('RTK', { Element, Icon, Toolkit, ToolbarTitle });

    Reactium.Hook.register('plugin-ready', () => {
        const BrandComp = Reactium.Component.get('RTKBRAND');

        Reactium.Zone.addComponent({
            id: 'Brand',
            component: BrandComp,
            zone: 'sidebar-brand',
            order: Reactium.Enums.priority.highest,
        });

        // Titlebar update
        if (typeof window !== 'undefined') {
            document.title = Reactium.Toolkit.config.titlebar;
        }

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
    }, Reactium.Enums.priority.highest);
});
