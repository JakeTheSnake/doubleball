GameCreator.UI = {    
    saveNewGlobalObject: function(objectType) {
        var obj, args = {};
        GameCreator.saveFormInputToObject("add-global-object-window-content", args);
        GameCreator.addGlobalObject(args, objectType);
    },

    drawDialogueLibrary: function() {
        var i, keys, listElementButton, globalObj;
        $("#dialogue-window .global-object-list").html('');
        keys = Object.keys(GameCreator.globalObjects);
        for (i = 0; i < keys.length; i += 1) {
            globalObj = GameCreator.globalObjects[keys[i]];
            listElementButton = GameCreator.htmlStrings.globalObjectLibraryItem(globalObj);
            $(listElementButton).on("click", function(iGlobalObject) {
                GameCreator.UI.openEditGlobalObjectDialogue(iGlobalObject);
            }.bind(this, globalObj));
            $("#dialogue-window .global-object-list").append(listElementButton);
        }
    },
    
    createLibraryItem: function(globalObj) {
        var listElementButton = GameCreator.htmlStrings.globalObjectLibraryItem(globalObj);
        this.setupLibraryItemListeners(listElementButton, globalObj);
        $(".global-object-list").append(listElementButton);
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
 
    openEditActionsWindow: function(infoWindowHtml, caSetVM, objName) {  
        //Only select actions if GameCreator isn't already paused for action selection.
        GameCreator.pauseGame();
        
        GameCreator.UI.openDialogue(700, 400, GameCreator.htmlStrings.editActionsWindow(infoWindowHtml, objName));
        GameCreator.UI.setupActionsColumn();
        GameCreator.UI.populateSelectActionList(caSetVM);
        //GameCreator.UI.setupEditActionsContent(text, choosableActions, existingActions, thisName);
        
        $("#dialogue-overlay").one("click", function() {
            GameCreator.resumeGame();
        });
    },
    
    //Add global object functions
    
    openAddGlobalObjectDialogue: function() {
        GameCreator.UI.openDialogue(700, 570, GameCreator.htmlStrings.addGlobalObjectWindow());
        GameCreator.UI.populateSelectObjectTypeGroupList();
    },


    setupAddObjectForm: function(objectType) {
        $("#add-global-object-window-content").html(GameCreator.htmlStrings.addGlobalObjectForm(objectType));
        $("#add-global-object-window-content .saveButton").on("click", function() {
            GameCreator.UI.saveNewGlobalObject(objectType);
            GameCreator.UI.closeDialogue();
        });
    },
    
    //Edit global object functions
    
    openEditGlobalObjectDialogue: function(globalObj) {
        GameCreator.UI.openDialogue(900, 570, globalObj.getEditWindow());

        $("#dialogue-panel-edit").find("li").on("click", function() {
            globalObj[$(this).data("uifunction")]($("#dialogue-edit-content"));
            $(this).parent().find("li").removeClass("active");
            $(this).addClass("active");
        });

        $('#object-manager-object-name').html(globalObj.objectName);

        globalObj.setupPropertiesForm($("#dialogue-window").find("#dialogue-edit-content"));
        $("#dialogue-panel-edit").find("li:first-child").addClass("active");
        GameCreator.UI.drawDialogueLibrary();
        var previewImage = document.createElement('img');
        previewImage.src = globalObj.getDefaultState().attributes.image.src;
        $("#object-manager-library-preview").html(previewImage);
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
        $(".arrow_box").hide();
        $("#dialogue-overlay").hide();
    },

    showDebugInformation: function(info){
        $("#debug-info-pane").html(GameCreator.htmlStrings.debugInformation(info));
    },

    setupSceneTabs: function() {
        GameCreator.UI.drawSceneTabs();
        $('#toolbar-scenes').off('click');
        $('#toolbar-scenes').on('click', '.nav-tabs > li:not(#add-scene-tab)', function() {
            GameCreator.activeSceneId = parseInt($(this).data('sceneid'));
            GameCreator.editActiveScene();
        });

        var draggedSceneId;
        $('#toolbar-scenes').off('dragstart');
        $('#toolbar-scenes').off('dragover');
        $('#toolbar-scenes').off('drop');
        $('#toolbar-scenes').off('dragleave');
        $('#toolbar-scenes').on('dragstart', '.nav-tabs > li:not(#add-scene-tab)', function(e) {
            draggedSceneId = parseInt($(this).data('sceneid'));
            $('#toolbar-scenes').one('drop', '.nav-tabs > li:not(#add-scene-tab)', function(e) {
                e.preventDefault();
                var droppedSceneId = parseInt($(this).data('sceneid'));
                if (draggedSceneId !== droppedSceneId) {
                    GameCreator.insertSceneAfter(draggedSceneId, droppedSceneId);
                }
            });
        });

        $('#toolbar-scenes').on('dragleave', '.nav-tabs > li:not(#add-scene-tab)', function(e) {
            $(this).removeClass('scene-swap-highlight');
        });

        $('#toolbar-scenes').on('dragover', '.nav-tabs > li:not(#add-scene-tab)', function(e) {
            $(this).addClass('scene-swap-highlight');
            e.preventDefault();
        });

        $('#toolbar-scenes').one('click', '#add-scene-tab', function() {
            GameCreator.addScene();
        });
    },

    drawSceneTabs: function() {
        var result = '';

        $('#toolbar-scenes').show();

        result += '<ul class="nav nav-tabs" role="tablist">';
        for(var i = 0; i < GameCreator.scenes.length; i++) {
            result += GameCreator.htmlStrings.sceneTab(GameCreator.scenes[i], GameCreator.activeSceneId === GameCreator.scenes[i].id);
        };
        result += GameCreator.htmlStrings.addSceneTab();
        result += '</ul>';

        $('#toolbar-scenes').html(result);
    },
    
    editSceneObject: function() {
        var objectType = GameCreator.selectedObject.parent.objectType;

        GameCreator.UI.setupSceneObjectForm(GameCreator.selectedObject);
    },

    updateSceneObjectForm: function(sceneObj) {
        $("#side-property-width span").html(sceneObj.attributes.width);
        $("#side-property-height span").html(sceneObj.attributes.height);
        $("#side-property-x span").html(sceneObj.attributes.x);
        $("#side-property-y span").html(sceneObj.attributes.y);
    },

    hideEditModeTools: function() {
        $(".routeNodeContainer").remove();
        $('#toolbar-scenes').hide();
    },

    setupEditEventColumns: function(caSets, columnParentContainer, selectableActions, globalObj) {
        var caSet;

        if (caSets.length === 0) {
            caSet = new GameCreator.ConditionActionSet(globalObj);
            caSets.push(caSet);
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
            caSetVMs.push(new GameCreator.CASetVM(caSets[i], selectableActions, globalObj));
        }

        var addCaSetButton = $(document.createElement('button'));
        $(addCaSetButton).addClass('icon-plus btn btn-success');
        $(addCaSetButton).html('Create group');
        $(addCaSetButton).on('click', function() {
            caSet = new GameCreator.ConditionActionSet(globalObj);
            caSets.push(caSet);
            caSetVMs.push(new GameCreator.CASetVM(caSet, selectableActions, globalObj));
            $("#dialogue-panel-conditions").trigger('redrawList');
        });

        $("#dialogue-panel-conditions").parent().find('button').remove();
        $("#dialogue-panel-conditions").parent().append(addCaSetButton);
        $("#dialogue-panel-conditions").on('redrawList', function(evt, activeCASetVM) {
            var isActive;
            var conditionsColumn = $("#dialogue-panel-conditions");
            conditionsColumn.html('');

            for (i = 0; i < caSetVMs.length; i+=1) {
                isActive = activeCASetVM === caSetVMs[i];
                conditionsColumn.append(caSetVMs[i].getPresentation(isActive));
            }

            $("#dialogue-panel-add-list").empty();
        });
    },

    setupActionsColumn: function() {
        var actionsColumn = $("#dialogue-panel-actions");
        actionsColumn.on('redrawList', function(evt, activeCASetVM) {
            actionsColumn.parent().find('button').remove();
            actionsColumn.empty();
            var addActionButton = document.createElement('button');
            $(addActionButton).addClass('icon-plus btn btn-success');
            $(addActionButton).html('Add action');

            actionsColumn.parent().append(addActionButton);
            
            for (i = 0; i < activeCASetVM.actionVMs.length; i+=1) {
                actionsColumn.append(activeCASetVM.actionVMs[i].getPresentation());
            }
            
            $(addActionButton).on('click', function() {
                GameCreator.UI.populateSelectActionList(activeCASetVM);
            });

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
            $(listItem).append(GameCreator.helpers.labelize(conditionName));
            $(listItem).on('click', function() {
                activeCASetVM.addCondition($(this).data('condition'));
                $("#dialogue-panel-conditions").trigger('redrawList', activeCASetVM);
            });

            column.append(listItem);
        }
    },

    populateSelectActionList: function(activeCASetVM) {
        var i, keys = Object.keys(activeCASetVM.selectableActions);
        var column = $("#dialogue-panel-add-list");

        column.html('');

        for (i = 0; i < keys.length; i++) {
            var listItem = document.createElement('li');
            var actionName = keys[i];

            $(listItem).data('action', actionName);
            $(listItem).append(actionName);
            $(listItem).on('click', function() {
                activeCASetVM.addAction($(this).data('action'))
                $("#dialogue-panel-actions").trigger('redrawList', activeCASetVM);
            });

            column.append(listItem);
        }
    },

    populateSelectObjectTypeGroupList: function() {
        var listItem, column = $("#dialogue-panel-object-type-group");
        column.html('');
        var objectGroups = [
            {text: 'Player Objects', value: 'playerObjectTypes'}, 
            {text: 'Game Objects', value: 'gameObjectTypes'},
            {text: 'Counters', value: 'counterObjectTypes'} 
        ];
        objectGroups.forEach(function(group){
            listItem = document.createElement('li');
            $(listItem).append(group.text);
            $(listItem).on('click', function() {
                $("#add-global-object-form-content").empty();
                column.find('.active').removeClass('active');
                $(this).addClass('active');
                GameCreator.UI.populateSelectObjectTypeList(GameCreator.objectTypeGroups[group.value]);
            });
            column.append(listItem);
        });
    },

    populateSelectObjectTypeList: function(objectTypeGroup) {
        var i, keys = Object.keys(objectTypeGroup);
        var column = $("#dialogue-panel-object-type");

        column.html('');
        for (i = 0; i < keys.length; i++) {
            var listItem = document.createElement('li');

            $(listItem).append(keys[i]);
            $(listItem).on('click', function(index) {
                column.find('.active').removeClass('active');
                $(this).addClass('active');
                var globalObject = new GameCreator[objectTypeGroup[keys[index]]]({});
                $("#add-global-object-form-content").html(globalObject.getAddGlobalObjectPropertiesContent('Properties for ' + GameCreator.helpers.labelize(globalObject.objectType)));
                GameCreator.helpers.populateGlobalObjectPropertiesForm(globalObject.getDefaultState().attributes, GameCreator[globalObject.objectType].objectAttributes, 'add-global-object-form-content');
                $("#save-new-global-object-button").click(function() {
                    var objectName = $("#add-global-object-name-input").val();
                    globalObject.objectName = objectName;
                    GameCreator.globalObjects[objectName] = globalObject;
                    GameCreator.UI.createLibraryItem(globalObject);
                    GameCreator.UI.closeDialogue();
                });
            }.bind(listItem, i));

            column.append(listItem);
        }
        
    },

    setupSceneObjectForm: function(sceneObject) {
        var container = $('#side-properties-form-container');
        container.html(sceneObject.parent.getSceneObjectForm());
        GameCreator.helpers.populateSidePropertiesForm(sceneObject, sceneObject.update.bind(sceneObject));
    },

    setupValuePresenter: function(container, attributes, attrName, obj, onChangeCallback) {
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
            try {
                var value = GameCreator.saveInputValueToObject($(input), attributes);
                if (onChangeCallback) {
                    onChangeCallback(value);
                }
            } catch (err) {
                $(display).addClass('properties-validation-flash'); // ANIMATION
                setTimeout(function() { $(display).removeClass('properties-validation-flash'); }, 700);
                GameCreator.UI.createValidationBox(container, err);
            }
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
                input.keypress(function(event){
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    if(keycode + '' === '13'){
                        closeInput(this);
                    }
                });
            }
        }

        container.parent().off('click').on('click', onClickFunc);
    },

    createValidationBox: function(target, message) {
        var messageBox = document.createElement('div');
        $(messageBox).addClass('arrow_box');
        $(messageBox).html(message);
        var targetBoundingBox = target[0].getBoundingClientRect();
        messageBox.style.position = 'absolute';
        document.body.appendChild(messageBox);
        var msgBoxBoundingBox = messageBox.getBoundingClientRect();
        messageBox.style['z-index'] = '99';
        messageBox.style.top = (targetBoundingBox.top - msgBoxBoundingBox.height - 10) + 'px';
        messageBox.style.left = (targetBoundingBox.left - msgBoxBoundingBox.width / 2 + 10) + 'px';
        
        var fade = function() { $(messageBox).fadeOut(200); };
        setTimeout(fade, 5000);
        $(messageBox).click(fade);
    },
}
