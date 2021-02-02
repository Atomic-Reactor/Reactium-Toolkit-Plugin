import Reactium from 'reactium-core/sdk';
import ColorSelect from './toolkit/Button/ColorSelect';
import CodeEditor from './utils/CodeEditor';

Reactium.Plugin.register('ToolkitDemo').then(() => {
    if (!Reactium.Toolkit) return;

    // Override Brand name
    Reactium.Toolkit.setConfig('brand', 'Reactium UI');
    Reactium.Toolkit.setConfig('titlebar', 'Reactium UI');

    Reactium.Hook.register('plugin-ready', () => {
        const RTK = Reactium.Component.get('RTK');
        RTK.ColorSelect = ColorSelect;
        RTK.CodeEditor = CodeEditor;
        Reactium.Component.register('RTK', RTK);
    });
});
