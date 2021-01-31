import _ from 'underscore';
import uuid from 'uuid/v4';
import ENUMS from './enums';
import op from 'object-path';
import pkg from './package';
import slugify from 'slugify';
import isHotkey from 'is-hotkey';
import { useEffect } from 'react';
import copy from 'copy-to-clipboard';
import Reactium, { __, useDerivedState } from 'reactium-core/sdk';

let defaultConfig = {
    brand: __('Reactium'),
    info: String(__('Toolkit version %ver')).replace('%ver', pkg.version),
    titlebar: __('Reactium'),
    sidebar: {
        collapsed: Reactium.Prefs.get('rtk.sidebar.collapsed', true),
        position: Reactium.Prefs.get('rtk.sidebar.position', 'left'),
        width: Reactium.Prefs.get('rtk.sidebar.width', 320),
    },
};

const sorter = (list, id, key = 'order') => {
    const hook = `${id}-sort`;
    let results = _.sortBy(list, key);
    Reactium.Hook.runSync(hook, results, key);
    return results;
};

const cx = Reactium.Utils.cxFactory('rtk');

const Elements = Reactium.Utils.registryFactory(
    'rtk-elements',
    null,
    Reactium.Utils.Registry.MODES.CLEAN,
);

const Hotkeys = Reactium.Utils.registryFactory(
    'rtk-hotkeys',
    null,
    Reactium.Utils.Registry.MODES.CLEAN,
);

const Pubsub = Reactium.Utils.registryFactory(
    'rtk-pubsub',
    null,
    Reactium.Utils.Registry.MODES.CLEAN,
);

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

Elements.sort = key => sorter(Elements.list, Elements.__name, key);
Hotkeys.sort = key => sorter(Hotkeys.list, Hotkeys.__name, key);
Pubsub.sort = key => sorter(Pubsub.list, Pubsub.__name, key);
Sidebar.sort = key => sorter(Sidebar.list, Sidebar.__name, key);
Toolbar.sort = key => sorter(Toolbar.list, Toolbar.__name, key);

Sidebar.position = {
    left: 'left',
    right: 'right',
};

Toolbar.align = {
    left: 'left',
    right: 'right',
    center: 'center',
};

Hotkeys.search = async e => {
    const type = e.type;
    const list = Hotkeys.sort();

    let next = true;

    const done = () => {
        next = false;
    };

    for (let i = 0; i < list.length; i++) {
        const item = list[i];

        const hotkeys = _.chain([op.get(item, 'hotkey', [])])
            .flatten()
            .value();

        if (hotkeys.length < 1) continue;

        const callback = op.get(item, type);

        if (!callback || !_.isFunction(callback)) continue;

        const match = hotkeys.filter(hotkey => isHotkey(hotkey, e));

        if (match.length > 0) {
            const doNext = await callback(e, done);
            if (doNext === false) done();
        }

        if (next !== true) return;
    }
};

class SDK {
    constructor() {
        // default config
        this.__config = JSON.parse(JSON.stringify(defaultConfig));

        // fullscreen
        this.__fs;

        // Hotkeys listener
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', Hotkeys.search);
            window.addEventListener('keyup', Hotkeys.search);
        }
    }

    get ENUMS() {
        let _enums = { ...ENUMS };
        Reactium.Hook.runSync('rtk-enums', _enums);
        return _enums;
    }

    get Elements() {
        return Elements;
    }

    get Hotkeys() {
        return Hotkeys;
    }

    get Sidebar() {
        return Sidebar;
    }

    get Toolbar() {
        return Toolbar;
    }

    get config() {
        let _config = JSON.parse(JSON.stringify(this.__config));
        Reactium.Hook.runSync('rtk-config', _config);
        return _config;
    }

    get setConfig() {
        let _config = JSON.parse(JSON.stringify(this.__config));

        return (...args) => {
            if (!_.isObject(args[0])) {
                if (args.length < 1) return _config;

                const key = args[0];
                const val = args[1];
                op.set(_config, key, val);
            } else {
                _config = { ..._config, ...args[0] };
            }

            this.__config = _config;
            this.notify('config', this.__config);

            return this.__config;
        };
    }

    get copy() {
        return copy;
    }

    get cx() {
        return cx;
    }

    get fullscreen() {
        return this.__fs;
    }

    get setFullscreen() {
        return val => {
            this.__fs = val;

            if (typeof window !== 'undefined') {
                if (val === true) {
                    document.body.setAttribute('data-fullscreen', val);
                } else {
                    document.body.removeAttribute('data-fullscreen');
                }
            }

            this.notify('fullscreen', { fullscreen: val });
        };
    }

    get os() {
        if (typeof window === 'undefined') return null;

        const platform = String(window.navigator.platform).toLowerCase();

        const isWindows = platform.includes('win');
        if (isWindows) return 'windows';

        const isIos = platform.startsWith('i');
        if (isIos) return 'ios';

        const isMac = platform.includes('mac');
        if (isMac) return 'mac';
    }

    get subscribe() {
        return (callback, id) => {
            id = id || uuid();
            Pubsub.register(id, { callback });
            return () => this.unsubscribe(id);
        };
    }

    get unsubscribe() {
        return id => {
            Pubsub.unregister(id);
        };
    }

    async notify(type, data = {}) {
        if (!type) return;
        const _cbs = _.pluck(Pubsub.sort(), 'callback');
        for (let i = 0; i < _cbs.length; i++) {
            const callback = _cbs[i];
            await callback({ type, ...data });
        }
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
            }, [order]);

            useEffect(() => {
                const unsub = Sidebar.subscribe(() => {
                    setData(fetch(), 'subscribe');
                });
                return unsub;
            }, []);

            return [state.data, setData];
        };
    }

    get useElements() {
        return props => {
            const zone = op.get(props, 'zone', null);
            const order = op.get(props, 'order', 'order');

            const fetch = () => {
                const filter = item => {
                    if (!op.get(item, 'component') || !zone) return false;

                    return _.chain([op.get(item, 'zone', null)])
                        .flatten()
                        .compact()
                        .uniq()
                        .value()
                        .includes(zone);
                };

                return Elements.sort(order).filter(filter);
            };

            const [state, setState] = useDerivedState({ data: [] });

            const isEqual = newData => _.isEqual(state.data, newData);

            const setData = newData => {
                if (isEqual(newData)) return;
                setState({ data: newData });
            };

            useEffect(() => {
                setData(fetch());
            }, [zone, order]);

            useEffect(() => {
                const unsub = Elements.subscribe(() => {
                    setData(fetch());
                });
                return unsub;
            }, []);

            return [state.data, setData];
        };
    }

    get useToolbarElements() {
        return props => {
            const order = op.get(props, 'order', 'order');

            const fetch = () => {
                const filter = item => !!op.get(item, 'component');

                return Toolbar.sort(order).filter(filter);
            };

            const [state, setState] = useDerivedState({ data: [] });

            const isEqual = newData => _.isEqual(state.data, newData);

            const setData = newData => {
                if (isEqual(newData)) return;
                setState({ data: newData });
            };

            useEffect(() => {
                setData(fetch());
            }, [order]);

            useEffect(() => {
                const unsub = Toolbar.subscribe(() => {
                    setData(fetch());
                });
                return unsub;
            }, []);

            return [state.data, setData];
        };
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