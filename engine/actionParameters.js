(function() {

GameCreator.actions.Destroy.params = {
    'effect': {
        component: DestroyEffectParam,
        mandatory: false,
        defaultValue: 'none'
    }
};

GameCreator.actions.Shoot.params = {
    'objectToShoot': {
        component: ShootableObjectParam,
        mandatory: true
    },
    'projectileSpeed': {
        component: RangeParam,
        mandatory: false,
        defaultValue: 500
    },
    'projectileDirection': {
        component: DirectionParam,
        mandatory: false,
        defaultValue: {
            type: 'Default'
        }
    }
};

GameCreator.actions.Create.params = {
    'objectToCreate': {
        mandatory: true,
        component: GlobalObjectParam
    },
    'x': {
        mandatory: false,
        defaultValue: 0,
        component: RangeParam
    },
    'y': {
        mandatory: false,
        defaultValue: 0,
        component: RangeParam
    }
};

GameCreator.actions.Counter.params = {
    'counter': {
        mandatory: true,
        component: CounterParam,
        defaultValue: {}
    },
    'type': {
        mandatory: false,
        defaultValue: 'add',
        component: CounterTypeParam
    },
    'value': {
        mandatory: false,
        defaultValue: 1,
        component: NumberParam
    },
};

GameCreator.actions.SwitchState.params = {
    'state': {
        component: StateParam,
        defaultValue: {},
        mandatory: true
    }
};

GameCreator.actions.SwitchScene.params = {
    'scene': {
        mandatory: true,
        component: SceneParam
    }
};

GameCreator.actions.Teleport.params = {
    'type': { 
        component: MovementTypeParam,
        defaultValue: 'absolute',
        mandatory: true 
    },
    'x': { 
        component: RangeParam,
        mandatory: false,
        defaultValue: 0
    },
    'y': {
        component: RangeParam,
        mandatory: false,
        defaultValue: 0
    }
};



})();