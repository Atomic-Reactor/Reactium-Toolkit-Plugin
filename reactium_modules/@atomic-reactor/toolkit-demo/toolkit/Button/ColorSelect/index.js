import cn from 'classnames';
import op from 'object-path';
import { buttonColors } from '../index';
import { Scrollbars } from 'react-custom-scrollbars';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import Reactium, {
    ComponentEvent,
    useDerivedState,
    useEventHandle,
    useHookComponent,
    useIsContainer,
    useRefs,
} from 'reactium-core/sdk';

const defaultButtonProps = () => ({ block: true, size: 'sm' });

const noop = () => {};

let ColorSelect = (
    {
        buttonProps,
        className,
        colors: initialColors,
        onChange = noop,
        ...props
    },
    ref,
) => {
    const { cx } = Reactium.Toolkit;

    const refs = useRefs();
    const { Button } = useHookComponent('ReactiumUI');

    const isContainer = useIsContainer();

    const [state, update] = useDerivedState({
        colors: initialColors || buttonColors(),
        collapsed: true,
        buttonProps: buttonProps || defaultButtonProps(),
        expanded: false,
        value: props.value,
    });

    const setState = newState => {
        if (unMounted()) return;
        update(newState);
    };

    const collapse = () => {
        dispatch('collapse');
        setState({ collapsed: true, expanded: false });
    };

    const dismiss = e => {
        dispatch('dismiss');
        if (!e) return collapse();
        if (state.collapsed === true) return;
        const container = refs.get('container');
        if (isContainer(e.target, container)) return;

        collapse();
    };

    const dispatch = (type, data = {}) => {
        if (unMounted()) return;
        const evt = new ComponentEvent(type, data);
        handle.dispatchEvent(evt);
    };

    const expand = () => {
        dispatch('expand');
        setState({ collapsed: false, expanded: true });
    };

    const toggle = () => {
        if (state.expanded === true) {
            collapse();
        } else {
            expand();
        }
    };

    const unMounted = () => !refs.get('container');

    const _onChange = (e, value) => {
        e.preventDefault();
        e.stopPropagation();

        collapse();
        setState({ value });
        onChange({ target: { value } });
    };

    const _onKeyDown = e => {
        if (e.keyCode !== 13) return;
        e.preventDefault();
        toggle();
    };

    const _handle = () => ({
        ...state,
        collapse,
        dismiss,
        dispatch,
        expand,
        toggle,
        setState,
        state,
    });

    const [handle, setHandle] = useEventHandle(() => _handle());
    const updateHandle = () => {
        if (unMounted()) return;
        const _newHandle = _handle();
        Object.entries(_newHandle).forEach(([k, v]) => op.set(handle, k, v));
        setHandle(handle);
    };

    useEffect(() => {
        setState({ value: props.value });
    }, [props.value]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        window.addEventListener('mousedown', dismiss);
        window.addEventListener('touchstart', dismiss);

        return () => {
            window.removeEventListener('mousedown', dismiss);
            window.removeEventListener('touchstart', dismiss);
        };
    }, []);

    useEffect(() => {
        updateHandle();
    }, [Object.values(state)]);

    useEffect(() => {
        dispatch('change', { value: state.value });
    }, [state.value]);

    useEffect(() => {
        dispatch('collapsed');
    }, [state.collapsed]);

    useEffect(() => {
        dispatch('expanded');
    }, [state.expanded]);

    useImperativeHandle(ref, () => handle);

    return (
        <div
            {...props}
            tabIndex={1}
            onClick={toggle}
            title={state.value}
            onKeyDown={_onKeyDown}
            ref={elm => refs.set('container', elm)}
            className={cn(cx('btn-color-select'), className, {
                expanded: state.expanded,
            })}>
            <div className={cx('btn-color-select-selected')}>
                <Button readOnly color={state.value} />
                <span className={cx('btn-color-select-label')}>
                    {state.value}
                </span>
            </div>
            <div
                className={cx('btn-color-select-picker')}
                style={{ display: state.collapsed ? 'none' : null }}>
                <Scrollbars>
                    <div className={cx('btn-color-select-picker-list')}>
                        {state.colors.map((c, i) => (
                            <Button
                                color={c}
                                value={c}
                                title={c}
                                key={`select-${i}`}
                                {...state.buttonProps}
                                onClick={e => _onChange(e, c)}>
                                <span className={cx('btn-color-select-label')}>
                                    {c}
                                </span>
                            </Button>
                        ))}
                    </div>
                </Scrollbars>
                <div className='arrow-up' />
            </div>
        </div>
    );
};

ColorSelect = forwardRef(ColorSelect);

export { ColorSelect, ColorSelect as default };
