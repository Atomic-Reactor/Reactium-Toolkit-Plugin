import ENUMS from './enums';
import Reactium, { __ } from 'reactium-core/sdk';


let defaultConfig = {
    title: __('Reactium'),
    subTitle: __('UI Toolkit'),
    sidebar: {
        collapsed: Reactium.Prefs.get('rtk.sidebar.collapsed', true),
        width: 320,
    },
};

const cx = Reactium.Utils.cxFactory('rtk');
const Sidebar = Reactium.Utils.registryFactory('RTKSidebar');
const Toolbar = Reactium.Utils.registryFactory('RTKToolbar');
const Overview = Reactium.Utils.registryFactory('RTKOverview');

Toolbar.align = {
    left: 'left',
    right: 'right',
    center: 'center',
};

class SDK {

    get ENUMS() {
        let _enums = { ...ENUMS };
        Reactium.Hook.runSync('rtk-enums', _enums);
        return _enums;
    }

    get Overview() {
        return Overview;
    }

    get Sidebar() {
        return Sidebar;
    }

    get Toolbar() {
        return Toolbar;
    }

    get config() {
        let _config = { ...defaultConfig };
        Reactium.Hook.runSync('rtk-config', _config);
        return _config;
    }

    get cx() {
        return cx;
    }
}

export default new SDK();
