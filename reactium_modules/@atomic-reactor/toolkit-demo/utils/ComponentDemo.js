import _ from 'underscore';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Resizable } from 're-resizable';
import React, { useCallback } from 'react';
import Reactium, { useHookComponent, useDerivedState } from 'reactium-core/sdk';

const min = () => 390;
const max = () => (_.isUndefined(window) ? 960 : window.innerWidth - 100);
const width = () => (_.isUndefined(window) ? min() : window.innerWidth * 0.4);

const ComponentDemo = ({
    className,
    demo,
    editor,
    id = 'default',
    inspector,
}) => {
    const { cx } = Reactium.Toolkit;
    const pref = `inspector.width.${id}`;
    const { Breakpoint } = useHookComponent('ReactiumUI');

    const [size, setSize] = useDerivedState({
        width: Reactium.Prefs.get(pref, width()),
    });

    const setWidth = value => {
        const width = size.width + value;
        Reactium.Prefs.set(pref, width);
        setSize({ width });
    };

    const ResizeWrap = useCallback(
        ({ children, className }) => (
            <Breakpoint
                xs={<div className={className}>{children}</div>}
                lg={
                    <Resizable
                        size={size}
                        minWidth={min()}
                        maxWidth={max()}
                        children={children}
                        className={className}
                        handleStyles={{ right: { width: 15 } }}
                        onResizeStop={(e, dir, ref, s) => setWidth(s.width)}
                        handleClasses={{
                            top: 'handle-hidden',
                            topRight: 'handle-hidden',
                            topLeft: 'handle-hidden',
                            bottom: 'handle-hidden',
                            bottomRight: 'handle-hidden',
                            bottomLeft: 'handle-hidden',
                            left: 'handle-hidden',
                            right: 'handle-right',
                        }}
                    />
                }
            />
        ),
        [],
    );

    return !demo && !editor && !inspector ? null : (
        <div className={cn(className, cx('component'))}>
            {(demo || inspector) && (
                <ResizeWrap className={cx('component-inspector')}>
                    {demo && (
                        <div className={cx('component-demo-wrap')}>{demo}</div>
                    )}
                    {inspector && (
                        <div className={cx('component-props-wrap')}>
                            {inspector}
                        </div>
                    )}
                </ResizeWrap>
            )}
            {editor && (
                <div className={cx('component-code-wrap')}>{editor}</div>
            )}
        </div>
    );
};

ComponentDemo.propTypes = {
    className: PropTypes.string,
    demo: PropTypes.node,
    editor: PropTypes.node,
    inspector: PropTypes.node,
};

export { ComponentDemo, ComponentDemo as default };
