import React from 'react';
import Toolbar from '../Toolbar';
import Reactium, { Zone } from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Content
 * -----------------------------------------------------------------------------
 */
const Content = ({ children }) => {
    const { cx, zone } = Reactium.Toolkit;

    return (
        <div className={cx('content')}>
            <Toolbar />
            <div className={cx('content-wrap')}>
                <div className={cx('content-zone', `content-zone-${zone}`)}>
                    <Zone zone={zone} />
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Content;
