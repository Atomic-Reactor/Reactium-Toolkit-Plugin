import React from 'react';
import _ from 'underscore';
import Reactium from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Header
 * -----------------------------------------------------------------------------
 */

const alignment = ['left', 'center', 'right'];
const Header = () => (
    <header className={Reactium.Toolkit.cx('header')}>
        {alignment.map(align => (
            <div
                key={`header-${align}`}
                className={Reactium.Toolkit.cx(`header-${align}`)}>
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

export { Header, Header as default };
