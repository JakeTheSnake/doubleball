/*global GameCreator, $*/
(function() {
"use strict";
    
GameCreator.Action = function(args) {
    this.action = args.action;
    this.params = args.params || [];
    this.timing = args.timing;
    this.name = args.name;
    if (args.runnableFunction) {
        this.runnable = args.runnableFunction;
    }
};

GameCreator.Action.prototype.runnable = function() {
  return !this.isDestroyed; 
};  

GameCreator.RuntimeAction = function(name, params, timing) {
    var i;
    this.name = name;
    this.timing = timing || {type: 'now'};
    if (params !== undefined) {
        this.parameters = params;
    } else {
        var paramNames = Object.keys(GameCreator.actions[name].params);
        this.parameters = {};
        for (i = 0; i < paramNames.length; i+=1) {
            this.parameters[paramNames[i]] = GameCreator.actions[name].params[paramNames[i]].defaultValue;
        }
    }
};

GameCreator.RuntimeAction.prototype.getAllParameters = function() {
    return GameCreator.actions[this.name].params;
};

GameCreator.RuntimeAction.prototype.getParameter = function(name) {
    return GameCreator.actions[this.name].params[name];
}

GameCreator.RuntimeAction.prototype.hasRequiredParameters = function(parameters) {
  var i, keys;
  keys = Object.keys(this.parameters);
  for(i = 0; i < keys.length; i += 1) {
    if (parameters[keys[i]] && parameters[keys[i]].mandatory) {
      if (this.parameters[keys[i]] === null || this.parameters[keys[i]] === undefined){
        return false;
      }
    }
  }
  return true;
}

GameCreator.RuntimeAction.prototype.runAction = function(runtimeObj, runtimeParameters) {
    var timerFunction, combinedParameters = {};

    if(runtimeParameters) {
      combinedParameters = $.extend(combinedParameters, runtimeParameters, this.parameters);
    } else {
      combinedParameters = this.parameters;
    }

    if (this.timing.type === "after") {
        timerFunction = GameCreator.timerHandler.registerOffset;
    } else if (this.timing.type === "at") {
        timerFunction = GameCreator.timerHandler.registerFixed;
    } else if (this.timing.type === "every") {
        timerFunction = GameCreator.timerHandler.registerInterval;
    } else {
        if (GameCreator.actions[this.name].runnable.call(runtimeObj) && this.hasRequiredParameters(GameCreator.actions[this.name].params)) {
          GameCreator.actions[this.name].action.call(runtimeObj, combinedParameters);
          return true;
        } else {
          return false;
        }
    }

    (function(thisAction, thisRuntimeObj, combinedParameters) {
        timerFunction(
            GameCreator.helpers.getRandomFromRange(thisAction.timing.time),
            function() {
                if (GameCreator.actions[thisAction.name].runnable.call(thisRuntimeObj)) {
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
                      action: function(params) {this.parent.bounce.call(this, params); },
                      name: "Bounce",
                      timing: {at: false, every: false, after: false}
                    }),
      Stop:  new GameCreator.Action({   
                      action: function(params) {this.parent.stop.call(this, params); },
                      name: "Stop",
                      timing: {at: false, every: false, after: false},
                    }),
      Destroy: new GameCreator.Action({   
                      action: function(params) {this.parent.destroy.call(this, params); },
                      params: {"effect":
                                {param: GameCreator.DestroyEffectParameter,
                                 mandatory: false,
                                 defaultValue: null}
                             },
                      name: "Destroy",
                      timing: {at: true, every: false, after: true},
                    }),
      Shoot:   new GameCreator.Action({    
                      action: function(params) {this.parent.shoot.call(this, params); },
                      params: {"objectToShoot":
                                {param: GameCreator.ShootableObjectParameter,
                                 mandatory: true
                                 },
                                "projectileSpeed":
                                 {param: GameCreator.NumberParameter,
                                  mandatory: false,
                                  defaultValue: 500},
                                "projectileDirection":
                                 {param: GameCreator.DirectionParameter,
                                  mandatory: false,
                                  defaultValue: "Default"}
                             },
                      name: "Shoot",
                      timing: {at: true, every: true, after: true},
                    }),
      Create:   new GameCreator.Action({    
                      action: function(params) {GameCreator.createRuntimeObject(GameCreator.helpers.getGlobalObjectById(Number(params.objectToCreate)), {x: params.x, y: params.y}); },
                      params: {"objectToCreate": 
                                {param: GameCreator.GlobalObjectParameter,
                                mandatory: true,
                                component: GlobalObjectParam},
                               "x": 
                               {param: GameCreator.RangeParameter,
                                mandatory: false,
                                defaultValue: 0,
                                component: RangeParam},
                               "y": 
                               {param: GameCreator.RangeParameter,
                                mandatory: false,
                                defaultValue: 0,
                                component: RangeParam}
                              },
                      name: "Create",
                      timing: {at: true, every: true, after: true},
                      runnableFunction: function() { return true; }
                    }),
      Counter:  new GameCreator.Action({
                    action: function(params) {GameCreator.changeCounter(this, params); },
                    params: {
                      "objId":
                      {
                          param: GameCreator.GlobalObjectParameter,
                          mandatory: false,
                          defaultValue: 'this',
                          observer: 'counter'
                      },
                      "counter":
                      {
                          param: GameCreator.CounterParameter,
                          mandatory: true,
                      },
                      "type":
                      {
                          param: GameCreator.CounterChangeTypeParameter,
                          mandatory: false,
                          defaultValue: 'add',
                      },
                      "value":
                      {
                          param: GameCreator.NumberParameter,
                          mandatory: false,
                          defaultValue: 1,
                      },
                    },
                    name: "Counter",
                    timing: {at: true, every: true, after: true},
                  }),
      SwitchState:  new GameCreator.Action({
                      action: function(params) {GameCreator.changeState(this, params); },
                      params: {
                        'objectId':
                        {
                            param: GameCreator.GlobalObjectParameter,
                            mandatory: true,
                            defaultValue: 'this',
                            observer: 'objectState'
                        },
                        "objectState":
                        {
                            param: GameCreator.StateParameter,
                            mandatory: true
                        }
                      },
                    name: "SwitchState",
                    timing: {at: true, every: true, after: true},
                    runnableFunction: function() {return true; }
                  }),
      Restart: new GameCreator.Action({
                    action: GameCreator.restartGame,
                    name: "Restart",
                    timing: {at: true, every: false, after: true},
                    runnableFunction: function() {return true; }
                  }),
      SwitchScene: new GameCreator.Action({
                    action: function(params){GameCreator.selectScene(params); },
                    params: {"scene":
                                {param: GameCreator.SwitchSceneParameter,
                                    mandatory: true,
                                    component: SceneParam
                                }
                            },
                    name: "SwitchScene",
                    timing: {at: true, every: true, after: true},
                    runnableFunction: function() {return true;}
                  }),
      NextScene: new GameCreator.Action({
                    action: GameCreator.nextScene,
                    name: "NextScene",
                    timing: {at: true, every: true, after: true},
                    runnableFunction: function() {return true;}
                  }),
      Teleport: new GameCreator.Action({
          action: function (params) { this.parent.setPosition.call(this, params); },
          params: {
              'type': { param: GameCreator.MovementTypeParameter, mandatory: true },
              'x': { param: GameCreator.RangeParameter, mandatory: false, defaultValue: 0 },
              'y': { param: GameCreator.RangeParameter, mandatory: false, defaultValue: 0 }
          },
          name: "Teleport",
          timing: { at: true, every: true, after: true },
          runnableFunction: function () { return true; }
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
    },

    nonObjectActions: {
        Create: GameCreator.actions.Create,
        Restart: GameCreator.actions.Restart,
        SwitchScene: GameCreator.actions.SwitchScene,
        NextScene: GameCreator.actions.NextScene,
        SwitchState: GameCreator.actions.SwitchState
    }
};

}());