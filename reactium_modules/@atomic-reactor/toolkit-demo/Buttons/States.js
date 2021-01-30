import _ from 'underscore';
import React, { useEffect, useState } from 'react';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

export default () => {
    const pref = 'rtk.color.buttons';
    const { copy } = Reactium.Toolkit;
    const { ColorSelect, Element } = useHookComponent('RTK');
    const { Button } = useHookComponent('ReactiumUI');
    const [color, updateColor] = useState();

    const setColor = newColor => {
        Reactium.Prefs.set(pref, newColor);
        updateColor(newColor);
    };

    const colors = _.without(
        Object.values(Button.ENUMS.COLOR),
        Button.ENUMS.COLOR.DEFAULT,
        Button.ENUMS.COLOR.CLEAR,
    ).sort();

    const style = {
        width: 128,
    };

    const buttonProps = [
        {
            style,
            css: 'btn-%color',
        },
        {
            style,
            outline: true,
            css: 'btn-%color-outline',
        },
        {
            style,
            css: 'btn-%color-pill',
            appearance: Button.ENUMS.APPEARANCE.PILL,
        },
        {
            style,
            outline: true,
            css: 'btn-%color-outline-pill',
            appearance: Button.ENUMS.APPEARANCE.PILL,
        },
    ];

    const states = [
        {
            label: __('Default'),
            className: '',
        },
        {
            label: __('Hover'),
            className: 'hover',
        },
        {
            label: __('Active'),
            className: 'active',
        },
        {
            label: __('Focus'),
            className: 'focus',
        },
        {
            label: __('Disabled'),
            className: 'disabled',
        },
    ];

    const Heading = () => (
        <>
            <h2>{__('Button States')}</h2>
            <ColorSelect
                value={color}
                colors={colors}
                onChange={e => setColor(e.target.value)}
            />
        </>
    );

    useEffect(() => {
        const colorPref = Reactium.Prefs.get(pref, Button.ENUMS.COLOR.PRIMARY);
        if (colorPref !== color) setColor(colorPref);
    }, []);

    return !color ? null : (
        <Element className='px-xs-24 px-lg-40' title={<Heading />}>
            <div
                style={{
                    maxWidth: 1280,
                    display: 'flex flex-center',
                    margin: '0 auto',
                }}>
                {states.map(({ label, className }) => {
                    return (
                        <div className='row' key={className}>
                            <div className='col-xs-12 col-md-2 text-xs-center text-md-left pb-xs-40 pb-md-0 pt-md-8'>
                                {label}
                            </div>
                            <div className='col-xs-12 col-md-10'>
                                <div className='row'>
                                    {buttonProps.map(({ css, ...props }, i) => {
                                        const cname = `.${String(css).replace(
                                            '%color',
                                            color,
                                        )}`;

                                        const title = __(
                                            'copy selector to clipboard',
                                        );

                                        const cp = _.compact([
                                            cname,
                                            className,
                                        ]).join(' ');

                                        return (
                                            <div
                                                key={`col-${i}`}
                                                className='col-xs-6 col-sm-3'>
                                                <div
                                                    key={`col-${i}-${color}`}
                                                    className='px-xs-12 px-sm-4 pb-xs-24 text-center'>
                                                    <Button
                                                        {...props}
                                                        color={color}
                                                        title={title}
                                                        className={className}
                                                        onClick={() =>
                                                            copy(cp)
                                                        }>
                                                        {color}
                                                    </Button>
                                                    <div className='rtk-meta-info pt-xs-8'>
                                                        {className ? (
                                                            `.${className}`
                                                        ) : (
                                                            <span>&nbsp;</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Element>
    );
};
