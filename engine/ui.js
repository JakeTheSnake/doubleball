GameCreator.UI = {
    addActiveObject: function(){
        var obj = GameCreator.addActiveObject({
            name: $("#addActiveObjectName").val(),
            width: parseInt($("#addActiveObjectWidth").val()),
            height: parseInt($("#addActiveObjectHeight").val()),
            src: $("#addActiveObjectSrc").val(),
            movementType: $("#addActiveObjectMovementType").val(),
            speed: parseFloat($("#addObjectSpeed").val()) || 0,
            speedX: parseFloat($("#addObjectSpeedX").val()) || 0,
            speedY: parseFloat($("#addObjectSpeedY").val()) || 0,
            accX: parseFloat($("#addObjectAccX").val()) || 0,
            accY: parseFloat($("#addObjectAccY").val()) || 0
        });
    },
    
    addPlayerMouseObject: function(){
        var obj = GameCreator.addPlayerMouseObject({
            name: $("#addPlayerObjectName").val(),
            width: parseInt($("#addPlayerObjectWidth").val()),
            height: parseInt($("#addPlayerObjectHeight").val()),
            src: $("#addPlayerObjectSrc").val(),
        });
    },
    
    addPlayerPlatformObject: function(){
        var obj = GameCreator.addPlayerPlatformObject({
            name: $("#addPlayerObjectName").val(),
            width: parseInt($("#addPlayerObjectWidth").val()),
            height: parseInt($("#addPlayerObjectHeight").val()),
            src: $("#addPlayerObjectSrc").val(),
        });
    },
    
    addPlayerTopDownObject: function(){
        var obj = GameCreator.addPlayerTopDownObject({
            name: $("#addPlayerObjectName").val(),
            width: parseInt($("#addPlayerObjectWidth").val()),
            height: parseInt($("#addPlayerObjectHeight").val()),
            src: $("#addPlayerObjectSrc").val(),
        });
    },
    
    createGlobalListElement: function(object) {
        var listElement = GameCreator.htmlStrings.globalObjectElement(object);
        $("#globalObjectList").append(listElement);
        var listElementButton = GameCreator.htmlStrings.globalObjectEditButton(object);
        $("#globalObjectList").append(listElementButton);
        $(listElementButton).on("click", function(e){
            $("#editGlobalObjectWindow").html(GameCreator.htmlStrings.editGlobalObjectWindow(object));
            $("#editGlobalObjectWindow").dialog( "option", "title", object.name );
            GameCreator.selectedGlobalObject = object;
            $("#editGlobalObjectWindow").dialog("open");
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
}