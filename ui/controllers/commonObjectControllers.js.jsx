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

    setupCaSet: function(caSets) {
        if (caSets.length === 0) {
            caSets.push(new GameCreator.ConditionActionSet());
        }
    },

    /******************************
     * COMMON OBJECT CONTROLLERS  *
     *****************************/
    setupPropertiesForm: function(container) {
        ReactDOM.unmountComponentAtNode(container);
        var globalObj = this;
        var html = this.getPropertiesContent();
        $(container).html(html);
        var globalObjAttributes = this.getDefaultState().attributes;

        GameCreator.helpers.populateGlobalObjectPropertiesForm(globalObjAttributes, GameCreator[this.objectType].objectAttributes, 'object-properties-content', globalObj);
        GameCreator.helpers.populateGlobalObjectPropertiesForm(this.attributes, GameCreator[this.objectType].objectNonStateAttributes, 'object-non-state-properties-content', globalObj);
        GameCreator.UI.populateImageSelectControls($('#global-object-image-upload-controls'), $('#object-property-image-container input'));
        GameCreator.UI.loadInputStyle();
    },
        
    setupCollisionsForm: function(container) {
        var globalObj = this;

        var html = GameCreator.htmlStrings.getColumn('With', 'dialogue-panel-with');
        $(container).html(html);
        var eventEditorContainer = document.createElement('div');
        var eventItemSelectContainer = document.createElement('div');
        $(container).append(eventEditorContainer);
        $(container).append(eventItemSelectContainer);

        ReactDOM.render(
            <EventItemSelector/>,
            eventItemSelectContainer
        );

        var withColumn = $('#dialogue-panel-with');
        withColumn.parent().append('<a id="add-new-collision-button" class="btn tab success wide">Add</a>');
        withColumn.on('redrawList', function(evt) {
            withColumn.empty();
            globalObj.events.onCollideSets.forEach(function(collisionItem) {
                var collisionListItem = $(document.createElement('div'));
                collisionListItem.addClass("btn tab collision-with-item");
                collisionListItem.append(GameCreator.htmlStrings.selectGlobalObjectPresentation(collisionItem.id));

                var deleteButton = GameCreator.UI.deleteButtonElement();
                

                $(deleteButton).on('click', function() {
                    var index = globalObj.events.onCollideSets.indexOf(collisionItem);
                    if (index !== -1) {
                        globalObj.events.onCollideSets.splice(index, 1);
                    }
                    if ($(this).parent().hasClass('active')) {
                        $(eventEditorContainer).empty();
                        $(document).trigger('GC.hideItemSelector');
                    }
                    $(collisionListItem).remove();
                });

                collisionListItem.append(deleteButton);
                withColumn.append(collisionListItem);

                collisionListItem.on('click', function() {
                    var index = globalObj.events.onCollideSets.indexOf(collisionItem);
                    $(this).parent().find('.active').removeClass('active');
                    $(this).addClass('active');
                    ReactDOM.render(
                        <EventEditor caSets={globalObj.events.onCollideSets[index].caSets} eventType='collision' />,
                        eventEditorContainer
                    );
                    $(document).trigger('GC.hideItemSelector');
                });

                $(eventEditorContainer).empty();
            });

            $("#add-new-collision-button").on("click", function() {
                var callback = function(itemName) {
                    var targetId = GameCreator.helpers.findGlobalObjectByName(itemName).id;
                    var collisionItem = {id: targetId, caSets: [new GameCreator.ConditionActionSet()]};
                    globalObj.events.onCollideSets.push(collisionItem);
                    withColumn.trigger('redrawList');
                };

                $(document).trigger('GC.showItemSelector', [GameCreator.helpers.getCollidableObjectNames(globalObj), callback]);
            });
        });
        
        withColumn.trigger('redrawList');

    },



    setupOnDestroyActionsForm: function(container) {
        GameCreator.commonObjectControllers.setupCaSet(this.events.onDestroySets);
        ReactDOM.render(
            (<div>
                <EventEditor caSets={this.events.onDestroySets} eventType='destroy' />
                <EventItemSelector/>
            </div>),
            container
        );
    },

    setupOnCreateActionsForm: function(container) {
        GameCreator.commonObjectControllers.setupCaSet(this.events.onCreateSets);
        ReactDOM.render(
            (<div>
                <EventEditor caSets={this.events.onCreateSets} eventType='create' />
                <EventItemSelector/>
            </div>),
            container
        );
    },

    setupOnClickActionsForm: function(container) {
        var selectableActions = GameCreator.helpers.getNonCollisionActions(this.objectType);
        GameCreator.commonObjectControllers.setupCaSet(this.events.onClickSets);
        ReactDOM.render(
            (<div>
                <EventEditor caSets={this.events.onClickSets} eventType='click' />
                <EventItemSelector/>
            </div>),
            container
        );
    },

    setupStatesColumn: function(container, selectedState) {
        ReactDOM.unmountComponentAtNode(container);
        $(container).html(GameCreator.htmlStrings.getColumn("States", "dialogue-panel-states"));
        $(container).append('<div id="dialogue-state-content"></div>');

        $("#dialogue-panel-states").html(this.getStatesContent());
        $("#dialogue-panel-states").parent().append('<a id="add-new-state-button" class="btn tab success wide">Add</a>');
        var globalObj = this;
        $("#add-new-state-button").on("click", function() {
            $("#create-state-form").remove();
            var saveCallback = function() {
                var stateName = $("#create-state-form input").val();
                globalObj.createState(stateName);
                globalObj.setupStatesColumn(container);
            };
            var cancelCallback = function() {
                $("#create-state-form").remove();
            };
            $("#dialogue-panel-states").append(GameCreator.htmlStrings.createNameSelectionForm('State name', 'create-state-form', saveCallback, cancelCallback));
        });
        $(container).find(".defaultMenuElement").on("click", function() {
            var state = $(this).data('id');
            $(container).find(".defaultMenuElement").removeClass('active');
            $(this).addClass("active");
            globalObj.setupEditStateForm(state);
        });
        $("#dialogue-panel-states .remove-item-button").on('click', function(evt) {
            var stateId = $(this).parent().data('id');
            GameCreator.helpers.removeObjectFromArrayById(globalObj.states, stateId);
            if($(this).parent().hasClass('active')) {
                $('#dialogue-state-content').empty();
            }
            $(this).parent().remove();
        });
    },

    setupEditStateForm: function(stateId) {
        var state = this.getState(stateId);
        $('#dialogue-state-content').html(this.getStatePropertiesContent('State: ' + state.name, stateId));
        $('#dialogue-state-content').append(GameCreator.htmlStrings.getColumn("Properties", "dialogue-panel-state-properties"));
        GameCreator.helpers.populateGlobalObjectPropertiesForm(this.getDefaultState().attributes, GameCreator[this.objectType].objectAttributes, 'state-properties-content');
        GameCreator.helpers.populateGlobalObjectPropertiesForm(state.attributes, GameCreator[this.objectType].objectAttributes, 'state-properties-content');
        GameCreator.UI.populateImageSelectControls($('#global-object-image-upload-controls'), $('#object-property-image-container input'));

        var globalObj = this;
        var propertiesColumn = $('#dialogue-panel-state-properties');
        var allAttributes = Object.keys(globalObj.getDefaultState().attributes);
        for (var i = 0; i < allAttributes.length; i += 1) {
            var listItem = document.createElement('a');
            $(listItem).addClass("btn tab");
            if (state.attributes[allAttributes[i]] !== undefined) {
                $(listItem).addClass('active-toggleable');
            } else {
                $('#object-property-' + allAttributes[i] + '-container').addClass('fade-disable');
                $('#object-property-' + allAttributes[i] + '-container input').attr('disabled', 'true');
                if(allAttributes[i] === 'image') {
                        $('#global-object-image-upload-controls').addClass('fade-disable');
                    }
            }
            $(listItem).html(GameCreator.helpers.labelize(allAttributes[i]));
            $(listItem).click(function(index) {
                if (state.attributes[allAttributes[index]] !== undefined) {
                    delete state.attributes[allAttributes[index]];
                    $('#object-property-' + allAttributes[index] + '-container input').attr('disabled', 'true');
                    if(allAttributes[index] === 'image') {
                        $('#global-object-image-upload-controls').addClass('fade-disable');
                        $('#global-object-image-upload-controls .selected-image-preview').attr('src', globalObj.getDefaultState().attributes[allAttributes[index]].src);
                    }
                } else {
                    $('#object-property-' + allAttributes[index] + '-container input').removeAttr('disabled');
                    if(allAttributes[index] === 'image') {
                        $('#global-object-image-upload-controls').removeClass('fade-disable');
                    }
                    state.attributes[allAttributes[index]] = globalObj.getDefaultState().attributes[allAttributes[index]];
                    GameCreator.helpers.populateGlobalObjectPropertiesForm(state.attributes, GameCreator[globalObj.objectType].objectAttributes, 'state-properties-content');
                    GameCreator.UI.populateImageSelectControls($('#global-object-image-upload-controls'), $('#object-property-image-container input'));
                }
                $('#object-property-' + allAttributes[index] + '-container').toggleClass('fade-disable');
                $(this).toggleClass('active-toggleable');
                
            }.bind(listItem, i));
            propertiesColumn.append(listItem);
        }

        $('#state-properties-content .delete-state-button').on('click', function(evt) {
            var stateId = $(this).data('id');
            GameCreator.helpers.removeObjectFromArrayById(globalObj.states, stateId);
            $('#dialogue-panel-states a[data-id="' + stateId + '"]').remove();
            $('#dialogue-state-content').empty();
        });

        GameCreator.UI.loadInputStyle();
    },

    setupEventsForm: function(container) {
        ReactDOM.unmountComponentAtNode(container);
        var globalObj = this;
        var html = this.getEventsContent();
        $(container).html(html);

        $("#dialogue-panel-events").find("a").on("click", function() {
            globalObj[$(this).data("uifunction")](document.getElementById("dialogue-events-content"));
            $(this).parent().find("a").removeClass("active");
            $(this).addClass("active");
        });
    },

    setupCountersForm: function(container) {
        var globalObj = this;

        var renderCounterEditor = function() {
            ReactDOM.render(
                <CountersEditor counters={globalObj.parentCounters} onAddCounter={addNewCounter} title="Counters"/>,
                container
            );
        };

        var addNewCounter = function(counterName) {
            globalObj.parentCounters[counterName] = new GameCreator.Counter();
            GameCreator.getActiveScene().objects.forEach(function(sceneObj){
                if(sceneObj.parent === globalObj) {
                    GameCreator.resetCounters(sceneObj, sceneObj.parent.parentCounters);
                }
            });
            renderCounterEditor();
        };
        
        renderCounterEditor();
    },
    

    /******************************
     * PLAYER OBJECT CONTROLLERS  *
     *****************************/
    setupKeyEventsForm: function(container) {
        var html = GameCreator.htmlStrings.getColumn("Keys", "dialogue-panel-keys");
        $(container).html(html);
        $("#dialogue-panel-keys").html(this.getKeysContent());
        var eventEditorContainer = document.createElement('div');
        var eventItemSelectContainer = document.createElement('div');
        $(container).append(eventEditorContainer);
        $(container).append(eventItemSelectContainer);
        $("#dialogue-panel-keys").parent().append('<a id="add-new-key-button" class="btn tab success wide">Add</a>');
        var globalObj = this;
        ReactDOM.render(
            <EventItemSelector/>,
            eventItemSelectContainer
        );
        $(container).find(".defaultMenuElement").on("click", function() {
            var keyName = $(this).data("name");
            var keyCaSets = globalObj.events.onKeySets[keyName]

            $(this).parent().find('.defaultMenuElement').removeClass('active');
            $(this).addClass('active');

            ReactDOM.render(
                <EventEditor caSets={keyCaSets} eventType='key'/>,
                eventEditorContainer
            );
        });
        $("#add-new-key-button").on("click", function(){
            //$("#dialogue-panel-add-list").html(globalObj.getKeySelector());
            var callback = function(itemName) {
                globalObj.events.onKeySets[itemName].push(new GameCreator.ConditionActionSet());
                globalObj.setupKeyEventsForm(container);
            };
            $(document).trigger("GC.showItemSelector", [GameCreator.helpers.getSelectableKeys(globalObj), callback]);
        });
        $("#dialogue-panel-keys .remove-item-button").on('click', function(evt) {
            var keyName = $(this).parent().data('name');
            globalObj.events.onKeySets[keyName] = [];
            if($(this).parent().hasClass('active')) {
                $('#dialogue-panel-actions').trigger('clearColumn');
                $("#dialogue-panel-conditions").trigger('clearColumn');
            }
            $(this).parent().remove();
        });
    },
}