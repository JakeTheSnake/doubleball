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

    GameCreator.Action.prototype.runnable = function() {return !this.isDestroyed; };

    

    GameCreator.RuntimeAction = function(name, parameters, timing) {
        this.name = name;
        this.parameters = parameters || {};
        this.timing = timing || {};
    };

    GameCreator.RuntimeAction.prototype.getAllParameters = function() {
        return GameCreator.actions[this.name].params;
    }

    GameCreator.RuntimeAction.prototype.getParameter = function(name) {
        return GameCreator.actions[this.name].params[name];
    }

    GameCreator.RuntimeAction.prototype.runAction = function(runtimeObj) {
        var timerFunction;
        if (this.timing.type === "after") {
            timerFunction = GameCreator.timerHandler.registerOffset;
        } else if (this.timing.type === "at") {
            timerFunction = GameCreator.timerHandler.registerFixed;
        } else if (this.timing.type === "every") {
            timerFunction = GameCreator.timerHandler.registerInterval;
        } else {
            if (GameCreator.actions[this.name].runnable.call(runtimeObj)) {
                GameCreator.actions[this.name].action.call(runtimeObj, this.parameters);
            }
            return;
        }

        (function(thisAction, thisRuntimeObj) {
            timerFunction(
                GameCreator.helpers.getRandomFromRange(thisAction.timing.time),
                function() {
                    if (GameCreator.actions[thisAction.name].runnable.call(thisRuntimeObj)) {
                        GameCreator.actions[thisAction.name].action.call(thisRuntimeObj, thisAction.parameters);
                        return true;
                    } else {
                        return false;
                    }
                });
        })(this, runtimeObj);
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
                          params: [{    inputId: "effect",
                                     input: function() {return GameCreator.htmlStrings.singleSelector("effect", $.extend({"None": "None"}, GameCreator.effects.destroyEffects)); },
                                     label: function() {return GameCreator.htmlStrings.inputLabel("effect", "Effect"); }
                                 }],
                          name: "Destroy",
                          timing: {at: true, every: false, after: true},
                        }),
          Shoot:   new GameCreator.Action({    
                          action: function(params) {this.parent.shoot.call(this, params); },
                          params: [{    inputId: "objectToShoot",
                                     input: function() {return GameCreator.htmlStrings.singleSelector("objectToShoot", GameCreator.globalObjects); },
                                     label: function() {return GameCreator.htmlStrings.inputLabel("objectToShoot", "Object"); }
                                 },
                                 {   inputId: "projectileSpeed",
                                     input: function() {return GameCreator.htmlStrings.rangeInput("projectileSpeed", "", "500"); },
                                     label: function() {return GameCreator.htmlStrings.inputLabel("projectileSpeed", "Speed") + '<br style="clear: both"/>'; }
                                 },
                                 {
                                    inputId: "projectileDirection",
                                    input: function() {return GameCreator.htmlStrings.singleSelector("projectileDirection", $.extend(GameCreator.directions,
                                                                                                                            GameCreator.getUniqueIDsInActiveScene())); },
                                    label: function() {return GameCreator.htmlStrings.inputLabel("projectileDirection", "Direction"); }
                                 }],
                          name: "Shoot",
                          timing: {at: true, every: true, after: true},
                        }),
          Create:   new GameCreator.Action({    
                          action: function(params) {GameCreator.createRuntimeObject(params, {}); },
                          params: {"objectToCreate": 
                                    {param: GameCreator.SceneObjectParameter,
                                    mandatory: true},
                                   "x": 
                                   {param: GameCreator.NumberParameter,
                                    mandatory: false,
                                    defaultValue: 0},
                                   "y": 
                                   {param: GameCreator.NumberParameter,
                                    mandatory: false,
                                    defaultValue: 0}
                                  },
                          name: "Create",
                          timing: {at: true, every: true, after: true},
                          runnableFunction: function() { return true; }
                        }),
          Counter:  new GameCreator.Action({
                          action: function(params) {GameCreator.changeCounter(this, params); },
                          params: [{
                                  inputId: "counterObject",
                                  input: function() {return GameCreator.UI.setupSingleSelectorWithListener(
                                      "counterObject",
                                      $.extend({"this": "this"}, GameCreator.getUniqueIDsInActiveScene()),
                                      "change",
                                      function(){$("#counterName").replaceWith(GameCreator.htmlStrings.singleSelector("counterName", GameCreator.getCountersForGlobalObj($(this).val()))); }
                                      ); },
                                  label: function() {return GameCreator.htmlStrings.inputLabel("counterObject", "Object"); }
                              },
                              {
                                  inputId: "counterName",
                                  input: function(thisName){return GameCreator.htmlStrings.singleSelector("counterName", GameCreator.getCountersForGlobalObj(thisName)); },
                                  label: function(){return GameCreator.htmlStrings.inputLabel("counterName", "Counter"); }
                              },
                              {
                                  inputId: "counterType",
                                  input: function(){return GameCreator.htmlStrings.singleSelector("counterType", {"Set":"set", "Change":"change" }); },
                                  label: function(){return GameCreator.htmlStrings.inputLabel("counterType", "Type"); }
                              },
                              {
                                  inputId: "counterValue",
                                  input: function(){return GameCreator.htmlStrings.rangeInput("counterValue", "value", "1"); },
                                  label: function(){return GameCreator.htmlStrings.inputLabel("counterValue", "Value") + '<br style="clear: both"/>'; }
                              }
                            ],
                        name: "Counter",
                        timing: {at: true, every: true, after: true},
                      }),
          SwitchState:  new GameCreator.Action({
                          action: function(params) {GameCreator.changeState(this, params); },
                          params: [{
                                  inputId: "objectId",
                                  input: function() {return GameCreator.UI.setupSingleSelectorWithListener(
                                      "objectId",
                                      $.extend({"this": "this"}, GameCreator.getUniqueIDsInActiveScene()),
                                      "change",
                                      function(){$("#stateId").replaceWith(GameCreator.htmlStrings.singleSelector("stateId", GameCreator.getStatesForGlobalObj($(this).val()))); }
                                      ); },
                                  label: function() {return GameCreator.htmlStrings.inputLabel("objectId", "Object"); }
                              },
                              {
                                  inputId: "stateId",
                                  input: function(thisName){return GameCreator.htmlStrings.singleSelector("stateId", GameCreator.getStatesForGlobalObj(thisName)); },
                                  label: function(){return GameCreator.htmlStrings.inputLabel("stateId", "State"); }
                              },

                            ],
                        name: "SwitchState",
                        timing: {at: true, every: false, after: true},
                      }),
          Restart: new GameCreator.Action({
                        action: GameCreator.restartGame,
                        name: "Restart",
                        timing: {at: true, every: false, after: true},
                        runnableFunction: function() {return true; }
                      }),
          SwitchScene: new GameCreator.Action({
                                action: function(params){GameCreator.selectScene(params); },
                                params: [{
                                                inputId: "changeType",
                                                input: function(){return GameCreator.htmlStrings.singleSelector("changeType", {increment: "increment", decrement: "decrement", setScene: "setScene"}); },
                                                label: function(){return GameCreator.htmlStrings.inputLabel("changeType", "Type"); }
                                                },
                                                {
                                                    inputId: "changeValue",
                                                    input: function(){return GameCreator.htmlStrings.numberInput("changeValue", "changeValue", "1"); },
                                                    label: function(){return GameCreator.htmlStrings.inputLabel("changeValue", "Value"); }
                                                }
                                    ],
                                name: "SwitchScene",
                                timing: {at: true, every: true, after: true},
                              runnableFunction: function() {return true;}
                            })
    };

    GameCreator.actionGroups = {
        collisionActions: {
            Bounce: GameCreator.actions.Bounce,
            Stop: GameCreator.actions.Stop,
            Destroy: GameCreator.actions.Destroy,
            Shoot: GameCreator.actions.Shoot,
            Create: GameCreator.actions.Create,
            Counter: GameCreator.actions.Counter,
            Restart: GameCreator.actions.Restart,
            SwitchScene: GameCreator.actions.SwitchScene,
            SwitchState: GameCreator.actions.SwitchState,
        },

        mouseCollisionActions: {
            Destroy: GameCreator.actions.Destroy,
            Shoot: GameCreator.actions.Shoot,
            Create: GameCreator.actions.Create,
            Counter: GameCreator.actions.Counter,
            Restart: GameCreator.actions.Restart,
            SwitchScene: GameCreator.actions.SwitchScene,
            SwitchState: GameCreator.actions.SwitchState,
        },

        nonCollisionActions: {
            Stop: GameCreator.actions.Stop,
            Destroy: GameCreator.actions.Destroy,
            Shoot: GameCreator.actions.Shoot,
            Create: GameCreator.actions.Create,
            Counter: GameCreator.actions.Counter,
            Restart: GameCreator.actions.Restart,
            SwitchScene: GameCreator.actions.SwitchScene,
            SwitchState: GameCreator.actions.SwitchState,
        },

        mouseNonCollisionActions: {
            Destroy: GameCreator.actions.Destroy,
            Shoot: GameCreator.actions.Shoot,
            Create: GameCreator.actions.Create,
            Counter: GameCreator.actions.Counter,
            Restart: GameCreator.actions.Restart,
            SwitchScene: GameCreator.actions.SwitchScene,
            SwitchState: GameCreator.actions.SwitchState,
        }
    };
}());