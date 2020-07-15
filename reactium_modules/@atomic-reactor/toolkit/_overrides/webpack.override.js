const path = require('path');
const webpack = require('webpack');

module.exports = config => {
    config.plugins.push(
        new webpack.ContextReplacementPlugin(/^toolkit/, context => {
            context.request = path.resolve('./src/app/toolkit');
        }),
    );

    return config;
};
