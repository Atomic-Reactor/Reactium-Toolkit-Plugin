import cn from 'classnames';
import op from 'object-path';
import { Scrollbars } from 'react-custom-scrollbars';
import { TweenMax, Power2 } from 'gsap/umd/TweenMax';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import Reactium, {
    ComponentEvent,
    useDerivedState,
    useEventHandle,
    useRefs,
    useRegisterHandle,
    useStatus,
} from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Sidebar
 * -----------------------------------------------------------------------------
 */
let Sidebar = (props, ref) => {
    const pref = 'rtk.sidebar.collapsed';
    const ENUMS = Reactium.Toolkit.ENUMS;
    const config = Reactium.Toolkit.config;

    const refs = useRefs();

    const [status, setStatus, isStatus] = useStatus(ENUMS.STATUS.PENDING);

    const [state, update] = useDerivedState({
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

            TweenMax.to(cont, 0.25, {
                width: 0,
                ease: Power2.easeInOut,
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
            const w = `${op.get(config, 'sidebar.width', 320)}px`;

            cont.style.maxWidth = w;
            cont.style.display = 'block';
            cont.style.overflow = 'hidden';
            cont.classList.remove('collapsed');

            TweenMax.from(cont, 0.25, {
                width: 0,
                ease: Power2.easeInOut,
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
        cx,
        dispatch,
        expand,
        isStatus,
        props,
        setState,
        setStatus,
        state,
        status,
        toggle,
        unMounted,
    });

    const [handle] = useEventHandle(_handle());

    useEffect(() => {
        const type = state.collapsed === true ? 'collapsed' : 'expanded';
        Reactium.Prefs.set(pref, state.collapsed);
        dispatch(type);
    }, [state.collapsed]);

    useImperativeHandle(ref, () => handle, [handle]);

    useRegisterHandle('RTKSidebar', () => handle);

    return (
        <nav
            ref={elm => refs.set('container', elm)}
            style={{ maxWidth: op.get(config, 'sidebar.width', 320) }}
            className={cn(cx('sidebar'), { collapsed: state.collapsed })}>
            <Scrollbars>
                <NavLinks />
            </Scrollbars>
        </nav>
    );
};

const NavLinks = () => {
    const config = Reactium.Toolkit.config;
    const cx = Reactium.Toolkit.cx;

    // const links = () => {
    //
    // };

    return (
        <div
            className={cx('sidebar-menu')}
            style={{ minWidth: op.get(config, 'sidebar.width', 320) }}>
            Sidebar
        </div>
    );
};

Sidebar = forwardRef(Sidebar);

export default Sidebar;
