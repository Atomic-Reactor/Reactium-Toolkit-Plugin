import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('MyPlugin').then(() => {
    // Reactium.Hook.register('app-ready', () => {
    //     const MenuLink = Reactium.Component.get('RTKMENULINK');
    //
    //     // Top-Level Link - Form Elements
    //     Reactium.Toolkit.Sidebar.register('form', {
    //         url: '/toolkit/form',
    //         component: MenuLink,
    //         children: 'Form Elements',
    //         'aria-label': 'Form Elements',
    //         order: Reactium.Enums.priority.lowest,
    //     });
    //
    //     // Child Link of Form Elements
    //     Reactium.Toolkit.Sidebar.register('form-inputs', {
    //         url: '/toolkit/form/inputs',
    //         children: 'Inputs',
    //         'aria-label': 'Form Inputs',
    //         order: Reactium.Enums.priority.neutral,
    //         group: 'form',
    //     });
    // });
});

Reactium.Hook.unregister('service-worker-init');
