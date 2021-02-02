import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/javascript/javascript';
import prettier from 'prettier/standalone';
import parserbabel from 'prettier/parser-babylon';
import parserHtml from 'prettier/parser-html';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import React, { forwardRef } from 'react';

const prettierOptions = {
    parser: 'babel',
    singleQuote: true,
    tabWidth: 4,
    printWidth: 200000000,
    jsxSingleQuote: true,
    jsxBracketSameLine: true,
    trailingComma: 'es5',
    plugins: [parserbabel, parserHtml],
};

const foldWidget = () => {
    return '...';
};

let Code = ({ className, value: initialValue, ...props }, ref) => {
    let value = '// Invalid Code';

    try {
        value = prettier.format(initialValue, prettierOptions);
    } catch (err) {
        console.log(err);
    }

    return (
        <CodeMirror
            value={value}
            options={props}
            editorDidMount={ref}
            className={className}
        />
    );
};

Code = forwardRef(Code);

Code.defaultProps = {
    className: 'rtk-code',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    lineNumbers: true,
    lineWrapping: false,
    foldGutter: true,
    foldOptions: { widget: foldWidget },
    indentUnit: 4,
    mode: 'jsx',
    readOnly: false,
};

export { Code, Code as default };
