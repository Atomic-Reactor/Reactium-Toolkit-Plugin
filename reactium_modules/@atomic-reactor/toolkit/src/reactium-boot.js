const Reactium = require('reactium-core/sdk').default;

Reactium.Hook.register('Server.AppStyleSheets', async (req, AppStyleSheets) => {
    AppStyleSheets.register('rtk', {
        path: '/assets/style/rtk.css',
        order: Reactium.Enums.priority.lowest,
    });
});
