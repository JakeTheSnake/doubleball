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
                width: parseInt($("#playerObjectWidth").val()),
                height: parseInt($("#playerObjectHeight").val()),
                src: $("#playerObjectSrc").val(),
                maxX: parseInt($("#mouseObjectMaxX").val()),
                maxY: parseInt($("#mouseObjectMaxY").val()),
                minX: parseInt($("#mouseObjectMinX").val()),
                minY: parseInt($("#mouseObjectMinY").val())
            });
        } else if($("#playerObjectType").val() == "addPlayerPlatformObject") {
            obj = GameCreator.addPlayerPlatformObject({
                name: $("#playerObjectName").val(),
                width: parseInt($("#playerObjectWidth").val()),
                height: parseInt($("#playerObjectHeight").val()),
                src: $("#playerObjectSrc").val(),
                accY: parseInt($("#platformObjectAccY").val()),
                maxSpeed: parseInt($("#platformObjectMaxSpeed").val()),
                acceleration: parseInt($("#platformObjectAcceleration").val())
            });
        } else if($("#playerObjectType").val() == "addPlayerTopDownObject") {
            obj = GameCreator.addPlayerTopDownObject({
                name: $("#playerObjectName").val(),
                width: parseInt($("#playerObjectWidth").val()),
                height: parseInt($("#playerObjectHeight").val()),
                src: $("#playerObjectSrc").val(),
                maxSpeed: parseInt($("#topDownObjectMaxSpeed").val())
            });
        }
    },
    
    createGlobalListElement: function(object) {
        var listElement = GameCreator.htmlStrings.globalObjectElement(object);
        $("#globalObjectList").append(listElement);
        var listElementButton = GameCreator.htmlStrings.globalObjectEditButton(object);
        $("#globalObjectList").append(listElementButton);
        $(listElementButton).on("click", function(e){
            GameCreator.UI.openEditGlobalObjectDialogue(object);
        });
        $(listElement).on("mousedown", function(e){
            var image = new Image();
            image.src = $(this).find("img").attr("src");
            $(image).attr("data-name", object.name);
            $(image).css("position", "absolute");
            $(image).css("top", e.pageY-45);
            $(image).css("left", e.pageX-45);
            $(image).css("width", "90px");
            $("body").append(image);
            GameCreator.draggedGlobalElement = image;
            return false;
        });
    },
    
    openEditActionsArea: function(text, actions, existingActions, container, targetName) {
    	
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
        GameCreator.UI.setupEditActionsContent(text, actions, existingActionsTmp);
    },
    
    openEditActionsWindow: function(text, actions, existingActions, targetName) {  
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
            
            GameCreator.UI.openDialogue(500, 300, GameCreator.htmlStrings.editActionsWindow(text, actions, existingActionsTmp));
            GameCreator.UI.setupEditActionsContent(text, actions, existingActionsTmp);
        
            $("#editActionsWindowCancel").on("click", function() {
                GameCreator.UI.closeDialogue();
                GameCreator.resumeGame();
                
            });
            
            $("#dialogueOverlay").one("click", function(){
                GameCreator.resumeGame();
            });
        }
    },
    
    /**
     * Opens a window where the user can select Actions for the current Event.
     * text: The text that should be show as description of the popup.
     * callback: Function that is called when the user clicks the OK button. Has one array of the selected Actions as parameter.
     * actions: The actions the user should be able to select from
     * selectedActions: An array of Actions that are already chosen.
     **/
    setupEditActionsContent: function(text, actions, selectedActions){
        
        $("#actionSelector").on("change", function(){
            $("#selectActionParametersContent").html("");
            $("#selectActionParametersContainer").css("display", "block");
            for(var i = 0;i < actions[$(this).val()].params.length;++i) {
                $("#selectActionParametersContent").append(GameCreator.htmlStrings.parameterGroup(actions[$(this).val()].params[i].label() + actions[$(this).val()].params[i].input()));
            }
        });
        
        $( "#selectActionAddAction" ).click(function( event ) {                
            var action = actions[$("#actionSelector").val()];
            var selectedAction = {action: action.action, parameters: {}, name: action.name};

            for (var i = 0; i < action.params.length; i++) {
                selectedAction.parameters[action.params[i].inputId] = GameCreator.helperFunctions.getValue($("#" + action.params[i].inputId));
            }
            
            //Remove actions from selectedActions that are excluded by the selected action.
            var i = 0;
            while(i < selectedActions.length) {
                var existingAction = selectedActions[i].name;
                if(action.excludes.indexOf(existingAction) != -1) {
                    selectedActions.splice(i, 1);
                } else {
                    i++;
                }
            }
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
    
    openEditGlobalObjectDialogue: function(object) {
        GameCreator.UI.openDialogue(700, 500, GameCreator.htmlStrings.editGlobalObjectWindow(object));
        $("#dialogueWindow").find(".tab").first().addClass("active");  
        $("#dialogueWindow").find(".tab").on("click", function() {
            GameCreator.UI[$(this).data("uifunction")]($("#dialogueWindow").find("#editGlobalObjectWindowContent"), object);
            $(this).parent().find(".tab").removeClass("active");
            $(this).addClass("active");
        });
        GameCreator.UI.setupEditGlobalObjectPropertiesForm($("#dialogueWindow").find("#editGlobalObjectWindowContent"), object);
    },
    
    setupEditGlobalObjectPropertiesForm: function(container, object) {
        container.html(GameCreator.htmlStrings.editGlobalObjectPropertiesContent(object));
        container.find("#saveGlobalObjectPropertiesButton").on("click", function() {
            GameCreator.saveFormInputToObject("editGlobalObjectPropertiesContent", object);
            GameCreator.UI.closeDialogue();
        });
    },
    
    setupEditGlobalObjectCollisionsForm: function(container, object) {
        container.html(GameCreator.htmlStrings.editGlobalObjectCollisionsContent(object));
        container.find(".collisionMenuElement").on("click", function(){
            var targetName = $(this).data("name");
            GameCreator.UI.openEditActionsArea(
                "Actions for collision with " + targetName, 
                $.extend(GameCreator.actions.commonSelectableActions, GameCreator.actions.collisionSelectableActions),
                object.collisionActions,
                $("#editCollisionActionsObjectContent"),
                targetName
            );
        });
        $("#addNewCollisionButton").on("click", function(){
        	$("#editCollisionActionsObjectContent").html(GameCreator.htmlStrings.collisionObjectSelector(object));
        	$(".addCollisionObjectElement").one("click", function(){
        		object.collisionActions[$(this).data("objectname")] = [];
        		GameCreator.UI.setupEditGlobalObjectCollisionsForm(container, object);
        	});
        });
    },
    
    setupEditGlobalObjectKeyActionsForm: function(container, object) {
        container.html(GameCreator.htmlStrings.editGlobalObjectKeyActionsContent(object));
        container.find(".keyMenuElement").on("click", function(){
            var keyName = $(this).data("name");
            GameCreator.UI.openEditActionsArea(
                "Actions on " + keyName,
                GameCreator.actions.commonSelectableActions,
                object.keyActions,
                $("#editKeyActionsKeyContent"),
                keyName
            );
        });
        $("#addNewKeyButton").on("click", function(){
            $("#editKeyActionsKeyContent").html(GameCreator.htmlStrings.keySelector(object));
            $(".addKeyObjectElement").one("click", function(){
                object.keyActions[$(this).data("keyname")] = [];
                GameCreator.UI.setupEditGlobalObjectKeyActionsForm(container, object);
            });
        });
    },
    
    setupEditGlobalObjectOnClickActionsForm: function(container, object) {
    	var text = "Actions on click";
    	var actions = $.extend(GameCreator.actions.commonSelectableActions, GameCreator.actions.generalSelectableActions);
    	var existingActions = object.onClickActions;
    	GameCreator.UI.openEditActionsArea(text, actions, existingActions, container);
    },
    
    setupEditGlobalObjectTimerActionsForm: function(container, object) {
       container.html(GameCreator.htmlStrings.editGlobalObjectTimerActionsContent(object));
    },
    
    setupEditGlobalObjectCounterActionsForm: function(container, object) {
       container.html(GameCreator.htmlStrings.editGlobalObjectCounterActionsContent(object));
    },
    
    //General dialogue functions
    
    openDialogue: function(width, height, content) {
        width = width || 600;
        height = height || 300;
        $("#dialogueWindow").css("width", width).css("height", height).css("left", (GameCreator.width - width / 2)).show();
        $("#dialogueWindow").html(content);
        $("#dialogueOverlay").css("height", $(document).height());
        $("#dialogueOverlay").show();
    },
    
    closeDialogue: function() {
        $("#dialogueWindow").hide();
        $("#dialogueOverlay").hide();
    }
}