import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

const HeaderLogo = () => {

    const Logo = useHookComponent('RTKLOGO');

    return <Logo />;
};

export { HeaderLogo, HeaderLogo as default };
