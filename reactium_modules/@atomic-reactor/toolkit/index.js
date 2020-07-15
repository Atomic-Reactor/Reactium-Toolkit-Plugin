/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React from 'react';
import { connect } from 'react-redux';
import deps from 'dependencies';
import { Zone } from 'reactium-core/sdk';

const Toolkit = props => <Zone zone='toolkit' {...props} />;

/**
 * -----------------------------------------------------------------------------
 * Inject Redux State and Actions into React Component: Toolkit
 * -----------------------------------------------------------------------------
 */
const mapStateToProps = (state, props) => ({
    ...state.toolkit,
    ...props,
});

const mapDispatchToProps = dispatch => ({
    mount: params => dispatch(deps().actions.toolkit.mount(params)),
    menuItemClick: url => dispatch(deps().actions.toolkit.menuItemClick(url)),
    menuToggle: () => dispatch(deps().actions.toolkit.menuToggle()),
    notice: {
        hide: params => dispatch(deps().actions.toolkit.notice.hide(params)),
        show: params => dispatch(deps().actions.toolkit.notice.show(params)),
    },
    set: data => dispatch(deps().actions.toolkit.set(data)),
    setTheme: data => dispatch(deps().actions.toolkit.setTheme(data)),
    toggleSettings: () => dispatch(deps().actions.toolkit.toggleSettings()),
    loaded: () => dispatch(deps().actions.toolkit.loaded()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Toolkit);
