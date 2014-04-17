GameCreator.commonObjectControllers = {
    
    addCounterObjectControllers: function(object) {
        object.setupPropertiesForm = GameCreator.commonObjectControllers.setupPropertiesForm;  
    },

    addCommonObjectControllers: function(object) {
        GameCreator.commonObjectControllers.addCounterObjectControllers(object);
        object.setupOnClickActionsForm = GameCreator.commonObjectControllers.setupOnClickActionsForm;
        object.setupOnDestroyActionsForm = GameCreator.commonObjectControllers.setupOnDestroyActionsForm;
        object.setupOnCreateActionsForm = GameCreator.commonObjectControllers.setupOnCreateActionsForm;
        object.setupEditCounterEvents = GameCreator.commonObjectControllers.setupEditCounterEvents;
        object.setupCountersForm = GameCreator.commonObjectControllers.setupCountersForm;
        object.setupCollisionsForm = GameCreator.commonObjectControllers.setupCollisionsForm;
    },

    addPlayerObjectControllers: function(object) {
        GameCreator.commonObjectControllers.addCommonObjectControllers(object);
        object.setupKeyActionsForm = GameCreator.commonObjectControllers.setupKeyActionsForm;
    },


    /******************************
     * COMMON OBJECT CONTROLLERS  *
     *****************************/
    setupPropertiesForm: function(container) {
        var html = '<div id="edit-global-object-properties-content">' +
        this.getPropertiesForm() +
        '</div>';
        container.html(html);
        container.find("#save-global-object-properties-button").on("click", function() {
            GameCreator.saveFormInputToObject("edit-global-object-properties-content", this);
            GameCreator.UI.redrawLibrary();
            GameCreator.UI.closeDialogue();
        });
    },
 
    setupOnClickActionsForm: function(container) {
        var text = "Actions on click";
        var choosableActions;
        if (this.objectType === "MouseObject") {
            choosableActions = GameCreator.actionGroups.mouseNonCollisionActions;
        } else {
            choosableActions = GameCreator.actionGroups.nonCollisionActions;
        }

        if (this.onClickActions == undefined) {
            this.onClickActions = [];
        }

        var existingActions = this.onClickActions;
        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, this.objectName);
    },

        
    setupCollisionsForm: function(container) {
        var collisionObjects = [];
        for(var i = 0; i < this.collisionActions.length; i++) {
            collisionObjects.push(GameCreator.helperFunctions.findGlobalObjectById(this.collisionActions[i].id));
        }
        container.html(this.getCollisionsContent(collisionObjects));
        container.find(".collisionMenuElement").on("click", function(){
            var targetName = $(this).data("name");
            var actions;
            if (this.objectType === "mouseObject") {
                actions = GameCreator.actionGroups.mouseCollisionActions;
            } else {
                actions = GameCreator.actionGroups.collisionActions;
            }
            var targetId = GameCreator.helperFunctions.findGlobalObjectByName(targetName).id;
            var existingActions = GameCreator.helperFunctions.getObjectById(this.collisionActions, targetId).actions;
            GameCreator.UI.createEditActionsArea(
                "Actions for collision with " + targetName, 
                actions,
                existingActions,
                $("#edit-collision-actions-object-content"),
                this.objectName
            );
        });

        $("#add-new-collision-button").on("click", function() {
            $("#edit-collision-actions-object-content").html(GameCreator.htmlStrings.collisionObjectSelector(this));
            $(".addCollisionObjectElement").one("click", function() {
                var targetId = GameCreator.helperFunctions.findGlobalObjectByName($(this).data("objectname")).id;
                var newActionItem = {id: targetId, actions: []};
                this.collisionActions.push(newActionItem);
                this.setupCollisionsForm(container);
            });
        });
    },
    
    setupOnDestroyActionsForm: function(container) {
        var text = "Actions on Destruction";
        var choosableActions = GameCreator.actionGroups.onCreateActions;
        if (this.objectType === "MouseObject") {
            choosableActions = GameCreator.actionGroups.mouseNonCollisionActions;
        } else {
            choosableActions = GameCreator.actionGroups.nonCollisionActions;
        }
        
        if (this.onDestroyActions == undefined) {
            this.onDestroyActions = [];
        }
        
        var existingActions = this.onDestroyActions;
        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, this.objectName);
    },

    setupOnCreateActionsForm: function(container) {
        var text = "Actions on Creation";
        var choosableActions = GameCreator.actionGroups.onCreateActions;
        
        //If onCreateActions has not yet been edited from anywhere, instantiate to empty array.
        if (this.onCreateActions == undefined) {
            this.onCreateActions = [];
        }
        
        var existingActions = this.onCreateActions;
        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, this.objectName);
    },
    
    setupCountersForm: function(container) {
       container.html(this.getCountersContent());
       var globalObj = this;
       $("#add-new-counter-button").on("click", function(){
            $("#edit-counters-counter-content").html(GameCreator.htmlStrings.createCounterForm());
            $("#edit-counters-counter-content .saveButton").one("click", function(){
                var counterName = $("#edit-counters-counter-content #counter-name").val();
                globalObj.parentCounters[counterName] = new GameCreator.Counter();
                globalObj.setupCountersForm(container);
            });
        });
        container.find(".counterMenuElement").on("click", function(){
          var counterName = $(this).data("name");
          globalObj.setupEditCounterEvents(counterName, $("#edit-counter-event-content"));
      });
    },
    
    setupEditCounterEvents: function(counterName, container) {
        container.html(this.getCounterEventsContent(counterName));
        var globalObj = this;
        $("#edit-counter-event-actions-content").html("");
        $("#add-new-counter-event-button").on("click", function(){
            $("#edit-counter-event-actions-content").html(GameCreator.htmlStrings.createCounterEventForm());
            $("#edit-counter-event-value-field").hide();
            $("#edit-counter-event-actions-content .saveButton").one("click", function(){
                var eventType = $("#edit-counter-event-actions-content #edit-counter-event-type").val();
                var eventValue = $("#edit-counter-event-actions-content #edit-counter-event-value").val();
                globalObj.parentCounters[counterName][eventType][eventValue] = [];
                globalObj.setupEditCounterEvents(counterName, container);
            });
        });
        
        container.find(".counterEventMenuElement").on("click", function() {
            var eventType = $(this).data("type");
            var eventValue = $(this).data("value");
            var existingActions;

            //If there is no eventValue it's an onIncrease or onDecrease event.
            if (eventValue) {
                existingActions = globalObj.parentCounters[counterName][eventType][eventValue];
            } else {
                existingActions = globalObj.parentCounters[counterName][eventType];
            }

            var actions;
            if (globalObj.objectType === "MouseObject") {
                actions = GameCreator.actionGroups.mouseNonCollisionActions;
            } else {
                actions = GameCreator.actionGroups.nonCollisionActions;
            }
            GameCreator.UI.createEditActionsArea(
                "Actions on " + eventType + " " + eventValue,
                actions,
                existingActions,
                $("#edit-counter-event-actions-content"),
                globalObj.objectName
            );
        }); 
    },


    /******************************
     * PLAYER OBJECT CONTROLLERS  *
     *****************************/
    setupKeyActionsForm: function(container) {
        container.html(this.getKeyActionsContent());
        var globalObj = this;
        container.find(".keyMenuElement").on("click", function(){
            var keyName = $(this).data("name");
            var actions;
        if (globalObj.objectType === "MouseObject") {
            actions = GameCreator.actionGroups.mouseNonCollisionActions;
        } else {
            actions = GameCreator.actionGroups.nonCollisionActions;
        }
            GameCreator.UI.createEditActionsArea(
                "Actions on " + keyName,
                actions,
                globalObj.keyActions[keyName],
                $("#edit-key-actions-key-content"),
                globalObj.objectName
            );
        });
        $("#add-new-key-button").on("click", function(){
            $("#edit-key-actions-key-content").html(globalObj.getKeySelector());
            $(".addKeyObjectElement").one("click", function() {
                globalObj.keyActions[$(this).data("keyname")] = [];
                globalObj.setupKeyActionsForm(container);
            });
        });
    },
}