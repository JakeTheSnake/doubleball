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
        mandatory: true,
        globalObjRef: true,
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
        component: GlobalObjectParam,
        globalObjRef: true,
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
        defaultValue: {},
        globalObjRef: 'carrier'
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
        mandatory: true,
        globalObjRef: 'objId'
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

GameCreator.actions.PlaySound.params = {
    'audioId': { 
        component: AudioParam,
        mandatory: true 
    },
    'speed': {
        component: RangeParam,
        mandatory: false,
        defaultValue: 100
    },
    'volume': {
        component: PercentParam,
        mandatory: false,
        defaultValue: 100
    }
};

GameCreator.actions.PlayMusic.params = {
    'audioId': { 
        component: AudioParam,
        mandatory: true 
    },
    'volume': {
        component: PercentParam,
        mandatory: false,
        defaultValue: 100
    }
};


})();