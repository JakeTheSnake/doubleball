GameCreator.Action = function(args) {
    this.action = args.action;
    this.params = args.params || [];
    this.timing = args.timing;
    this.name = args.name;
    this.excludes = args.excludes || [];
    if (args.runnableFunction) {
        this.runnable = args.runnableFunction;
    }
}

GameCreator.Action.prototype.runnable = function() {return !this.isDestroyed;}

GameCreator.RuntimeAction = function(name, parameters, timing) {
    this.actionName = name;
    this.parameters = parameters || {};
    this.timing = timing || {};
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
        if(GameCreator.actions[this.actionName].runnable.call(runtimeObj)) {
          GameCreator.actions[this.actionName].action.call(runtimeObj, this.parameters);
        }
        return;
    }

    (function(thisRuntimeObj) {
    timerFunction(
        GameCreator.helperFunctions.getRandomFromRange(thisRuntimeObj.timing.time),
        function() {
            if (GameCreator.actions[thisRuntimeObj.actionName].runnable.call(thisRuntimeObj)) {
                GameCreator.actions[thisRuntimeObj.actionName].action.call(thisRuntimeObj, thisRuntimeObj.parameters);
                return true;
            } else {
                return false;
            }
        });
  })(this);
}

GameCreator.actions = {
      Bounce: new GameCreator.Action(
                    {
                      action: function(params) {this.parent.bounce.call(this, params)},
                      name: "Bounce",
                      excludes: ["Stop", "Destroy", "Bounce"],
                      timing: {at: false, every: false, after: false}
                    }
                  )
                ,
      Stop:  new GameCreator.Action(
                    {   
                      action: function(params) {this.parent.stop.call(this, params)},
                      name: "Stop",
                      excludes: ["Bounce", "Destroy", "Stop"],
                      timing: {at: false, every: false, after: false},
                    }
                  )
                ,

      Destroy: new GameCreator.Action(
                    {  
                      action: function(params) {this.parent.destroy.call(this, params)},
                      name: "Destroy",
                      excludes: ["Bounce", "Stop", "Destroy"],
                      timing: {at: true, every: false, after: true},
                    }
                  )
                ,
      Shoot:   new GameCreator.Action(
                    {    
                      action: function(params) {this.parent.shoot.call(this, params)},
                      params: [{    inputId: "objectToShoot",
                                 input: function() {return GameCreator.htmlStrings.singleSelector("objectToShoot", GameCreator.globalObjects)},
                                 label: function() {return GameCreator.htmlStrings.inputLabel("objectToShoot", "Object")}
                             },
                             {   inputId: "projectileSpeed",
                                 input: function() {return GameCreator.htmlStrings.rangeInput("projectileSpeed", "", "500")},
                                 label: function() {return GameCreator.htmlStrings.inputLabel("projectileSpeed", "Speed") + '<br style="clear: both"/>'}
                             },
                             {
                                inputId: "projectileDirection",
                                input: function() {return GameCreator.htmlStrings.singleSelector("projectileDirection", $.extend(GameCreator.directions,
                                                                                                                        GameCreator.getUniqueIDsInScene()))},
                                label: function() {return GameCreator.htmlStrings.inputLabel("projectileDirection", "Direction")}
                             }],
                      name: "Shoot",
                      timing: {at: true, every: true, after: true},
                    }
                  )
                ,
      Create:   new GameCreator.Action(
                    {    
                      action: function(params){GameCreator.createRuntimeObject(params, {})},
                      params: [{
                                inputId: "objectToCreate",
                                input: function() {return GameCreator.htmlStrings.singleSelector("objectToCreate", GameCreator.getGlobalObjects())},
                                label: function() {return GameCreator.htmlStrings.inputLabel("objectToCreate", "Object")}
                             },
                             {
                                inputId: "x",
                                input: function() {return GameCreator.htmlStrings.rangeInput("x", "x", "")},
                                label: function() {return GameCreator.htmlStrings.inputLabel("x", "X") + '<br style="clear: both"/>'}
                             },
                            {
                                inputId: "y",
                                input: function() {return GameCreator.htmlStrings.rangeInput("y", "y", "")},
                                label: function() {return GameCreator.htmlStrings.inputLabel("y", "Y") + '<br style="clear: both"/>'}
                             }],
                      name: "Create",
                      timing: {at: true, every: true, after: true},
                      runnableFunction: function() {return true;}
                    }
                  )
                ,
      Counter:	new GameCreator.Action(
                    {
                      action: function(params){GameCreator.changeCounter(this, params)},
                      params: [{
                              inputId: "counterObject",
                              input: function(thisName) {return GameCreator.UI.setupSingleSelectorWithListener(
                                  "counterObject", 
                                  $.extend({"this": thisName}, GameCreator.getUniqueIDsInScene()), 
                                  "change", 
                                  function(){$("#counter-name").replaceWith(GameCreator.htmlStrings.singleSelector("counterName", GameCreator.getCountersForGlobalObj($(this).val())))}
                                  )},
                              label: function() {return GameCreator.htmlStrings.inputLabel("counterObject", "Object")}
                          },
                          {
                              inputId: "counterName",
                              input: function(thisName){return GameCreator.htmlStrings.singleSelector("counterName", GameCreator.getCountersForGlobalObj(thisName))},
                              label: function(){return GameCreator.htmlStrings.inputLabel("counterName", "Counter")}
                          },
                          {
                              inputId: "counterType",
                              input: function(){return GameCreator.htmlStrings.singleSelector("counterType", {"Set":"set", "Change":"change" })},
                              label: function(){return GameCreator.htmlStrings.inputLabel("counterType", "Type")}
                          },
                          {
                              inputId: "counterValue",
                              input: function(){return GameCreator.htmlStrings.rangeInput("counterValue", "value", "1")},
                              label: function(){return GameCreator.htmlStrings.inputLabel("counterValue", "Value") + '<br style="clear: both"/>'}
                          }
                        ],
                    name: "Counter",
                    timing: {at: true, every: true, after: true},
                  }
                )
              ,
      Restart: new GameCreator.Action(
                  {
                    action: GameCreator.restartGame,
                    name: "Restart",
                    excludes: ["Bounce", "Destroy", "Stop", "SwitchScene"],
                    timing: {at: true, every: false, after: true},
                    runnableFunction: function() {return true;}
                  }
                )
              ,
      SwitchScene: new GameCreator.Action(
                        {
                        	action: function(params){GameCreator.selectScene(params)},
                        	params: [{
                          					inputId: "changeType",
                          					input: function(){return GameCreator.htmlStrings.singleSelector("changeType", {increment: "increment", decrement: "decrement", setScene: "setScene"})},
                          					label: function(){return GameCreator.htmlStrings.inputLabel("changeType", "Type")}
                        					},
                        					{
                        						inputId: "changeValue",
                        						input: function(){return GameCreator.htmlStrings.numberInput("changeValue", "changeValue", "1")},
                        						label: function(){return GameCreator.htmlStrings.inputLabel("changeValue", "Value")}
                        					}
                        		],
                        	name: "SwitchScene",
                        	excludes: ["Bounce", "Destroy", "Stop", "Restart"],
                        	timing: {at: true, every: true, after: true},
                          runnableFunction: function() {return true;}
                        }
                      )
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
  },
  mouseCollisionActions: {
      Destroy: GameCreator.actions.Destroy,
      Shoot: GameCreator.actions.Shoot,
      Create: GameCreator.actions.Create,
      Counter: GameCreator.actions.Counter,
      Restart: GameCreator.actions.Restart,
      SwitchScene: GameCreator.actions.SwitchScene,
  },
  nonCollisionActions: {
      Stop: GameCreator.actions.Stop,
      Destroy: GameCreator.actions.Destroy,
      Shoot: GameCreator.actions.Shoot,
      Create: GameCreator.actions.Create,
      Counter: GameCreator.actions.Counter,
      Restart: GameCreator.actions.Restart,
      SwitchScene: GameCreator.actions.SwitchScene,
  },
  mouseNonCollisionActions: {
      Destroy: GameCreator.actions.Destroy,
      Shoot: GameCreator.actions.Shoot,
      Create: GameCreator.actions.Create,
      Counter: GameCreator.actions.Counter,
      Restart: GameCreator.actions.Restart,
      SwitchScene: GameCreator.actions.SwitchScene,
	},
	onCreateActions: {
      Destroy: GameCreator.actions.Destroy,
      Shoot: GameCreator.actions.Shoot,
      Create: GameCreator.actions.Create,
      Counter: GameCreator.actions.Counter,
	}
}