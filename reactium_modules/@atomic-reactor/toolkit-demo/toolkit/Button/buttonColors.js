import _ from 'underscore';
import Reactium from 'reactium-core/sdk';

const buttonColors = exclude => {
    const { Button } = Reactium.Component.get('ReactiumUI');

    exclude = _.isArray(exclude) ? exclude : [Button.ENUMS.COLOR.CLEAR];

    return _.without(
        Object.values(Button.ENUMS.COLOR),
        ...exclude,
    ).sort();
};

export { buttonColors, buttonColors as default };
