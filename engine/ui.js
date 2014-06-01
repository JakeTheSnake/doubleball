GameCreator.UI = {
    addActiveObject: function(){
        var args = {};
        GameCreator.saveFormInputToObject("add-global-object-window-content", args);
        GameCreator.addGlobalObject(args, "ActiveObject");
    },
    
    addPlayerObject: function(objectType) {
        var obj, args = {};
        GameCreator.saveFormInputToObject("add-global-object-window-content", args);
        GameCreator.addGlobalObject(args, objectType);
    },

    redrawLibrary: function() {
        var i, keys, listElementButton, globalObj;
        $("#global-object-list").html('');
        keys = Object.keys(GameCreator.globalObjects);
        for (i = 0; i < keys.length; i += 1) {
            globalObj = GameCreator.globalObjects[keys[i]];
            listElementButton = GameCreator.htmlStrings.globalObjectEditButton(globalObj);
            $("#global-object-list").append(listElementButton);
            this.setupLibraryItemListeners(listElementButton, globalObj);
        }
    },
    
    createLibraryItem: function(globalObj) {
        var listElementButton = GameCreator.htmlStrings.globalObjectEditButton(globalObj);
        $("#global-object-list").append(listElementButton);
        this.setupLibraryItemListeners(listElementButton, globalObj);
    },

    setupLibraryItemListeners: function(listElementButton, globalObj) {
        $(listElementButton).on("click", function(e){
            GameCreator.UI.openEditGlobalObjectDialogue(globalObj);
        });
        $(listElementButton).on("mousedown", function(e){
            var image = new Image();
            image.src = $(this).find("button").attr("data-imgsrc");
            $(image).css("position", "absolute");
            $(image).css("top", e.pageY-45);
            $(image).css("left", e.pageX-45);
            $(image).css("display", "none");
            $(image).css("width", "90px");
            $("body").append(image);
            var initialX = e.pageX;
            var initialY = e.pageY;
            var aspectRatio = globalObj.getDefaultState().width / globalObj.getDefaultState().height;
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
                    var args = {x: x - offsetX - globalObj.getDefaultState().width[0] / 2, 
                                y: y - offsetY - globalObj.getDefaultState().height[0] / 2};
                    var newInstance = GameCreator.createSceneObject(globalObj, GameCreator.scenes[GameCreator.activeScene], args);
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
        
        $( "#select-action-add-action" ).click(function( event ) {                
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
        $("#dialogue-window").find(".tab").first().addClass("active");
        $("#dialogue-window").find(".tab").on("click", function() {
            GameCreator.UI[$(this).data("uifunction")]();
            $(this).parent().find(".tab").removeClass("active");
            $(this).addClass("active");
        });
        GameCreator.UI.setupAddActiveObjectForm();
    },
    
    setupAddActiveObjectForm: function() {
        $("#add-global-object-window-content").html(GameCreator.ActiveObject.addGlobalObjectForm());
        $("#add-active-object-movement-parameters").html(GameCreator.ActiveObject.freeMovementInputs());
        $("#active-object-movement-type").on("change", function(){
            if ($(this).val() == "free") {
                $("#add-active-object-movement-parameters").html(GameCreator.ActiveObject.freeMovementInputs());
            }
            else {
                $("#add-active-object-movement-parameters").html(GameCreator.ActiveObject.routeMovementInputs());
            }
        });
        $("#add-global-object-window-content .saveButton").on("click", function(){GameCreator.UI.addActiveObject();GameCreator.UI.closeDialogue()});
    },
    
    setupAddPlayerObjectForm: function() {
        $("#add-global-object-window-content").html(GameCreator.htmlStrings.addPlayerObjectForm());
        
        // Mouse Object is default
        $("#add-player-object-movement-parameters").html(GameCreator.MouseObject.movementInputs());
        var objectType = "MouseObject"; 
        $("#player-object-type").on("change", function() {
            objectType = ($(this).val());
            $("#add-player-object-movement-parameters").html(GameCreator[objectType].movementInputs());
        });
        $("#add-global-object-window-content .saveButton").on("click", function() {
            GameCreator.UI.addPlayerObject(objectType);
            GameCreator.UI.closeDialogue();
        });
    },
    
    //Add counter object functions.
    setupAddCounterObjectForm: function() {
        $("#add-global-object-window-content").html(GameCreator.CounterObject.addGlobalObjectForm());
        $("#counter-representation").on("change", function() {
            if ($(this).val() === "text") {
                $("#add-counter-object-counter-representation-content").html(GameCreator.CounterObject.counterObjectTextForm());
            } else if ($(this).val() === "image") {
                $("#add-counter-object-counter-representation-content").html(GameCreator.CounterObject.counterObjectImageForm());
            }
        });
        $("#add-global-object-window-content .saveButton").on("click", function() {
            GameCreator.UI.saveCounterObject();
            GameCreator.UI.closeDialogue();
        });
        $("#add-counter-object-counter-representation-content").html(GameCreator.CounterObject.counterObjectTextForm());
    },
    
    saveCounterObject: function() {
        var args = {src: "assets/textcounter.png"};
        GameCreator.saveFormInputToObject("add-global-object-window-content", args);
        GameCreator.addGlobalObject(args, 'CounterObject');
    },
    
    //Edit global object functions
    
    openEditGlobalObjectDialogue: function(globalObj) {
        GameCreator.UI.openDialogue(900, 570, globalObj.getEditWindow());
        $("#dialogue-window").find(".tab").first().addClass("active");  
        $("#dialogue-window").find(".tab").on("click", function() {
            globalObj[$(this).data("uifunction")]($("#dialogue-window").find("#edit-global-object-window-content"));
            $(this).parent().find(".tab").removeClass("active");
            $(this).addClass("active");
        });
        globalObj.setupPropertiesForm($("#dialogue-window").find("#edit-global-object-window-content"));
    },
    
    //General dialogue functions
    
    openDialogue: function(width, height, content) {
        width = width || 900;
        height = height || 570;
        $("#dialogue-window").css("width", width).css("height", height).css("left", ($(window).width() / 2 - width / 2)).show();
        $("#dialogue-window").html(content);
        $("#dialogue-overlay").css("height", $(document).height());
        $("#dialogue-overlay").show();
    },
    
    closeDialogue: function() {
        $("#dialogue-window").hide();
        $("#dialogue-overlay").hide();
    },
    
    setupSingleSelectorWithListener: function(elementId, collection, event, callback, attrName, selectedKey) {
      $(document.body).on(event, "#" + elementId, callback);
      return GameCreator.htmlStrings.singleSelector(elementId, collection, attrName, selectedKey);
    },

    showDebugInformation: function(info){
        $("#debug-info-pane").html(GameCreator.htmlStrings.debugInformation(info));
    },

    setupSceneTabs: function(scenes){
        var result = '';
        $('#scene-tabs').show();
        for(var i = 0; i < scenes.length; i++){
            result += GameCreator.htmlStrings.sceneTab(i, GameCreator.activeScene === i);
        };
        result += GameCreator.htmlStrings.addSceneTab();
        $('#scene-tabs').html(result);
        $('#scene-tabs').off('click');
        $('#scene-tabs').on('click', '.tab:not(#add-scene-tab)', function(){
            GameCreator.activeScene = parseInt($(this).data('scenenr'));
            GameCreator.editActiveScene();
        });
        $('#scene-tabs').one('click', '#add-scene-tab', function(){
            GameCreator.addScene();
        });
    },
    
    deleteSelectedObject: function() {
        GameCreator.deleteSelectedObject();
        $("#edit-scene-object-content").html("");
        $("#edit-scene-object-title").html("");
    },

    editSceneObject: function() {
        $("#edit-scene-object-title").html('<div class="headingNormalBlack">' + GameCreator.selectedObject.objectName + '</div>');
        if (GameCreator.selectedObject.parent.objectType === "CounterObject") {
            var uniqueIds = $.extend({" ": undefined}, GameCreator.getUniqueIDsInScene());
            var obj = GameCreator.selectedObject;
            $("#edit-scene-object-content").html(GameCreator.CounterObject.sceneObjectForm(obj, uniqueIds));
            $("#add-counter-object-counter-selector").html();
            $("#add-counter-counter-object").on("change", function() {
                $("#counter-list-content").html(
                    GameCreator.htmlStrings.inputLabel("add-counter-counter-name", "Counter") +
                    GameCreator.htmlStrings.singleSelector("add-counter-counter-name", $(this).val() ? GameCreator.getCountersForGlobalObj($(this).val()) : {}, "counterName")
                );
            });
        } else {
            $("#edit-scene-object-content").html(GameCreator[GameCreator.selectedObject.parent.objectType].sceneObjectForm(GameCreator.selectedObject));
        }
    },

    unselectSceneObject: function() {
        $("#edit-scene-object-title").html("");
        $("#edit-scene-object-content").html("");
    },

    directSceneMode: function() {
        $(".routeNodeContainer").remove();
        $('#scene-tabs').hide();
    }
}