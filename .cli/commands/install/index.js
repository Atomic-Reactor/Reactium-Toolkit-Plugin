const chalk = require('chalk');
const GENERATOR = require('./generator');

const NAME = 'installer';
const DESC = 'Test the arcli-install script';
const CANCELED = `Installer ${chalk.magenta('canceled!')}`;

// prettier-ignore
const ACTION = async action => {
    console.log('');

    await GENERATOR({ arcli: global, props: global.arcli.props });

    process.exit();
    console.log('');
};

// prettier-ignore
const COMMAND = ({ program }) => program.command(NAME).description(DESC).action(ACTION);

module.exports = { ACTION, CANCELED, COMMAND, NAME };
