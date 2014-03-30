(function() {

var container;
var redBall;
var existingActions;
var caption;
var testValue;

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

module("RunActionTests", {
  setup: function() {
    GameCreator.actions["testAction"] = new GameCreator.Action({
                                                action: function(params) {testValue += params.value;},
                                                runnable: function() {return true;}
                                            });
    testValue = 0;
  },
  teardown: function() {
    delete GameCreator.actions["testAction"];
  }
});

test("Run Action", function() {
    var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "now"});
    runtimeAction.runAction(new Object());
    deepEqual(testValue, 1, "Action was run.");
});

test("Run Several Actions", function() {
    var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "now"});
    var runtimeAction2 = new GameCreator.RuntimeAction("testAction", {value: 2}, {type: "now"});
    var runtimeAction3 = new GameCreator.RuntimeAction("testAction", {value: 4}, {type: "now"});

    var actionsToRun = [runtimeAction, runtimeAction2, runtimeAction3];
    for (var i = 0; i < actionsToRun.length; i++) {
        actionsToRun[i].runAction(new Object());    
    }

    deepEqual(testValue, 7, "All actions were run.");
});

test("Run timed Action at 1000 ms", function() {
    var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "at", time: 1000});
    GameCreator.timerHandler.update(500);
    deepEqual(testValue, 0, "Action was not run at 500 ms");
    runtimeAction.runAction(new Object());
    GameCreator.timerHandler.update(500);
    deepEqual(testValue, 1, "Action was run at 1000 ms");
});

test("Run timed Action after 1000 ms", function() {
    var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "after", time: 1000});
    runtimeAction.runAction(new Object());
    GameCreator.timerHandler.update(999);
    deepEqual(testValue, 0, "Action was not run at 999 ms");
    GameCreator.timerHandler.update(1);
    deepEqual(testValue, 1, "Action was run at 1000 ms");
});

test("Run timed Action every 1000 ms", function() {
    var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "every", time: 1000});
    runtimeAction.runAction(new Object());
    GameCreator.timerHandler.update(1000);
    deepEqual(testValue, 1, "Action was run at 1000 ms");
    GameCreator.timerHandler.update(1000);
    deepEqual(testValue, 2, "Action was run at 2000 ms");
});

module("Real Action Tests", {
  setup: function() {
    redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", objectName: "red_ball", width:[20], height:[30]}, "ActiveObject");
  },
  teardown: function() {
  }
});

function setupCollisionEventForNewObject(action, parameters) {
    var parameters = parameters || {};
    var timing = {type: "now"};
    var bounceAction = new GameCreator.RuntimeAction(action, parameters, timing);
    redBall.collisionActions.push({id: GameCreator.borderObjects.borderL.id, actions: [bounceAction]});
    return GameCreator.createRuntimeObject(redBall, {x: -5, y: 6, speedX: -500, speedY: 50});
}

test("Bounce Action Test", function() {
    var runtimeObj = setupCollisionEventForNewObject("Bounce");
    var oldSpeed = runtimeObj.speedX;
    GameCreator.checkCollisions();

    deepEqual(runtimeObj.speedX, -oldSpeed, "Speed was negated with bounce.");
});

test("Stop Action Test", function() {
    var runtimeObj = setupCollisionEventForNewObject("Stop");

    GameCreator.checkCollisions();

    deepEqual(runtimeObj.speedX, 0, "Object stopped X.");
});


test("Destroy Action Test", function() {
    var runtimeObj = setupCollisionEventForNewObject("Destroy");

    GameCreator.checkCollisions();

    deepEqual(GameCreator.objectsToDestroy[0], runtimeObj, "Object was destroyed.");
});

test("Create Action Test", function() {
    setupCollisionEventForNewObject("Create", {objectToCreate: "red_ball", x: 50, y: 60});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.renderableObjects.length, 2, "Object was created");
    deepEqual(GameCreator.renderableObjects[1].x, 50, "Correct X coordinate");
    deepEqual(GameCreator.renderableObjects[1].y, 60, "Correct Y coordinate");
});

test("Shoot Action Test", function() {
    GameCreator.addGlobalObject({src: "../assets/red_ball.gif", objectName: "projectile", width:[20], height:[30]}, "ActiveObject");
    setupCollisionEventForNewObject("Shoot", {objectToShoot: "projectile", projectileSpeed: 500, projectileDirection: "Left"});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.renderableObjects.length, 2, "Object was shot");
    deepEqual(GameCreator.renderableObjects[1].speedX, -500, "Correct X coordinate");
});

test("Counter Action Test", function() {
    redBall.parentCounters["testCounter"] = new GameCreator.Counter();
    
    var runtimeObj = setupCollisionEventForNewObject("Counter", {counterObject: "red_ball", counterName: "testCounter", counterType: "Set", counterValue: 5});
    var counter = runtimeObj.counters["testCounter"];

    GameCreator.checkCollisions();

    deepEqual(counter.value, 5, "Counter value was set.");
});



})();
