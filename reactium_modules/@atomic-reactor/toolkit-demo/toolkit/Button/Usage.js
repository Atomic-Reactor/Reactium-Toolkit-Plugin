import _ from 'underscore';
import cn from 'classnames';
import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import Reactium, {
    __,
    useDerivedState,
    useHookComponent,
    useRefs,
} from 'reactium-core/sdk';

const CodeEditor = ({ children, ...initialProps }) => {
    const { Code } = useHookComponent('RTK');

    const props = Object.entries(initialProps).reduce((obj, [key, val]) => {
        if (val !== null) {
            obj[key] = val;
        }
        return obj;
    }, {});

    const attributes = Object.entries(props)
        .map(([key, val]) => `${key}='${val}'`)
        .join(' ');

    const jsx = `
        import React from 'react';
        import { useHookComponent } from 'reactium-core/sdk';

        export const Component = () => {
            const { Button } = useHookComponent('ReactiumUI');

            return <Button ${attributes}>${children}</Button>
        };
    `;

    return <Code value={jsx} />;
};

const Demo = props => {
    const { cx } = Reactium.Toolkit;
    const { Button } = useHookComponent('ReactiumUI');
    return (
        <div className={cx('component-demo')}>
            <Button {...props} />
        </div>
    );
};

const Properties = ({ setState, ...props }) => {
    const { cx } = Reactium.Toolkit;

    const { ColorSelect } = useHookComponent('RTK');
    const { Button, Toggle } = useHookComponent('ReactiumUI');

    return (
        <Scrollbars>
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
                                defaultValue={props.size}
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
                        label={__('Outline')}
                        defaultChecked={props.outline}
                        onChange={e =>
                            setState({
                                outline: e.target.checked ? true : null,
                            })
                        }
                    />
                </div>
                <div className='form-group'>
                    <Toggle
                        value={true}
                        label={__('Pill')}
                        onChange={e =>
                            setState({
                                appearance: e.target.checked
                                    ? Button.ENUMS.APPEARANCE.PILL
                                    : null,
                            })
                        }
                        defaultChecked={
                            props.appearance === Button.ENUMS.APPEARANCE.PILL
                        }
                    />
                </div>
            </div>
        </Scrollbars>
    );
};

export default () => {
    const pref = 'rtk.button';

    const { cx } = Reactium.Toolkit;

    const refs = useRefs();
    const { Element } = useHookComponent('RTK');
    const { Button } = useHookComponent('ReactiumUI');

    const [state, update] = useDerivedState({
        children: __('Button'),
        color: Button.ENUMS.COLOR.PRIMARY,
        outline: false,
        size: Button.ENUMS.SIZE.SM,
        ...Reactium.Prefs.get(pref, {}),
    });

    const setState = newState => {
        if (unMounted()) return;
        update(newState);
    };

    const unMounted = () => !refs.get('container');

    useEffect(() => {
        Reactium.Prefs.set(pref, state);
    }, [Object.values(state)]);

    return (
        <Element title={__('Buttons')} ref={elm => refs.set('container', elm)}>
            <div className={cx('component')}>
                <div className={cx('component-inspector')}>
                    <div className={cx('component-demo-wrap')}>
                        <Demo {...state} />
                    </div>
                    <div className={cx('component-props-wrap')}>
                        <Properties {...state} setState={setState} />
                    </div>
                </div>
                <div className={cx('component-code-wrap')}>
                    <CodeEditor {...state} />
                </div>
            </div>
        </Element>
    );
};
