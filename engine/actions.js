/*global GameCreator, $*/
(function() {
'use strict';
    
GameCreator.Action = function(args) {
    this.action = args.action;
    this.params = args.params || [];
    this.timing = args.timing;
    this.name = args.name;
    if (args.runnableFunction) {
        this.runnable = args.runnableFunction;
    }
};

GameCreator.Action.prototype.runnable = function(runtimeObj) {
    if (runtimeObj) {
        return !runtimeObj.isDestroyed; 
    } else {
        return true;
    }
};  

GameCreator.RuntimeAction = function(name, params, timing) {
    var i;
    this.name = name;
    this.timing = timing || {type: 'now'};
    this.parameters = params || {};
};

GameCreator.RuntimeAction.prototype.getAllParameters = function() {
    return GameCreator.actions[this.name].params;
};

GameCreator.RuntimeAction.prototype.getParameter = function(name) {
    return GameCreator.actions[this.name].params[name];
};

GameCreator.RuntimeAction.prototype.hasReferenceToGlobalObj = function(globalObjId) {
    var action = GameCreator.actions[this.name];
    var parameters = Object.keys(this.parameters);
    for (var i = 0; i < parameters.length; i += 1) {
        var paramName = parameters[i];
        var globalObjRef = action.params[paramName].globalObjRef;
        if (globalObjRef === true) {
            if (this.parameters[paramName] == globalObjId) {
                return true;
            }
        } else if (typeof(globalObjRef) === "string") { // Global Obj reference is nested 
            if (this.parameters[paramName][globalObjRef] == globalObjId) {
                return true;
            }
        }
    }
    return false;
};

GameCreator.RuntimeAction.prototype.hasRequiredParameters = function(parameters) {
    var i, keys;
    keys = Object.keys(this.parameters);
    for (i = 0; i < keys.length; i += 1) {
        if (parameters[keys[i]] && parameters[keys[i]].mandatory) {
            if (this.parameters[keys[i]] === null || this.parameters[keys[i]] === undefined) {
                return false;
            }
        }
    }
    return true;
}

GameCreator.RuntimeAction.prototype.validate = function() {
    var i, keys, errorMsgs;
    var parameters = GameCreator.actions[this.name].params;
    keys = Object.keys(parameters);
    errorMsgs = [];
    for (i = 0; i < keys.length; i += 1) {
        if (parameters[keys[i]] && parameters[keys[i]].mandatory) {
            if (this.parameters[keys[i]] === null || this.parameters[keys[i]] === undefined) {
                errorMsgs.push("Action '" + this.name + "' is missing required parameter '" + GameCreator.helpers.getPrettyName(keys[i]) + "'");
            }
        }
    }
    return errorMsgs;
}

GameCreator.RuntimeAction.prototype.runAction = function(runtimeObj, runtimeParameters) {
    var timerFunction, combinedParameters = {};

    if(runtimeParameters) {
      combinedParameters = $.extend(combinedParameters, runtimeParameters, this.parameters);
    } else {
      combinedParameters = this.parameters;
    }

    if (this.timing.type === 'after') {
        timerFunction = GameCreator.timerHandler.registerOffset;
    } else if (this.timing.type === 'at') {
        timerFunction = GameCreator.timerHandler.registerFixed;
    } else if (this.timing.type === 'every') {
        timerFunction = GameCreator.timerHandler.registerInterval;
    } else {
        var action = GameCreator.actions[this.name];
        if (action.runnable(runtimeObj) && this.hasRequiredParameters(action.params)) {
            action.action.call(runtimeObj, combinedParameters);
            return true;
        } else {
            return false;
        }
    }

    (function(thisAction, thisRuntimeObj, combinedParameters) {
        timerFunction(
            GameCreator.helpers.getRandomFromRange(thisAction.timing.time),
            function() {
                if (GameCreator.actions[thisAction.name].runnable(thisRuntimeObj)) {
                    GameCreator.actions[thisAction.name].action.call(thisRuntimeObj, combinedParameters);
                    return true;
                } else {
                    return false;
                }
            });
    })(this, runtimeObj, combinedParameters);
};

GameCreator.actions = {
    Bounce: new GameCreator.Action({
        name: 'Bounce',
        action: function(params) {
            this.parent.bounce.call(this, params);
        },
        timing: {
            at: false, every: false, after: false
        }
    }),
    Stop: new GameCreator.Action({   
        name: 'Stop',
        action: function(params) {
            this.parent.stop.call(this, params);
        },
        timing: {
            at: false, every: false, after: false
        },
    }),
    Destroy: new GameCreator.Action({   
        name: 'Destroy',
        action: function(params) {
            this.parent.destroy.call(this, params);
        },
        timing: {
            at: true, every: false, after: true
        },
    }),
    Shoot: new GameCreator.Action({    
        name: 'Shoot',
        action: function(params) {
            this.parent.shoot.call(this, params);
        },
        timing: {
            at: true, every: true, after: true
        },
    }),
    Create: new GameCreator.Action({    
        name: 'Create',
        action: function(params) {
            GameCreator.createRuntimeObject(GameCreator.helpers.getGlobalObjectById(Number(params.objectToCreate)), {x: params.x, y: params.y});
        },
        timing: {at: true, every: true, after: true},
        runnableFunction: function() { return true; }
    }),
    Counter: new GameCreator.Action({
        name: 'Counter',
        action: function(params) {
            GameCreator.changeCounter(this, params);
        },
        timing: {
            at: true, every: true, after: true
        },
    }),
    SwitchState: new GameCreator.Action({
        name: 'SwitchState',
        action: function(params) {
            GameCreator.changeState(this, params);  
        },
        timing: {
            at: true, every: true, after: true
        },
    }),
    Restart: new GameCreator.Action({
        name: 'Restart',
        action: GameCreator.restartGame,
        timing: {
            at: true, every: false, after: true
        },
    }),
    SwitchScene: new GameCreator.Action({
        name: 'SwitchScene',
        action: function(params){
            GameCreator.selectScene(params);
        },
        timing: {
            at: true, every: true, after: true
        },
    }),
    NextScene: new GameCreator.Action({
        name: 'NextScene',
        action: function() {
            var currentIndex = GameCreator.helpers.getIndexOfSceneWithId(GameCreator.activeSceneId);
            var nextIndex = (currentIndex + 1) % GameCreator.scenes.length;
            GameCreator.switchScene(GameCreator.scenes[nextIndex]);
        },
        timing: {
            at: true, every: true, after: true
        },
    }),
    Teleport: new GameCreator.Action({
        name: 'Teleport',
        action: function(params) {
            this.parent.setPosition.call(this, params);
        },
        timing: { at: true, every: true, after: true },
    }),
    RestartScene: new GameCreator.Action({
        name: 'RestartScene',
        action: function() {
            var currentIndex = GameCreator.helpers.getIndexOfSceneWithId(GameCreator.activeSceneId);
            GameCreator.switchScene(GameCreator.scenes[currentIndex]);
        },
        timing: { at: true, every: true, after: true }
    })
};

GameCreator.actionGroups = {
    collisionActions: {
        Bounce: GameCreator.actions.Bounce,
        Stop: GameCreator.actions.Stop,
        Teleport: GameCreator.actions.Teleport,
        Destroy: GameCreator.actions.Destroy,
        Shoot: GameCreator.actions.Shoot,
        Create: GameCreator.actions.Create,
        Counter: GameCreator.actions.Counter,
        Restart: GameCreator.actions.Restart,
        SwitchScene: GameCreator.actions.SwitchScene,
        NextScene: GameCreator.actions.NextScene,
        SwitchState: GameCreator.actions.SwitchState,
        RestartScene: GameCreator.actions.RestartScene,
    },

    mouseCollisionActions: {
        Destroy: GameCreator.actions.Destroy,
        Shoot: GameCreator.actions.Shoot,
        Create: GameCreator.actions.Create,
        Counter: GameCreator.actions.Counter,
        Restart: GameCreator.actions.Restart,
        SwitchScene: GameCreator.actions.SwitchScene,
        NextScene: GameCreator.actions.NextScene,
        SwitchState: GameCreator.actions.SwitchState,
        RestartScene: GameCreator.actions.RestartScene,
    },

    nonCollisionActions: {
        Stop: GameCreator.actions.Stop,
        Teleport: GameCreator.actions.Teleport,
        Destroy: GameCreator.actions.Destroy,
        Shoot: GameCreator.actions.Shoot,
        Create: GameCreator.actions.Create,
        Counter: GameCreator.actions.Counter,
        Restart: GameCreator.actions.Restart,
        SwitchScene: GameCreator.actions.SwitchScene,
        NextScene: GameCreator.actions.NextScene,
        SwitchState: GameCreator.actions.SwitchState,
        RestartScene: GameCreator.actions.RestartScene,
    },

    mouseNonCollisionActions: {
        Destroy: GameCreator.actions.Destroy,
        Shoot: GameCreator.actions.Shoot,
        Create: GameCreator.actions.Create,
        Counter: GameCreator.actions.Counter,
        Restart: GameCreator.actions.Restart,
        SwitchScene: GameCreator.actions.SwitchScene,
        NextScene: GameCreator.actions.NextScene,
        SwitchState: GameCreator.actions.SwitchState,
        RestartScene: GameCreator.actions.RestartScene,
    },

    nonObjectActions: {
        Create: GameCreator.actions.Create,
        Restart: GameCreator.actions.Restart,
        SwitchScene: GameCreator.actions.SwitchScene,
        NextScene: GameCreator.actions.NextScene,
        SwitchState: GameCreator.actions.SwitchState,
        Counter: GameCreator.actions.Counter,
        ResetScene: GameCreator.actions.ResetScene,
    }
};

}());
