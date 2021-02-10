/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const _ = require('underscore');
const op = require('object-path');
const slugify = require('slugify');
const globby = require('globby').sync;
const camelcase = require('camelcase');
const GENERATOR = require('./generator');
const mod = path.dirname(require.main.filename);
const { error, message } = require(`${mod}/lib/messenger`);

const { arcli, Hook } = global;
const prefix = arcli.prefix;
const props = arcli.props;

const { inquirer } = props;

const isEmpty = dir => {
    let files = [];

    try {
        files = fs.readdirSync(dir).filter(
            file =>
                !String(file)
                    .toLowerCase()
                    .endsWith('.ds_store'),
        );
    } catch (err) {}
    return files.length < 1;
};

const normalize = (...args) => path.normalize(path.join(...args));

const mergeParams = (params = {}, merge = {}) => {
    Object.entries(merge).forEach(([key, val]) => {
        val = _.chain([val])
            .compact()
            .isEmpty()
            .value()
            ? undefined
            : val;
        params[key] = val;
    });

    return params;
};

const NAME = 'toolkit <sidebar>';

const DESC = 'Create a Reactium Toolkit sidebar item';

const CANCELED =
    'Reactium Toolkit sidebar creation ' + chalk.magenta('canceled!');

const VALIDATE = {};
const PROMPT = {};
const FILTER = {};

const HELP = () => {
    console.log('');
};

const CONFORM = params => {
    Hook.runSync('toolkit-sidebar-conform', { arcli, params, props });

    return Object.keys(params).reduce((obj, key) => {
        let val = params[key];
        switch (key) {
            case 'id':
            case 'group':
                obj[key] = slugify(val, { lower: true });
                break;

            default:
                obj[key] = val;
                break;
        }
        return obj;
    }, {});
};

VALIDATE.REQUIRED = (key, val) =>
    !val ? `${chalk.magenta(key)} is required` : true;

FILTER.FORMAT = (key, val) => CONFORM({ [key]: val })[key];

// prettier-ignore
FILTER.URL = (val, params) => _.compact(['/toolkit', op.get(params, 'group'), op.get(params, 'id')]).join('/');

PROMPT.TYPE = async params => {
    if (op.get(params, 'type')) return;

    const answers = await inquirer.prompt([
        {
            prefix,
            type: 'list',
            name: 'type',
            message: 'Type:',
            choices: [
                { name: 'Link', value: 'link', short: 'link', checked: true },
                { name: 'Group', value: 'group', short: 'group' },
            ],
        },
    ]);

    mergeParams(params, answers);
};

PROMPT.DIR = async params => {
    if (op.get(params, 'directory')) return;

    let { directory } = await inquirer.prompt([
        {
            prefix,
            name: 'directory',
            depthLimit: 10,
            type: 'fuzzypath',
            message: 'Directory:',
            itemType: 'directory',
            default: path.resolve(
                normalize(
                    process.cwd(),
                    'src',
                    'app',
                    'components',
                    'Toolkit',
                    'Sidebar',
                ),
            ),
            rootPath: path.resolve(process.cwd()),
            excludePath: p => {
                // prettier-ignore;
                if (p.startsWith(path.resolve(normalize(process.cwd(), 'src'))))
                    return false;
                if (
                    p.startsWith(
                        path.resolve(
                            normalize(process.cwd(), 'reactium_modules'),
                        ),
                    )
                )
                    return false;

                // prettier-ignore
                return (
                    p.endsWith('.tmp') ||
                    p.includes('.Trash') ||
                    p.startsWith('/Volumes/') ||
                    p.includes('node_modules') ||
                    p.startsWith(path.resolve(normalize(process.cwd(), '.git'))) ||
                    p.startsWith(path.resolve(normalize(process.cwd(), '.cli'))) ||
                    p.startsWith(path.resolve(normalize(process.cwd(), 'docs'))) ||
                    p.startsWith(path.resolve(normalize(process.cwd(), '.core'))) ||
                    p.startsWith(path.resolve(normalize(process.cwd(), 'build'))) ||
                    p.startsWith(path.resolve(normalize(process.cwd(), 'public'))) ||
                    p.startsWith(path.resolve(normalize(process.cwd(), 'markdown'))) ||
                    p.startsWith(path.resolve(normalize(process.cwd(), 'flow-typed')))
                );
            },
        },
    ]);

    const parts = [directory];
    if (params.group) {
        parts.push(
            camelcase(slugify(params.group, { lower: true }), {
                pascalCase: true,
            }),
        );
    }

    parts.push(
        camelcase(slugify(params.id, { lower: true }), {
            pascalCase: true,
        }),
    );

    directory = path.resolve(normalize(...parts));

    mergeParams(params, { directory });
};

PROMPT.OVERWRITE = async params => {
    if (!op.get(params, 'overwrite') && !isEmpty(params.directory)) {
        const { overwrite } = await inquirer.prompt([
            {
                prefix,
                default: false,
                type: 'confirm',
                name: 'overwrite',
                message:
                    chalk.magenta('The selected directory is not empty!') +
                    '\n\t' +
                    chalk.cyan(params.directory) +
                    '\n\t  Overwrite?:',
            },
        ]);

        if (overwrite !== true) {
            message(CANCELED);
            process.exit();
        }
    }
};

PROMPT.LINK = async params => {
    if (op.get(params, 'type') !== 'link') return;

    const questions = [];

    if (!op.get(params, 'group')) {
        questions.push({
            prefix,
            name: 'group',
            type: 'input',
            message: 'Group ID:',
            validate: val => VALIDATE.REQUIRED('group', val),
        });
    }

    if (!op.get(params, 'id')) {
        questions.push({
            prefix,
            name: 'id',
            type: 'input',
            message: 'Link ID:',
            valiate: val => VALIDATE.REQUIRED('id', val),
            filter: value => FILTER.FORMAT('id', value),
        });
    }

    const answers = await inquirer.prompt(questions);

    mergeParams(params, CONFORM(answers));
};

PROMPT.GROUP = async params => {
    const questions = [];

    if (!op.get(params, 'id')) {
        questions.push({
            prefix,
            name: 'id',
            type: 'input',
            message: 'ID:',
            valiate: val => VALIDATE.REQUIRED('id', val),
            filter: value => FILTER.FORMAT('id', value),
        });
    }

    if (!op.get(params, 'label')) {
        questions.push({
            prefix,
            name: 'label',
            type: 'input',
            message: 'Label:',
            valiate: val => VALIDATE.REQUIRED('label', val),
        });
    }

    if (!op.get(params, 'url')) {
        questions.push({
            prefix,
            name: 'url',
            type: 'confirm',
            message: 'URL?:',
        });
    }

    if (!op.get(params.order)) {
        questions.push({
            prefix,
            default: 100,
            name: 'order',
            type: 'number',
            message: 'Order:',
        });
    }

    const answers = await inquirer.prompt(questions);

    if (op.get(answers, 'url') === true) {
        answers.url = FILTER.URL(answers.url, params);
    }

    mergeParams(params, CONFORM(answers));
};

PROMPT.PREFLIGHT = async params => {
    // Transform the preflight object instead of the params object
    const preflight = CONFORM({ ...params });

    // Output messge
    message(
        'A new toolkit element will be created using the following configuration:',
    );
    console.log(JSON.stringify(preflight, null, 2));
    console.log('');

    const { confirm } = await inquirer.prompt([
        {
            prefix,
            name: 'confirm',
            type: 'confirm',
            message: 'Proceed?:',
            default: false,
        },
    ]);

    if (confirm !== true) {
        message(CANCELED);
        process.exit();
    }
};

const ACTION = async (action, initialParams) => {
    console.log('');

    // props.command = action;

    // 0.0 - prep params that came from flags
    let params = CONFORM(initialParams);

    // 1.0 - Get Type of menu link
    await PROMPT.TYPE(params);

    // 2.0.1 - Link
    await PROMPT.LINK(params);

    // 2.0.2 - Group
    await PROMPT.GROUP(params);

    // 3.0 - Get Directory
    await PROMPT.DIR(params);

    // 4.0 - Check directory
    await PROMPT.OVERWRITE(params);

    // 6.0 - Preflight
    await PROMPT.PREFLIGHT(params);

    // 7.0 - Execute actions
    await GENERATOR({ arcli: global, params, props });

    console.log('');
};

const FLAGS_TO_PARAMS = opt =>
    FLAGS().reduce((obj, key) => {
        let val = opt[key];
        val = typeof val === 'function' ? undefined : val;

        if (val) obj[key] = val;

        return obj;
    }, {});

const FLAGS = () => {
    let flags = [
        'name',
        'directory',
        'overwrite',
        'id',
        'group',
        'url',
        'label',
        'order',
    ];
    Hook.runSync('toolkit-sidebar-flags', flags);
    return flags;
};

const COMMAND = ({ program, ...args }) =>
    program
        .command(NAME)
        .description(DESC)
        .action((action, opt) => ACTION(action, FLAGS_TO_PARAMS(opt)))
        .on('--help', HELP);

module.exports = {
    ACTION,
    COMMAND,
    ID: NAME,
};
