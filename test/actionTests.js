(function() {

var container;
var redBall;
var existingActions;
var caption;

module("ActionTests", {
  setup: function() {
    container = $("#qunit-fixture");
    redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", objectName: "red_ball", width:[20], height:[30]}, "ActiveObject");
    existingActions = [];
    caption = "An object collided with yo mama";
    GameCreator.UI.createEditActionsArea(caption, GameCreator.actions,
        existingActions, container, "red_ball");    
  },
  teardown: function() {
  }
});


test("Action window components", function() {
    deepEqual($("#select-action-window #select-actions-header").html(), caption, "Header text was set");
    deepEqual($("#action-selector").children().length, Object.keys(GameCreator.actions).length, "Action Selector populated");

    var allActions = Object.keys(GameCreator.actions);
    for (var i = 0; i < allActions.length; i++) {
        var actionName = allActions[i];    
        selectAction(actionName);

        var timingOptionsCount = countTimingOptionsForAction(actionName);
        var actionSelectOptions = $("#select-action-timing-content #timing-selector option");
        var actionParameters = $("#select-action-parameters-content div.actionParameter")
        deepEqual(actionSelectOptions.length, timingOptionsCount, "Action: " + actionName + " - Timing content");
        deepEqual(actionParameters.length, GameCreator.actions[actionName].params.length, "Action: " + actionName + " - Parameter content");        
    }
});

test("Add actions", function() {
    var allActions = Object.keys(GameCreator.actions);
    addActions(allActions)
    deepEqual($("#select-action-result div.actionRow").length, allActions.length);
});

function addActions(actionsToAdd) {
    var actionsToAdd = Object.keys(GameCreator.actions);
    for (var i = 0; i < actionsToAdd.length; i++) { // Add all actions
        var actionName = actionsToAdd[i];    
        selectAction(actionName);
        $("#select-action-add-action").trigger("click");
    }
}

function selectAction(actionName) {
    $("#action-selector").val(actionName);
    $("#action-selector").trigger("change");
};

function countTimingOptionsForAction(actionName) {
    var timings = Object.keys(GameCreator.actions[actionName].timing);
    var count = 1; // Starting at 1 to count "Now"
    for (var i = 0; i < timings.length; i++) {
        var timingName = timings[i];
        if (GameCreator.actions[actionName].timing[timingName] === true) {
            count++;
        }
    }
    return count;
};

})();
