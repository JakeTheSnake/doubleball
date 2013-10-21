GameCreator.actions = {
    collisionSelectableActions: {"Bounce":{   action: function(params) {this.parent.bounce.call(this, params)},
                                              params: [],
                                              name: "Bounce",
                                              excludes: ["Stop", "Destroy", "Bounce"]
                                          },
                                 "Stop":  {   action: function(params) {this.parent.stop.call(this, params)},
                                              params: [],
                                              name: "Stop",
                                              excludes: ["Bounce", "Destroy", "Stop"]
                                          },
    },
    
    generalSelectableActions: { "Stop":   {    action: function(params){this.parent.stop.call(this)},
                                               params: [],
                                               name: "Stop",
                                               excludes: ["Bounce", "Destroy", "Stop"]
                                          }
    },
    
    commonSelectableActions: { "Destroy": {    action: function(params) {this.parent.destroy.call(this, params)},
                                               params: [],
                                               name: "Destroy",
                                               excludes: ["Bounce", "Stop", "Destroy"]
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
                                                            input: function() {return GameCreator.htmlStrings.singleSelector("projectileDirection", GameCreator.directions)},
                                                            label: function() {return GameCreator.htmlStrings.inputLabel("projectileDirection", "Direction")}
                                                         }],
                                               name: "Shoot",
                                               excludes: []
                                          }
    },
};