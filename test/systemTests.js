(function() {
var ReactTestUtils = React.addons.TestUtils;

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
    GameCreator.keys.keyLeftPressed = true;

    GameCreator.runFrame(10);

    ok(runtimeObj.attributes.x < 70, "Object moved left.");
});

test("Moved right test", function() {
    GameCreator.keys.keyRightPressed = true;

    GameCreator.runFrame(10);

    ok(runtimeObj.attributes.x > 70, "Object moved right.");
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

function addAction(actionName) {
    ReactTestUtils.Simulate.click($("#dialogue-right-action-column a")[0]);
    ReactTestUtils.Simulate.click($('#dialogue-right-select-column a:contains("' + GameCreator.helpers.labelize(actionName) + '")')[0]);
}


test("Add action through keypress", function() {
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
    runtimeObj.parent.onCreateSets.push(new GameCreator.ConditionActionSet());
    $("#qunit-fixture").append('<div id="dialogue-window"></div>');
    GameCreator.keys.keyPressed.space = true;

    GameCreator.runFrame(10);

    deepEqual($("#select-action-window").length, 1, "Action Window popped up");

    addAction("testAction");

    deepEqual(runtimeObj.parent.onKeySets.space.length, 1, "Event was added");
    deepEqual(runtimeObj.parent.onKeySets.space[0].actions.length, 1, "Action was added");

    GameCreator.keys.pendingRelease.space = true;
    GameCreator.runFrame(10);

    deepEqual(GameCreator.keys.keyPressed.space, false, "Key was released.");
    deepEqual(GameCreator.keys.pendingRelease.space, false, "Pending release was reset");

    ok(actionWasRun, "Action was run");
});

test("Add action through object creation", function() {
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
    $("#qunit-fixture").append('<div id="dialogue-window"></div>');

    GameCreator.runFrame(10);

    deepEqual($("#select-action-window").length, 1, "Action Window popped up");

    addAction("testAction");

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

    addAction("testAction");

    deepEqual(runtimeObj.parent.onDestroySets.length, 1, "Event was added");
    deepEqual(runtimeObj.parent.onDestroySets[0].actions.length, 1, "Action was added");

    GameCreator.runFrame(10);

    ok(actionWasRun, "Action was run");
});

})();