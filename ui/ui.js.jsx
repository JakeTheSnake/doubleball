GameCreator.UI = {    
    state: {
        selectedGlobalItem: null,
        selectedItemType: null
    },
    setSelectedGlobalObject: function(globalObj) {
        GameCreator.UI.state.selectedGlobalItem = globalObj;
        GameCreator.UI.state.selectedItemType = 'globalObject';
    },
    setSelectedGlobalCounter: function(globalCounter) {
        GameCreator.UI.state.selectedGlobalItem = globalCounter;
        GameCreator.UI.state.selectedItemType = 'globalCounter';
    },
    initializeUI: function() {
        $("#dialogue-overlay").on("click", GameCreator.UI.closeDialogue);
        $("#add-global-object-button").on("click", GameCreator.UI.openAddGlobalObjectDialogue);
        $("#edit-global-object-button").on("click", function() {
            GameCreator.UI.openEditGlobalObjectDialogue(GameCreator.selectedLibraryObject);
        });

        $("#rename-global-object-button").on("click", function() {
            GameCreator.UI.renameGlobalObject(GameCreator.selectedLibraryObject);
        });

        $("#delete-global-object-button").on("click", function() {
            GameCreator.UI.deleteGlobalObject(GameCreator.selectedLibraryObject);
        });
        
        $("#toolbar-top button").on('click', function() {
            $("#toolbar-top button").removeClass('btn-active');
            $(this).addClass('btn-active');
        });

        $('#library-preview').on('mousedown', 'img', function(e) {
            GameCreator.UI.dragGlobalObjectToScene(e, GameCreator.selectedLibraryObject);
        });

        $("#library-tabs a").on('click', function() {
            GameCreator.UI.setObjectLibraryTab($(this));
        });

        $('#toolbar-global-counters').click(GameCreator.UI.openGlobalCountersDialogue);
        $('#toolbar-game-properties').click(GameCreator.UI.openGamePropertiesDialogue);

        $(document).on('GameCreator.addedSceneObject GameCreator.removedSceneObject', function(){
            GameCreator.UI.drawSceneObjectLibrary();
        });
        GameCreator.UI.setupPublishButtons();
        GameCreator.UI.redrawLibrary();
        GameCreator.UI.drawSceneTabs();
        GameCreator.UI.drawSceneObjectLibrary();
    },

    setupPublishButtons: function() {
        if (window.gon) {
            var publishedLabel = gon.published ? "PUBLISHED" : "PRIVATE";
            $("#published-label").html(publishedLabel);

            $("#published-buttons input").on("click", function() {
                publishedLabel = $(this).data("name");
                $("#published-label").html(publishedLabel);

            });

            $("#published-buttons label").on("mouseover", function() {
                var inputId = $(this).attr("for");
                $("#published-label").html($("#" + inputId).data("name"));
            });

            $("#published-buttons label").on("mouseout", function() {
                $("#published-label").html(publishedLabel);
            });
        
            var published = gon.published;

            $("#private-button").prop('checked', published === 0);
            $("#unlist-button").prop('checked', published === 1);
            $("#publish-button").prop('checked', published === 2);

            $("#published-buttons input").change(function() {
                var formData = new FormData(document.forms.namedItem('published_form'));
                formData.append('authenticity_token', gon.auth_key);
                var oReq = new XMLHttpRequest();
                oReq.open("POST", "publish", true);
                

                oReq.send(formData);
            });
        }
    },

    redrawLibrary: function() {
        var globalObjectNames = Object.keys(GameCreator.globalObjects);
        $(".global-object-list").empty();
        globalObjectNames.forEach(function(globalObjName) {
            GameCreator.UI.createLibraryItem(GameCreator.globalObjects[globalObjName]);
        });
    },

    saveNewGlobalObject: function(objectType) {
        var args = {};
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

            if(GameCreator.selectedLibraryObject === globalObj) {
                $(listElementButton).addClass('active');
            }

            $(listElementButton).on("click", function(iGlobalObject) {
                GameCreator.selectedLibraryObject = iGlobalObject;
                GameCreator.UI.populateOpenDialogue(iGlobalObject);
            }.bind(this, globalObj));
            $("#dialogue-window .global-object-list").append(listElementButton);
        }
    },
   
    createLibraryItem: function(globalObj) {
        var listElementButton = GameCreator.htmlStrings.globalObjectLibraryItem(globalObj);
        GameCreator.UI.setupGlobalLibraryItemListeners(listElementButton, globalObj);
        $(".global-object-list").append(listElementButton);
    },

    renameGlobalObject: function(globalObj) {
        var textField = document.createElement('input');
        var replacementListItem = document.createElement('li');

        var selectedListItem = $('#global-object-library li.active');
        $(textField).attr('type', 'text');
        $(textField).attr('value', globalObj.objectName);
        
        var finishedAction = function(event) {
            if (event.which === 13 || event.type === 'blur') {
                try {
                    GameCreator.renameGlobalObject(globalObj.objectName, $(this).val());
                } catch (e) {
                    GameCreator.UI.createValidationBox($(this), e);
                }
                GameCreator.UI.redrawLibrary();
                $(".global-object-list").trigger('recalculateActiveObject');
            } else if (event.which === 27) {
                GameCreator.UI.redrawLibrary();
                $(".global-object-list").trigger('recalculateActiveObject');
            }
        };
        $(textField).keyup(finishedAction);
        $(textField).keypress(finishedAction);
        $(textField).blur(finishedAction);

        $(replacementListItem).append(textField);
        selectedListItem.replaceWith(replacementListItem);
        textField.select();
    },

    deleteGlobalObject: function(globalObj) {
        if (confirm("Are you sure you want to delete " + globalObj.objectName + "? All references to this object will also be removed.")) {
            GameCreator.removeGlobalObject(globalObj.id);
            GameCreator.UI.redrawLibrary();
        }
    },

    drawSceneObjectLibrary: function() {
        var scene = GameCreator.getActiveScene();
        if (scene) {
            var sceneObjectList = $('.scene-object-list')
            sceneObjectList.empty();
            scene.objects.forEach(function(sceneObject){
                var sceneObjectListItem = GameCreator.htmlStrings.sceneObjectLibraryItem(sceneObject);
                sceneObjectList.append(sceneObjectListItem);
                GameCreator.UI.setupSceneLibraryItemListeners(sceneObjectListItem, sceneObject);
            });
        }
    },

    setObjectLibraryTab: function(tabElement) {
        var id = $(tabElement).data('panelid');
        $('.object-library-panel').hide();
        $('#' + id).show();
        $('#library-tabs a').removeClass('active');
        $(tabElement).addClass('active');
    },

    setSelectedSceneObjectInLibrary: function() {
        GameCreator.UI.setObjectLibraryTab(document.getElementById('scene-object-library-tab'));
    },

    setupSceneLibraryItemListeners: function(listElementButton, sceneObject) {
        $(listElementButton).on("click", function(e){
            $('.library-scene-object-button').removeClass('active');
            $(listElementButton).addClass('active');
            GameCreator.selectedObject = sceneObject;
            GameCreator.UI.editSceneObject();
        });
    },

    setupGlobalLibraryItemListeners: function(listElementButton, globalObj) {
        $(listElementButton).on("dblclick", function(e){
            GameCreator.UI.openEditGlobalObjectDialogue(globalObj);
        });

        $(listElementButton).on("click", function(e){
            $('#edit-global-object-button').removeClass('disabled');
            $('#rename-global-object-button').removeClass('disabled');
            GameCreator.selectedLibraryObject = globalObj;
            GameCreator.UI.setPreviewImage(globalObj.getDefaultState().attributes.image.src);
            $('.library-global-object-button').removeClass('active');
            $(listElementButton).addClass('active');
            GameCreator.UI.setSelectedGlobalObject(globalObj);
        });

        $(".global-object-list").on('recalculateActiveObject', function(){
            if (GameCreator.selectedLibraryObject === globalObj) {
                $(listElementButton).trigger('click');
            }
        });

        $(listElementButton).on("mousedown", function(e){
            GameCreator.UI.dragGlobalObjectToScene(e, globalObj);
        });
    },

    setPreviewImage: function(imgSrc) {
        var previewImage = document.createElement('img');
        previewImage.src = imgSrc;
        $('.library-preview').html(previewImage);
    },

    dragGlobalObjectToScene: function(e, globalObj) {
        var image = new Image();
        //Width and height are ranges, get the largest possible value from range.
        var height = globalObj.getDefaultState().attributes.height.slice(-1)[0];
        var width = globalObj.getDefaultState().attributes.width.slice(-1)[0];
        image.src = globalObj.getDefaultState().attributes.image.src;
        $(image).css("position", "absolute");
        $(image).css("top", e.pageY - (height/2));
        $(image).css("left", e.pageX - (width/2));
        $(image).css("display", "none");
        $(image).css("width", width + "px");
        $(image).css("height", height + "px");

        $("body").append(image);
        var initialX = e.pageX;
        var initialY = e.pageY;
        $(window).on("mousemove.dragGlobalMenuItem", function(e){
            if (Math.abs(initialX - e.pageX) > 3 || Math.abs(initialY - e.pageY) > 3){
                $(image).css("display", "block"); 
                $(image).css("top", e.pageY - (height/2));
                $(image).css("left", e.pageX - (width/2));
            }
            return false;
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
    },
 
    openEditActionsWindow: function(infoWindowHtml, caSet, eventType, objName) {  
        //Only select actions if GameCreator isn't already paused for action selection.
        GameCreator.pauseGame();
        
        GameCreator.UI.openSelectActionsDialogue(infoWindowHtml, caSet, eventType, objName);

        $("#dialogue-overlay").one("click", function() {
            GameCreator.resumeGame();
        });
    },

    openSelectActionsDialogue: function(infoWindowHtml, caSet, eventType, objName) {
        GameCreator.UI.openDialogue(700, 400, GameCreator.htmlStrings.editActionsWindow(infoWindowHtml, objName));
        React.render(<ActionColumn actions={caSet.actions} eventType={eventType}/>, document.getElementById('dialogue-right-action-column'));
        React.render(<EventItemSelector/>, document.getElementById('dialogue-right-select-column'));
    },

    openGlobalCountersDialogue: function() {       
        React.render(
            <GlobalCounterDialogueBottom/>,
            document.getElementById('dialogue-window')
        );
        GameCreator.UI.openDialogue(700, 570, null);
    },

    openGamePropertiesDialogue: function() {       
        React.render(
            <DialogueLeft title="Game Properties">
                <GamePropertiesForm properties={{width: GameCreator.width, height: GameCreator.height}}/>
            </DialogueLeft>,
            document.getElementById('dialogue-window')
        );
        GameCreator.UI.openDialogue(700, 570, null);
    },
    
    //Add global object functions
    
    openAddGlobalObjectDialogue: function() {
        GameCreator.UI.openDialogue(700, 570, GameCreator.htmlStrings.addGlobalObjectWindow());
        GameCreator.UI.populateSelectObjectTypeGroupList();
    },

   
    //Edit global object functions
    
    openEditGlobalObjectDialogue: function(globalObj) {
        GameCreator.UI.openDialogue(900, 570, globalObj.getEditWindow());

        GameCreator.UI.populateOpenDialogue(globalObj);
    },

    populateOpenDialogue: function(globalObj) {
        $('#object-manager-object-name').html(globalObj.objectName);
        globalObj.setupPropertiesForm($("#dialogue-window").find("#dialogue-edit-content"));
        $("#dialogue-panel-edit").find("a").removeClass("active");
        $("#dialogue-panel-edit").find("a:first-child").addClass("active");

        $("#dialogue-panel-edit").on('click', 'a', function() {
            globalObj[$(this).data("uifunction")](document.getElementById('dialogue-edit-content'));
            $(this).parent().find("a").removeClass("active");
            $(this).addClass("active");
        });

        GameCreator.UI.drawDialogueLibrary();
        var previewImage = document.createElement('img');
        previewImage.src = globalObj.getDefaultState().attributes.image.src;
        $("#object-manager-library-preview").html(previewImage);

        GameCreator.UI.loadInputStyle();
    },

    loadInputStyle: function() {
        $("#dialogue-window .input-container input[type=text]").each(function() {
            var textInput = $(this);
            textInput.on('focus', function() {
                $(this).parent().addClass('input-container-active');
                $(this).removeAttr('placeholder');
            });

            textInput.on('blur', function() {
                if ($(this).val().length == 0) {
                    $(this).parent().removeClass('input-container-active');
                    $(this).attr('placeholder', textInput.parent().find('label').html());
                }
            });

            if (textInput.val().length != 0) {
                $(this).parent().addClass('input-container-active');
                $(this).removeAttr('placeholder');
            } else {
                $(this).parent().removeClass('input-container-active');
                $(this).attr('placeholder', textInput.parent().find('label').html());
            }
        })
    },
    
    //General dialogue functions
    
    openDialogue: function(width, height, content) {
        width = width || 900;
        height = height || 570;
        $("#dialogue-window").show();
        if (content) $("#dialogue-window").html(content);
        $("#dialogue-window > .bottom").addClass("slide-in-from-bottom");
        $("#dialogue-window > .left").addClass("slide-in-from-left");
        $("#dialogue-window > .right").addClass("slide-in-from-right");
        $("#dialogue-overlay").show();
        $("#close-dialogue-button").one('click', function(){
            GameCreator.UI.closeDialogue();
        });
        GameCreator.UI.loadInputStyle();
    },
    
    closeDialogue: function() {
        $("#dialogue-window").hide();
        React.unmountComponentAtNode(document.getElementById('dialogue-window'));
        $(".arrow_box").hide();
        $("#dialogue-overlay").hide();
        $(".global-object-list").trigger('recalculateActiveObject');
    },

    showDebugInformation: function(info){
        $("#debug-info-pane").html(GameCreator.htmlStrings.debugInformation(info));
    },

    setupSceneTabs: function() {
        GameCreator.UI.drawSceneTabs();
        $('#scenes').off('click');
        $('#scenes').on('click', '.btn-group > a:not(#add-scene-tab)', function() {
            GameCreator.activeSceneId = parseInt($(this).data('sceneid'));
            GameCreator.editActiveScene();
        });

        var draggedSceneId;
        $('#scenes').off('dragstart');
        $('#scenes').off('dragover');
        $('#scenes').off('drop');
        $('#scenes').off('dragleave');
        $('#scenes').on('dragstart', '.btn-group > a:not(#add-scene-tab)', function(e) {
            draggedSceneId = parseInt($(this).data('sceneid'));
            $('#scenes').one('drop', '.btn-group > a:not(#add-scene-tab)', function(e) {
                e.preventDefault();
                var droppedSceneId = parseInt($(this).data('sceneid'));
                if (draggedSceneId !== droppedSceneId) {
                    GameCreator.insertSceneAfter(draggedSceneId, droppedSceneId);
                }
            });
        });

        $('#scenes').on('dragleave', '.btn-group > a:not(#add-scene-tab)', function(e) {
            $(this).removeClass('scene-swap-highlight');
        });

        $('#scenes').on('dragover', '.btn-group > a:not(#add-scene-tab)', function(e) {
            $(this).addClass('scene-swap-highlight');
            e.preventDefault();
        });

        $('#scenes').one('click', '#add-scene-tab', function() {
            GameCreator.addScene();
        });
    },

    drawSceneTabs: function() {
        var result = '';

        result += '<div class="btn-group sequenced">';
        for(var i = 0; i < GameCreator.scenes.length; i++) {
            result += GameCreator.htmlStrings.sceneTab(GameCreator.scenes[i], GameCreator.activeSceneId === GameCreator.scenes[i].id);
        };
        result += GameCreator.htmlStrings.addSceneTab();
        result += '</div>';

        $('#scenes').html(result);
    },
    
    editSceneObject: function() {
        GameCreator.hideRoute();
        if (GameCreator.selectedObject.route) {
            GameCreator.drawRoute(GameCreator.selectedObject.route);
        }
        GameCreator.drawObjectSelectedUI();

        $('#scene-object-library li').removeClass('active');
        $('#scene-object-library li[data-instanceId="' + GameCreator.selectedObject.attributes.instanceId + '"]').addClass('active');

        GameCreator.UI.setupSceneObjectForm(GameCreator.selectedObject);
    },

    updateSceneObjectForm: function(sceneObj) {
        $("#side-property-width span").html(sceneObj.attributes.width);
        $("#side-property-height span").html(sceneObj.attributes.height);
        $("#side-property-x span").html(sceneObj.attributes.x);
        $("#side-property-y span").html(sceneObj.attributes.y);
        $("#side-property-maxX span").html(sceneObj.attributes.maxX);
        $("#side-property-maxY span").html(sceneObj.attributes.maxY);
        $("#side-property-minX span").html(sceneObj.attributes.minX);
        $("#side-property-minY span").html(sceneObj.attributes.minY);
    },

    hideEditModeTools: function() {
        $(".route-node-container").remove();
        $('#scenes').hide();
        $("#edit-mode-tools").hide();
        $('#toolbar-left').hide();
        $("#save-game-button").addClass('disabled');
    },

    showEditModeTools: function() {
        $('#scenes').show();
        $("#edit-mode-tools").show();
        $('#toolbar-left').show();
        $("#save-game-button").removeClass('disabled');
    },

    setupEditEventColumns: function(caSets, columnParentContainer, selectableActions, globalObj) {
        var caSet;

        if (caSets.length === 0) {
            caSet = new GameCreator.ConditionActionSet();
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

    setupConditionsColumn: function (caSets, selectableConditions, globalObj) {
        var conditionsColumn = $("#dialogue-panel-conditions");
        var caSetVMs = [];
        for (var i = 0; i < caSets.length; i++) {
            caSetVMs.push(new GameCreator.CASetVM(caSets[i], selectableConditions, globalObj));
        }

        var addCaSetButton = $(document.createElement('a'));
        $(addCaSetButton).addClass('btn success wide');
        $(addCaSetButton).html('Create group');
        $(addCaSetButton).on('click', function() {
            caSet = new GameCreator.ConditionActionSet();
            caSets.push(caSet);
            caSetVMs.push(new GameCreator.CASetVM(caSet, selectableConditions, globalObj));
            conditionsColumn.trigger('redrawList');
        });

        conditionsColumn.parent().find('a').remove();
        conditionsColumn.parent().append(addCaSetButton);
        conditionsColumn.on('redrawList', function (evt, activeCASetVM) {
            var isActive;
            conditionsColumn.html('');
            var conditionsUL = $(document.createElement('ul'));
            conditionsUL.addClass('parameter-groups');
            conditionsColumn.append(conditionsUL);

            if (!activeCASetVM && caSetVMs.length) {
                activeCASetVM = caSetVMs[0];
                $("#dialogue-panel-actions").trigger('redrawList', activeCASetVM);
            }

            for (i = 0; i < caSetVMs.length; i+=1) {
                isActive = activeCASetVM === caSetVMs[i];
                conditionsUL.append(caSetVMs[i].getPresentation(isActive));
            }

            $("#dialogue-panel-add-list").empty();
        });
        conditionsColumn.on('clearColumn', function () {
            conditionsColumn.parent().find('a').remove();
            conditionsColumn.empty();
        });
    },

    setupActionsColumn: function() {
        var actionsColumn = $("#dialogue-panel-actions");
        var i;
        actionsColumn.on('redrawList', function(evt, activeCASetVM) {
            actionsColumn.parent().find('a.success').remove(); // Remove add action-button
            actionsColumn.empty();
            var addActionButton = document.createElement('a');
            $(addActionButton).addClass('btn tab success wide');
            $(addActionButton).attr('id', 'add-action-button');
            $(addActionButton).html('Add action');

            var actionsUL = $(document.createElement('ul'));
            actionsUL.addClass('parameter-groups');
            actionsColumn.append(actionsUL);

            actionsColumn.parent().append(addActionButton);
            
            for (i = 0; i < activeCASetVM.actionVMs.length; i+=1) {
                actionsUL.append(activeCASetVM.actionVMs[i].getPresentation(activeCASetVM));
            }
            
            $(addActionButton).on('click', function() {
                GameCreator.UI.populateSelectActionList(activeCASetVM);
            });

            $("#dialogue-panel-add-list").empty();
        });
        actionsColumn.on('clearColumn', function() {
            actionsColumn.parent().find('a.success').remove();// Remove add action-button
            actionsColumn.empty();
        });
    },

    populateImageSelectControls: function(container, input) {
        container.html(GameCreator.htmlStrings.imageSelectControls());
        
        $('.selected-image-preview').attr('src', input.val());

        $('.upload-image-button').click(function(){
            GameCreator.UI.openImageSelectPopup(input);
        })
    },

    openImageSelectPopup: function(input) {
        var container = document.getElementById('image-select-popup');
        React.render(<ImagePicker input={input} parent={container}/>, container);
        
        $(container).show();
        
        $("#image-select-overlay").show();

        $("#image-select-overlay").one('click', function(){
            GameCreator.UI.closeImageSelectPopup($(container));
        });
    },


    closeImageSelectPopup: function(container) {
        container.empty();
        container.hide();
        $("#image-select-overlay").hide();
    },

    populateSelectConditionList: function(activeCASetVM) {
        var i;
        var column = $("#dialogue-panel-add-list");

        column.html('');

        for (i = 0; i < Object.keys(GameCreator.conditions).length; i++) {
            var listItem = document.createElement('a');
            var conditionName = Object.keys(GameCreator.conditions)[i];

            $(listItem).data('condition', conditionName);
            $(listItem).addClass('btn tab');
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
            var listItem = document.createElement('a');
            listItem.href = "#";
            $(listItem).addClass('btn tab');
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
            {text: 'Counter Displays', value: 'counterDisplayTypes'}
        ];
        objectGroups.forEach(function(group){
            listItem = document.createElement('a');
            listItem.href = "#";
            $(listItem).addClass('btn tab');
            $(listItem).append(group.text);
            $(listItem).on('click', function() {
                $("#add-global-object-form-content").empty();
                column.find('.active').removeClass('active');
                $(this).addClass('active');
                $('#add-global-object-form-content').html(GameCreator.htmlStrings.objectTypeGroupDescription(group.value));
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
            var listItem = document.createElement('a');
            listItem.href = "#";
            $(listItem).addClass('btn tab');
            $(listItem).append(keys[i]);
            $(listItem).on('click', function(index) {
                column.find('.active').removeClass('active');
                $(this).addClass('active');
                var globalObject = new GameCreator[objectTypeGroup[keys[index]]]({});
                $("#add-global-object-form-content").html(globalObject.getAddGlobalObjectPropertiesContent('Properties for ' + GameCreator.helpers.labelize(globalObject.objectType)));
                GameCreator.helpers.populateGlobalObjectPropertiesForm(globalObject.getDefaultState().attributes, GameCreator[globalObject.objectType].objectAttributes, 'add-global-object-form-content');
                GameCreator.UI.populateImageSelectControls($('#global-object-image-upload-controls'), $('#object-property-image-container input'));
                $("#save-new-global-object-button").click(function() {
                    var objectName = $("#add-global-object-name-input").val();
                    globalObject.objectName = objectName;
                    GameCreator.addTempGlobalObjectToGame(globalObject);
                    GameCreator.UI.closeDialogue();
                });
                GameCreator.UI.loadInputStyle();
            }.bind(listItem, i));

            column.append(listItem);
        }
        
    },

    setupSceneObjectForm: function(sceneObject) {
        var container = $('#side-properties-form-container');
        container.html(sceneObject.parent.getSceneObjectForm());
        container.append(GameCreator.htmlStrings.sceneObjectDeleteButton());
        GameCreator.helpers.populateSidePropertiesForm(sceneObject, sceneObject.update.bind(sceneObject));
        $('#delete-sceneobject-button').on('click', function() {
            sceneObject.remove();
        });
    },

    deleteButtonElement: function() {
        var deleteButton = document.createElement('a');
    
        $(deleteButton).html('X');
        $(deleteButton).addClass('btn warning');

        return deleteButton;
    },

    setupValuePresenter: function(container, attributes, attrName, obj, onChangeCallback) {
        var input, select, paramLen, onClickFunc, closeInput, inputOpen = false;
        container = $(container);
        //If the template does not specify that this value should be shown, return.
        if (!container.length) {
            return;
        }
        var display = document.createElement('span');
        var inputType = container.data('inputtype');
        $(display).html(GameCreator.helpers.getPresentationForInputValue(attributes, attrName, inputType, obj));
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
                $(display).addClass('properties-validation-flash');
                setTimeout(function() { $(display).removeClass('properties-validation-flash'); }, 700);
                GameCreator.UI.createValidationBox(container, err);
            }
            $(display).html(GameCreator.helpers.getPresentationForInputValue(attributes, attrName, inputType, obj));
            container.html(display);
            container.parent().off('click').on('click', onClickFunc);
            if (obj instanceof GameCreator.SceneObject) {
                GameCreator.render(true);
            }
            
        }

        onClickFunc = function(evt) {
            if (!inputOpen) {
                inputOpen = true;
                container.html(GameCreator.htmlStrings[inputType](attrName, attributes[attrName], obj, attributes[$(container).data('dependancy')]));
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
                input.select();
                input.keypress(function(event){
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    if(keycode + '' === '13'){
                        closeInput(this);
                    }
                });
            }
        }

        container.off('click').on('click', onClickFunc);
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

    updateGameProperties: function(props) {
        document.getElementById('main-canvas').width = props.width;
        document.getElementById('main-canvas').height = props.height;
        document.getElementById('bg-canvas').width = props.width;
        document.getElementById('bg-canvas').height = props.height;
        document.getElementById('ui-canvas').width = props.width;
        document.getElementById('ui-canvas').height = props.height;
        GameCreator.width = props.width;
        GameCreator.height = props.height;
        GameCreator.editActiveScene();
    },

}
