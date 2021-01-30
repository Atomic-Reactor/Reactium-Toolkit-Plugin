import React from 'react';
import _ from 'underscore';
import Reactium from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Toolbar
 * -----------------------------------------------------------------------------
 */

const alignment = ['left', 'center', 'right'];
const Toolbar = props => (
    <header className={Reactium.Toolkit.cx('toolbar')} {...props}>
        {alignment.map(align => (
            <div
                key={`toolbar-${align}`}
                className={Reactium.Toolkit.cx(`toolbar-${align}`)}>
                {_.where(Reactium.Toolkit.Toolbar.sort('order'), { align }).map(
                    ({ id, component: Component }) => (
                        <Component key={`${align}-${id}`} zone={align} />
                    ),
                )}
            </div>
        ))}
    </header>
);

export { Toolbar, Toolbar as default };
