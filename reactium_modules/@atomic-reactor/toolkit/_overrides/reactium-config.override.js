const contextMode = () => {
    if (
        process.env.NODE_ENV !== 'development' &&
        process.env.LAZY_GET_COMPONENTS !== 'off'
    ) {
        return 'lazy-once';
    }

    return 'sync';
};

module.exports = config => {
    confg.contexts.toolkit = {
        modulePath: 'toolkit',
        filePattern: '.js?$',
        mode: contextMode(),
    };

    config.umd.searchParams.exclude.push(/src\/app\/toolkit/);

    return config;
};
