GameCreator.UI = {
    addActiveObject: function(){
        var args = {};
        GameCreator.saveFormInputToObject("add-global-object-window-content", args);
        GameCreator.addGlobalObject(args, "activeObject");
    },
    
    addPlayerObject: function(){
        var obj;
        if($("#player-object-type").val() == "addPlayerMouseObject") {
            obj = GameCreator.addGlobalObject({
                name: $("#player-object-name").val(),
                width: GameCreator.helperFunctions.getValue($("#player-object-width")),
                height: GameCreator.helperFunctions.getValue($("#player-object-height")),
                src: $("#player-object-src").val(),
                maxX: GameCreator.helperFunctions.getValue($("#mouse-object-maxX")),
                maxY: GameCreator.helperFunctions.getValue($("#mouse-object-maxY")),
                minX: GameCreator.helperFunctions.getValue($("#mouse-object-minX")),
                minY: GameCreator.helperFunctions.getValue($("#mouse-object-minY"))
            }, "mouseObject");
        } else if($("#player-object-type").val() == "addPlayerPlatformObject") {
            obj = GameCreator.addGlobalObject({
                name: $("#player-object-name").val(),
                width: GameCreator.helperFunctions.getValue($("#player-object-width")),
                height: GameCreator.helperFunctions.getValue($("#player-object-height")),
                src: $("#player-object-src").val(),
                accY: GameCreator.helperFunctions.getValue($("#platform-object-accY")),
                maxSpeed: GameCreator.helperFunctions.getValue($("#platform-object-max-speed")),
                acceleration: GameCreator.helperFunctions.getValue($("#platform-object-acceleration"))
            }, "platformObject");
        } else if($("#player-object-type").val() == "addPlayerTopDownObject") {
            obj = GameCreator.addGlobalObject({
                name: $("#player-object-name").val(),
                width: GameCreator.helperFunctions.getValue($("#player-object-width")),
                height: GameCreator.helperFunctions.getValue($("#player-object-height")),
                src: $("#player-object-src").val(),
                maxSpeed: GameCreator.helperFunctions.getValue($("#top-down-object-max-speed"))
            }, "topDownObject");
        }
    },
    
    createGlobalListElement: function(globalObj) {
        var listElement = GameCreator.htmlStrings.globalObjectElement(globalObj);
        //$("#global-object-list").append(listElement);
        var listElementButton = GameCreator.htmlStrings.globalObjectEditButton(globalObj);
        $("#global-object-list").append(listElementButton);
        $(listElementButton).on("click", function(e){
            GameCreator.UI.openEditGlobalObjectDialogue(globalObj);
        });
        
        $(listElementButton).on("mousedown", function(e){
            var image = new Image();
            image.src = $(listElement).find("img").attr("src");
            $(image).attr("data-name", globalObj.name);
            $(image).css("position", "absolute");
            $(image).css("top", e.pageY-45);
            $(image).css("left", e.pageX-45);
            $(image).css("width", "90px");
            $("body").append(image);
            GameCreator.draggedGlobalElement = image;
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
            var selectedAction = {parameters: {}, name: action.name, timing:{}};

            for (var i = 0; i < action.params.length; i++) {
                selectedAction.parameters[action.params[i].inputId] = GameCreator.helperFunctions.getValue($("#" + action.params[i].inputId));
            }
            
            //Remove actions from selectedActions that are excluded by the selected action.
            /*var i = 0;
            while(i < selectedActions.length) {
                var existingAction = selectedActions[i].name;
                if(action.excludes.indexOf(existingAction) != -1) {
                    selectedActions.splice(i, 1);
                } else {
                    i++;
                }
            }*/
            var timingType = GameCreator.helperFunctions.getValue($("#timing"));
            var timingTime = GameCreator.helperFunctions.getValue($("#timing-time"));
            selectedAction.timing = {type: timingType, time: timingTime};
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
        $("#add-global-object-window-content").html(GameCreator.htmlStrings.addActiveObjectForm());
        $("#add-active-object-movement-parameters").html(GameCreator.htmlStrings.freeMovementInputs());
        $("#active-object-movement-type").on("change", function(){
            if($(this).val() == "free") {
                $("#add-active-object-movement-parameters").html(GameCreator.htmlStrings.freeMovementInputs());
            }
            else {
                $("#add-active-object-movement-parameters").html(GameCreator.htmlStrings.routeMovementInputs());
            }
        });
        $("#add-global-object-window-content .saveButton").on("click", function(){GameCreator.UI.addActiveObject();GameCreator.UI.closeDialogue()});
    },
    
    setupAddPlayerObjectForm: function() {
        $("#add-global-object-window-content").html(GameCreator.htmlStrings.addPlayerObjectForm());
        $("#add-player-object-movement-parameters").html(GameCreator.htmlStrings.mouseMovementInputs());
        $("#player-object-type").on("change", function(){
            var objectType = ($(this).val());
            GameCreator.addObject = GameCreator.UI[objectType];
            if (objectType === "addPlayerMouseObject") {
              $("#add-player-object-movement-parameters").html(GameCreator.htmlStrings.mouseMovementInputs());
            } else if (objectType === "addPlayerPlatformObject") {
              $("#add-player-object-movement-parameters").html(GameCreator.htmlStrings.platformMovementInputs());
            } else if (objectType === "addPlayerTopDownObject") {
              $("#add-player-object-movement-parameters").html(GameCreator.htmlStrings.topDownMovementInputs());
            }
        });
        $("#add-global-object-window-content .saveButton").on("click", function(){GameCreator.UI.addPlayerObject();GameCreator.UI.closeDialogue()});
    },
    
    //Add counter object functions.
    setupAddCounterObjectForm: function() {
      $("#add-global-object-window-content").html(GameCreator.htmlStrings.addCounterObjectForm());
      $("#counter-representation").on("change", function(){
        if($(this).val() === "text") {
          $("#add-counter-object-counter-representation-content").html(GameCreator.htmlStrings.counterObjectTextForm());
        } else if ($(this).val() === "image"){
          $("#add-counter-object-counter-representation-content").html(GameCreator.htmlStrings.addCounterObjectImage());
        }
      });
      $("#add-global-object-window-content .saveButton").on("click", function(){GameCreator.UI.saveCounterObject();GameCreator.UI.closeDialogue()});
      $("#add-counter-object-counter-representation-content").html(GameCreator.htmlStrings.counterObjectTextForm());
    },
    
    setupAddCounterObjectCounterSelector: function(obj) {
      var uniqueIds = GameCreator.getUniqueIDsInScene();
      var selectedId;
      if(!obj || (obj && !obj.counterObject)) {
        for(id in uniqueIds) {
          if(uniqueIds.hasOwnProperty(id)){
            selectedId = uniqueIds[id];
            break;
          } 
        };
      } else {
        selectedId = obj.counterObject;
      }
      return GameCreator.htmlStrings.inputLabel('add-counter-counter-object', 'Object') +
          GameCreator.UI.setupSingleSelectorWithListener(
            'add-counter-counter-object', 
            GameCreator.getUniqueIDsInScene(), 
            'change', 
            function(){
              $("#add-counter-counter-name").replaceWith(GameCreator.htmlStrings.singleSelector("add-counter-counter-name", GameCreator.getCountersForGlobalObj($(this).val()), "counterName"))
            },
            'counterObject',
            selectedId
          ) +
          GameCreator.htmlStrings.inputLabel("add-counter-counter-object", "Counter") +
          GameCreator.htmlStrings.singleSelector("add-counter-counter-object", selectedId ? GameCreator.getCountersForGlobalObj(selectedId) : {}, "counterName");
    },
    
    saveCounterObject: function() {
      var args = {};
      GameCreator.saveFormInputToObject("add-global-object-window-content", args);
      GameCreator.addGlobalObject(args, 'counterObject');
    },
    
    //Edit global object functions
    
    openEditGlobalObjectDialogue: function(globalObj) {
        GameCreator.UI.openDialogue(900, 570, GameCreator.htmlStrings.editGlobalObjectWindow(globalObj));
        $("#dialogue-window").find(".tab").first().addClass("active");  
        $("#dialogue-window").find(".tab").on("click", function() {
            GameCreator.UI[$(this).data("uifunction")]($("#dialogue-window").find("#edit-global-object-window-content"), globalObj);
            $(this).parent().find(".tab").removeClass("active");
            $(this).addClass("active");
        });
        GameCreator.UI.setupEditGlobalObjectPropertiesForm($("#dialogue-window").find("#edit-global-object-window-content"), globalObj);
    },
    
    setupEditGlobalObjectPropertiesForm: function(container, globalObj) {
      //If it's a counter object and does not have its own counter, show dropdowns for selecting counter to display.
      var html = '<div id="edit-global-object-properties-content">' +
      GameCreator.UI.setupEditGlobalObjectPropertiesContent(container, globalObj) +
      '</div>';
      container.html(html);
        container.find("#save-global-object-properties-button").on("click", function() {
            GameCreator.saveFormInputToObject("edit-global-object-properties-content", globalObj);
            GameCreator.UI.closeDialogue();
        });
    },
    

    setupEditGlobalObjectPropertiesContent: function(container, globalObj) {
        return GameCreator.htmlStrings.editGlobalObjectPropertiesContent(globalObj);
    },
    
    setupEditGlobalObjectCollisionsForm: function(container, globalObj) {
        var collisionObjects = [];
        for(var i = 0; i < globalObj.collisionActions.length; i++) {
            collisionObjects.push(GameCreator.helperFunctions.findGlobalObjectById(globalObj.collisionActions[i].id));
        }
        container.html(GameCreator.htmlStrings.editGlobalObjectCollisionsContent(collisionObjects));
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
                globalObj.name
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
        container.html(GameCreator.htmlStrings.editGlobalObjectKeyActionsContent(globalObj));
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
                globalObj.keyActions,
                $("#edit-key-actions-key-content"),
                keyName,
                globalObj.name
            );
        });
        $("#add-new-key-button").on("click", function(){
            $("#edit-key-actions-key-content").html(GameCreator.htmlStrings.keySelector(globalObj));
            $(".addKeyObjectElement").one("click", function(){
                globalObj.keyActions[$(this).data("keyname")] = [];
                GameCreator.UI.setupEditGlobalObjectKeyActionsForm(container, globalObj);
            });
        });
    },
    
    setupEditGlobalObjectOnClickActionsForm: function(container, globalObj) {
      var text = "Actions on click";
      var actions;
      if(globalObj.objectType === "mouseObject") {
        actions = GameCreator.actionGroups.mouseNonCollisionActions;
      } else {
        actions = GameCreator.actionGroups.nonCollisionActions;
      }
        
        //If onClickActions has not yet been edited from anywhere, instantiate to empty array.
        if(globalObj.onClickActions == undefined) {
            globalObj.onClickActions = [];
        }
        
      var existingActions = globalObj.onClickActions;
      GameCreator.UI.createEditActionsArea(text, actions, existingActions, container, null, globalObj.name);
    },

    setupEditGlobalObjectOnDestroyActionsForm: function(container, globalObj) {
        var text = "Actions on Destruction";
        var actions = GameCreator.actionGroups.onCreateActions;
        if(globalObj.objectType === "mouseObject") {
          actions = GameCreator.actionGroups.mouseNonCollisionActions;
        } else {
          actions = GameCreator.actionGroups.nonCollisionActions;
        }
        
        //If onCreateActions has not yet been edited from anywhere, instantiate to empty array.
        if(globalObj.onDestroyActions == undefined) {
            globalObj.onDestroyActions = [];
        }
        
        var existingActions = globalObj.onDestroyActions;
        GameCreator.UI.createEditActionsArea(text, actions, existingActions, container, null, globalObj.name);
    },

    setupEditGlobalObjectOnCreateActionsForm: function(container, globalObj) {
        var text = "Actions on Creation";
        var actions = GameCreator.actionGroups.onCreateActions;
        
        //If onCreateActions has not yet been edited from anywhere, instantiate to empty array.
        if(globalObj.onCreateActions == undefined) {
            globalObj.onCreateActions = [];
        }
        
        var existingActions = globalObj.onCreateActions;
        GameCreator.UI.createEditActionsArea(text, actions, existingActions, container, null, globalObj.name);
    },
    
    setupEditGlobalObjectCountersForm: function(container, globalObj) {
       container.html(GameCreator.htmlStrings.editGlobalObjectCountersContent(globalObj));
       $("#add-new-counter-button").on("click", function(){
            $("#edit-counters-counter-content").html(GameCreator.htmlStrings.createCounterForm());
            $("#edit-counters-counter-content .saveButton").one("click", function(){
              var counterName = $("#edit-counters-counter-content #counter-name").val();
                globalObj.counters[counterName] = GameCreator.counter.New();
                GameCreator.UI.setupEditGlobalObjectCountersForm(container, globalObj);
            });
        });
        container.find(".counterMenuElement").on("click", function(){
          var counterName = $(this).data("name");
          GameCreator.UI.setupEditCounterEvents(globalObj, counterName, $("#edit-counter-event-content"));
      });
    },
    
    setupEditCounterEvents: function(globalObj, counterName, container) {
      container.html(GameCreator.htmlStrings.editCounterEventsContent(globalObj.counters[counterName]));
      $("#edit-counter-event-actions-content").html("");
      $("#add-new-counter-event-button").on("click", function(){
            $("#edit-counter-event-actions-content").html(GameCreator.htmlStrings.createCounterEventForm());
            $("#edit-counter-event-value-field").hide();
            $("#edit-counter-event-actions-content .saveButton").one("click", function(){
              var eventType = $("#edit-counter-event-actions-content #edit-counter-event-type").val();
              var eventValue = $("#edit-counter-event-actions-content #edit-counter-event-value").val();
              globalObj.counters[counterName][eventType][eventValue] = [];
              GameCreator.UI.setupEditCounterEvents(globalObj, counterName, container);
            });
        });
        
        container.find(".counterEventMenuElement").on("click", function(){
            var eventType = $(this).data("type");
            var eventValue = $(this).data("value");
            var existingActions;

      //If there is no eventValue it's an onIncrease or onDecrease event.
      if(eventValue) {
        existingActions = globalObj.counters[counterName][eventType][eventValue];
      } else {
        existingActions = globalObj.counters[counterName][eventType];
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
                null,
                globalObj.name
            );
        }); 
    },
    
    //General dialogue functions
    
    openDialogue: function(width, height, content) {
        width = width || 900;
        height = height || 570;
        $("#dialogue-window").css("width", width).css("height", height).css("left", ($(window).width() / 2 - width / 2)).show();
        //$("#dialogue-window").html(content);
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
        $("#edit-scene-object-title").html('<div class="headingNormalBlack">' + GameCreator.selectedObject.name + '</div>');
        if(GameCreator.selectedObject.parent.objectType == "activeObject") {
            $("#edit-scene-object-content").html(GameCreator.htmlStrings.editActiveObjectForm(GameCreator.selectedObject));
        }
        else if(GameCreator.selectedObject.parent.objectType == "mouseObject") {
            $("#edit-scene-object-content").html(GameCreator.htmlStrings.editMouseObjectForm(GameCreator.selectedObject));
        }
        else if(GameCreator.selectedObject.parent.objectType == "platformObject") {
            $("#edit-scene-object-content").html(GameCreator.htmlStrings.editPlatformObjectForm(GameCreator.selectedObject));
        }
        else if(GameCreator.selectedObject.parent.objectType == "topDownObject") {
            $("#edit-scene-object-content").html(GameCreator.htmlStrings.editTopDownObjectForm(GameCreator.selectedObject));
        }
        else if (GameCreator.selectedObject.parent.objectType == "counterObject") {
            $("#edit-scene-object-content").html(GameCreator.htmlStrings.editCounterObjectForm(GameCreator.selectedObject));
            $("#add-counter-object-counter-selector").html(GameCreator.UI.setupAddCounterObjectCounterSelector(GameCreator.selecte));
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