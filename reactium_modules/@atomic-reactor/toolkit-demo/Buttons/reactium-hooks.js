import Usage from './Usage';
import States from './States';
import Overview from './Overview';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Plugin.register('ToolkitButtons').then(() => {
    if (!Reactium.Toolkit) return;

    Reactium.Hook.register('plugin-ready', () => {
        const MenuLink = Reactium.Component.get('RTKMENULINK');

        Reactium.Toolkit.Sidebar.register('button', {
            order: 4,
            component: MenuLink,
            url: '/toolkit/button',
            children: __('Buttons'),
            'aria-label': __('Buttons'),
        });

        Reactium.Toolkit.Sidebar.register('button-states', {
            order: 0,
            group: 'button',
            url: '/toolkit/button/states',
            children: __('Button States'),
            'aria-label': __('Button States'),
        });

        Reactium.Toolkit.Elements.register('button-overview', {
            order: 0,
            component: Overview,
            zone: ['button', 'overview'],
        });

        Reactium.Toolkit.Elements.register('button-states', {
            order: 0,
            component: States,
            zone: 'button-states',
        });

        Reactium.Toolkit.Elements.register('button-usage', {
            order: 0,
            component: Usage,
            zone: 'button-component',
        });
    });
});
