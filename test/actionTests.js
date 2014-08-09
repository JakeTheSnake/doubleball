(function() {

var container;
var redBall;
var existingActions;
var caption;
var testValue;
var platformZealot;
var runtimeAction;
var runtimeObject;

module("ActionTests", {
  setup: function() {
    container = $("#qunit-fixture");
    var image = new Image();
    image.src = '../assets/red_ball.gif';
    redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
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
    var image = new Image();
    image.src = '../assets/red_ball.gif';
    redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
  },
  teardown: function() {
  }
});

function setupCollisionEventForNewObject(action, parameters) {
    var parameters = parameters || {};
    var timing = {type: "now"};
    var bounceAction = new GameCreator.RuntimeAction(action, parameters, timing);
    var collideEvent = new GameCreator.ConditionActionSet();
    collideEvent.actions.push(bounceAction);
    redBall.onCollideEvents.push({id: GameCreator.borderObjects.borderL.id, events: [collideEvent]});
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
    var runtimeObj = setupCollisionEventForNewObject("Destroy", {effect: "FadeOut"});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.objectsToDestroy[0], runtimeObj, "Object was destroyed.");
    ok(GameCreator.currentEffects[0] instanceof GameCreator.effects.FadeOut, "Effect was added");
});

test("Create Action Test", function() {
    setupCollisionEventForNewObject("Create", {objectToCreate: "red_ball", x: 50, y: 60});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.renderableObjects.length, 2, "Object was created");
    deepEqual(GameCreator.renderableObjects[1].x, 50, "Correct X coordinate");
    deepEqual(GameCreator.renderableObjects[1].y, 60, "Correct Y coordinate");
});

test("Shoot Action Test", function() {
    var image = new Image();
    image.src = '../assets/red_ball.gif';
    GameCreator.addGlobalObject({image: image, objectName: "projectile", width:[20], height:[30]}, "FreeObject");
    setupCollisionEventForNewObject("Shoot", {objectToShoot: "projectile", projectileSpeed: 500, projectileDirection: "Left"});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.renderableObjects.length, 2, "Object was shot");
    deepEqual(GameCreator.renderableObjects[1].speedX, -500, "Correct X coordinate");
});

test("Counter Action Test", function() {
    redBall.parentCounters["testCounter"] = new GameCreator.Counter();
    
    var runtimeObj = setupCollisionEventForNewObject("Counter", {counterObject: "this", counterName: "testCounter", counterType: "Set", counterValue: 5});
    var counter = runtimeObj.counters["testCounter"];

    GameCreator.checkCollisions();

    deepEqual(counter.value, 5, "Counter value was set.");
});


test("SwitchScene Action Test", function() {
    GameCreator.scenes.push([]);
    var runtimeObj = setupCollisionEventForNewObject("SwitchScene", {changeType: "setScene", changeValue: 1});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.activeScene, 1, "Scene was switched.");
});

test("SwitchState Action Test", function() {
    var runtimeObj = setupCollisionEventForNewObject("SwitchState", {objectId: "this", stateId: 1});
    runtimeObj.parent.createState('TestState', {});

    GameCreator.checkCollisions();

    deepEqual(runtimeObj.currentState, 1);
});

var newEvent;

module("ActionTriggers", {
  setup: function() {
    GameCreator.actions["testAction"] = new GameCreator.Action({
                                                action: function(params) {testValue += params.value;},
                                                runnable: function() {return true;}
                                            });
    testValue = 0;
    var img = new Image();
    img.src = '../assets/red_ball.gif';
    platformZealot = GameCreator.addGlobalObject({image: img, objectName: "red_ball", width:[20], height:[30]}, "PlatformObject");
    runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "now"});
    runtimeObject = GameCreator.createRuntimeObject(platformZealot, {x: 50, y: 60, speedX: -500, speedY: 50});
    newEvent = new GameCreator.ConditionActionSet();
    newEvent.actions.push(runtimeAction);
  },
  teardown: function() {
    delete GameCreator.actions["testAction"];
  }
});

function assertActionRun() {
    deepEqual(testValue, 1, "Action was run");
}

test("Trigger action by key", function() {
    var key = "space";

    platformZealot.keyEvents[key] = [newEvent];
    platformZealot.keyPressed[key] = true;

    runtimeObject.parent.checkEvents.call(runtimeObject);

    assertActionRun();
});

test("Trigger action by creation", function() {
    platformZealot.onCreateSets = [newEvent];

    GameCreator.callOnCreateForNewObjects();

    assertActionRun();
});


test("Trigger action by destruction", function() {
    platformZealot.onDestroyEvents = [newEvent];

    runtimeObject.parent.destroy.call(runtimeObject);

    assertActionRun();
});

})();
