GameCreator.actions = {
    collisionSelectableActions: {"Bounce":{   action: function(params) {this.parent.bounce.call(this, params)},
                                              params: [],
                                              name: "Bounce",
                                              excludes: ["Stop", "Destroy", "Bounce"],
                                              timing: {at: false, every: false, after: false}
                                          },
                                 "Stop":  {   action: function(params) {this.parent.stop.call(this, params)},
                                              params: [],
                                              name: "Stop",
                                              excludes: ["Bounce", "Destroy", "Stop"],
                                              timing: {at: false, every: false, after: false}
                                          },
    },
    
    generalSelectableActions: { "Stop":   {    action: function(params){this.parent.stop.call(this)},
                                               params: [],
                                               name: "Stop",
                                               excludes: ["Bounce", "Destroy", "Stop"],
                                               timing: {at: false, every: false, after: false}
                                          }
    },
    
    commonSelectableActions: { "Destroy": {    action: function(params) {this.parent.destroy.call(this, params)},
                                               params: [],
                                               name: "Destroy",
                                               excludes: ["Bounce", "Stop", "Destroy"],
                                               timing: {at: true, every: false, after: true}
                                          },
                               "Shoot":   {    action: function(params) {this.parent.shoot.call(this, params)},
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
                                               timing: {at: true, every: true, after: true}
                                          },
                              "Create":   {    action: function(params){GameCreator.createRuntimeObject(params, {})},
                                               params: [{
                                                            inputId: "objectToCreate",
                                                            input: function() {return GameCreator.htmlStrings.singleSelector("objectToCreate", GameCreator.getGlobalObjects())},
                                                            label: function() {return GameCreator.htmlStrings.inputLabel("objectToCreate", "Object")}
                                                         }],
                                               name: "Create",
                                               excludes: [],
                                               timing: {at: true, every: true, after: true}
                                          }
    },
};