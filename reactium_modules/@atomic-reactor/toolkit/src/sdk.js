import _ from 'underscore';
import ENUMS from './enums';
import op from 'object-path';
import pkg from '../package';
import slugify from 'slugify';
import { useEffect } from 'react';
import Reactium, { __, useDerivedState } from 'reactium-core/sdk';

const cx = Reactium.Utils.cxFactory('rtk');
const Sidebar = Reactium.Utils.registryFactory(
    'rtk-sidebar',
    null,
    Reactium.Utils.Registry.MODES.CLEAN,
);
const Toolbar = Reactium.Utils.registryFactory(
    'rtk-toolbar',
    null,
    Reactium.Utils.Registry.MODES.CLEAN,
);
const Element = Reactium.Utils.registryFactory(
    'rtk-element',
    null,
    Reactium.Utils.Registry.MODES.CLEAN,
);
const Overview = Reactium.Utils.registryFactory(
    'rtk-overview',
    null,
    Reactium.Utils.Registry.MODES.CLEAN,
);

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

const sorter = (list, id) => key => {
    const hook = `${id}-sort`;
    let results = _.sortBy(list, key);
    Reactium.Hook.runSync(hook, results, key);
    return results;
};

class SDK {
    get ENUMS() {
        let _enums = { ...ENUMS };
        Reactium.Hook.runSync('rtk-enums', _enums);
        return _enums;
    }

    get Element() {
        Element.sort = sorter(Element.list, Element.__name);
        return Element;
    }

    get Overview() {
        Overview.sort = sorter(Overview.list, Overview.__name);
        return Overview;
    }

    get Sidebar() {
        Sidebar.sort = sorter(Sidebar.list, Sidebar.__name);
        return Sidebar;
    }

    get Toolbar() {
        Toolbar.sort = sorter(Toolbar.list, Toolbar.__name);
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

    get useLinks() {
        return props => {
            const group = op.get(props, 'group', false);
            const order = op.get(props, 'order', 'order');
            
            const fetch = () => {
                const filter = item => group !== !op.get(item, 'group', false);
                return Sidebar.sort(order).filter(filter);
            };

            const [state, setState] = useDerivedState({ data: [] });

            const isEqual = newData => _.isEqual(state.data, newData);

            const setData = (newData, caller) => {
                if (isEqual(newData, caller)) return;
                setState({ data: newData });
            };

            useEffect(() => {
                setData(fetch(), 'useEffect');
            }, []);

            useEffect(() => {
                const unsub = Sidebar.subscribe(() => {
                    setData(fetch(), 'subscribe');
                });
                return unsub;
            }, []);

            return [state.data, setData];
        };
    }
}

export default new SDK();
