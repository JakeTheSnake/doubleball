GameCreator.UI = {
    addActiveObject: function(){
        var args = {};
        GameCreator.saveFormInputToObject("addGlobalObjectWindowContent", args);
        var obj = GameCreator.addActiveObject(args);
        args = {
            name: $("#activeObjectName").val(),
            width: parseInt($("#activeObjectWidth").val()),
            height: parseInt($("#activeObjectHeight").val()),
            src: $("#activeObjectSrc").val(),
            movementType: $("#activeObjectMovementType").val(),
            speed: parseFloat($("#routeObjectSpeed").val()),
            speedX: parseFloat($("#freeObjectSpeedX").val()),
            speedY: parseFloat($("#freeObjectSpeedY").val()),
            accX: parseFloat($("#freeObjectAccX").val()),
            accY: parseFloat($("#freeObjectAccY").val())
        };
    },
    
    addPlayerObject: function(){
        var obj;
        if($("#playerObjectType").val() == "addPlayerMouseObject") {
            obj = GameCreator.addPlayerMouseObject({
                name: $("#playerObjectName").val(),
                width: GameCreator.helperFunctions.getValue($("#playerObjectWidth")),
                height: GameCreator.helperFunctions.getValue($("#playerObjectHeight")),
                src: $("#playerObjectSrc").val(),
                maxX: GameCreator.helperFunctions.getValue($("#mouseObjectMaxX")),
                maxY: GameCreator.helperFunctions.getValue($("#mouseObjectMaxY")),
                minX: GameCreator.helperFunctions.getValue($("#mouseObjectMinX")),
                minY: GameCreator.helperFunctions.getValue($("#mouseObjectMinY"))
            });
        } else if($("#playerObjectType").val() == "addPlayerPlatformObject") {
            obj = GameCreator.addPlayerPlatformObject({
                name: $("#playerObjectName").val(),
                width: GameCreator.helperFunctions.getValue($("#playerObjectWidth")),
                height: GameCreator.helperFunctions.getValue($("#playerObjectHeight")),
                src: $("#playerObjectSrc").val(),
                accY: GameCreator.helperFunctions.getValue($("#platformObjectAccY")),
                maxSpeed: GameCreator.helperFunctions.getValue($("#platformObjectMaxSpeed")),
                acceleration: GameCreator.helperFunctions.getValue($("#platformObjectAcceleration"))
            });
        } else if($("#playerObjectType").val() == "addPlayerTopDownObject") {
            obj = GameCreator.addPlayerTopDownObject({
                name: $("#playerObjectName").val(),
                width: GameCreator.helperFunctions.getValue($("#playerObjectWidth")),
                height: GameCreator.helperFunctions.getValue($("#playerObjectHeight")),
                src: $("#playerObjectSrc").val(),
                maxSpeed: GameCreator.helperFunctions.getValue($("#topDownObjectMaxSpeed"))
            });
        }
    },
    
    createGlobalListElement: function(globalObj) {
        var listElement = GameCreator.htmlStrings.globalObjectElement(globalObj);
        $("#globalObjectList").append(listElement);
        var listElementButton = GameCreator.htmlStrings.globalObjectEditButton(globalObj);
        $("#globalObjectList").append(listElementButton);
        $(listElementButton).on("click", function(e){
            GameCreator.UI.openEditGlobalObjectDialogue(globalObj);
        });
        $(listElement).on("mousedown", function(e){
            var image = new Image();
            image.src = $(this).find("img").attr("src");
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
     * targetName: If existingActions is an object, targetName is the key to the current array of actions in existingActions.
     *             If null, existingActions has to be an array of actions.
     * thisName: The name of the object whose actiosn will be edited with this form.
     **/
    createEditActionsArea: function(text, actions, existingActions, container, targetName, thisName) {
    	
    	var existingActionsTmp;
    	
    	if(targetName) {
	        if (!existingActions[targetName]) {
	            existingActions[targetName] = [];
	        }
	        existingActionsTmp = existingActions[targetName];
	    }
	    else {
	    	existingActionsTmp = existingActions;
	    }
        
        container.html(GameCreator.htmlStrings.editActionsWindow(text, actions, existingActionsTmp));
        GameCreator.UI.setupEditActionsContent(text, actions, existingActionsTmp, thisName);
    },
 
    openEditActionsWindow: function(text, actions, existingActions, targetName, thisName) {  
        //Only select actions if GameCreator isn't already paused for action selection.
        if(!GameCreator.paused){
            GameCreator.pauseGame();
            
            var existingActionsTmp;
            
            if(targetName) {
            	//Check if there exist any actions for collisions with the current targetObject.
	            if (!existingActions[targetName]) {
	                existingActions[targetName] = [];
	            }
	            existingActionsTmp = existingActions[targetName];
        	}
        	else {
        		existingActionsTmp = existingActions;
        	}
            
            GameCreator.UI.openDialogue(700, 400, GameCreator.htmlStrings.editActionsWindow(text, actions, existingActionsTmp));
            GameCreator.UI.setupEditActionsContent(text, actions, existingActionsTmp, thisName);
        
            $("#editActionsWindowCancel").on("click", function() {
                GameCreator.UI.closeDialogue();
                GameCreator.resumeGame();
                
            });
            
            $("#dialogueOverlay").one("click", function(){
                GameCreator.resumeGame();
            });
        }
    },
    
    
    setupEditActionsContent: function(text, actions, selectedActions, thisName){
        
        $("#actionSelector").on("change", function(){
            $("#selectActionParametersContent").html("");
            $("#selectActionTimingContent").html("");
            $("#selectActionParametersContainer").css("display", "block");
            $("#selectActionTimingContainer").css("display", "block");
            for(var i = 0;i < actions[$(this).val()].params.length;++i) {
                $("#selectActionParametersContent").append(GameCreator.htmlStrings.parameterGroup(actions[$(this).val()].params[i].label() + actions[$(this).val()].params[i].input(thisName)));
            }
            var timing = actions[$("#actionSelector").val()].timing;
            $("#selectActionTimingContent").append(GameCreator.htmlStrings.timingGroup(timing));
            $("#timing").on("change", function(){
                if ($("#timing").val() === "now") {
                    $("#timingParameter").css("display", "none");
                } else {
                    $("#timingParameter").css("display", "block");
                }
            });
        });
        
        $( "#selectActionAddAction" ).click(function( event ) {                
            var action = actions[$("#actionSelector").val()];
            var selectedAction = {action: action.action, parameters: {}, name: action.name, timing:{}, runnable: action.runnable};

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
            var timingTime = GameCreator.helperFunctions.getValue($("#timingTime"));
            selectedAction.timing = {type: timingType, time: timingTime};
            selectedActions.push(selectedAction);
            
            $("#selectActionResult").html(GameCreator.htmlStrings.selectedActionsList(selectedActions));
        });
        
        $("#selectActionWindow").on("click", ".removeActionButton", function(){
        	selectedActions.splice($("#selectActionWindow").find(".removeActionButton").index(this), 1);
        	$(this).parent().parent().remove();
        	return false;
    	});
    },
    
    //Add global object functions
    
    openAddGlobalObjectDialogue: function() {
        GameCreator.UI.openDialogue(600, 400, GameCreator.htmlStrings.addGlobalObjectWindow());
        $("#dialogueWindow").find(".tab").first().addClass("active");
        $("#dialogueWindow").find(".tab").on("click", function() {
            GameCreator.UI[$(this).data("uifunction")]();
            $(this).parent().find(".tab").removeClass("active");
            $(this).addClass("active");
        });
        GameCreator.UI.setupAddActiveObjectForm();
    },
    
    setupAddActiveObjectForm: function() {
        $("#addGlobalObjectWindowContent").html(GameCreator.htmlStrings.addActiveObjectForm());
        $("#addActiveObjectMovementParameters").html(GameCreator.htmlStrings.freeMovementInputs());
        $("#activeObjectMovementType").on("change", function(){
            if($(this).val() == "free") {
                $("#addActiveObjectMovementParameters").html(GameCreator.htmlStrings.freeMovementInputs());
            }
            else {
                $("#addActiveObjectMovementParameters").html(GameCreator.htmlStrings.routeMovementInputs());
            }
        });
        $("#addGlobalObjectWindowContent .saveButton").on("click", function(){GameCreator.UI.addActiveObject();GameCreator.UI.closeDialogue()});
    },
    
    setupAddPlayerObjectForm: function() {
        $("#addGlobalObjectWindowContent").html(GameCreator.htmlStrings.addPlayerObjectForm());
        $("#addPlayerObjectMovementParameters").html(GameCreator.htmlStrings.mouseMovementInputs());
        $("#playerObjectType").on("change", function(){
            var objectType = ($(this).val());
            GameCreator.addObject = GameCreator.UI[objectType];
            if (objectType === "addPlayerMouseObject") {
              $("#addPlayerObjectMovementParameters").html(GameCreator.htmlStrings.mouseMovementInputs());
            } else if (objectType === "addPlayerPlatformObject") {
              $("#addPlayerObjectMovementParameters").html(GameCreator.htmlStrings.platformMovementInputs());
            } else if (objectType === "addPlayerTopDownObject") {
              $("#addPlayerObjectMovementParameters").html(GameCreator.htmlStrings.topDownMovementInputs());
            }
        });
        $("#addGlobalObjectWindowContent .saveButton").on("click", function(){GameCreator.UI.addPlayerObject();GameCreator.UI.closeDialogue()});
    },
    
    //Edit global object functions
    
    openEditGlobalObjectDialogue: function(globalObj) {
        GameCreator.UI.openDialogue(700, 500, GameCreator.htmlStrings.editGlobalObjectWindow(globalObj));
        $("#dialogueWindow").find(".tab").first().addClass("active");  
        $("#dialogueWindow").find(".tab").on("click", function() {
            GameCreator.UI[$(this).data("uifunction")]($("#dialogueWindow").find("#editGlobalObjectWindowContent"), globalObj);
            $(this).parent().find(".tab").removeClass("active");
            $(this).addClass("active");
        });
        GameCreator.UI.setupEditGlobalObjectPropertiesForm($("#dialogueWindow").find("#editGlobalObjectWindowContent"), globalObj);
    },
    
    setupEditGlobalObjectPropertiesForm: function(container, globalObj) {
        container.html(GameCreator.htmlStrings.editGlobalObjectPropertiesContent(globalObj));
        container.find("#saveGlobalObjectPropertiesButton").on("click", function() {
            GameCreator.saveFormInputToObject("editGlobalObjectPropertiesContent", globalObj);
            GameCreator.UI.closeDialogue();
        });
    },
    
    setupEditGlobalObjectCollisionsForm: function(container, globalObj) {
        container.html(GameCreator.htmlStrings.editGlobalObjectCollisionsContent(globalObj));
        container.find(".collisionMenuElement").on("click", function(){
            var targetName = $(this).data("name");
            var actions;
	    	if(globalObj.objectType === "mouseObject") {
	    		actions = GameCreator.actionGroups.mouseCollisionActions;
	    	} else {
	    		actions = GameCreator.actionGroups.collisionActions;
	    	}
            GameCreator.UI.createEditActionsArea(
                "Actions for collision with " + targetName, 
                actions,
                globalObj.collisionActions,
                $("#editCollisionActionsObjectContent"),
                targetName,
                globalObj.name
            );
        });
        $("#addNewCollisionButton").on("click", function(){
        	$("#editCollisionActionsObjectContent").html(GameCreator.htmlStrings.collisionObjectSelector(globalObj));
        	$(".addCollisionObjectElement").one("click", function(){
        		globalObj.collisionActions[$(this).data("objectname")] = [];
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
                $("#editKeyActionsKeyContent"),
                keyName,
                globalObj.name
            );
        });
        $("#addNewKeyButton").on("click", function(){
            $("#editKeyActionsKeyContent").html(GameCreator.htmlStrings.keySelector(globalObj));
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
        var actions;
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
        var actions;
    	if(globalObj.objectType === "mouseObject") {
    		actions = GameCreator.actionGroups.mouseNonCollisionActions;
    	} else {
    		actions = GameCreator.actionGroups.nonCollisionActions;
    	}
        
        //If onCreateActions has not yet been edited from anywhere, instantiate to empty array.
        if(globalObj.onCreateActions == undefined) {
            globalObj.onCreateActions = [];
        }
        
        var existingActions = globalObj.onCreateActions;
        GameCreator.UI.createEditActionsArea(text, actions, existingActions, container, null, globalObj.name);
    },
    
    setupEditGlobalObjectCountersForm: function(container, globalObj) {
       container.html(GameCreator.htmlStrings.editGlobalObjectCountersContent(globalObj));
       $("#addNewCounterButton").on("click", function(){
            $("#editCountersCounterContent").html(GameCreator.htmlStrings.createCounterForm());
            $("#editCountersCounterContent .saveButton").one("click", function(){
            	var counterName = $("#editCountersCounterContent #counterName").val();
                globalObj.counters[counterName] = GameCreator.counter.New();
                GameCreator.UI.setupEditGlobalObjectCountersForm(container, globalObj);
            });
        });
        container.find(".counterMenuElement").on("click", function(){
        	var counterName = $(this).data("name");
        	GameCreator.UI.setupEditCounterEvents(globalObj, counterName, $("#editCounterEventContent"));
    	});
    },
    
    setupEditCounterEvents: function(globalObj, counterName, container) {
    	container.html(GameCreator.htmlStrings.editCounterEventsContent(globalObj.counters[counterName]));
    	$("#editCounterEventActionsContent").html("");
    	$("#addNewCounterEventButton").on("click", function(){
            $("#editCounterEventActionsContent").html(GameCreator.htmlStrings.createCounterEventForm());
            $("#editCounterEventValueField").hide();
            $("#editCounterEventActionsContent .saveButton").one("click", function(){
            	var eventType = $("#editCounterEventActionsContent #editCounterEventType").val();
            	var eventValue = $("#editCounterEventActionsContent #editCounterEventValue").val();
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
                $("#editCounterEventActionsContent"),
                null,
                globalObj.name
            );
        }); 
    },
    
    //General dialogue functions
    
    openDialogue: function(width, height, content) {
        width = width || 600;
        height = height || 300;
        $("#dialogueWindow").css("width", width).css("height", height).css("left", ($(window).width() / 2 - width / 2)).show();
        $("#dialogueWindow").html(content);
        $("#dialogueOverlay").css("height", $(document).height());
        $("#dialogueOverlay").show();
    },
    
    closeDialogue: function() {
        $("#dialogueWindow").hide();
        $("#dialogueOverlay").hide();
    },
    
    setupSingleSelectorWithListener: function(elementId, collection, event, callback) {
    	$(document.body).on(event, "#" + elementId, callback);
    	return GameCreator.htmlStrings.singleSelector(elementId, collection);
    }
}