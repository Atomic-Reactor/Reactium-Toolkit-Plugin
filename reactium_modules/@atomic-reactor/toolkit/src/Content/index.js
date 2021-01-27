import React from 'react';
import Reactium from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Content
 * -----------------------------------------------------------------------------
 */
const Content = () => {
    const cx = Reactium.Toolkit.cx;
    const { params = {} } = Reactium.Routing.currentRoute;
    return (
        <div className={cx('content')}>
            Content: {JSON.stringify(params)}
        </div>
    );
};

export default Content;
