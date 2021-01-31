import cn from 'classnames';
import { buttonColors } from '../index';
import React, { useEffect } from 'react';

import Reactium, {
    useHookComponent,
    useDerivedState,
    useIsContainer,
    useRefs,
} from 'reactium-core/sdk';

const noop = () => {};
const ColorSelect = ({
    className,
    colors: initialColors,
    onChange = noop,
    ...props
}) => {
    const { cx } = Reactium.Toolkit;

    const refs = useRefs();
    const { Button } = useHookComponent('ReactiumUI');

    const isContainer = useIsContainer();

    const [state, update] = useDerivedState({
        colors: initialColors || buttonColors(),
        collapsed: true,
        buttonProps: {
            block: true,
            size: Button.ENUMS.SIZE.SM,
        },
        expanded: false,
        value: props.value,
    });

    const setState = newState => {
        if (unMounted()) return;
        update(newState);
    };

    const collapse = () => setState({ collapsed: true, expanded: false });

    const dismiss = e => {
        if (!e) return collapse();
        if (state.collapsed === true) return;
        const container = refs.get('container');
        if (isContainer(e.target, container)) return;

        collapse();
    };

    const expand = () => setState({ collapsed: false, expanded: true });

    const unMounted = () => !refs.get('container');

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

    return (
        <div
            {...props}
            title={state.value}
            ref={elm => refs.set('container', elm)}
            className={cn(cx('btn-color-select'), className)}>
            <button
                onClick={expand}
                className={cx('btn-color-select-selected')}>
                <Button readOnly color={state.value} />
                <span className={cx('btn-color-select-label')}>
                    {state.value}
                </span>
            </button>
            <div className={cx('btn-color-select-picker')}>
                {state.colors.map((c, i) => (
                    <Button
                        color={c}
                        value={c}
                        key={`select-${i}`}
                        {...state.buttonProps}
                        onClick={() => onChange({ target: { value: c }})}>
                        <span className={cx('btn-color-select-label')}>
                            {c}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export { ColorSelect, ColorSelect as default };

/*
<select defaultValue={value} onChange={onChange} title={__('select color')}>
    {colors.map((c, i) => (
        <option key={i}>{c}</option>
    ))}
</select>;
*/
