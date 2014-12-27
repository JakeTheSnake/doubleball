GameCreator.commonObjectControllers = {
    
    addCounterObjectControllers: function(object) {
        object.setupPropertiesForm = GameCreator.commonObjectControllers.setupPropertiesForm;
        object.setupStatesColumn = GameCreator.commonObjectControllers.setupStatesColumn;
        object.setupEditStateForm = GameCreator.commonObjectControllers.setupEditStateForm;
    },

    addTextObjectControllers: function(object) {
        object.setupPropertiesForm = GameCreator.commonObjectControllers.setupPropertiesForm;
        object.setupStatesColumn = GameCreator.commonObjectControllers.setupStatesColumn;
        object.setupEditStateForm = GameCreator.commonObjectControllers.setupEditStateForm;
    },

    addCommonObjectControllers: function(object) {
        object.setupOnClickActionsForm = GameCreator.commonObjectControllers.setupOnClickActionsForm;
        object.setupOnDestroyActionsForm = GameCreator.commonObjectControllers.setupOnDestroyActionsForm;
        object.setupOnCreateActionsForm = GameCreator.commonObjectControllers.setupOnCreateActionsForm;
        object.setupEditCounterEvents = GameCreator.commonObjectControllers.setupEditCounterEvents;
        object.setupStatesColumn = GameCreator.commonObjectControllers.setupStatesColumn;
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
        GameCreator.helpers.populateGlobalObjectPropertiesForm(this.attributes, GameCreator[this.objectType].objectNonStateAttributes, 'object-non-state-properties-content', globalObj);
        GameCreator.helpers.populateImageUploadControls();
    },
        
    setupCollisionsForm: function(container) {
        var collisionObjects = [];
        var globalObj = this;
        for(var i = 0; i < this.onCollideSets.length; i++) {
            collisionObjects.push(GameCreator.helpers.findGlobalObjectById(this.onCollideSets[i].id));
        }

        var html = GameCreator.htmlStrings.getColumn('With', 'dialogue-panel-with');
        html += GameCreator.htmlStrings.getColumn('When', 'dialogue-panel-conditions');
        html += GameCreator.htmlStrings.getColumn('Do', 'dialogue-panel-actions');
        html += GameCreator.htmlStrings.getColumn('Select Item', 'dialogue-panel-add-list');
        container.html(html);

        GameCreator.UI.setupActionsColumn();

        var withColumn = $('#dialogue-panel-with');
        withColumn.parent().append('<button id="add-new-collision-button" class="icon-plus btn btn-success">Add</button>');
        withColumn.on('redrawList', function(evt) {
            withColumn.empty();
            globalObj.onCollideSets.forEach(function(collisionItem) {
                var collisionListItem = $(document.createElement('li'));
                collisionListItem.append(GameCreator.htmlStrings.selectGlobalObjectPresentation(collisionItem.id));

                var deleteButton = GameCreator.UI.deleteButtonElement();

                $(deleteButton).on('click', function() {
                    var index = globalObj.onCollideSets.indexOf(collisionItem);
                    if (index !== -1) {
                        globalObj.onCollideSets.splice(index, 1);
                    }

                    if($(collisionListItem).hasClass('active')) {
                        $('#dialogue-panel-actions').trigger('clearColumn');
                        $("#dialogue-panel-conditions").trigger('clearColumn');
                    }

                    $(collisionListItem).remove();
                });

                collisionListItem.append(deleteButton);

                withColumn.append(collisionListItem);
                collisionListItem.on('click', function() {
                    $(this).parent().find('.active').removeClass('active');
                    $(this).addClass('active');
                    GameCreator.UI.setupConditionsColumn(collisionItem.caSets, GameCreator.helpers.getCollisionActions(globalObj), globalObj);
                    $('#dialogue-panel-actions').trigger('clearColumn');
                    $("#dialogue-panel-conditions").trigger('redrawList');
                });

            });

            $("#add-new-collision-button").on("click", function() {
                $("#dialogue-panel-add-list").html(GameCreator.htmlStrings.collisionObjectSelector(globalObj));
                $("#dialogue-panel-add-list li").one("click", function() {
                    var targetId = GameCreator.helpers.findGlobalObjectByName($(this).data("objectname")).id;
                    var collisionItem = {id: targetId, caSets: [new GameCreator.ConditionActionSet(globalObj)]};
                    globalObj.onCollideSets.push(collisionItem);
                    withColumn.trigger('redrawList');
                    $('#dialogue-panel-actions').trigger('clearColumn');
                    $("#dialogue-panel-conditions").trigger('clearColumn');
                    $("#dialogue-panel-add-list").empty();
                });
            });
        });
        
        withColumn.trigger('redrawList');

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

    setupStatesColumn: function(container, selectedState) {
        container.html(GameCreator.htmlStrings.getColumn("States", "dialogue-panel-states"));
        container.append('<div id="dialogue-state-content" class="content"></div>');
        $("#dialogue-panel-states").html(this.getStatesContent());
        $("#dialogue-panel-states").parent().append('<button id="add-new-state-button" class="icon-plus btn btn-success">Add</button>');
        var globalObj = this;
        $("#add-new-state-button").on("click", function() {
            $("#create-state-form").remove();
            var saveCallback = function() {
                var stateName = $("#create-state-form input").val();
                globalObj.createState(stateName);
                globalObj.setupStatesColumn(container);
            };
            $("#dialogue-panel-states").append(GameCreator.htmlStrings.createNameSelectionForm('State name', 'create-state-form', saveCallback));
        });
        container.find(".defaultMenuElement").on("click", function() {
            var state = $(this).data('id');
            container.find(".defaultMenuElement").removeClass('active');
            $(this).addClass("active");
            globalObj.setupEditStateForm(state);
        });
        $("#dialogue-panel-states .remove-item-button").on('click', function(evt) {
            var stateId = $(this).parent().data('id');
            GameCreator.helpers.removeObjectFromArrayById(globalObj.states, stateId);
            if($(this).parent().hasClass('active')) {
                $('#dialogue-state-content').html('');
            }
            $(this).parent().remove();
        });
    },

    setupEditStateForm: function(stateId) {
        var state = this.getState(stateId);
        $('#dialogue-state-content').html(this.getStatePropertiesContent('State: ' + state.name));
        $('#dialogue-state-content').append(GameCreator.htmlStrings.getColumn("Properties", "dialogue-panel-state-properties"));
        GameCreator.helpers.populateGlobalObjectPropertiesForm(this.getDefaultState().attributes, GameCreator[this.objectType].objectAttributes, 'state-properties-content');
        GameCreator.helpers.populateGlobalObjectPropertiesForm(state.attributes, GameCreator[this.objectType].objectAttributes, 'state-properties-content');

        var globalObj = this;
        var propertiesColumn = $('#dialogue-panel-state-properties');
        var allAttributes = Object.keys(globalObj.getDefaultState().attributes);
        for (var i = 0; i < allAttributes.length; i += 1) {
            var listItem = document.createElement('li');
            if (state.attributes[allAttributes[i]] !== undefined) {
                $(listItem).addClass('active');
            } else {
                $('#object-property-' + allAttributes[i] + '-container').addClass('fade-disable');
                $('#object-property-' + allAttributes[i] + '-container input').attr('disabled', 'true');
            }
            $(listItem).html(GameCreator.helpers.labelize(allAttributes[i]));
            $(listItem).click(function(index) {
                if (state.attributes[allAttributes[index]] !== undefined) {
                    delete state.attributes[allAttributes[index]];
                    $('#object-property-' + allAttributes[index] + '-container input').attr('disabled', 'true');
                } else {
                    $('#object-property-' + allAttributes[index] + '-container input').removeAttr('disabled');
                    state.attributes[allAttributes[index]] = globalObj.getDefaultState().attributes[allAttributes[index]];
                    GameCreator.helpers.populateGlobalObjectPropertiesForm(state.attributes, GameCreator[globalObj.objectType].objectAttributes, 'state-properties-content');
                }
                $('#object-property-' + allAttributes[index] + '-container').toggleClass('fade-disable');
                $(this).toggleClass('active');
                
            }.bind(listItem, i));
            propertiesColumn.append(listItem);
        }
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
        container.append('<div id="dialogue-counter-content" class="content"></div>');
        $("#dialogue-panel-counters").html(this.getCountersContent());
        $("#dialogue-panel-counters").parent().append('<button id="add-new-counter-button" class="icon-plus btn btn-success">Add</button>');
        var globalObj = this;
        $("#add-new-counter-button").on("click", function() {
            $("#create-counter-form").remove();
            var saveCallback = function() {
                var counterName = $("#create-counter-form input").val();
                globalObj.parentCounters[counterName] = new GameCreator.Counter();
                GameCreator.getActiveScene().objects.forEach(function(sceneObj){
                    if(sceneObj.parent === globalObj) {
                        GameCreator.resetCounters(sceneObj, sceneObj.parent.parentCounters);
                    }
                });
                globalObj.setupCountersForm(container);
            };
            $("#dialogue-panel-counters").append(GameCreator.htmlStrings.createNameSelectionForm('Counter name', 'create-counter-form', saveCallback));
            
        });
        container.find(".defaultMenuElement").on("click", function() {
            var counterName = $(this).data("name");
            container.find(".active").removeClass('active');
            $(this).addClass("active");
            globalObj.setupEditCounterEvents(counterName);
        });
    },
    
    setupEditCounterEvents: function(counterName) {
        var container = $('#dialogue-counter-content');
        container.html(GameCreator.htmlStrings.getColumn('Events', "dialogue-panel-counter-events"));
        var counterEventContent = document.createElement('div');
        $(counterEventContent).addClass('content');
        container.append(counterEventContent);
        $('#dialogue-panel-counter-events').html(this.getCounterEventsContent(counterName));
        var globalObj = this;
        $("#edit-counter-event-actions-content").html("");
        $("#add-new-counter-event-button").on("click", function() {
            $('#dialogue-panel-counter-events').append(GameCreator.htmlStrings.getCounterEventForm('dialogue-add-counter-event'));
            $("#dialogue-panel-counter-events .saveButton").one("click", function() {
                var eventType = GameCreator.helpers.getValue($('#dialogue-add-counter-event select'));
                var eventValue = GameCreator.helpers.getValue($('#dialogue-add-counter-event input'));
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
        var html = GameCreator.htmlStrings.getColumn("Keys", "dialogue-panel-keys");
        container.html(html);
        $("#dialogue-panel-keys").html(this.getKeysContent());
        $("#dialogue-panel-keys").parent().append('<button id="add-new-key-button" class="icon-plus btn btn-success">Add</button>');
        var keyEventContent = document.createElement('div');
        var eventHtml = GameCreator.htmlStrings.getColumn('When', 'dialogue-panel-conditions');
        eventHtml += GameCreator.htmlStrings.getColumn('Do', 'dialogue-panel-actions');
        eventHtml += GameCreator.htmlStrings.getColumn('Select Item', 'dialogue-panel-add-list');
        $('#dialogue-events-content').append(keyEventContent);
        $(keyEventContent).html(eventHtml);
        var globalObj = this;
        container.find(".defaultMenuElement").on("click", function(){
            var keyName = $(this).data("name");
            var onKeyEventSets = globalObj.onKeySets[keyName]

            $(this).parent().find('.defaultMenuElement').removeClass('active');
            $(this).addClass('active');
            var selectableActions = GameCreator.helpers.getNonCollisionActions(globalObj.objectType);
            GameCreator.UI.setupEditEventColumns(onKeyEventSets, $(keyEventContent), selectableActions, globalObj);
        });
        $("#add-new-key-button").on("click", function(){
            $("#dialogue-panel-add-list").html(globalObj.getKeySelector());
            $(".addKeyObjectElement").one("click", function() {
                globalObj.onKeySets[$(this).data("keyname")].push(new GameCreator.ConditionActionSet(globalObj));
                globalObj.setupKeyEventsForm(container);
            });
        });
        $("#dialogue-panel-keys .remove-item-button").on('click', function(evt) {
            var keyName = $(this).parent().data('name');
            globalObj.onKeySets[keyName] = [];
            if($(this).parent().hasClass('active')) {
                $('#dialogue-panel-actions').trigger('clearColumn');
                $("#dialogue-panel-conditions").trigger('clearColumn');
            }
            $(this).parent().remove();
        });
    },
}