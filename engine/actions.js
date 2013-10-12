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
                                                             label: function() {return GameCreator.htmlStrings.inputLabel("objectToShoot", "Object to Shoot")}
                                                         },
                                                         {   inputId: "projectileSpeed",
                                                             input: function() {return GameCreator.htmlStrings.rangeInput("projectileSpeed", "", "500")},
                                                             label: function() {return GameCreator.htmlStrings.inputLabel("projectileSpeed", "Projectile Speed")}
                                                         }],
                                               name: "Shoot",
                                               excludes: []
                                          }
    },
};