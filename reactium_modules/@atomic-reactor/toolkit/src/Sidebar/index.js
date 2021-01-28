import _ from 'underscore';
import cn from 'classnames';
import op from 'object-path';
import { Scrollbars } from 'react-custom-scrollbars';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import Reactium, {
    ComponentEvent,
    Zone,
    useDerivedState,
    useEventHandle,
    useRefs,
    useRegisterHandle,
} from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Sidebar
 * -----------------------------------------------------------------------------
 */
let Sidebar = (props, ref) => {
    const pref = 'rtk.sidebar.collapsed';

    const config = Reactium.Toolkit.config;
    const { width = 320 } = config.sidebar;

    const pos = op.get(
        config,
        'sidebar.position',
        Reactium.Toolkit.Sidebar.position.left,
    );

    const refs = useRefs();

    const [state, update] = useDerivedState({
        ease: Power2.easeInOut,
        speed: 0.2,
        tween: null,
        collapsed: op.get(config, 'sidebar.collapsed', false),
    });

    const setState = (newState, silent = false) => {
        if (unMounted()) return;
        update(newState, silent);
    };

    const cx = Reactium.Toolkit.cx;

    const dispatch = async (eventType, event = {}) => {
        if (unMounted()) return;

        eventType = String(eventType).toLowerCase();

        const evt = new ComponentEvent(eventType, event);

        handle.dispatchEvent(evt);
        Reactium.Hook.run(`rtk-${eventType}`, evt, handle);
        await Reactium.Hook.runSync(`rtk-${eventType}`, evt, handle);
    };

    const collapse = () =>
        new Promise(resolve => {
            dispatch('collapse');

            const cont = refs.get('container');

            cont.style.display = 'block';
            cont.style.overflow = 'hidden';
            cont.classList.remove('collapsed');

            TweenMax.to(cont, state.speed, {
                width: 0,
                ease: state.ease,
                onComplete: () => {
                    if (unMounted()) resolve(false);

                    cont.removeAttribute('style');
                    setState({ collapsed: true, tween: null });
                    resolve(true);
                },
            });
        });

    const expand = () =>
        new Promise(resolve => {
            dispatch('expand');

            const cont = refs.get('container');
            const w = `${width}px`;

            cont.style.width = '0px';
            cont.style.maxWidth = w;
            cont.style.display = 'block';
            cont.style.overflow = 'hidden';
            cont.classList.remove('collapsed');

            TweenMax.to(cont, state.speed, {
                width: width,
                ease: state.ease,
                onComplete: () => {
                    if (unMounted()) resolve(false);

                    cont.removeAttribute('style');
                    cont.style.maxWidth = w;
                    setState({ collapsed: false, tween: null });
                    resolve();
                },
            });
        });

    const toggle = () => {
        const tween = state.tween
            ? state.tween
            : state.collapsed === true
            ? expand()
            : collapse();

        setState({ tween });
        return tween;
    };

    const unMounted = () => !refs.get('container');

    // -------------------------------------------------------------------------
    // Handle
    // -------------------------------------------------------------------------
    const _handle = () => ({
        collapse,
        collapsed: state.collapsed,
        expand,
        expanded: !state.collapsed,
        toggle,
    });

    const [handle, updateHandle] = useEventHandle(_handle());
    const setHandle = newHandle => {
        if (unMounted()) return;
        updateHandle(newHandle);
    };

    useEffect(() => {
        const type = state.collapsed === true ? 'collapsed' : 'expanded';
        Reactium.Prefs.set(pref, state.collapsed);

        const newHandle = {
            ...handle,
            collapsed: state.collapsed,
            expanded: !state.collapsed,
        };

        setHandle(newHandle);

        dispatch(type);
    }, [state.collapsed]);

    useImperativeHandle(ref, () => handle, [state.collapsed]);

    useRegisterHandle('RTKSidebar', () => handle);

    return (
        <nav
            ref={elm => refs.set('container', elm)}
            style={{ maxWidth: width }}
            className={cn({
                collapsed: state.collapsed,
                [cx('sidebar')]: true,
                [pos]: true,
            })}>
            <div className={cx('sidebar-brand')}>
                <Zone zone='sidebar-brand' />
            </div>
            <NavLinks />
        </nav>
    );
};

const NavLinks = () => {
    const config = Reactium.Toolkit.config;
    const cx = Reactium.Toolkit.cx;
    const { width = 320 } = config.sidebar;

    const links = _.chain(
        Reactium.Toolkit.Sidebar.list.filter(item => !op.get(item, 'group')),
    )
        .sortBy('order')
        .value();

    return (
        <div style={{ maxWidth: width }} className={cx('sidebar-menu')}>
            <Scrollbars className={cx('sidebar-menu-list')}>
                {links.map(({ component: Component, ...item }) => (
                    <Component key={item.id} {...item} />
                ))}
            </Scrollbars>
        </div>
    );
};

Sidebar = forwardRef(Sidebar);

export default Sidebar;
