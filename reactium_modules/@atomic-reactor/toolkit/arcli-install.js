const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const op = require('object-path');

module.exports = spinner => {
    const message = (...text) => {
        if (spinner) spinner.text = text.join(' ');
    };

    const normalize = (...args) => path.normalize(path.join(...args));

    let cwd, pluginDir, toolkitDir;

    return {
        init: ({ params, props }) => {
            cwd = op.get(props, 'cwd');

            pluginDir = op.get(
                params,
                'pluginDirectory',
                normalize(cwd, 'src', 'app', 'components', 'Admin'),
            );
            toolkitDir = normalize(cwd, 'src', 'app', 'toolkit');
        },

        copyFiles: () => {            
            if (fs.existsSync(normalize(toolkitDir, 'index.js'))) {
                spinner.stopAndPersist({
                    text: `Skipping ${chalk.cyan('toolkit')} files`,
                    symbol: chalk.cyan('-'),
                });
                return;
            }

            spinner.stop();
            console.log('');

            message('Copying', chalk.cyan('toolkit'), 'files...');

            fs.copySync(normalize(pluginDir, '_tmp'), toolkitDir, {
                overwrite: false,
            });

            spinner.stopAndPersist({
                text: `Copied ${chalk.cyan('toolkit')} files`,
                symbol: chalk.green('✔'),
            });
        },

        complete: () => console.log(''),
    };
};
