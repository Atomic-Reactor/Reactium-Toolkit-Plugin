const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('underscore');
const op = require('object-path');
const prettier = require('prettier').format;
const handlebars = require('handlebars').compile;

module.exports = ({ Spinner }) => {
    const message = text => {
        if (Spinner) {
            Spinner.text = text;
        }
    };

    const template = ({ file, context }) => {
        const tmp = path.normalize(`${__dirname}/template/${file}`);
        const content = handlebars(fs.readFileSync(tmp, 'utf-8'))(context);
        return content;
    };

    const write = ({ content, directory, file }) => {
        file = path.normalize(path.join(directory, file));
        fs.writeFileSync(file, content);
    };

    return {
        empty: ({ params }) => {
            fs.emptyDirSync(params.directory);
        },
        element: ({ action, params, props }) => {
            write({
                content: template({ file: 'element.hbs', context: params }),
                directory: params.directory,
                file: 'index.js',
            });
        },
        hooks: ({ params, props }) => {
            write({
                content: template({
                    file: 'reactium-hooks.hbs',
                    context: params,
                }),
                directory: params.directory,
                file: 'reactium-hooks.js',
            });
        },
    };
};
