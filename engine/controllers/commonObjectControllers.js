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
        object.setupStatesForm = GameCreator.commonObjectControllers.setupStatesForm;
        object.setupCountersForm = GameCreator.commonObjectControllers.setupCountersForm;
        object.setupCollisionsForm = GameCreator.commonObjectControllers.setupCollisionsForm;
    },

    addPlayerObjectControllers: function(object) {
        GameCreator.commonObjectControllers.addCommonObjectControllers(object);
        object.setupKeyEventsForm = GameCreator.commonObjectControllers.setupKeyEventsForm;
    },


    /******************************
     * COMMON OBJECT CONTROLLERS  *
     *****************************/
    setupPropertiesForm: function(container) {
        var globalObj = this;
        var html = '<div id="edit-global-object-properties-content">' +
            this.getPropertiesForm() +
            '</div>';
        container.html(html);
        container.find("#save-global-object-properties-button").on("click", function() {
            GameCreator.saveFormInputToObject("edit-global-object-properties-content", globalObj);
            GameCreator.UI.redrawLibrary();
            GameCreator.UI.closeDialogue();
        });
    },
 
    setupOnClickActionsForm: function(container) {
        var text = "Actions on click";
        var choosableActions = GameCreator.helperFunctions.getNonCollisionActions(this.objectType);

        if (this.onClickActions == undefined) {
            this.onClickActions = [];
        }

        var existingActions = this.onClickActions;
        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, this.objectName);
    },

        
    setupCollisionsForm: function(container) {
        var collisionObjects = [];
        var globalObj = this;
        for(var i = 0; i < this.onCollideEvents.length; i++) {
            collisionObjects.push(GameCreator.helperFunctions.findGlobalObjectById(this.onCollideEvents[i].id));
        }
        container.html(this.getCollisionsContent(collisionObjects));
        container.find(".collisionMenuElement").on("click", function(){
            var targetName = $(this).data("name");
            var actions = GameCreator.helperFunctions.getNonCollisionActions(globalObj.objectType);
            var targetId = GameCreator.helperFunctions.findGlobalObjectByName(targetName).id;
            var existingActions = GameCreator.helperFunctions.getObjectById(globalObj.onCollideEvents, targetId).events[0].actions;
            GameCreator.UI.createEditActionsArea(
                "Actions for collision with " + targetName, 
                actions,
                existingActions,
                $("#edit-collision-actions-object-content"),
                globalObj.objectName
            );
        });

        $("#add-new-collision-button").on("click", function() {
            $("#edit-collision-actions-object-content").html(GameCreator.htmlStrings.collisionObjectSelector(globalObj));
            $(".addCollisionObjectElement").one("click", function() {
                var targetId = GameCreator.helperFunctions.findGlobalObjectByName($(this).data("objectname")).id;
                var newEventItem = {id: targetId, events: [new GameCreator.Event()]};
                globalObj.onCollideEvents.push(newEventItem);
                globalObj.setupCollisionsForm(container);
            });
        });
    },
    
    setupOnDestroyActionsForm: function(container) {
        var text = "Actions on Destruction";
        var choosableActions = GameCreator.helperFunctions.getNonCollisionActions(this.objectType);
        
        if (this.onDestroyEvents.length === 0) {
            this.onDestroyEvents.push(new GameCreator.Event());
        }
        
        var existingActions = this.onDestroyEvents[0].actions;
        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, this.objectName);
    },

    setupOnCreateActionsForm: function(container) {
        var text = "Actions on Creation";
        var choosableActions = GameCreator.actionGroups.onCreateActions;
        
        if (this.onCreateEvents.length === 0) {
            this.onCreateEvents.push(new GameCreator.Event());
        }
        
        var existingActions = this.onCreateEvents[0].actions;

        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, this.objectName);
    },

    setupStatesForm: function(container) {
        container.html(this.getStatesContent(this.states));
        $('#state-tabs').find(".tab:first").addClass('active');
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

            var actions = GameCreator.helperFunctions.getNonCollisionActions(globalObj.objectType);
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
    setupKeyEventsForm: function(container) {
        container.html(this.getKeyEventsContent());
        var globalObj = this;
        container.find(".keyMenuElement").on("click", function(){
            var keyName = $(this).data("name");
            var actions = GameCreator.helperFunctions.getNonCollisionActions(globalObj.objectType);
            GameCreator.UI.createEditActionsArea(
                "Actions on " + keyName,
                actions,
                globalObj.keyEvents[keyName][0].actions,
                $("#edit-key-actions-key-content"),
                globalObj.objectName
            );
        });
        $("#add-new-key-button").on("click", function(){
            $("#edit-key-actions-key-content").html(globalObj.getKeySelector());
            $(".addKeyObjectElement").one("click", function() {
                globalObj.keyEvents[$(this).data("keyname")].push(new GameCreator.Event());
                globalObj.setupKeyEventsForm(container);
            });
        });
    },
}