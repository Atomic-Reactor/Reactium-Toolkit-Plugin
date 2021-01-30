import ColorSelect from '.';
import Reactium from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    // Extend the RTK components
    const RTK = Reactium.Component.get('RTK');
    RTK.ColorSelect = ColorSelect;
    Reactium.Component.register('RTK', RTK);
});
