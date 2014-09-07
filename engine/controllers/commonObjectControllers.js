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
        var globalObjAttributes = this.getDefaultState().attributes;

        GameCreator.helpers.populateGlobalObjectPropertiesForm(globalObjAttributes, GameCreator[this.objectType].objectAttributes, 'object-properties-content');
        GameCreator.helpers.populateGlobalObjectPropertiesForm(this.attributes, GameCreator[this.objectType].objectNonStateAttributes, 'object-non-state-properties-content');
    },
        
    setupCollisionsForm: function(container) {
        var collisionObjects = [];
        var globalObj = this;
        for(var i = 0; i < this.onCollideEvents.length; i++) {
            collisionObjects.push(GameCreator.helpers.findGlobalObjectById(this.onCollideEvents[i].id));
        }

        var html = GameCreator.htmlStrings.getColumn('With', 'dialogue-panel-with');
        html += GameCreator.htmlStrings.getColumn('When', 'dialogue-panel-conditions');
        html += GameCreator.htmlStrings.getColumn('Do', 'dialogue-panel-actions');
        html += GameCreator.htmlStrings.getColumn('Select Item', 'dialogue-panel-add-list');
        container.html(html);

        GameCreator.UI.setupActionsColumn();

        $("#dialogue-panel-with").on('redrawList', function(evt) {
            $('#dialogue-panel-with').empty();
            globalObj.onCollideEvents.forEach(function(collisionItem) {
                var collisionListItem = $(document.createElement('li'));
                var globalObject = GameCreator.helpers.findGlobalObjectById(collisionItem.id);
                collisionListItem.append(GameCreator.htmlStrings.selectGlobalObjectPresentation(collisionItem.id));
                $("#dialogue-panel-with").append(collisionListItem);
                collisionListItem.on('click', function() {
                    GameCreator.UI.setupConditionsColumn(collisionItem.caSets, GameCreator.helpers.getCollisionActions(globalObject), globalObject);

                    $("#dialogue-panel-conditions").trigger('redrawList');
                });

            });

            $('#dialogue-panel-with').append('<li><button id="add-new-collision-button">Add</button></li>');

            $("#add-new-collision-button").on("click", function() {
                $("#dialogue-panel-add-list").html(GameCreator.htmlStrings.collisionObjectSelector(globalObj));
                $("#dialogue-panel-add-list li").one("click", function() {
                    var targetId = GameCreator.helpers.findGlobalObjectByName($(this).data("objectname")).id;
                    var collisionItem = {id: targetId, caSets: [new GameCreator.ConditionActionSet()]};
                    globalObj.onCollideEvents.push(collisionItem);
                    $("#dialogue-panel-with").trigger('redrawList');
                    $("#dialogue-panel-add-list").empty();
                });
            });
        });
        
        $("#dialogue-panel-with").trigger('redrawList');

        
    },

    setupOnDestroyActionsForm: function(container) {
        var selectableActions = GameCreator.helpers.getNonCollisionActions(this.objectType);
        
        GameCreator.UI.setupEditEventColumns(this.onDestroySets, container, selectableActions, this);
    },

    setupOnCreateActionsForm: function(container) {
        var selectableActions = GameCreator.helpers.getNonCollisionActions(this.objectType);
        
        GameCreator.UI.setupEditEventColumns(this.onCreateSets, container, selectableActions, this);  
    },

    setupOnClickActionsForm: function(container) {
        var selectableActions = GameCreator.helpers.getNonCollisionActions(this.objectType);
        
        GameCreator.UI.setupEditEventColumns(this.onClickSets, container, selectableActions, this);    
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
        container.html(GameCreator.htmlStrings.getColumn("Counters", "dialogue-panel-counters"));
        container.append('<div id="dialogue-counter-content"></div>');
        $("#dialogue-panel-counters").html(this.getCountersContent());
        var globalObj = this;
        $("#add-new-counter-button").on("click", function() {
            $("#dialogue-panel-counters").append(GameCreator.htmlStrings.createCounterForm());
            $("#create-counter-form button").one("click", function() {
                var counterName = $("#create-counter-form input").val();
                globalObj.parentCounters[counterName] = new GameCreator.Counter();
                GameCreator.getActiveScene().objects.forEach(function(sceneObj){
                    if(sceneObj.parent === globalObj) {
                        GameCreator.resetCounters(sceneObj, sceneObj.parent.parentCounters);
                    }
                });
                globalObj.setupCountersForm(container);
            });
        });
        container.find(".counterMenuElement").on("click", function() {
            var counterName = $(this).data("name");
            container.find(".counterMenuElement").removeClass('active');
            $(this).addClass("active");
            globalObj.setupEditCounterEvents(counterName);
        });
    },
    
    setupEditCounterEvents: function(counterName) {
        var container = $('#dialogue-counter-content');
        container.html(GameCreator.htmlStrings.getColumn('Events', "dialogue-panel-counter-events"));
        var counterEventContent = document.createElement('div');
        container.append(counterEventContent);
        $('#dialogue-panel-counter-events').html(this.getCounterEventsContent(counterName));
        var globalObj = this;
        $("#edit-counter-event-actions-content").html("");
        $("#add-new-counter-event-button").on("click", function() {
            $('#dialogue-panel-counter-events').append(GameCreator.htmlStrings.createCounterEventForm('dialogue-add-counter-event'));
            $("#edit-counter-event-value-field").hide();
            $("#dialogue-panel-counter-events .saveButton").one("click", function() {
                var eventType = $("#edit-counter-event-type").val();
                var eventValue = $("#edit-counter-event-value").val();
                globalObj.parentCounters[counterName][eventType][eventValue] = [];
                globalObj.setupEditCounterEvents(counterName, container);
            });
        });
        
        container.find(".counterEventMenuElement").on("click", function() {
            var eventType = $(this).data("type");
            var eventValue = $(this).data("value");
            $(this).parent().find('.counterEventMenuElement').removeClass('active');
            $(this).addClass('active');
            var onCounterEventSets = globalObj.parentCounters[counterName].getCounterEventSets(eventType, eventValue);
            var selectableActions = GameCreator.helpers.getNonCollisionActions(globalObj.objectType);
            GameCreator.UI.setupEditEventColumns(onCounterEventSets, $(counterEventContent), selectableActions, globalObj);
        }); 
    },


    /******************************
     * PLAYER OBJECT CONTROLLERS  *
     *****************************/
    setupKeyEventsForm: function(container) {
        container.html(GameCreator.htmlStrings.getColumn("Keys", "dialogue-panel-keys"));
        container.append('<div id="dialogue-keys-content"></div>');
        $("#dialogue-panel-keys").html(this.getKeysContent());
        var keyEventContent = document.createElement('div');
        container.append(keyEventContent);
        var globalObj = this;
        container.find(".keyMenuElement").on("click", function(){
            var keyName = $(this).data("name");
            var onKeyEventSets = globalObj.keyEvents[keyName]

            $(this).parent().find('.keyMenuElement').removeClass('active');
            $(this).addClass('active');
            var selectableActions = GameCreator.helpers.getNonCollisionActions(globalObj.objectType);
            GameCreator.UI.setupEditEventColumns(onKeyEventSets, $(keyEventContent), selectableActions, globalObj);
        });
        $("#add-new-key-button").on("click", function(){
            $("#dialogue-keys-content").html(globalObj.getKeySelector());
            $(".addKeyObjectElement").one("click", function() {
                globalObj.keyEvents[$(this).data("keyname")].push(new GameCreator.ConditionActionSet());
                globalObj.setupKeyEventsForm(container);
            });
        });
    },
}