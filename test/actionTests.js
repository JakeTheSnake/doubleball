(function() {

var container;
var redBall;
var existingActions;
var caption;
var testValue;
var platformZealot;
var runtimeAction;
var runtimeObject;

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
    var collideEvent = new GameCreator.ConditionActionSet(redBall);
    collideEvent.actions.push(bounceAction);
    redBall.onCollideSets.push({id: GameCreator.borderObjects.borderL.id, caSets: [collideEvent]});
    return GameCreator.createRuntimeObject(redBall, {x: -5, y: 6, speedX: -500, speedY: 50});
}

test("Bounce Action Test", function() {
    var runtimeObj = setupCollisionEventForNewObject("Bounce");
    var oldSpeed = runtimeObj.attributes.speedX;
    GameCreator.checkCollisions();

    deepEqual(runtimeObj.attributes.speedX, -oldSpeed, "Speed was negated with bounce.");
});

test("Stop Action Test", function() {
    var runtimeObj = setupCollisionEventForNewObject("Stop");

    GameCreator.checkCollisions();

    deepEqual(runtimeObj.attributes.speedX, 0, "Object stopped X.");
});


test("Destroy Action Test", function() {
    var runtimeObj = setupCollisionEventForNewObject("Destroy", {effect: "FadeOut"});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.objectsToDestroy[0], runtimeObj, "Object was destroyed.");
    ok(GameCreator.currentEffects[0] instanceof GameCreator.effects.FadeOut, "Effect was added");
});

test("Create Action Test", function() {
    setupCollisionEventForNewObject("Create", {objectToCreate: redBall.id, x: 50, y: 60});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.renderableObjects.length, 2, "Object was created");
    deepEqual(GameCreator.renderableObjects[1].attributes.x, 50, "Correct X coordinate");
    deepEqual(GameCreator.renderableObjects[1].attributes.y, 60, "Correct Y coordinate");
});

test("Shoot Action Test", function() {
    var image = new Image();
    image.src = '../assets/red_ball.gif';
    var objToShoot = GameCreator.addGlobalObject({image: image, objectName: "projectile", width:[20], height:[30]}, "FreeObject");
    setupCollisionEventForNewObject("Shoot", {objectToShoot: objToShoot.id, projectileSpeed: 500, projectileDirection: "Left"});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.renderableObjects.length, 2, "Object was shot");
    deepEqual(GameCreator.renderableObjects[1].attributes.speedX, -500, "Correct X coordinate");
});

test("Counter Action Test", function() {
    redBall.parentCounters["testCounter"] = new GameCreator.Counter();
    
    var runtimeObj = setupCollisionEventForNewObject("Counter", {objId: 'this', counter: "testCounter", type: "set", value: 5});
    var counter = runtimeObj.counters["testCounter"];

    GameCreator.checkCollisions();

    deepEqual(counter.value, 5, "Counter value was set.");
});


test("SwitchScene Action Test", function() {
    var newScene = new GameCreator.Scene();
    GameCreator.scenes.push(newScene);
    var runtimeObj = setupCollisionEventForNewObject("SwitchScene", {scene: newScene.id});

    GameCreator.checkCollisions();

    deepEqual(GameCreator.activeSceneId, newScene.id, "Scene was switched.");
});

test("SwitchState Action Test", function() {
    var runtimeObj = setupCollisionEventForNewObject("SwitchState", {objectId: "this", objectState: 1});
    runtimeObj.parent.createState('TestState', {});

    GameCreator.checkCollisions();

    deepEqual(runtimeObj.currentState, 1);
});

test("NextScene Action Test", function() {
    var sceneOne = new GameCreator.Scene();
    var sceneTwo = new GameCreator.Scene();
    GameCreator.scenes.push(sceneOne);
    GameCreator.scenes.push(sceneTwo);
    
    GameCreator.switchScene(sceneOne);
    deepEqual(GameCreator.activeSceneId, sceneOne.id, "First scene should be active from start.");

    var runtimeObj = setupCollisionEventForNewObject("NextScene");
    GameCreator.checkCollisions();

    deepEqual(GameCreator.activeSceneId, sceneTwo.id, "Second scene should be active after action.");
});

module("ErrorActions", {
    setup: function() {
        platformZealot = GameCreator.addGlobalObject({objectName: "red_ball", width:[20], height:[30]}, "PlatformObject");
        runtimeObject = GameCreator.createRuntimeObject(platformZealot, {x: 50, y: 60, speedX: -500, speedY: 50});
    },
    teardown: function() {

    }
});

test("Bounce Action", function() {
    var bounceAction = new GameCreator.RuntimeAction("Bounce", {collisionObject: undefined});
    var error;
    try {
        bounceAction.runAction(runtimeObject);
    } catch (e) {
        error = e;
    }
    deepEqual(error, GameCreator.errors.BounceActionNoCollisionObject, "No Collision Object-error should be thrown");
});

test("Stop Action", function() {
    var bounceAction = new GameCreator.RuntimeAction("Stop", {collisionObject: undefined});
    var error;
    try {
        bounceAction.runAction(runtimeObject);
    } catch (e) {
        error = e;
    }
    deepEqual(error, GameCreator.errors.StopActionNoCollisionObject, "No Collision Object-error should be thrown");
});

test("Shoot Action", function() {
    var shootAction = new GameCreator.RuntimeAction("Shoot", {objectToShoot: undefined, projectileSpeed: undefined});
    ok(shootAction.runAction(runtimeObject) === false, "Action should not be run because of lacking required param");
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

    platformZealot.onKeySets[key] = [newEvent];
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
    platformZealot.onDestroySets = [newEvent];

    runtimeObject.parent.destroy.call(runtimeObject);

    assertActionRun();
});

})();
