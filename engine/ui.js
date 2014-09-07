GameCreator.UI = {    
    saveNewGlobalObject: function(objectType) {
        var obj, args = {};
        GameCreator.saveFormInputToObject("add-global-object-window-content", args);
        GameCreator.addGlobalObject(args, objectType);
    },

    redrawLibrary: function() {
        var i, keys, listElementButton, globalObj;
        $(".global-object-list").html('');
        keys = Object.keys(GameCreator.globalObjects);
        for (i = 0; i < keys.length; i += 1) {
            globalObj = GameCreator.globalObjects[keys[i]];
            listElementButton = GameCreator.htmlStrings.globalObjectLibraryItem(globalObj);
            $(".global-object-list").append(listElementButton);
            this.setupLibraryItemListeners(listElementButton, globalObj);
        }
    },
    
    createLibraryItem: function(globalObj) {
        var listElementButton = GameCreator.htmlStrings.globalObjectLibraryItem(globalObj);
        $(".global-object-list").append(listElementButton);
        this.setupLibraryItemListeners(listElementButton, globalObj);
    },

    setupLibraryItemListeners: function(listElementButton, globalObj) {
        $(listElementButton).on("click", function(e){
            GameCreator.UI.openEditGlobalObjectDialogue(globalObj);
        });
        $(listElementButton).on("mousedown", function(e){
            var image = new Image();
            image.src = $(this).attr("data-imgsrc");
            $(image).css("position", "absolute");
            $(image).css("top", e.pageY-45);
            $(image).css("left", e.pageX-45);
            $(image).css("display", "none");
            $(image).css("width", "90px");
            $("body").append(image);
            var initialX = e.pageX;
            var initialY = e.pageY;
            var aspectRatio = globalObj.getDefaultState().attributes.width / globalObj.getDefaultState().attributes.height;
            $(window).on("mousemove.dragGlobalMenuItem", function(e){
                if (Math.abs(initialX - e.pageX) > 3 || Math.abs(initialY - e.pageY) > 3){
                    $(image).css("display", "block"); 
                    $(image).css("top", e.pageY - 45 / aspectRatio);
                    $(image).css("left", e.pageX - 45);
                }
            });

            $(window).one("mouseup.dragGlobalMenuItem", function(e){
                var x = e.pageX;
                var y = e.pageY;
                var offsetX = $("#main-canvas").offset().left;
                var offsetY = $("#main-canvas").offset().top;
                if (x > offsetX && x < offsetX + GameCreator.width && y > offsetY && y < offsetY + GameCreator.height) {
                    var args = {x: x - offsetX - globalObj.getDefaultState().attributes.width[0] / 2, 
                                y: y - offsetY - globalObj.getDefaultState().attributes.height[0] / 2};
                    var newInstance = GameCreator.createSceneObject(globalObj, GameCreator.getActiveScene(), args);
                }
                $(image).remove();
                $(window).off("mousemove.dragGlobalMenuItem");
            });

            return false;
        });
    },
    
    
    /**
     * Renders an edit action form inside a specified container.
     * text: The text that should be show as description of the dialogue.
     * actions: The actions the user should be able to select from
     * existingActions: An object or an array, containing actions already chosen.
     * container: The container
     * thisName: The name of the object whose actiosn will be edited with this form.
     **/
    createEditActionsArea: function(text, choosableActions, existingActions, container, thisName) {
        container.html(GameCreator.htmlStrings.editActionsWindow(text, choosableActions, existingActions));
        GameCreator.UI.setupEditActionsContent(text, choosableActions, existingActions, thisName);
    },
 
    openEditActionsWindow: function(text, choosableActions, existingActions, thisName) {  
        //Only select actions if GameCreator isn't already paused for action selection.
        GameCreator.pauseGame();
        
        GameCreator.UI.openDialogue(700, 400, GameCreator.htmlStrings.editActionsWindow(text, choosableActions, existingActions));
        GameCreator.UI.setupEditActionsContent(text, choosableActions, existingActions, thisName);
    
        $("#edit-actions-window-cancel").on("click", function() {
            GameCreator.UI.closeDialogue();
            GameCreator.resumeGame();
            
        });
        
        $("#dialogue-overlay").one("click", function() {
            GameCreator.resumeGame();
        });
    },
    
    setupEditActionsContent: function(text, choosableActions, selectedActions, thisName) {
        $("#action-selector").on("change", function() {
            $("#select-action-parameters-content").html("");
            $("#select-action-timing-content").html("");
            $("#select-action-parameters-container").css("display", "block");
            $("#select-action-timing-container").css("display", "block");
            for(var i = 0;i < choosableActions[$(this).val()].params.length;++i) {
                $("#select-action-parameters-content").append(GameCreator.htmlStrings.parameterGroup(choosableActions[$(this).val()].params[i].label() + choosableActions[$(this).val()].params[i].input(thisName)));
            }
            var timing = choosableActions[$("#action-selector").val()].timing;
            $("#select-action-timing-content").append(GameCreator.htmlStrings.timingGroup(timing));
            $("#timing-selector").on("change", function() {
                if ($("#timing-selector").val() === "now") {
                    $("#timing-parameter").css("display", "none");
                } else {
                    $("#timing-parameter").css("display", "block");
                }
            });
        });
        
        $("#select-action-add-action" ).click(function( event ) {                
            var action = choosableActions[$("#action-selector").val()];
            var parameters = {};

            for (var i = 0; i < action.params.length; i++) {
                parameters[action.params[i].inputId] = GameCreator.helpers.getValue($("#" + action.params[i].inputId));
            }
            
            var timingType = GameCreator.helpers.getValue($("#timing-selector"));
            var timingTime = GameCreator.helpers.getValue($("#timing-time"));
            var timing = {type: timingType, time: timingTime};

            var selectedAction = new GameCreator.RuntimeAction(action.name, parameters, timing);
            selectedActions.push(selectedAction);
            
            $("#select-action-result").html(GameCreator.htmlStrings.selectedActionsList(selectedActions));
        });
        
        $("#select-action-window").on("click", ".removeActionButton", function(){
          selectedActions.splice($("#select-action-window").find(".removeActionButton").index(this), 1);
          $(this).parent().parent().remove();
          return false;
      });
    },
    
    //Add global object functions
    
    openAddGlobalObjectDialogue: function() {
        GameCreator.UI.openDialogue(900, 570, GameCreator.htmlStrings.addGlobalObjectWindow());
        /*
        $("#dialogue-window").find(".tab").on("click", function() {
            GameCreator.UI.setupAddObjectForm($(this).data("object-type"));
            $(this).parent().find(".tab").removeClass("active");
            $(this).addClass("active");
        });
        */

        /*
        GameCreator.UI.setupAddObjectForm("FreeObject");
        */
    },

    setupAddObjectForm: function(objectType) {
        $("#add-global-object-window-content").html(GameCreator.htmlStrings.addGlobalObjectForm(objectType));
        $("#add-global-object-window-content .saveButton").on("click", function() {GameCreator.UI.saveNewGlobalObject(objectType);GameCreator.UI.closeDialogue()});
    },
    
    //Edit global object functions
    
    openEditGlobalObjectDialogue: function(globalObj) {
        GameCreator.UI.openDialogue(900, 570, globalObj.getEditWindow());

        $("#dialogue-panel-edit").find("li").on("click", function() {
            globalObj[$(this).data("uifunction")]($("#dialogue-edit-content"));
            $(this).parent().find("li").removeClass("active");
            $(this).addClass("active");
        });

        globalObj.setupPropertiesForm($("#dialogue-window").find("#dialogue-edit-content"));
        $("#dialogue-panel-edit").find("li:first-child").addClass("active");
    },
    
    //General dialogue functions
    
    openDialogue: function(width, height, content) {
        width = width || 900;
        height = height || 570;
        $("#dialogue-window").css("width", width).css("height", height).css("left", ($(window).width() / 2 - width / 2)).show();
        $("#dialogue-window").html(content);
        $("#dialogue-overlay").show();
    },
    
    closeDialogue: function() {
        $("#dialogue-window").hide();
        $("#dialogue-overlay").hide();
    },

    showDebugInformation: function(info){
        $("#debug-info-pane").html(GameCreator.htmlStrings.debugInformation(info));
    },

    setupSceneTabs: function(scenes) {
        var result = '';
        $('#toolbar-scenes').show();

        result += '<ul class="nav nav-tabs" role="tablist">';
        for(var i = 0; i < scenes.length; i++) {
            result += GameCreator.htmlStrings.sceneTab(scenes[i], GameCreator.activeSceneId === scenes[i].id);
        };
        result += GameCreator.htmlStrings.addSceneTab();
        result += '</ul>';

        $('#toolbar-scenes').html(result);
        $('#toolbar-scenes').off('click');
        $('#toolbar-scenes').on('click', '.nav-tabs > li:not(#add-scene-tab)', function() {
            GameCreator.activeSceneId = parseInt($(this).data('sceneid'));
            GameCreator.editActiveScene();
        });
        $('#toolbar-scenes').one('click', '#add-scene-tab', function() {
            GameCreator.addScene();
        });
    },
    
    deleteSelectedObject: function() {
        GameCreator.deleteSelectedObject();
        $("#edit-scene-object-content").html("");
        $("#edit-scene-object-title").html("");
    },

    editSceneObject: function() {
        var objectType = GameCreator.selectedObject.parent.objectType;

        GameCreator.UI.setupSceneObjectForm(GameCreator.selectedObject);
    },

    updateSceneObjectForm: function(sceneObj) {
        $("#scene-object-property-width span").html(sceneObj.attributes.width);
        $("#scene-object-property-height span").html(sceneObj.attributes.height);
        $("#scene-object-property-x span").html(sceneObj.attributes.x);
        $("#scene-object-property-y span").html(sceneObj.attributes.y);
    },

    unselectSceneObject: function() {
        $("#edit-scene-object-title").html("");
        $("#edit-scene-object-content").html("");
    },

    directSceneMode: function() {
        $(".routeNodeContainer").remove();
        $('#toolbar-scenes').hide();
    },

    setupEditEventColumns: function(caSets, columnParentContainer, selectableActions, globalObj) {
        var caSet;

        if (caSets.length === 0) {
            caSet = new GameCreator.ConditionActionSet(globalObj);
            caSet.addCondition(new GameCreator.RuntimeCondition("exists", {objId: 1, count: 6}));
            caSet.addCondition(new GameCreator.RuntimeCondition("exists", {objId: 2, count: 7}));
            caSet.actions.push(new GameCreator.RuntimeAction("Create", {objectToCreate: 1}));
            caSets.push(caSet);
            var caSet2 = new GameCreator.ConditionActionSet(globalObj);
            caSet2.addCondition(new GameCreator.RuntimeCondition("exists", {objId: 1, count: 8}));
            caSet2.addCondition(new GameCreator.RuntimeCondition("exists", {objId: 2, count: 9}));
            caSet2.actions.push(new GameCreator.RuntimeAction("Create", {objectToCreate: 1, x: 300}));
            caSets.push(caSet2);
        }

        var html = GameCreator.htmlStrings.getColumn('When', 'dialogue-panel-conditions');
        html += GameCreator.htmlStrings.getColumn('Do', 'dialogue-panel-actions');
        html += GameCreator.htmlStrings.getColumn('Select Item', 'dialogue-panel-add-list');
        
        columnParentContainer.html(html);

        GameCreator.UI.setupConditionsColumn(caSets, selectableActions, globalObj);
        GameCreator.UI.setupActionsColumn();

        $("#dialogue-panel-conditions").trigger('redrawList');
    },

    setupConditionsColumn: function(caSets, selectableActions, globalObj) {
        var caSetVMs = [];

        for (var i = 0; i < caSets.length; i++) {
            caSetVMs.push(new GameCreator.CASetVM(caSets[i], selectableActions));
        }
        $("#dialogue-panel-conditions").on('redrawList', function(evt, activeCASetVM) {
            var isActive;
            var conditionsColumn = $("#dialogue-panel-conditions");
            conditionsColumn.html('');
            for (i = 0; i < caSetVMs.length; i+=1) {
                isActive = activeCASetVM === caSetVMs[i];
                conditionsColumn.append(caSetVMs[i].getPresentation(isActive));
            }
            var addCaSetButton = $(document.createElement('li'));
            addCaSetButton.html('<button>Add condition set</button>');
            conditionsColumn.append(addCaSetButton);
            addCaSetButton.on('click', function() {
                caSet = new GameCreator.ConditionActionSet(globalObj);
                caSets.push(caSet);
                caSetVMs.push(new GameCreator.CASetVM(caSet, selectableActions));
                $("#dialogue-panel-conditions").trigger('redrawList');
            });
            $("#dialogue-panel-add-list").empty();
        });
    },

    setupActionsColumn: function() {
        $("#dialogue-panel-actions").on('redrawList', function(evt, activeCASetVM) {
            var actionsColumn = $("#dialogue-panel-actions");
            actionsColumn.html('');
            
            for (i = 0; i < activeCASetVM.actionVMs.length; i+=1) {
                actionsColumn.append(activeCASetVM.actionVMs[i].getPresentation());
            }
            
            var addActionButton = document.createElement('button');
            $(addActionButton).html('Add action');
            $(addActionButton).on('click', function() {
                GameCreator.UI.populateSelectActionList(activeCASetVM);
            });
            actionsColumn.append(addActionButton);
            $("#dialogue-panel-add-list").empty();
        });
    },

    populateSelectConditionList: function(activeCASetVM) {
        var i;
        var column = $("#dialogue-panel-add-list");

        column.html('');

        for (i = 0; i < Object.keys(GameCreator.conditions).length; i++) {
            var listItem = document.createElement('li');
            var conditionName = Object.keys(GameCreator.conditions)[i];
            $(listItem).data('condition', conditionName);
            $(listItem).append(conditionName);
            $(listItem).on('click', function() {
                activeCASetVM.addCondition($(this).data('condition'));
                $("#dialogue-panel-conditions").trigger('redrawList', activeCASetVM);
            });
            column.append(listItem);
        }
    },

    populateSelectActionList: function(activeCASetVM) {
        var i;
        var column = $("#dialogue-panel-add-list");

        column.html('');

        for (i = 0; i < Object.keys(activeCASetVM.selectableActions).length; i++) {
            var listItem = document.createElement('li');
            var actionName = Object.keys(activeCASetVM.selectableActions)[i];
            $(listItem).data('action', actionName);
            $(listItem).append(actionName);
            $(listItem).on('click', function() {
                activeCASetVM.addAction($(this).data('action'))
                $("#dialogue-panel-actions").trigger('redrawList', activeCASetVM);
            });
            column.append(listItem);
        }
    },

    setupSceneObjectForm: function(sceneObject) {
        var container = $('#scene-object-properties-container');
        container.html(sceneObject.parent.getSceneObjectForm());
        GameCreator.helpers.populateSceneObjectForm(sceneObject);
    },

    setupValuePresenter: function(container, attributes, attrName, obj) {
        var input, select, paramLen, onClickFunc, closeInput, inputOpen = false;
        container = $(container);
        var display = document.createElement('span');
        var inputType = container.data('inputtype');
        $(display).html(GameCreator.helpers.getPresentationForInputValue(attributes[attrName], inputType, obj));
        container.html(display);

        closeInput = function(input) {
            $(window).off('click.closeDropDown');
            inputOpen = false;
            if (obj instanceof GameCreator.SceneObject) {
                GameCreator.invalidate(obj);
            }
            GameCreator.saveInputValueToObject($(input), attributes);
            $(display).html(GameCreator.helpers.getPresentationForInputValue(attributes[attrName], inputType, obj));
            container.html(display);
            container.parent().off('click').on('click', onClickFunc);
            if (obj instanceof GameCreator.SceneObject) {
                GameCreator.render(true);
            }
        }

        onClickFunc = function(evt) {
            if (!inputOpen) {
                inputOpen = true;
                container.html(GameCreator.htmlStrings[inputType](attrName, attributes[attrName], obj));
                input = container.find('input, select');
                if (input[0].nodeName === 'INPUT') {
                    paramLen = (attributes[attrName] || '').toString().length;
                    input[0].setSelectionRange(paramLen, paramLen);
                    input.on('blur', function() {
                        closeInput(this);
                    });
                } else {
                    input.on('blur change', function() {
                        closeInput(this);
                    });
                }
                input.focus();
            }
        }

        container.parent().off('click').on('click', onClickFunc);
    },
}
