import React from 'react';
import Reactium, { __, useHandle, useHookComponent } from 'reactium-core/sdk';

export default () => {
    const { cx } = Reactium.Toolkit;

    const Sidebar = useHandle('RTKSidebar');
    const { Element } = useHookComponent('RTK');
    const { Button } = useHookComponent('ReactiumUI');

    return (
        <Element title={__('Reactium UI Toolkit')} fullscreen>
            <div className={cx('hero')}>
                <div className={cx('hero-bg')} />
                <div className={cx('hero-logo')}>
                    <img src='/assets/images/logo.svg' />
                    <div className={cx('hero-logo-lockup')}>
                        <h1>{__('Build Awesomeness With Reactium UI')}</h1>
                        <h2>{__('Believe it!')}</h2>
                    </div>
                </div>
                <div className={cx('hero-slide')}>
                    <Button
                        size={Button.ENUMS.SIZE.LG}
                        onClick={() => Sidebar.expand()}
                        color={Button.ENUMS.COLOR.SUCCESS}
                        appearance={Button.ENUMS.APPEARANCE.PILL}>
                        {__('Get Started')}
                    </Button>
                </div>
            </div>
        </Element>
    );
};
