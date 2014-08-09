(function() {

var redBall, actionWasRun, runtimeObj;

module("System Test: Play Mode - PlatformObject", {
  setup: function() {
    redBall = GameCreator.addGlobalObject({image: {src: "../assets/red_ball.gif"}, objectName: "red_ball", width:[20], height:[30]}, "PlatformObject");
    GameCreator.gameLoop = function() {};
    GameCreator.playScene(GameCreator.scenes[0]);
    runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
  },
  teardown: function() {
  }
});

test("Move left test", function() {
    runtimeObj.parent.keyLeftPressed = true;

    GameCreator.runFrame(10);

    ok(runtimeObj.x < 70, "Object moved left.");
});

test("Moved right test", function() {
    runtimeObj.parent.keyRightPressed = true;

    GameCreator.runFrame(10);

    ok(runtimeObj.x > 70, "Object moved right.");
});

module("System Test - Direct Mode", {
  setup: function() {
    redBall = GameCreator.addGlobalObject({image: {src: "../assets/red_ball.gif"}, objectName: "red_ball", width:[20], height:[30]}, "PlatformObject");
    GameCreator.actions["testAction"] = new GameCreator.Action({
                                                action: function() {actionWasRun = true;},
                                                name: "testAction",
                                                runnable: function() {return true;},
                                                timing: {at: true, every: true, after: true},
                                            });
    GameCreator.actionGroups.nonCollisionActions["testAction"] = GameCreator.actions.testAction;
    actionWasRun = false;
    GameCreator.gameLoop = function() {};
    GameCreator.directScene(GameCreator.scenes[0]);
  },
  teardown: function() {
  }
});

function selectAction(actionName) {
    $("#action-selector").val(actionName);
    $("#action-selector").trigger("change");   
}

function addSelectedAction() {
    $("#select-action-add-action").trigger("click");
}

test("Add action through keypress", function() {
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
    runtimeObj.parent.onCreateSets.push(new GameCreator.ConditionActionSet());
    $("#qunit-fixture").append('<div id="dialogue-window"></div>');
    runtimeObj.parent.keyPressed.space = true;

    GameCreator.runFrame(10);

    deepEqual($("#select-action-window").length, 1, "Action Window popped up");

    selectAction("testAction");
    addSelectedAction();

    deepEqual(runtimeObj.parent.keyEvents.space.length, 1, "Event was added");
    deepEqual(runtimeObj.parent.keyEvents.space[0].actions.length, 1, "Action was added");

    runtimeObj.parent.keyPressed.space = false;
    GameCreator.runFrame(10);

    ok(actionWasRun, "Action was run");
});

test("Add action through object creation", function() {
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
    $("#qunit-fixture").append('<div id="dialogue-window"></div>');

    GameCreator.runFrame(10);

    deepEqual($("#select-action-window").length, 1, "Action Window popped up");

    selectAction("testAction");
    addSelectedAction();

    deepEqual(runtimeObj.parent.onCreateSets.length, 1, "Event was added");
    deepEqual(runtimeObj.parent.onCreateSets[0].actions.length, 1, "Action was added");

    GameCreator.runFrame(10);

    ok(actionWasRun, "Action was run");
});

test("Add action through object destruction", function() {
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
    $("#qunit-fixture").append('<div id="dialogue-window"></div>');
    runtimeObj.parent.onCreateSets.push(new GameCreator.ConditionActionSet());
    runtimeObj.parent.destroy.call(runtimeObj);

    deepEqual($("#select-action-window").length, 1, "Action Window popped up");

    selectAction("testAction");
    addSelectedAction();

    deepEqual(runtimeObj.parent.onDestroySets.length, 1, "Event was added");
    deepEqual(runtimeObj.parent.onDestroySets[0].actions.length, 1, "Action was added");

    GameCreator.runFrame(10);

    ok(actionWasRun, "Action was run");
});

})();