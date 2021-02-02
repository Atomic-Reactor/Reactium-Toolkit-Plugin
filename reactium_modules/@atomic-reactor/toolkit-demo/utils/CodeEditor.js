import _ from 'underscore';
import copy from 'copy-to-clipboard';
import React, { useEffect } from 'react';
import Reactium, { useHookComponent, useRefs } from 'reactium-core/sdk';

const CodeEditor = ({ setState, tagName, value }) => {
    const refs = useRefs();
    const { Code } = useHookComponent('RTK');
    const { Button, Icon } = useHookComponent('ReactiumUI');

    const apply = e => {
        const { value } = e;

        let attributes;

        const str = String(value);
        const reg = new RegExp(`<${tagName}\\s+(.*?)\>`, 'gm');
        const tag = _.first(_.first(Array.from(str.matchAll(reg))));

        try {
            attributes = Reactium.Toolkit.parseAttributes(
                Array.from(
                    tag.matchAll(
                        /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/gm,
                    ),
                ).reduce((obj, item) => {
                    obj[item[1]] = item[2];
                    return obj;
                }, {}),
            );
        } catch (err) {}

        if (attributes) {
            setState(attributes);
        }
    };

    useEffect(() => {
        if (!Reactium.Zone.hasZoneComponent('code-editor-actions', 'refresh')) {
            Reactium.Zone.addComponent({
                id: 'refresh',
                zone: ['code-editor-actions'],
                component: props => (
                    <Button
                        onClick={() => apply(props)}
                        color='clear'
                        style={{ padding: 0, width: 40, height: 32 }}>
                        <Icon name='Feather.RefreshCw' size={14} />
                    </Button>
                ),
            });

            Reactium.Zone.addComponent({
                id: 'copy',
                zone: ['code-editor-actions'],
                component: props => (
                    <Button
                        onClick={() => copy(props.value)}
                        color='clear'
                        style={{ padding: 0, width: 40, height: 32 }}>
                        <Icon name='Feather.Clipboard' size={14} />
                    </Button>
                ),
            });

            return () => {
                Reactium.Zone.removeComponent('refresh');
                Reactium.Zone.removeComponent('clipboard');
            };
        }
    }, []);

    return (
        <Code
            value={value}
            id='code-editor'
            ref={elm => refs.set('code', elm)}
        />
    );
};

export { CodeEditor, CodeEditor as default };
