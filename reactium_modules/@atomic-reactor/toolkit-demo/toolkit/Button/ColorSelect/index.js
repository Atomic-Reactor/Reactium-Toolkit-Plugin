import React from 'react';
import cn from 'classnames';
import { __ } from 'reactium-core/sdk';
import { buttonColors } from '../index';

const noop = () => {};
const ColorSelect = ({
    className,
    value,
    colors: initialColors,
    onChange = noop,
    ...props
}) => {
    const colors = initialColors || buttonColors();
    return (
        <div className={cn('form-group', className)} {...props}>
            <select
                defaultValue={value}
                onChange={onChange}
                title={__('select color')}>
                {colors.map((c, i) => (
                    <option key={i}>{c}</option>
                ))}
            </select>
        </div>
    );
};

export { ColorSelect, ColorSelect as default };
