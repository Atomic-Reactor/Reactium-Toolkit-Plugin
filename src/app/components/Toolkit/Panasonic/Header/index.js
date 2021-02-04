import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useHookComponent } from 'reactium-core/sdk';

export default () => {
    const { Button } = useHookComponent('ReactiumUI');

    const onStartClick = () =>
        window.dispatchEvent(new Event('calculator-show'));

    return (
        <div className='pan'>
            <header className='pan-header'>
                <div className='pan-container'>
                    <div>
                        <img
                            src='/assets/images/panasonic-logo.svg'
                            style={{ width: 135, height: 22.45 }}
                        />
                    </div>
                    <div>
                        <img
                            src='/assets/images/menu.png'
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: 870,
                            }}
                        />
                    </div>
                </div>
            </header>
            <nav className='pan-nav'>
                <div className='pan-container'>
                    <Link to='#'>
                        <span>Home</span>
                    </Link>
                    <Link to='#'>
                        <span>Energy Solutions</span>
                    </Link>
                    <NavLink to='/'>
                        <span>Battery Storage</span>
                    </NavLink>
                </div>
            </nav>
            <div className='pan-heading'>
                <div className='pan-container'>
                    <h1>Battery Storage</h1>
                </div>
            </div>
            <div
                className='pan-hero'
                style={{
                    backgroundImage:
                        'url("/assets/images/mainbatterystoragebanner-august-banner.jpg")',
                }}>
                <div className='pan-container'>
                    <div className='pan-shadow-box'>
                        <h2>EverVolt™ Battery Storage for Your Home</h2>
                    </div>
                    <div className='pan-button-box'>
                        <Button
                            appearance='pill'
                            color='success'
                            size='lg'
                            onClick={onStartClick}>
                            Get Started Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
