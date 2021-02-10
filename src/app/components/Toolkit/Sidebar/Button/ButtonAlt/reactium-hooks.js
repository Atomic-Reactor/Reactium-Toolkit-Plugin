import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Item: Button Alt
    Reactium.Toolkit.Sidebar.register('button-alt', {
        order: 100,
        component: MenuLink,
        children: __('Button Alt'),
        'aria-label': __('Button Alt'),
        url: '/toolkit/button/button-alt',
        group: 'button',
    });
});
