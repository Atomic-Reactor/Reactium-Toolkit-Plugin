import _ from 'underscore';
import React, { useCallback, useEffect, useState } from 'react';
import Reactium, {
    useDerivedState,
    useEventHandle,
    useHookComponent,
    useRefs,
    useRegisterHandle,
    useStatus,
} from 'reactium-core/sdk';

const Calculator = () => {
    const refs = useRefs();
    const { Button, Checkpoints, Icon, Modal, Scene } = useHookComponent(
        'ReactiumUI',
    );

    const [state, setState] = useDerivedState({
        pid: null,
    });

    const back = () => {
        const s = refs.get('scene');
        const c = refs.get('checkpoints');
        s.back().then(() => c.prev());
    };

    const next = () => {
        const s = refs.get('scene');
        const c = refs.get('checkpoints');
        const step = Object.keys(s.state.panels)[c.value + 1];
        s.navTo({ panel: step }).then(() => c.next());
    };

    const show = () => {
        const m = refs.get('modal');

        m.show(<Render />);
    };

    const showProductDetail = index => {
        const s = refs.get('scene');

        setState({ pid: index });

        handle.state.pid = index;

        s.removeChildren(['product-info']);
        s.addChildren([
            <ProductInfo handle={handle} id='product-info' key='pid' />,
        ]);

        _.defer(() => s.navTo({ panel: 'product-info' }));
    };

    const submit = () => {
        const s = refs.get('scene');
        s.removeChildren(['processing']);
        s.addChildren([
            <Processing handle={handle} id='processing' key='processing' />,
        ]);
        _.defer(() => s.navTo({ panel: 'processing' }));
    };

    const _handle = () => ({
        Modal: refs.get('modal'),
        Scene: refs.get('scene'),
        Checkpoints: refs.get('checkpoints'),
        show,
        back,
        next,
        showProductDetail,
        state,
        setState,
    });

    const [handle, setHandle] = useEventHandle(_handle());
    const updateHandle = () => {
        const newHandle = _handle();
        Object.entries(newHandle).forEach(([key, value]) => {
            handle[key] = value;
        });

        setHandle(handle);
    };

    useRegisterHandle('Calculator', () => handle);

    useEffect(() => {
        window.addEventListener('calculator-show', show);
        window.addEventListener('calculator-next', next);
        window.addEventListener('calculator-back', back);

        return () => {
            window.removeEventListener('calculator-show', show);
            window.removeEventListener('calculator-next', next);
            window.removeEventListener('calculator-back', back);
        };
    }, []);

    useEffect(updateHandle, [Object.values(state)]);

    useEffect(updateHandle, [Object.values(refs.get())]);

    const Render = useCallback(
        () => (
            <div className='pan-calculator'>
                <Scene
                    active='step-1'
                    width={840}
                    height={640}
                    ref={elm => refs.set('scene', elm)}>
                    <div id='step-1' className='pan-calculator-step'>
                        <img
                            src='/assets/images/suburbs.svg'
                            className='graphic-right'
                        />
                        <h4>Tell us about your location</h4>
                        <div style={{ width: 300 }}>
                            <div className='form-group'>
                                <label>
                                    <span>Address</span>
                                    <input
                                        type='text'
                                        autoComplete='true'
                                        ref={elm => refs.set('address', elm)}
                                    />
                                </label>
                            </div>

                            <div className='form-group'>
                                <label>
                                    <span>Average Electric Bill</span>
                                    <input
                                        type='text'
                                        autoComplete='true'
                                        ref={elm => refs.set('bill', elm)}
                                    />
                                </label>
                            </div>

                            <div className='form-group'>
                                <Button
                                    block
                                    outline
                                    appearance='pill'
                                    size='md'
                                    className='mt-xs-20'
                                    onClick={() =>
                                        window.dispatchEvent(
                                            new Event('calculator-next'),
                                        )
                                    }>
                                    Calculate
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div id='step-2' className='pan-calculator-step'>
                        <h4>We recommend 11.4 kWh</h4>
                        <div className='products'>
                            {products.map((item, i) => (
                                <div className='product' key={`product-${i}`}>
                                    <div className='image'>
                                        <img src={item.image} />
                                    </div>
                                    <div className='label'>{item.label}</div>
                                    <div className='info'>{item.info}</div>
                                    <p>{item.excerpt}</p>
                                    <Button
                                        block
                                        color='default'
                                        className='mb-xs-8'
                                        onClick={() => showProductDetail(i)}>
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            outline
                            color='primary'
                            size='md'
                            appearance='pill'
                            className='mb-xs-20'
                            onClick={() =>
                                window.dispatchEvent(
                                    new Event('calculator-next'),
                                )
                            }>
                            Get a Consultation
                        </Button>
                        <Button
                            color='clear'
                            className='back'
                            onClick={() =>
                                window.dispatchEvent(
                                    new Event('calculator-back'),
                                )
                            }>
                            <Icon name='Feather.ArrowLeft' />
                        </Button>
                    </div>
                    <div id='step-3' className='pan-calculator-step'>
                        <h4>Consultation Request</h4>
                        <div className='row' style={{ width: 640 }}>
                            <div className='col-xs-6 pr-xs-12'>
                                <div className='form-group'>
                                    <label>
                                        <span>First Name</span>
                                        <input
                                            type='text'
                                            ref={elm =>
                                                refs.set('firstName', elm)
                                            }
                                        />
                                    </label>
                                </div>
                                <div className='form-group'>
                                    <label>
                                        <span>Email Address</span>
                                        <input
                                            type='email'
                                            ref={elm => refs.set('email', elm)}
                                        />
                                    </label>
                                </div>
                                <div className='form-group'>
                                    <label>
                                        <span>Phone</span>
                                        <input
                                            type='phone'
                                            ref={elm => refs.set('phone', elm)}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className='col-xs-6 pl-xs-12'>
                                <div className='form-group'>
                                    <label>
                                        <span>Address</span>
                                        <input
                                            type='text'
                                            ref={elm =>
                                                refs.set('addressExt', elm)
                                            }
                                        />
                                    </label>
                                </div>
                                <div className='form-group'>
                                    <label>
                                        <span>Country</span>
                                        <input
                                            type='text'
                                            ref={elm =>
                                                refs.set('country', elm)
                                            }
                                        />
                                    </label>
                                </div>
                                <div className='form-group'>
                                    <label>
                                        <span>Zip Code</span>
                                        <input
                                            type='text'
                                            ref={elm => refs.set('zip', elm)}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <Button
                            color='primary'
                            size='md'
                            appearance='pill'
                            className='mt-xs-40'
                            style={{ width: 260 }}
                            onClick={submit}>
                            Submit Request
                        </Button>
                        <Button
                            color='clear'
                            className='back'
                            onClick={() => back()}>
                            <Icon name='Feather.ArrowLeft' />
                        </Button>
                    </div>
                </Scene>
                <Checkpoints
                    readOnly
                    index={0}
                    points={points()}
                    ref={elm => {
                        refs.set('checkpoints', elm);
                        updateHandle();
                    }}
                />
            </div>
        ),
        [],
    );

    return <Modal ref={elm => refs.set('modal', elm)} />;
};

const Processing = ({ handle, id }) => {
    const { Button, Spinner } = useHookComponent('ReactiumUI');

    const [status, setStatus, isStatus] = useStatus('pending');

    useEffect(() => {
        switch (status) {
            case 'pending':
                _.delay(() => setStatus('done', true), 5000);
                break;

            case 'done':
                handle.Checkpoints.complete();
                break;
        }

        return () => {
            setStatus('pending');
        };
    }, [status]);

    return (
        <div id={id} className='pan-calculator-step'>
            {isStatus('pending') ? (
                <>
                    <h4>Processing...</h4>
                    <Spinner />
                </>
            ) : (
                <>
                    <img
                        src='/assets/images/complete.svg'
                        className='graphic-right'
                    />
                    <h4>Thank You!</h4>
                    <p>
                        An Panasonic Energy Solution Consultant will be in
                        contact with you soon.
                    </p>
                    <Button
                        outline
                        appearance='pill'
                        className='mt-xs-32'
                        size='lg'>
                        Recommend to a Friend
                    </Button>
                </>
            )}
        </div>
    );
};

const ProductInfo = ({ handle, id }) => {
    const { Button, Icon } = useHookComponent('ReactiumUI');

    const [product, setProduct] = useState(products[handle.state.pid]);

    const next = () => {
        handle.Scene.navTo({ panel: 'step-3' }).then(() =>
            handle.Checkpoints.next(),
        );
    };

    useEffect(() => {
        setProduct(products[handle.state.pid]);
    }, [handle.state.pid]);

    return (
        <div id={id} className='pan-calculator-step'>
            <h4>Product Detail</h4>
            <div className='product-detail'>
                <div className='image'>
                    <img src={product.image} />
                </div>
                <div className='detail'>
                    <div className='label'>{product.label}</div>
                    <div className='info'>{product.info}</div>
                    <p>{product.desc}</p>
                </div>
            </div>
            <Button
                outline
                color='primary'
                size='md'
                onClick={() => next()}
                appearance='pill'
                className='mb-xs-20'>
                Get a Consultation
            </Button>
            <Button
                color='clear'
                className='back'
                onClick={() => handle.Scene.back()}>
                <Icon name='Feather.ArrowLeft' />
            </Button>
        </div>
    );
};

const points = () => {
    const { Icon } = useHookComponent('ReactiumUI');

    return [
        {
            label: <span className='flex middle center'>Get Started</span>,
            icon: <Icon name='Linear.Home4' size={20} />,
            value: 0,
        },
        {
            label: <span className='flex middle center'>Recommendation</span>,
            icon: <Icon name='Linear.BatteryPower' size={20} />,
            value: 1,
        },
        {
            label: <span className='flex middle center'>Consultation</span>,
            icon: <Icon name='Linear.PaperPlane' size={20} />,
            value: 2,
        },
    ];
};

const products = [
    {
        index: 0,
        kw: '11.4 kWh',
        label: 'EverVolt™ AC-Coupled Home Battery Storage',
        info: 'EVAC-105-4 (Standard) | EVAC-105-6 (Plus)',
        image: '/assets/images/rs19129web_batterystorager2ac.jpg',
        excerpt: 'Legendary Panasonic battery Tech...',
        desc:
            'The same legendary Panasonic battery technology that powers the world’s most advanced electric cars is now available to power your home. EverVolt™ stores the excess power your solar panels generate during the day for use during grid outages, or to sell to your local utility. Available in a four- or six-battery configuration, this AC-coupled storage system works with or without solar and delivers clean usable energy capacity ranging from 11.4 kWh to 17.1 kWh.',
    },
    {
        index: 1,
        kw: '11.4 kWh',
        label: 'EverVolt™ DC-Coupled Home Battery Storage',
        info: 'EVDC-105-4 (Standard) | EVDC-105-6 (Plus)',
        image: '/assets/images/rs19129web_batterystorager2dc.jpg',
        excerpt: 'Legendary Panasonic battery Tech...',
        desc:
            'The same legendary Panasonic battery technology that powers the world’s most advanced electric cars is now available to power your home. EverVolt™ stores the excess power your solar panels generate during the day for use during grid outages, or to sell to your local utility. Available in a four- or six-battery configuration, this AC-coupled storage system works with or without solar and delivers clean usable energy capacity ranging from 11.4 kWh to 17.1 kWh.',
    },
];

export { Calculator, Calculator as default };
