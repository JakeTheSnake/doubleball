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

GameCreator.RuntimeAction.prototype.hasObservers = function(paramName) {
    var paramNames = Object.keys(this.getAllParameters());
    for (var i = 0; i < paramNames.length; i += 1) {
        if (this.getParameter(paramNames[i]).observes !== paramName) {
            return true;
        }
    }
    return false;
};

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
                                {
                                    component: DestroyEffectParam,
                                    mandatory: false,
                                    defaultValue: 'none'
                                }
                             },
                      name: "Destroy",
                      timing: {at: true, every: false, after: true},
                    }),
      Shoot:   new GameCreator.Action({    
                      action: function(params) {this.parent.shoot.call(this, params); },
                      params: {"objectToShoot":
                                {
                                    component: ShootableObjectParam,
                                    mandatory: true
                                 },
                                "projectileSpeed":
                                 {
                                    component: RangeParam,
                                    mandatory: false,
                                    defaultValue: 500
                                 },
                                "projectileDirection":
                                 {
                                     component: DirectionParam,
                                     mandatory: false,
                                     defaultValue: "Default"
                                 }
                             },
                      name: "Shoot",
                      timing: {at: true, every: true, after: true},
                    }),
      Create:   new GameCreator.Action({    
                      action: function(params) {GameCreator.createRuntimeObject(GameCreator.helpers.getGlobalObjectById(Number(params.objectToCreate)), {x: params.x, y: params.y}); },
                      params: {"objectToCreate": 
                                {
                                mandatory: true,
                                component: GlobalObjectParam},
                               "x": 
                               {
                                mandatory: false,
                                defaultValue: 0,
                                component: RangeParam},
                               "y": 
                               {
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
                          mandatory: false,
                          observer: 'counter',
                          component: CounterCarrierParam
                      },
                      "counter":
                      {
                          mandatory: true,
                          component: CounterParam,
                          observes: 'objId'
                      },
                      "type":
                      {
                          mandatory: false,
                          defaultValue: 'add',
                          component: CounterTypeParam
                      },
                      "value":
                      {
                          mandatory: false,
                          defaultValue: 1,
                          component: NumberParam
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
                            component: GlobalObjectParam,
                            mandatory: true,
                            observer: 'objectState'
                        },
                        'objectState':
                        {
                            component: StateParam,
                            observes: 'objectId',
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
                                {
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
              'type': 
              { 
                  component: MovementTypeParam,
                  defaultValue: 'absolute',
                  mandatory: true 
              },
              'x': 
              { 
                  component: RangeParam,
                  mandatory: false,
                  defaultValue: 0
              },
              'y':
              {
                  component: RangeParam,
                  mandatory: false,
                  defaultValue: 0
              }
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
        SwitchState: GameCreator.actions.SwitchState,
        Counter: GameCreator.actions.Counter,
    }
};

}());