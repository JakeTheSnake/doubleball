GameCreator.UI = {
    addActiveObject: function(){
        var obj = GameCreator.addActiveObject({
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
        });
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
    
    /**
     * Opens a window where the user can select Actions for the current Event.
     * text: The text that should be show as description of the popup.
     * callback: Function that is called when the user clicks the OK button. Has one array of the selected Actions as parameter.
     * actions: The actions the user should be able to select from
     * existingActions: An array of Actions that are already chosen.
     **/
    openSelectActionsWindow: function(text, callback, actions, existingActions){
        //Only select actions if GameCreator isn't already paused for action selection.
        if(!GameCreator.paused){
            GameCreator.pauseGame();
            GameCreator.UI.openSelectActionsWindow.setAction = callback;
            $("#selectActionResult").html("");
            
            // Populate the selected actions with the actions from the existingActions argument.
            if (!existingActions) {
                GameCreator.UI.openSelectActionsWindow.selectedActions = [];
            } else {
                GameCreator.UI.openSelectActionsWindow.selectedActions = existingActions
                for (var i = 0; i < existingActions.length; i++) {
                    var action = existingActions[i];
                    var selectedAction = {action: action.action, parameters: {}};

                    $("#selectActionResult").append(GameCreator.htmlStrings.actionRow(existingActions[i].name, selectedAction));
                }
            }
            GameCreator.UI.openSelectActionsWindow.selectableActions = actions;
            $("#selectActionsHeader").html(text);
            $("#selectActionParametersContainer").html("");
            
            $("#selectActionDropdownContainer").html(GameCreator.htmlStrings.singleSelector(actions));
            $("#selectActionWindow").dialog("open");
            $("#actionSelector").on("change", function(){
                $("#selectActionParametersContainer").html("");
                for(var i = 0;i < actions[$(this).val()].params.length;++i) {
                    $("#selectActionParametersContainer").append(actions[$(this).val()].params[i].label())
                    $("#selectActionParametersContainer").append(actions[$(this).val()].params[i].input());
                }
            });
            
        }
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
    
    setupEditGlobalObjectPropertiesForm: function(target, object) {
        target.html(GameCreator.htmlStrings.editGlobalObjectPropertiesContent(object));
        target.find("#saveGlobalActiveObjectButton").on("click", function() {
            GameCreator.saveObjectChanges("editGlobalObjectPropertiesContent", object);
            GameCreator.UI.closeDialogue();
        });
    },
    
    setupEditGlobalObjectCollisionsForm: function(target, object) {
        target.html(GameCreator.htmlStrings.editGlobalObjectCollisionsContent(object));
    },
    
    setupEditGlobalObjectKeyActionsForm: function(target, object) {
       target.html(GameCreator.htmlStrings.editGlobalObjectKeyActionsContent(object));
    },
    
    setupEditGlobalObjectTimerActionsForm: function(target, object) {
       target.html(GameCreator.htmlStrings.editGlobalObjectTimerActionsContent(object));
    },
    
    setupEditGlobalObjectCounterActionsForm: function(target, object) {
       target.html(GameCreator.htmlStrings.editGlobalObjectCounterActionsContent(object));
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