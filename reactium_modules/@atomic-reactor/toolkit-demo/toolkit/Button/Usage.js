import _ from 'underscore';
import cn from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import Reactium, {
    __,
    useDerivedState,
    useHookComponent,
    useRefs,
} from 'reactium-core/sdk';

export default () => {
    const pref = 'rtk.button';

    const refs = useRefs();
    const { CodeEditor, Element, ComponentDemo } = useHookComponent('RTK');
    const { Button } = useHookComponent('ReactiumUI');

    const loadedState = Reactium.Toolkit.parseAttributes(
        Reactium.Prefs.get(pref, {}),
    );

    const [state, update] = useDerivedState({
        children: __('Button'),
        color: Button.ENUMS.COLOR.PRIMARY,
        outline: false,
        size: Button.ENUMS.SIZE.SM,
        ...loadedState,
    });

    const setState = newState => {
        if (unMounted()) return;
        update(newState);
    };

    const unMounted = () => !refs.get('container');

    const attributes = _.compact(
        Object.entries(state).map(([key, val]) =>
            val !== null && val !== false && key !== 'children'
                ? `${key}='${val}'`
                : null,
        ),
    )
        .sort()
        .join(' ');

    const jsx = `
        import React from 'react';
        import { useHookComponent } from 'reactium-core/sdk';

        export const Component = () => {
            const { Button } = useHookComponent('ReactiumUI');

            return <Button ${attributes}>${state.children}</Button>;
        };
    `;

    useEffect(() => {
        Reactium.Prefs.set(pref, state);
    }, [Object.values(state)]);

    return (
        <Element title={__('Buttons')} ref={elm => refs.set('container', elm)}>
            <ComponentDemo
                id='button'
                className='button-demo'
                demo={<Demo {...Reactium.Toolkit.parseAttributes(state)} />}
                inspector={
                    <Properties
                        {...Reactium.Toolkit.parseAttributes(state)}
                        setState={setState}
                    />
                }
                editor={
                    <CodeEditor
                        tagName='Button'
                        value={jsx}
                        setState={setState}
                    />
                }
            />
        </Element>
    );
};

const Demo = props => {
    const { cx } = Reactium.Toolkit;
    const { Button } = useHookComponent('ReactiumUI');

    return (
        <div
            className={cx('component-demo')}
            style={{ overflow: 'hidden', height: 220 }}>
            <Button {...props} />
        </div>
    );
};

const Properties = ({ setState, ...props }) => {
    const { cx } = Reactium.Toolkit;

    const { ColorSelect } = useHookComponent('RTK');
    const { Breakpoint, Button, Toggle } = useHookComponent('ReactiumUI');

    const ScrollWrap = useCallback(
        ({ children }) => (
            <Breakpoint
                xs={children}
                lg={<Scrollbars>{children}</Scrollbars>}
            />
        ),
        [],
    );

    return (
        <ScrollWrap>
            <div className={cn(cx('component-props'), 'p-xs-40')}>
                <div className='form-group'>
                    <div className='flex middle'>
                        <div className='col-xs-12 col-sm-6'>{__('Label')}</div>
                        <div className='col-xs-12 col-sm-6 text-right'>
                            <input
                                type='text'
                                value={props.children}
                                style={{ width: 150, marginLeft: 'auto' }}
                                onChange={e =>
                                    setState({ children: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <div className='flex middle'>
                        <div className='col-xs-12 col-sm-6'>{__('Color')}</div>
                        <div className='col-xs-12 col-sm-6 text-right'>
                            <ColorSelect
                                value={props.color}
                                style={{ width: 150, marginLeft: 'auto' }}
                                onChange={e =>
                                    setState({ color: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <div className='flex middle'>
                        <div className='col-xs-12 col-sm-6'>{__('Size')}</div>
                        <div className='col-xs-12 col-sm-6 text-right'>
                            <select
                                value={props.size}
                                style={{ width: 150, marginLeft: 'auto' }}
                                onChange={e =>
                                    setState({ size: e.target.value })
                                }>
                                {Object.values(Button.ENUMS.SIZE).map(size => (
                                    <option key={`button-size-${size}`}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <Toggle
                        value={true}
                        label={__('Outline')}
                        checked={props.outline === true}
                        onChange={e =>
                            setState({
                                outline: e.target.checked
                                    ? e.target.value
                                    : null,
                            })
                        }
                    />
                </div>
                <div className='form-group'>
                    <Toggle
                        label={__('Pill')}
                        value={Button.ENUMS.APPEARANCE.PILL}
                        onChange={e =>
                            setState({
                                appearance: e.target.checked
                                    ? e.target.value
                                    : null,
                            })
                        }
                        checked={
                            props.appearance === Button.ENUMS.APPEARANCE.PILL
                        }
                    />
                </div>
            </div>
        </ScrollWrap>
    );
};
