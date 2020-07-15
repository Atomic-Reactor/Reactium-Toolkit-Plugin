import Toolkit from './index';
import deps from 'dependencies';

export default [
    {
        path: ['/toolkit/:group/:element', '/toolkit/:group', '/toolkit'],
        exact: true,
        component: Toolkit,
        load: (params, search) => {
            return deps().actions.toolkit.load(params, search); 
        },
    },
];
