import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Item: Button Test
    Reactium.Toolkit.Sidebar.register('button-test', {
        order: 100,
        component: MenuLink,
        children: __('Button Test'),
        'aria-label': __('Button Test'),
        url: '/toolkit/button/button-test',
        group: 'button',
    });
});
