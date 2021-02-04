import Header from './Header';
import Calculator from './Calculator';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('Panasonic').then(() => {
    if (!Reactium.Toolkit) return;

    Reactium.Hook.register('plugin-ready', () => {
        const MenuLink = Reactium.Component.get('RTKMENULINK');

        Reactium.Toolkit.Sidebar.unregister('overview');
        Reactium.Toolkit.Elements.unregister('overview');

        Reactium.Toolkit.Sidebar.register('panasonic', {
            exact: true,
            component: MenuLink,
            children: 'Panasonic',
            'aria-label': 'Panasonic',
            url: '/toolkit',
            order: Reactium.Enums.priority.highest,
        });

        Reactium.Toolkit.Elements.register('panasonic-calculator', {
            order: 0,
            zone: 'overview',
            component: Calculator,
        });

        Reactium.Toolkit.Elements.register('panasonic-header', {
            order: 2,
            zone: 'overview',
            component: Header,
        });
    });
});
