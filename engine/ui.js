GameCreator.UI = {
    addActiveObject: function(){
        var args = {};
        GameCreator.saveFormInputToObject("add-global-object-window-content", args);
        GameCreator.addGlobalObject(args, "ActiveObject");
    },
    
    addPlayerObject: function(){
        var obj, args = {};
        GameCreator.saveFormInputToObject("add-global-object-window-content", args);
        if ($("#player-object-type").val() == "addPlayerMouseObject") {
            obj = GameCreator.addGlobalObject(args, "MouseObject");
        } else if ($("#player-object-type").val() == "addPlayerPlatformObject") {
            obj = GameCreator.addGlobalObject(args, "PlatformObject");
        } else if ($("#player-object-type").val() == "addPlayerTopDownObject") {
            obj = GameCreator.addGlobalObject(args, "TopDownObject");
        }
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
            var aspectRatio = globalObj.width / globalObj.height;
            $(window).on("mousemove.dragGlobalMenuItem", function(e){
                if(Math.abs(initialX - e.pageX) > 3 || Math.abs(initialY - e.pageY) > 3){
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
                    var newInstance = GameCreator.createSceneObject(globalObj, GameCreator.scenes[GameCreator.activeScene], {x:x-offsetX-globalObj.width[0]/2, y:y-offsetY-globalObj.height[0]/2});
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
        
        $("#dialogue-overlay").one("click", function(){
            GameCreator.resumeGame();
        });
    },
    
    
    setupEditActionsContent: function(text, choosableActions, selectedActions, thisName){
        
        $("#action-selector").on("change", function(){
            $("#select-action-parameters-content").html("");
            $("#select-action-timing-content").html("");
            $("#select-action-parameters-container").css("display", "block");
            $("#select-action-timing-container").css("display", "block");
            for(var i = 0;i < choosableActions[$(this).val()].params.length;++i) {
                $("#select-action-parameters-content").append(GameCreator.htmlStrings.parameterGroup(choosableActions[$(this).val()].params[i].label() + choosableActions[$(this).val()].params[i].input(thisName)));
            }
            var timing = choosableActions[$("#action-selector").val()].timing;
            $("#select-action-timing-content").append(GameCreator.htmlStrings.timingGroup(timing));
            $("#timing-selector").on("change", function(){
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
                parameters[action.params[i].inputId] = GameCreator.helperFunctions.getValue($("#" + action.params[i].inputId));
            }
            
            var timingType = GameCreator.helperFunctions.getValue($("#timing-selector"));
            var timingTime = GameCreator.helperFunctions.getValue($("#timing-time"));
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
            if($(this).val() == "free") {
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
        $("#add-player-object-movement-parameters").html(GameCreator.MouseObject.movementInputs());
        $("#player-object-type").on("change", function(){
            var objectType = ($(this).val());
            GameCreator.addObject = GameCreator.UI[objectType];
            if (objectType === "addPlayerMouseObject") {
              $("#add-player-object-movement-parameters").html(GameCreator.MouseObject.movementInputs());
            } else if (objectType === "addPlayerPlatformObject") {
              $("#add-player-object-movement-parameters").html(GameCreator.PlatformObject.movementInputs());
            } else if (objectType === "addPlayerTopDownObject") {
              $("#add-player-object-movement-parameters").html(GameCreator.TopDownObject.movementInputs());
            }
        });
        $("#add-global-object-window-content .saveButton").on("click", function(){GameCreator.UI.addPlayerObject();GameCreator.UI.closeDialogue()});
    },
    
    //Add counter object functions.
    setupAddCounterObjectForm: function() {
      $("#add-global-object-window-content").html(GameCreator.CounterObject.addGlobalObjectForm());
      $("#counter-representation").on("change", function(){
        if($(this).val() === "text") {
          $("#add-counter-object-counter-representation-content").html(GameCreator.CounterObject.counterObjectTextForm());
        } else if ($(this).val() === "image"){
          $("#add-counter-object-counter-representation-content").html(GameCreator.CounterObject.counterObjectImageForm());
        }
      });
      $("#add-global-object-window-content .saveButton").on("click", function(){GameCreator.UI.saveCounterObject();GameCreator.UI.closeDialogue()});
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
            GameCreator.UI[$(this).data("uifunction")]($("#dialogue-window").find("#edit-global-object-window-content"), globalObj);
            $(this).parent().find(".tab").removeClass("active");
            $(this).addClass("active");
        });
        GameCreator.UI.setupEditGlobalObjectPropertiesForm($("#dialogue-window").find("#edit-global-object-window-content"), globalObj);
    },
    
    setupEditGlobalObjectPropertiesForm: function(container, globalObj) {
      var html = '<div id="edit-global-object-properties-content">' +
      globalObj.getPropertiesForm() +
      '</div>';
      container.html(html);
        container.find("#save-global-object-properties-button").on("click", function() {
            GameCreator.saveFormInputToObject("edit-global-object-properties-content", globalObj);
            GameCreator.UI.redrawLibrary();
            GameCreator.UI.closeDialogue();
        });
    },
    
    setupEditGlobalObjectCollisionsForm: function(container, globalObj) {
        var collisionObjects = [];
        for(var i = 0; i < globalObj.collisionActions.length; i++) {
            collisionObjects.push(GameCreator.helperFunctions.findGlobalObjectById(globalObj.collisionActions[i].id));
        }
        container.html(globalObj.getCollisionsContent(collisionObjects));
        container.find(".collisionMenuElement").on("click", function(){
            var targetName = $(this).data("name");
            var actions;
            if(globalObj.objectType === "mouseObject") {
              actions = GameCreator.actionGroups.mouseCollisionActions;
            } else {
              actions = GameCreator.actionGroups.collisionActions;
            }
            var targetId = GameCreator.helperFunctions.findGlobalObjectByName(targetName).id;
            var existingActions = GameCreator.helperFunctions.getObjectById(globalObj.collisionActions, targetId).actions;
            GameCreator.UI.createEditActionsArea(
                "Actions for collision with " + targetName, 
                actions,
                existingActions,
                $("#edit-collision-actions-object-content"),
                globalObj.objectName
            );
        });
        $("#add-new-collision-button").on("click", function(){
          $("#edit-collision-actions-object-content").html(GameCreator.htmlStrings.collisionObjectSelector(globalObj));
          $(".addCollisionObjectElement").one("click", function(){
            var targetId = GameCreator.helperFunctions.findGlobalObjectByName($(this).data("objectname")).id;
            var newActionItem = {id: targetId, actions: []};
            globalObj.collisionActions.push(newActionItem);
            GameCreator.UI.setupEditGlobalObjectCollisionsForm(container, globalObj);
          });
        });
    },
    
    setupEditGlobalObjectKeyActionsForm: function(container, globalObj) {
        container.html(globalObj.getKeyActionsContent());
        container.find(".keyMenuElement").on("click", function(){
            var keyName = $(this).data("name");
            var actions;
        if(globalObj.objectType === "mouseObject") {
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
            $(".addKeyObjectElement").one("click", function(){
                globalObj.keyActions[$(this).data("keyname")] = [];
                GameCreator.UI.setupEditGlobalObjectKeyActionsForm(container, globalObj);
            });
        });
    },
    
    setupEditGlobalObjectOnClickActionsForm: function(container, globalObj) {
      var text = "Actions on click";
      var choosableActions;
      if(globalObj.objectType === "mouseObject") {
        choosableActions = GameCreator.actionGroups.mouseNonCollisionActions;
      } else {
        choosableActions = GameCreator.actionGroups.nonCollisionActions;
      }
        
        //If onClickActions has not yet been edited from anywhere, instantiate to empty array.
        if(globalObj.onClickActions == undefined) {
            globalObj.onClickActions = [];
        }
        
      var existingActions = globalObj.onClickActions;
      GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, globalObj.objectName);
    },

    setupEditGlobalObjectOnDestroyActionsForm: function(container, globalObj) {
        var text = "Actions on Destruction";
        var choosableActions = GameCreator.actionGroups.onCreateActions;
        if(globalObj.objectType === "mouseObject") {
            choosableActions = GameCreator.actionGroups.mouseNonCollisionActions;
        } else {
            choosableActions = GameCreator.actionGroups.nonCollisionActions;
        }
        
        //If onCreateActions has not yet been edited from anywhere, instantiate to empty array.
        if(globalObj.onDestroyActions == undefined) {
            globalObj.onDestroyActions = [];
        }
        
        var existingActions = globalObj.onDestroyActions;
        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, globalObj.objectName);
    },

    setupEditGlobalObjectOnCreateActionsForm: function(container, globalObj) {
        var text = "Actions on Creation";
        var choosableActions = GameCreator.actionGroups.onCreateActions;
        
        //If onCreateActions has not yet been edited from anywhere, instantiate to empty array.
        if(globalObj.onCreateActions == undefined) {
            globalObj.onCreateActions = [];
        }
        
        var existingActions = globalObj.onCreateActions;
        GameCreator.UI.createEditActionsArea(text, choosableActions, existingActions, container, globalObj.objectName);
    },
    
    setupEditGlobalObjectCountersForm: function(container, globalObj) {
       container.html(globalObj.getCountersContent());
       $("#add-new-counter-button").on("click", function(){
            $("#edit-counters-counter-content").html(GameCreator.htmlStrings.createCounterForm());
            $("#edit-counters-counter-content .saveButton").one("click", function(){
              var counterName = $("#edit-counters-counter-content #counter-name").val();
                globalObj.parentCounters[counterName] = new GameCreator.Counter();
                GameCreator.UI.setupEditGlobalObjectCountersForm(container, globalObj);
            });
        });
        container.find(".counterMenuElement").on("click", function(){
          var counterName = $(this).data("name");
          GameCreator.UI.setupEditCounterEvents(globalObj, counterName, $("#edit-counter-event-content"));
      });
    },
    
    setupEditCounterEvents: function(globalObj, counterName, container) {
        container.html(globalObj.getCounterEventsContent(counterName));
        $("#edit-counter-event-actions-content").html("");
        $("#add-new-counter-event-button").on("click", function(){
            $("#edit-counter-event-actions-content").html(GameCreator.htmlStrings.createCounterEventForm());
            $("#edit-counter-event-value-field").hide();
            $("#edit-counter-event-actions-content .saveButton").one("click", function(){
                var eventType = $("#edit-counter-event-actions-content #edit-counter-event-type").val();
                var eventValue = $("#edit-counter-event-actions-content #edit-counter-event-value").val();
                globalObj.parentCounters[counterName][eventType][eventValue] = [];
                GameCreator.UI.setupEditCounterEvents(globalObj, counterName, container);
            });
        });
        
        container.find(".counterEventMenuElement").on("click", function(){
            var eventType = $(this).data("type");
            var eventValue = $(this).data("value");
            var existingActions;

            //If there is no eventValue it's an onIncrease or onDecrease event.
            if(eventValue) {
            existingActions = globalObj.parentCounters[counterName][eventType][eventValue];
            } else {
            existingActions = globalObj.parentCounters[counterName][eventType];
            }

            var actions;
            if(globalObj.objectType === "mouseObject") {
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
      for(var i = 0; i < scenes.length;i++){
        result += GameCreator.htmlStrings.sceneTab(i, GameCreator.activeScene === i);
      };
      result += GameCreator.htmlStrings.addSceneTab()
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
        if (GameCreator.selectedObject.parent.objectType == "CounterObject") {
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