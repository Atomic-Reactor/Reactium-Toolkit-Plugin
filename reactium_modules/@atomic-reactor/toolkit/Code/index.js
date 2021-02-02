import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/javascript/javascript';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import _ from 'underscore';
import op from 'object-path';
import PropTypes from 'prop-types';
import React, { forwardRef, useImperativeHandle } from 'react';

import Reactium, {
    useDerivedState,
    useEventHandle,
    useRefs,
    Zone,
} from 'reactium-core/sdk';

let Code = ({ className, id, value: initialValue, ...initialProps }, ref) => {
    let events = {};
    let props = { ...initialProps };

    const refs = useRefs();

    const [value, setValue] = useDerivedState({
        current: Reactium.Toolkit.codeFormat(initialValue),
    });

    Object.entries(initialProps).forEach(([key, val]) => {
        if (String(key).startsWith('on') || String(key).startsWith('editor')) {
            events[key] = val;
            delete props[key];
        }
    });

    const _onChange = (...args) => {
        const cm = args[0];
        const newValue = cm.doc.getValue();
        if (newValue === value.current) return;

        setValue({ changed: true, current: newValue });
        handle.value = newValue;
        handle.editor = cm;
        setHandle(handle);

        if (_.isFunction(op.get(events, 'onChange'))) {
            _.defer(() => events.onChange(...args, handle));
        }
    };

    const _onMount = (...args) => {
        refs.set('code', args[0]);
        handle.editor = args[0];
        setHandle(handle);

        if (_.isFunction(op.get(events, 'editorDidMount'))) {
            events.editorDidMount(...args, handle);
        }
    };

    const _handle = () => ({
        id,
        props,
        value: value.current,
        editor: refs.get('code'),
    });

    let [handle, setHandle] = useEventHandle(_handle());

    useImperativeHandle(ref, () => handle);

    return (
        <div className={className}>
            <CodeMirror
                {...events}
                options={props}
                onChange={_onChange}
                editorDidMount={_onMount}
                value={Reactium.Toolkit.codeFormat(initialValue)}
            />
            <div className={`${className}-actions`}>
                <Zone zone={`${className}-actions`} {..._handle()} />
                {id && <Zone zone={`${id}-actions`} {..._handle()} />}
            </div>
        </div>
    );
};

Code = forwardRef(Code);

Code.propTypes = {
    className: PropTypes.string,
    gutters: PropTypes.array,
    lineNumbers: PropTypes.bool,
    lineWrapping: PropTypes.bool,
    foldGutter: PropTypes.bool,
    foldOptions: PropTypes.object,
    id: PropTypes.string,
    indentUnit: PropTypes.number,
    mode: PropTypes.string,
    readOnly: PropTypes.bool,
    editorDidAttach: PropTypes.func,
    editorDidConfigure: PropTypes.func,
    editorDidDetach: PropTypes.func,
    editorDidMount: PropTypes.func,
    editorWillUnmount: PropTypes.func,
    onBeforeChange: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onContextMenu: PropTypes.func,
    onCopy: PropTypes.func,
    onCursorActivity: PropTypes.func,
    onCut: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    onFocus: PropTypes.func,
    onGutterClick: PropTypes.func,
    onInputRead: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyHandled: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyUp: PropTypes.func,
    onMouseDown: PropTypes.func,
    onPaste: PropTypes.func,
    onSelection: PropTypes.func,
    onTouchStart: PropTypes.func,
    onUpdate: PropTypes.func,
    onViewportChange: PropTypes.func,
};

Code.defaultProps = {
    className: 'rtk-code',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    lineNumbers: true,
    lineWrapping: false,
    foldGutter: true,
    foldOptions: { widget: () => '...' },
    id: 'code',
    indentUnit: 4,
    mode: 'jsx',
    readOnly: false,
};

export { Code, Code as default };
