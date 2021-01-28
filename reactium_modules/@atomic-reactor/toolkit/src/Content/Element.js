import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import Reactium, { Zone } from 'reactium-core/sdk';

const propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
};

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Element
 * -----------------------------------------------------------------------------
 */

const Element = ({ children, className, index, xs, sm, md, lg, ...props }) => {
    const { cx, zone } = Reactium.Toolkit;

    const cname = cn(className, cx('element'), {
        [`rtk-col-xs-${xs}`]: !!xs,
        [`rtk-col-sm-${sm}`]: !!sm,
        [`rtk-col-md-${md}`]: !!md,
        [`rtk-col-lg-${lg}`]: !!lg,
    });

    return (
        <div {...props} className={cname}>
            <div>{children}</div>
            {index && (
                <div
                    className={cn(
                        cx('element-toolbar'),
                        cx(`element-toolbar-${index}`),
                    )}>
                    <Zone zone={`${zone}-toolbar-${index}`} />
                </div>
            )}
        </div>
    );
};

Element.propTypes = propTypes;

export { Element, Element as default };
