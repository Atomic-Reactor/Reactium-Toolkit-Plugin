const _ = require('underscore');

module.exports = config => {
    config.watch.restartWatches = _.flatten([
        'reactium_modules/@atomic-reactor/toolkit/assets/style/toolkit.scss',
        config.watch.restartWatches,
    ]);

    config.watch.style = _.flatten([
        'reactium_modules/@atomic-reactor/toolkit/**/*.scss',
        config.watch.style,
    ]);

    config.src.style = _.flatten([
        'reactium_modules/@atomic-reactor/toolkit/**/*.scss',
        config.src.style,
        '!{reactium_modules/@atomic-reactor/toolkit/**/_*.scss}',
    ]);
};
