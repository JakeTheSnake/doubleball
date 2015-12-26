(function() {

GameCreator.conditions.objectExists.params = {
    objId: {
        component: GlobalObjectParam,
        mandatory: true,
        globalObjRef: true
    },
    comparator: {
        component: ComparatorParam,
        mandatory: true,
        defaultValue: 'equals'
    },
    count: {
        component: NumberParam,
        mandatory: false,
        defaultValue: 1
    }
};

GameCreator.conditions.counterEquals.params = {
    counter: {
        component: CounterParam,
        mandatory: true,
    },
    comparator: {
        component: ComparatorParam,
        mandatory: true,
        defaultValue: 'equals'
    },
    value: {
        component: NumberParam,
        mandatory: false,
        defaultValue: 0
    }
};

GameCreator.conditions.isInState.params = {
    state: {
        component: StateParam,
        mandatory: false,
        defaultValue: 0
    }
};

GameCreator.conditions.currentScene.params = {
    comparator: {
        component: ComparatorParam,
        param: GameCreator.ComparatorParameter,
        mandatory: true,
        defaultValue: 'equals'
    },
    scene: {
        component: SceneParam,
        param: GameCreator.SwitchSceneParameter,
        mandatory: true,
    },
};

GameCreator.conditions.collidesWith.params = {
    objId: {
        component: GlobalObjectParam,
        mandatory: true,
        globalObjRef: true
    },
};

GameCreator.conditions.randomCondition.params = {
    comparator: {
        component: ComparatorParam,
        mandatory: true,
        defaultValue: 'equals'
    },
    value: {
        component: NumberParam,
        mandatory: false,
        defaultValue: 1
    },
    maxRandomValue: {
        component: NumberParam,
        mandatory: false,
        defaultValue: 1
    }
};

GameCreator.conditions.timeElapsed.params = {
    time: {
        component: NumberParam,
        mandatory: true,
        defaultValue: 0
    },
};

})();