const SDK = require('@atomic-reactor/reactium-sdk-core').default;
SDK.Hook.registerSync('Server.AppStyleSheets', (req, AppStyleSheets) => {
    if (!String(req.originalUrl).startsWith('/toolkit')) return;
    AppStyleSheets.register('toolkit-plugin', {
        path: '/assets/style/toolkit.css',
        order: SDK.Enums.priority.normal,
    });
});
