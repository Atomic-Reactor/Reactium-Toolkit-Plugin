import React from 'react';
import Reactium from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Content
 * -----------------------------------------------------------------------------
 */
const Content = ({ children }) => {
    const cx = Reactium.Toolkit.cx;
    const { params = {} } = Reactium.Routing.currentRoute;
    
    return (
        <div className={cx('content')}>
            {children}
            <div className={cx('content-wrap')}>

            </div>
        </div>
    );
};

export default Content;
