import React from 'react';
import _ from 'underscore';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

export default () => {
    const { copy } = Reactium.Toolkit;
    const { Element } = useHookComponent('RTK');
    const { Button } = useHookComponent('ReactiumUI');

    const colors = _.without(
        Object.values(Button.ENUMS.COLOR),
        Button.ENUMS.COLOR.DEFAULT,
        Button.ENUMS.COLOR.CLEAR,
    );

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

    return (
        <Element className='px-xs-24 px-lg-40' title={__('Buttons')}>
            <div
                style={{
                    maxWidth: 1280,
                    display: 'flex flex-center',
                    margin: '0 auto',
                }}>
                <div className='row'>
                    {buttonProps.map(({ css, ...props }, i) => {
                        return (
                            <div key={`col-${i}`} className='col-xs-6 col-sm-3'>
                                {colors.map(color => {
                                    const cname = `.${String(css).replace(
                                        '%color',
                                        color,
                                    )}`;

                                    const title = __(
                                        'copy selector to clipboard',
                                    );

                                    return (
                                        <div
                                            key={`col-${i}-${color}`}
                                            className='px-xs-12 px-sm-4 pb-xs-24 text-center'>
                                            <Button
                                                {...props}
                                                color={color}
                                                title={title}
                                                onClick={() => copy(cname)}>
                                                {color}
                                            </Button>
                                            <div className='rtk-meta-info pt-xs-8'>
                                                {cname}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Element>
    );
};
