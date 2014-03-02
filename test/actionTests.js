module("ActionTests", {
  setup: function() {
    redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", name: "red_ball", width:[20], height:[30]}, "activeObject");
    container = $("#qunit-fixture");
	existingActions = [];
	caption = "An object collided with yo mama";
	GameCreator.UI.createEditActionsArea(caption, GameCreator.actions,
	 	existingActions, container, "red_ball");
    
  },
  teardown: function() {
  }
});

function selectAction(actionName) {
	$("#action-selector").val(actionName);
	$("#action-selector").trigger("change");
}

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
}

test("Action window components", function() {
	deepEqual($("#select-action-window #select-actions-header").html(), caption, "Header text was set");
	deepEqual($("#action-selector").children().length, Object.keys(GameCreator.actions).length, "Action Selector populated");
	var allActions = Object.keys(GameCreator.actions);
	for (var i = 0; i < allActions.length; i++) {
		var actionName = allActions[i];	
		selectAction(actionName);
		var timingOptions = countTimingOptionsForAction(actionName);
		deepEqual($("#select-action-timing-content #timing-selector option").length, timingOptions, "Action: " + actionName + " - Timing content");
		deepEqual($("#select-action-parameters-content div.actionParameter").length, GameCreator.actions[actionName].params.length, "Action: " + actionName + " - Parameter content");		
	}
});

