GameCreator.actions = {
    collisionSelectableActions: {"Bounce":{   action: function(params) {this.parent.bounce.call(this, params)},
                                              params: [],
                                              name: "Bounce",
                                              excludedBy: ["Stop", "Destroy"]
                                          },
                                 "Stop":  {   action: function(params) {this.parent.stop.call(this, params)},
                                              params: [],
                                              name: "Stop",
                                              excludedBy: ["Bounce", "Destroy"]
                                          },
    },
    
    generalSelectableActions: { "Stop":   {    action: function(params){this.parent.stop.call(this)},
                                               params: [],
                                               name: "Stop",
                                               excludedBy: ["Bounce", "Destroy"]
                                          }
    },
    
    commonSelectableActions: { "Destroy": {    action: function(params) {this.parent.destroy.call(this, params)},
                                               params: [],
                                               name: "Destroy",
                                               excludedBy: ["Bounce", "Stop"]
                                          },
                               "Shoot":   {    action: function(params) {this.parent.shoot.call(this, params)},
                                               params: [{    inputId: "objectToShoot",
                                                             input: function() {return GameCreator.htmlStrings.singleSelector("objectToShoot", GameCreator.globalObjects)},
                                                             label: function() {return GameCreator.htmlStrings.inputLabel("objectToShoot", "Object to Shoot")}
                                                         },
                                                         {   inputId: "projectileSpeed",
                                                             input: function() {return GameCreator.htmlStrings.numberInput("projectileSpeed", "", "500")},
                                                             label: function() {return GameCreator.htmlStrings.inputLabel("projectileSpeed", "Projectile Speed")}
                                                         }],
                                               name: "Shoot"
                                          }
    },
};