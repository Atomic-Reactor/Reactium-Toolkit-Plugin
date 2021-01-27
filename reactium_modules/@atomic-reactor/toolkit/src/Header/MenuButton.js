import _ from 'underscore';
import React, { useState, useEffect } from 'react';
import Reactium, { __, useHandle, useHookComponent } from 'reactium-core/sdk';

const MenuButton = () => {
    const cx = Reactium.Toolkit.cx;

    const { Icon } = useHookComponent('RTK');

    const Sidebar = useHandle('RTKSidebar');

    const [collapsed, setCollapsed] = useState();

    const [label, setLabel] = useState();

    const SidebarToggle = () => Sidebar.toggle();

    const onCollapse = () => {
        setCollapsed(true);
    };

    const onExpand = () => {
        setCollapsed(false);
    };

    useEffect(() => {
        if (_.isEmpty(Object.keys(Sidebar))) return;

        setCollapsed(Sidebar.state.collapsed);

        Sidebar.addEventListener('expand', onExpand);
        Sidebar.addEventListener('collapse', onCollapse);

        return () => {
            Sidebar.removeEventListener('expand', onExpand);
            Sidebar.removeEventListener('collapse', onCollapse);
        };
    }, [Sidebar]);

    useEffect(() => {
        if (_.isUndefined(collapsed)) return;

        setLabel(
            collapsed === true ? __('expand sidebar') : __('collapse sidebar'),
        );
    }, [collapsed]);

    return _.isUndefined(collapsed) ? null : (
        <button
            title={label}
            aria-label={label}
            style={{ padding: 10 }}
            onClick={SidebarToggle}
            className={cx('btn-clear-xs')}>
            <Icon name={collapsed ? 'Feather.Menu' : 'Feather.X'} />
        </button>
    );
};

export { MenuButton, MenuButton as default };
