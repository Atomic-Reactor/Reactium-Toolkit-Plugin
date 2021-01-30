import React from 'react';
import _ from 'underscore';
import camelcase from 'camelcase';
import buttonProps from './buttonProps';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

const cc = str => camelcase(str, { pascalCase: true });

export default () => {
    const { copy } = Reactium.Toolkit;
    const { Element } = useHookComponent('RTK');
    const { Button } = useHookComponent('ReactiumUI');

    const colors = _.without(
        Object.values(Button.ENUMS.COLOR),
        Button.ENUMS.COLOR.DEFAULT,
        Button.ENUMS.COLOR.CLEAR,
    );

    const style = { width: 128 };

    const title = __('copy selector to clipboard');

    const ButtonRender = ({ color, css, ...props }, i) => {
        const cname = `.${String(css).replace('%color', color)}`;
        return (
            <div key={`col-${i}`} className='col-xs-6 col-sm-3'>
                <div
                    key={`col-${i}-${color}`}
                    className='px-xs-12 px-sm-4 pb-xs-24 text-center'>
                    <Button
                        {...props}
                        color={color}
                        onClick={() => copy(cname)}>
                        {color}
                    </Button>
                    <div className='rtk-meta-info pt-xs-8'>{cname}</div>
                </div>
            </div>
        );
    };

    return (
        <Element className='px-xs-24 px-lg-40' title={__('Button Colors')}>
            <div
                style={{
                    maxWidth: 1280,
                    display: 'flex flex-center',
                    margin: '0 auto',
                }}>
                {colors.map(color => (
                    <div className='row' key={`button-color-${color}`}>
                        <div className='col-xs-12 col-md-2 text-xs-center text-md-left pb-xs-40 pb-md-0 pt-md-8'>
                            {cc(color)}
                        </div>
                        <div className='col-xs-12 col-md-10'>
                            <div className='row'>
                                {buttonProps({ style, title }).map((btn, i) => (
                                    <ButtonRender
                                        {...btn}
                                        color={color}
                                        key={`button-color-${color}-${i}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Element>
    );
};

/*
{buttonProps({ style }).map(({ css, ...props }, i) => {
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
    </div>
    );
})}
*/
