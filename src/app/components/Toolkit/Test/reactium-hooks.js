import Element from '.';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Link
    Reactium.Toolkit.Sidebar.register('test', {
        order: 100,
        component: MenuLink,
        children: __('Test'),
        'aria-label': __('Test'),
        url: '/toolkit/test',
    });

    // Element
    Reactium.Toolkit.Elements.register('test-element', {
        order: 0,
        zone: 'test',
        component: Element,
    });
});
