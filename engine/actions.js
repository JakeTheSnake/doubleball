GameCreator.actions = {
    collisionSelectableActions: {"Bounce":{   action: function(params) {this.parent.bounce.call(this, params)},
                                              params: [],
                                              name: "Bounce"
                                          },
                                 "Stop":  {   action: function(params) {this.parent.stop.call(this, params)},
                                              params: [],
                                              name: "Stop"
                                          },
    },
    
    generalSelectableActions: { "Stop":   {    action: function(params){this.parent.stop.call(this)},
                                               params: [],
                                               name: "Stop"
                                          }
    },
    
    commonSelectableActions: { "Destroy": {    action: function(params) {this.parent.destroy.call(this, params)},
                                               params: [],
                                               name: "Destroy"    
                                          },
                               "Shoot":   {    action: function(params) {this.parent.shoot.call(this, params)},
                                               params: [{    inputId: "objectToShoot",
                                                             input: function() {return GameCreator.htmlStrings.singleSelector(GameCreator.globalObjects, "objectToShoot")},
                                                             label: function() {return GameCreator.htmlStrings.inputLabel("objectToShoot", "Object to Shoot")}
                                                         }],
                                               name: "Shoot"
                                          },
                               "Nothing": {    action: function(params){},
                                               params: [],
                                               name: "Nothing"
                                          },
    },
};