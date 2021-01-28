import React from 'react';
import _ from 'underscore';
import Reactium from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Toolbar
 * -----------------------------------------------------------------------------
 */

const alignment = ['left', 'center', 'right'];
const Toolbar = () => (
    <header className={Reactium.Toolkit.cx('toolbar')}>
        {alignment.map(align => (
            <div
                key={`toolbar-${align}`}
                className={Reactium.Toolkit.cx(`toolbar-${align}`)}>
                {_.chain(Reactium.Toolkit.Toolbar.list)
                    .where({ align })
                    .sortBy('order')
                    .value()
                    .map(({ id, component: Component }) => (
                        <Component key={`${align}-${id}`} zone={align} />
                    ))}
            </div>
        ))}
    </header>
);

export { Toolbar, Toolbar as default };
