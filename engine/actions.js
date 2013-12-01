GameCreator.actions = {
    	Bounce:{   action: function(params) {this.parent.bounce.call(this, params)},
                  params: [],
                  name: "Bounce",
                  excludes: ["Stop", "Destroy", "Bounce"],
                  timing: {at: false, every: false, after: false},
                  runnable: function(){return !this.isDestroyed;}
              },
     	Stop:  {   action: function(params) {this.parent.stop.call(this, params)},
                  params: [],
                  name: "Stop",
                  excludes: ["Bounce", "Destroy", "Stop"],
                  timing: {at: false, every: false, after: false},
                  runnable: function(){return !this.isDestroyed;}
              },

    	Destroy: {    action: function(params) {this.parent.destroy.call(this, params)},
                   params: [],
                   name: "Destroy",
                   excludes: ["Bounce", "Stop", "Destroy"],
                   timing: {at: true, every: false, after: true},
                   runnable: function(){return !this.isDestroyed;}
              },
   		Shoot:   {    action: function(params) {this.parent.shoot.call(this, params)},
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
                   excludes: [],
                   timing: {at: true, every: true, after: true},
                   runnable: function(){return !this.isDestroyed;}
              },
  		Create:   {    action: function(params){GameCreator.createRuntimeObject(params, {})},
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
                   excludes: [],
                   timing: {at: true, every: true, after: true},
                   runnable: function(){return true;}
              },
    	Counter:{		action: function(params){GameCreator.changeCounter(this, params)},
                    params: [{
                            inputId: "counterObject",
                            input: function(thisName) {return GameCreator.UI.setupSingleSelectorWithListener(
                                "counterObject", 
                                $.extend({"this": thisName}, GameCreator.getUniqueIDsInScene()), 
                                "change", 
                                function(){$("#counterName").replaceWith(GameCreator.htmlStrings.singleSelector("counterName", GameCreator.getCountersForGlobalObj($(this).val())))}
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
                    excludes: [],
                    timing: {at: true, every: true, after: true},
                    runnable: function(){return !this.isDestroyed;}
		        },
		Restart: {
			action: GameCreator.restartGame,
			params: [],
			name: "Restart",
			excludes: ["Bounce", "Destroy", "Stop"],
			timing: {at: true, every: false, after: true},
			runnable: function(){return true;}
		}
};

GameCreator.actionGroups = {
	collisionActions: {
			Bounce: GameCreator.actions.Bounce,
			Stop: GameCreator.actions.Stop,
			Destroy: GameCreator.actions.Destroy,
			Shoot: GameCreator.actions.Shoot,
			Create: GameCreator.actions.Create,
			Counter: GameCreator.actions.Counter,
			Restart: GameCreator.actions.Restart
	},
	mouseCollisionActions: {
			Destroy: GameCreator.actions.Destroy,
			Shoot: GameCreator.actions.Shoot,
			Create: GameCreator.actions.Create,
			Counter: GameCreator.actions.Counter,
			Restart: GameCreator.actions.Restart
	},
	nonCollisionActions: {
			Stop: GameCreator.actions.Stop,
			Destroy: GameCreator.actions.Destroy,
			Shoot: GameCreator.actions.Shoot,
			Create: GameCreator.actions.Create,
			Counter: GameCreator.actions.Counter,
			Restart: GameCreator.actions.Restart
	},
	mouseNonCollisionActions: {
			Destroy: GameCreator.actions.Destroy,
			Shoot: GameCreator.actions.Shoot,
			Create: GameCreator.actions.Create,
			Counter: GameCreator.actions.Counter,
			Restart: GameCreator.actions.Restart
	}
	
}