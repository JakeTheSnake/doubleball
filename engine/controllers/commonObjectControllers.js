GameCreator.commonObjectControllers = {
    
    addCounterObjectControllers: function(object) {
        object.setupPropertiesForm = GameCreator.commonObjectControllers.setupPropertiesForm;
        object.setupStatesForm = GameCreator.commonObjectControllers.setupStatesForm;
        object.setupEditStateForm = GameCreator.commonObjectControllers.setupEditStateForm;
    },

    addCommonObjectControllers: function(object) {
        object.setupOnClickActionsForm = GameCreator.commonObjectControllers.setupOnClickActionsForm;
        object.setupOnDestroyActionsForm = GameCreator.commonObjectControllers.setupOnDestroyActionsForm;
        object.setupOnCreateActionsForm = GameCreator.commonObjectControllers.setupOnCreateActionsForm;
        object.setupEditCounterEvents = GameCreator.commonObjectControllers.setupEditCounterEvents;
        object.setupStatesForm = GameCreator.commonObjectControllers.setupStatesForm;
        object.setupEditStateForm = GameCreator.commonObjectControllers.setupEditStateForm;
        object.setupCountersForm = GameCreator.commonObjectControllers.setupCountersForm;
        object.setupPropertiesForm = GameCreator.commonObjectControllers.setupPropertiesForm;
        object.setupCollisionsForm = GameCreator.commonObjectControllers.setupCollisionsForm;
        object.setupEventsForm = GameCreator.commonObjectControllers.setupEventsForm;
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
        var html = this.getPropertiesContent();
        container.html(html);
        container.find("#save-global-object-properties-button").on("click", function() {
            GameCreator.saveFormInputToObject("object-properties-content", GameCreator.helpers.getObjectById(globalObj.states, 0).attributes);
            GameCreator.saveFormInputToObject("object-non-state-properties-content", globalObj);
            GameCreator.UI.redrawLibrary();
            GameCreator.UI.closeDialogue();
        });
    },
 
    setupOnClickActionsForm: function(container) {
        var text = "Actions on click";
        var choosableActions = GameCreator.helpers.getNonCollisionActions(this.objectType);

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
            collisionObjects.push(GameCreator.helpers.findGlobalObjectById(this.onCollideEvents[i].id));
        }
        container.html(this.getCollisionsContent(collisionObjects));
        container.find(".collisionMenuElement").on("click", function(){
            var targetName = $(this).data("name");
            var actions = GameCreator.helpers.getNonCollisionActions(globalObj.objectType);
            var targetId = GameCreator.helpers.findGlobalObjectByName(targetName).id;
            var existingActions = GameCreator.helpers.getObjectById(globalObj.onCollideEvents, targetId).events[0].actions;
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
                var targetId = GameCreator.helpers.findGlobalObjectByName($(this).data("objectname")).id;
                var newEventItem = {id: targetId, events: [new GameCreator.ConditionActionSet()]};
                globalObj.onCollideEvents.push(newEventItem);
                globalObj.setupCollisionsForm(container);
            });
        });
    },
    
    setupOnDestroyActionsForm: function(container) {
        var text = "Actions on Destruction";
        var choosableActions = GameCreator.helpers.getNonCollisionActions(this.objectType);
        
        if (this.onDestroyEvents.length === 0) {
            this.onDestroyEvents.push(new GameCreator.ConditionActionSet());
        }
        
        var existingActions = this.onDestroyEvents[0].actions;
        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, this.objectName);
    },

    setupOnCreateActionsForm: function(container, selectedSet) {
        var text = "Actions on Creation";
        var choosableActions = GameCreator.actionGroups.onCreateActions;
        
        if (this.onCreateSets.length === 0) {
            var caSet = new GameCreator.ConditionActionSet();
            caSet.addCondition(new GameCreator.RuntimeCondition("exists", {objId: 1, count: 6}));
            caSet.addCondition(new GameCreator.RuntimeCondition("exists", {objId: 2, count: 7}));
            caSet.actions.push(new GameCreator.RuntimeAction("Create", {objectToCreate: 'red_ball', x: 200, y: 100}));
            this.onCreateSets.push(caSet);
            var caSet2 = new GameCreator.ConditionActionSet();
            caSet2.addCondition(new GameCreator.RuntimeCondition("exists", {objId: 1, count: 8}));
            caSet2.addCondition(new GameCreator.RuntimeCondition("exists", {objId: 2, count: 9}));
            caSet2.actions.push(new GameCreator.RuntimeAction("Create", {objectToCreate: 'red_ball', x: 300, y: 400}));
            this.onCreateSets.push(caSet2);
        }

        var caSetVMs = [];

        for (var i = 0; i < this.onCreateSets.length; i++) {
            caSetVMs.push(new GameCreator.CASetVM(this.onCreateSets[i]));
        }

        var html = GameCreator.htmlStrings.getColumn('When', 'dialogue-panel-conditions');
        html += GameCreator.htmlStrings.getColumn('Do', 'dialogue-panel-actions');
        //html += GameCreator.htmlStrings.getSelectionColumn(this.onCreateSets[selectedSet]);
        
        container.html(html);

        var conditionsColumn = $("#dialogue-panel-conditions");
        for (i = 0; i < caSetVMs.length; i+=1) {
            $(conditionsColumn).append(caSetVMs[i].getPresentation());
        }

        $("#dialogue-panel-conditions").on('redrawList', function(evt, activeCASetVM){
            var isActive;
            conditionsColumn.html('');
            for (i = 0; i < caSetVMs.length; i+=1) {
                isActive = activeCASetVM === caSetVMs[i];
                $(conditionsColumn).append(caSetVMs[i].getPresentation(isActive));
            }
        })
        // Setup listeners
    },

    setupStatesForm: function(container, selectedState) {
        selectedState = (selectedState ? selectedState : 0);
        var globalObj = this;
        container.html(this.getStatesContent(this.states));
        $('#state-tabs').find('.tab[data-state="' + selectedState + '"]').addClass('active');
        $('#state-tabs').on('click', '.tab:not(#add-state-tab)', function(){
            $('.state-tab').removeClass('active');
            $(this).addClass('active');
            globalObj.setupEditStateForm($('#state-content'), $(this).data('state'));
        });
        $('#add-state-tab').on('click', function(){
            globalObj.createState('State ' + globalObj.states.length, $.extend({}, globalObj.getDefaultState().attributes));
            globalObj.setupStatesForm(container, globalObj.states.length - 1);
        });
        this.setupEditStateForm($('#state-content'), selectedState);
    },

    setupEditStateForm: function(container, stateId) {
        var globalObj = this;
        var html = globalObj.getPropertiesForm(stateId);
        var state = globalObj.getState(stateId);
        container.html(html);
        var attributeNames = Object.keys(state.attributes);
        if(stateId != 0) {
            for(var i = 0; i < attributeNames.length; i += 1) {
                $('#state-content [data-attrname="' + attributeNames[i] + '"]').after('<span class="remove-attribute-button" data-attribute="' + attributeNames[i] + '">X</span>');
            }
            container.find('.remove-attribute-button').on('click', function() {
                globalObj.removeAttributeFromState($(this).data('attribute'), stateId);
                globalObj.setupEditStateForm(container, stateId);
            });
            container.append('<button class="regularButton" id="reset-attributes-button">Reset Attributes</button>');
            $('#reset-attributes-button').on('click', function(){
                globalObj.resetStateAttributes(stateId);
                globalObj.setupEditStateForm(container, stateId);
            });
        }
        $('#save-global-object-properties-button').on('click', function() {
            GameCreator.saveFormInputToObject("object-properties-content", state.attributes);
            GameCreator.saveFormInputToObject("object-non-state-properties-content", globalObj);
            GameCreator.UI.redrawLibrary();
        });
    },

    setupEventsForm: function(container) {
        var globalObj = this;
        var html = this.getEventsContent();
        container.html(html);

        $("#dialogue-panel-events").find("li").on("click", function() {
            globalObj[$(this).data("uifunction")]($("#dialogue-events-content"));
            $(this).parent().find("li").removeClass("active");
            $(this).addClass("active");
        });
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

            var actions = GameCreator.helpers.getNonCollisionActions(globalObj.objectType);
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
            var actions = GameCreator.helpers.getNonCollisionActions(globalObj.objectType);
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
                globalObj.keyEvents[$(this).data("keyname")].push(new GameCreator.ConditionActionSet());
                globalObj.setupKeyEventsForm(container);
            });
        });
    },
}