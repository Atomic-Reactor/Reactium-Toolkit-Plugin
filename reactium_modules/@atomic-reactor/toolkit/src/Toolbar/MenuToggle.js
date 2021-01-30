import _ from 'underscore';
import cc from 'camelcase';
import React, { useEffect, useState } from 'react';
import Reactium, { __, useHandle, useHookComponent } from 'reactium-core/sdk';

const MenuToggle = ({ zone }) => {
    const cx = Reactium.Toolkit.cx;

    const arrow = `Feather.Arrow${cc(
        String(Reactium.Toolkit.config.sidebar.position).toLowerCase(),
        { pascalCase: true },
    )}`;

    const visible = Reactium.Toolkit.config.sidebar.position === zone;

    const { Icon } = useHookComponent('RTK');

    const Sidebar = useHandle('RTKSidebar');

    const [collapsed, setCollapsed] = useState();

    const [label, setLabel] = useState();

    const onCollapse = () => setCollapsed(true);

    const onExpand = () => setCollapsed(false);

    useEffect(() => {
        if (_.isUndefined(collapsed)) return;

        let lbl =
            collapsed === true ? __('expand sidebar') : __('collapse sidebar');

        switch (Reactium.Toolkit.os) {
            case 'windows' :
                lbl = `ctrl+] ${lbl}`;
                break;

            case 'mac' :
                lbl = `⌘+] ${lbl}`;
                break;
        }

        setLabel(lbl);
    }, [collapsed]);

    useEffect(() => {
        setCollapsed(Sidebar.collapsed);

        Sidebar.addEventListener('expand', onExpand);
        Sidebar.addEventListener('collapse', onCollapse);

        // Register hotkey
        Reactium.Toolkit.Hotkeys.register('sidebar', {
            hotkey: 'mod+]',
            keydown: () => Sidebar.toggle(),
        });

        return () => {
            Sidebar.removeEventListener('expand', onExpand);
            Sidebar.removeEventListener('collapse', onCollapse);

            // Unregister hotkey
            Reactium.Toolkit.Hotkeys.unregister('sidebar');
        };
    }, [Sidebar]);

    return _.isUndefined(collapsed) || !visible ? null : (
        <button
            title={label}
            aria-label={label}
            style={{ padding: 10 }}
            className={cx('btn-clear-xs')}
            onClick={() => Sidebar.toggle()}>
            <Icon name={collapsed ? 'Feather.Menu' : arrow} />
        </button>
    );
};

export { MenuToggle, MenuToggle as default };
