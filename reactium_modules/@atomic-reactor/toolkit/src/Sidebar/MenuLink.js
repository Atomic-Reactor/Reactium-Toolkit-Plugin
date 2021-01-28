import _ from 'underscore';
import cn from 'classnames';
import op from 'object-path';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Reactium, { useHookComponent } from 'reactium-core/sdk';

const propTypes = {
    children: PropTypes.node.isRequired,
    exact: PropTypes.bool,
    expanded: PropTypes.bool,
    group: PropTypes.string,
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
};

const defaultProps = {
    expanded: false,
    group: null,
    url: null,
};

const MenuLink = initialProps => {
    
    const {
        children,
        exact,
        group,
        id,
        order,
        url,
        expanded: initialExpanded,
        ...props
    } = initialProps;

    const { params } = Reactium.Routing.currentRoute;
    const { Icon } = useHookComponent('RTK');

    const shouldExpand = () => {
        if (!!group) return false;
        if (initialExpanded === true) return true;
        if (op.get(params, 'group') === id) return true;
        return Reactium.Prefs.get(prefkey, false);
    };

    const config = Reactium.Toolkit.config;
    const align = config.sidebar.position;
    const cx = Reactium.Toolkit.cx;
    const { width } = config.sidebar;
    const prefkey = `rtk.sidebar.expanded.${id}`;
    const [expanded, setExpanded] = useState(shouldExpand());

    const className = cn({
        [cx('sidebar-menu-item')]: true,
        [cx(`sidebar-menu-item-${id}`)]: true,
        [cx(`sidebar-menu-item-${align}`)]: true,
        [cx(`sidebar-menu-item-${order}`)]: true,
        [cx(`sidebar-menu-item-${group}`)]: !!group,
    });

    const related = _.chain(Reactium.Toolkit.Sidebar.list)
        .where({ group: id })
        .sortBy('order')
        .value();

    const onToggle = e => {
        e.preventDefault();
        e.stopPropagation();
        Reactium.Prefs.set(prefkey, !expanded);
        setExpanded(!expanded);
    };

    const Toggle = () =>
        !group && related.length > 0 ? (
            <button onClick={onToggle} className='rtk-btn-clear-xs'>
                <Icon name='Feather.ChevronDown' />
            </button>
        ) : null;

    useEffect(() => {
        if (shouldExpand()) setExpanded(true);
    }, [params]);

    return (
        <div className={className} style={{ minWidth: width }}>
            {url ? (
                String(url).startsWith('/') ? (
                    <NavLink
                        {...props}
                        to={url}
                        exact={exact}
                        className={cn({
                            expanded,
                            [cx('sidebar-menu-item-heading')]: !group,
                            [cx('sidebar-menu-item-link')]: !!group,
                        })}>
                        <span>{children}</span>
                        <Toggle />
                    </NavLink>
                ) : (
                    <a
                        {...props}
                        href={url}
                        className={cn({
                            expanded,
                            [cx('sidebar-menu-item-heading')]: !group,
                            [cx('sidebar-menu-item-link')]: !!group,
                        })}>
                        <span>{children}</span>
                        <Toggle />
                    </a>
                )
            ) : (
                <div
                    {...props}
                    className={cn({
                        expanded,
                        [cx('sidebar-menu-item-heading')]: !group,
                        [cx('sidebar-menu-item-link')]: !!group,
                    })}>
                    <span>{children}</span>
                    <Toggle />
                </div>
            )}
            {related.length > 0 && (
                <div className={cx('sidebar-menu-sub')}>
                    {related.map(
                        ({ component: Component = MenuLink, ...item }) => (
                            <Component
                                exact
                                {...item}
                                key={`${id}-${item.id}`}
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

MenuLink.propTypes = propTypes;

MenuLink.defaultProps = defaultProps;

export { MenuLink, MenuLink as default };
