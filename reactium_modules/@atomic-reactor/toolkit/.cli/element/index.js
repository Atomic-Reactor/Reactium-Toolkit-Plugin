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
    const files = fs.readdirSync(dir).filter(
        file =>
            !String(file)
                .toLowerCase()
                .endsWith('.ds_store'),
    );
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

const NAME = 'toolkit <element>';

const DESC = 'Create a new Reactium Toolkit element';

const CANCELED = 'Reactium Toolkit element creation canceled!';

const VALIDATE = {};
const PROMPT = {};

const HELP = () => {
    console.log('');
};

const CONFORM = params => {
    Hook.runSync('toolkit-element-conform', { arcli, params, props });

    return Object.keys(params).reduce((obj, key) => {
        let val = params[key];
        switch (key) {
            case 'name':
                val = camelcase(slugify(val), { pascalCase: true });
                obj[key] = val;
                break;

            default:
                obj[key] = val;
                break;
        }
        return obj;
    }, {});
};

VALIDATE.NAME = name => (!name ? 'Element name is required' : true);

PROMPT.NAME = async params => {
    if (op.get(params, 'name')) return;

    const answers = await inquirer.prompt([
        {
            prefix,
            name: 'name',
            type: 'input',
            message: 'Element name:',
            validate: val => VALIDATE.NAME(val),
        },
    ]);

    mergeParams(params, CONFORM(answers));
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
                normalize(process.cwd(), 'src', 'app', 'components', 'Toolkit'),
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

    directory = path.resolve(normalize(directory, params.name));
    fs.ensureDirSync(directory);

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
                    '\n\t  Overwrite?:',
            },
        ]);

        if (overwrite !== true) {
            message(CANCELED);
            process.exit();
        }
    }
};

PROMPT.HOOK = async params => {
    const questions = [];

    if (!op.get(params.id)) {
        questions.push({
            prefix,
            name: 'id',
            type: 'input',
            message: 'Unique ID:',
            default: slugify(String(params.name).toLowerCase()),
        });
    }

    if (!op.get(params.sidebar)) {
        questions.push({
            prefix,
            name: 'sidebar',
            type: 'confirm',
            message: 'Sidebar?:',
        });
    }

    const answers = await inquirer.prompt(questions);

    mergeParams(params, answers);
};

PROMPT.SIDEBAR = async params => {
    if (!op.get(params, 'sidebar')) return;

    const questions = [];

    if (!op.get(params.group)) {
        questions.push({
            prefix,
            name: 'group',
            type: 'input',
            message: 'Sidebar Group:',
        });
    }

    if (!op.get(params.label)) {
        questions.push({
            prefix,
            name: 'label',
            type: 'input',
            default: params.name,
            message: 'Sidebar Label:',
        });
    }

    if (!op.get(params.url)) {
        questions.push({
            prefix,
            name: 'url',
            type: 'input',
            message: 'Sidebar URL:',
        });
    }

    if (!op.get(params.order)) {
        questions.push({
            prefix,
            default: 100,
            name: 'order',
            type: 'number',
            message: 'Sidebar Order:',
        });
    }

    const answers = await inquirer.prompt(questions);

    mergeParams(params, answers);
};

PROMPT.PREFLIGHT = async params => {
    // Transform the preflight object instead of the params object
    const preflight = CONFORM({ ...params });
    // delete preflight.sidebar;

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

    props.command = action;

    // 0.0 - prep params that came from flags
    let params = CONFORM(initialParams);

    // 1.0 - Get name
    await PROMPT.NAME(params);

    // 2.0 - Get Directory
    await PROMPT.DIR(params);

    // 3.0 - Check directory
    await PROMPT.OVERWRITE(params);

    // 4.0 - Hook
    await PROMPT.HOOK(params);

    // 5.0 - Sidebar
    await PROMPT.SIDEBAR(params);

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
        'sidebar',
        'group',
        'url',
        'label',
        'order',
    ];
    Hook.runSync('toolkit-element-flags', flags);
    return flags;
};

const COMMAND = ({ program, ...args }) =>
    program
        .command(NAME)
        .description(DESC)
        .action((action, opt) => ACTION(action, FLAGS_TO_PARAMS(opt)))
        .option('-n, --name [name]', 'The element name')
        .option('-d, --directory [directory]', 'The path to create the element')
        .option('-o, --overwrite [overwrite]', 'Overwrite existing element.')
        .option('-i, --id [id]', 'The unique element id')
        .option('-s, --sidebar [sidebar]', 'Include sidebar link')
        .option('-g, --group [group]', 'The sidebar link group')
        .option('-l, --label [label]', 'The sidebar link label')
        .option('-u, --url [url]', 'The sidebar link url')
        .option('--order [order]', 'The sidebar link order')
        .on('--help', HELP);

module.exports = {
    ACTION,
    COMMAND,
    ID: NAME,
};
