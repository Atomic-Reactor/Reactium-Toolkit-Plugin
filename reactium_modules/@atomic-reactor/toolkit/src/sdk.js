import _ from 'underscore';
import ENUMS from './enums';
import op from 'object-path';
import pkg from '../package';
import slugify from 'slugify';
import Reactium, { __ } from 'reactium-core/sdk';

const cx = Reactium.Utils.cxFactory('rtk');
const Sidebar = Reactium.Utils.registryFactory('RTKSidebar');
const Toolbar = Reactium.Utils.registryFactory('RTKToolbar');
const Overview = Reactium.Utils.registryFactory('RTKOverview');

Sidebar.position = {
    left: 'left',
    right: 'right',
};

Toolbar.align = {
    left: 'left',
    right: 'right',
    center: 'center',
};

let defaultConfig = {
    brand: __('Reactium'),
    info: String(__('Toolkit version %ver')).replace('%ver', pkg.version),
    titlebar: __('Reactium'),
    sidebar: {
        collapsed: Reactium.Prefs.get('rtk.sidebar.collapsed', true),
        position: Reactium.Prefs.get(
            'rtk.sidebar.position',
            Sidebar.position.left,
        ),
        width: Reactium.Prefs.get('rtk.sidebar.width', 320),
    },
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

    get zone() {
        const { pathname } = Reactium.Routing.currentRoute.location;

        if (String(pathname).startsWith('/toolbar/search')) return 'search';

        const { group, slug } = op.get(
            Reactium.Routing.currentRoute,
            'params',
            {},
        );

        const zone = !group ? ['overview'] : _.compact([group, slug]);

        return slugify(zone.join('-'), { lower: true });
    }
}

export default new SDK();
