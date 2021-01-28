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
import Reactium from 'reactium-core/sdk';
import MenuLink from './Sidebar/MenuLink';
import MenuToggle from './Toolbar/MenuToggle';

Reactium.Toolkit = Reactium.Toolkit || SDK;

Reactium.Plugin.register('ReactiumToolkit').then(() => {
    Reactium.Component.register('RTK', { Toolkit, Icon });
    Reactium.Component.register('RTKLOGO', Logo);
    Reactium.Component.register('RTKMENULINK', MenuLink);

    Reactium.Zone.addComponent({
        zone: 'sidebar-brand',
        component: Brand,
        order: Reactium.Enums.priority.highest,
    });

    Reactium.Hook.register('app-ready', () => {
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
            url: '/toolkit',
            component: MenuLink,
            children: 'Overview',
            'aria-label': 'Overview',
            exact: true,
            order: Reactium.Enums.priority.highest,
        });

        Reactium.Toolkit.Sidebar.register('components', {
            url: '/toolkit/components',
            component: MenuLink,
            children: 'Components',
            'aria-label': 'Components',
            order: Reactium.Enums.priority.neutral,
        });

        Reactium.Toolkit.Sidebar.register('typography', {
            url: '/toolkit/typography',
            component: MenuLink,
            children: 'Typography',
            'aria-label': 'Typography',
            order: Reactium.Enums.priority.neutral,
        });

        Reactium.Toolkit.Sidebar.register('buttons', {
            url: '/toolkit/buttons',
            component: MenuLink,
            children: 'Buttons',
            'aria-label': 'Buttons',
            order: Reactium.Enums.priority.neutral,
        });

        for (let i = 1; i <= 50; i++) {
            Reactium.Toolkit.Sidebar.register(`component-${i}`, {
                group: 'components',
                url: `/toolkit/components/${i}`,
                children: `Component ${i}`,
            });

            Reactium.Toolkit.Sidebar.register(`typography-${i}`, {
                group: 'typography',
                url: `/toolkit/typography/${i}`,
                children: `Typography ${i}`,
            });

            Reactium.Toolkit.Sidebar.register(`button-${i}`, {
                group: 'buttons',
                url: `/toolkit/buttons/${i}`,
                children: `Button ${i}`,
            });
        }
    });
});
