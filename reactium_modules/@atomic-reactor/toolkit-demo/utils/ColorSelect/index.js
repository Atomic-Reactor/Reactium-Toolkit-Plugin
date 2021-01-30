import React from 'react';
import { __ } from 'reactium-core/sdk';

const noop = () => {};
const ColorSelect = ({ value, colors = [], onChange = noop }) => {
    return (
        <div className='form-group'>
            <select value={value} onChange={onChange} title={__('select color')}>
                {colors.map((c, i) => (
                    <option key={i}>{c}</option>
                ))}
            </select>
        </div>
    );
};

export { ColorSelect, ColorSelect as default };
