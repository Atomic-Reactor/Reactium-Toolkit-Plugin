import Header from './Header';
import Calculator from './Calculator';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('Panasonic').then(() => {
    if (!Reactium.Toolkit) return;

    Reactium.Hook.register('plugin-ready', () => {
        const MenuLink = Reactium.Component.get('RTKMENULINK');

        Reactium.Toolkit.Sidebar.register('panasonic', {
            exact: true,
            component: MenuLink,
            children: 'Panasonic',
            'aria-label': 'Panasonic',
            url: '/toolkit/panasonic',
            order: Reactium.Enums.priority.highest,
        });

        Reactium.Toolkit.Elements.register('panasonic-calculator', {
            order: 0,
            zone: 'panasonic',
            component: Calculator,
        });

        Reactium.Toolkit.Elements.register('panasonic-header', {
            order: 2,
            zone: 'panasonic',
            component: Header,
        });
    });
});
