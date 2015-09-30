(function() {

module("GameCreator Tests", {
  setup: function() {
    GameCreator.state = 'playing';    
  },
  teardown: function() {

  }
});

test("Create Runtime Active Object", function() {
    var redBall = createGlobalObject("FreeObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    deepEqual(GameCreator.renderableObjects.length, 1, "Added to renderableObjects");
    deepEqual(GameCreator.movableObjects.length, 1, "Added to movableObjects");
    deepEqual(GameCreator.eventableObjects.length, 0, "Added to eventableObjects");
    var redBallCollidables = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, redBall.id);
    deepEqual(redBallCollidables.runtimeObjects.length, 1, "Added to collidableObjects");
});

test("Create Runtime Player Object", function() {
    var redBall = createGlobalObject("PlatformObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    deepEqual(GameCreator.renderableObjects.length, 1, "Added to renderableObjects");
    deepEqual(GameCreator.movableObjects.length, 1, "Added to movableObjects");
    deepEqual(GameCreator.eventableObjects.length, 1, "Added to eventableObjects");
    var redBallCollidables = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, redBall.id);
    deepEqual(redBallCollidables.runtimeObjects.length, 1, "Added to collidableObjects");
});

test("Create Runtime Counter Object", function() {
    var redBall = createGlobalObject("CounterDisplayText");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    deepEqual(GameCreator.renderableObjects.length, 1, "Added to renderableObjects");
    deepEqual(GameCreator.movableObjects.length, 0, "Added to movableObjects");
    deepEqual(GameCreator.eventableObjects.length, 0, "Added to eventableObjects");
    deepEqual(GameCreator.collidableObjects.length, 0, "Added to collidableObjects");
});

test("Destroy Active Object", function() {
    var image = new Image();
    image.src = '../assets/red_ball.gif';
    var redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});

    runtimeObj.parent.destroy.call(runtimeObj);
    GameCreator.cleanupDestroyedObjects();

    deepEqual(GameCreator.renderableObjects.length, 0, "Removed from renderableObjects");
    deepEqual(GameCreator.movableObjects.length, 0, "Removed from movableObjects");
    deepEqual(GameCreator.eventableObjects.length, 0, "Removed from eventableObjects");
    var redBallCollidables = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, redBall.id);
    deepEqual(redBallCollidables, undefined, "Removed from collidableObjects");
});

test("Collision test", function() {
    var redBall = createGlobalObject("FreeObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: -5, y: 200});
    var testValue = 0;
    GameCreator.actions["testAction"] = new GameCreator.Action({
                                                action: function(params) {testValue += params.value;},
                                                runnable: function() {return true;}
                                            });
    var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "now"});
    var collideEvent = new GameCreator.ConditionActionSet();
    collideEvent.actions.push(runtimeAction);
    redBall.onCollideSets.push({id: GameCreator.borderObjects.borderL.id, caSets: [collideEvent]});

    GameCreator.checkCollisions();

    deepEqual(testValue, 1, "Action should run as a result of the collision.");
    ok(runtimeObj.alreadyCollidesWith(GameCreator.borderObjects.borderL.objectName), "Object already collides with border");

    GameCreator.checkCollisions();

    deepEqual(testValue, 1, "Action should not run twice for the same collision.");
});

test("Remove global object removes scene objects", function() {
    var redBall = createGlobalObject("FreeObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    GameCreator.scenes.push(new GameCreator.Scene());
    GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
    GameCreator.createSceneObject(redBall, GameCreator.scenes[1], {x: 5, y: 6});

    GameCreator.removeGlobalObject(redBall.id);

    deepEqual(0, GameCreator.scenes[0].objects.length, "Objects from first scene should be removed");
    deepEqual(0, GameCreator.scenes[1].objects.length, "Objects from second scene should be removed");
});

test("Remove global object removes related actions.", function() {
    var redBall = createGlobalObject("PlatformObject");
    var blackBall = createGlobalObject("FreeObject");

    var createCaSet = function() {
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(new GameCreator.RuntimeAction("Shoot", {objectToShoot: blackBall.id}));
        caSet.actions.push(new GameCreator.RuntimeAction("Create", {objectToCreate: blackBall.id}));
        caSet.actions.push(new GameCreator.RuntimeAction("Counter", {objId: blackBall.id}));
        caSet.actions.push(new GameCreator.RuntimeAction("SwitchState", {objectId: blackBall.id}));
        caSet.conditions.push(new GameCreator.RuntimeCondition("ojectExists", {objId: blackBall.id}));
        caSet.conditions.push(new GameCreator.RuntimeCondition("collidesWith", {objId: blackBall.id}));
        return caSet;
    }    

    redBall.onCreateSets.push(createCaSet());
    redBall.onDestroySets.push(createCaSet());
    redBall.onClickSets.push(createCaSet());
    redBall.onCollideSets.push({id: GameCreator.borderObjects.borderL.id, caSets: [createCaSet()]});
    redBall.onKeySets.shift.push(createCaSet());

    GameCreator.removeGlobalObject(blackBall.id);

    deepEqual(redBall.onCreateSets[0].actions.length, 0, "OnCreate-actions should be removed.");
    deepEqual(redBall.onCreateSets[0].conditions.length, 0, "OnCreate-conditions should be removed.");
    deepEqual(redBall.onDestroySets[0].actions.length, 0, "OnDestroy-actions should be removed.");
    deepEqual(redBall.onDestroySets[0].conditions.length, 0, "OnDestroy-conditions should be removed.");
    deepEqual(redBall.onClickSets[0].actions.length, 0, "onClick-actions should be removed.");
    deepEqual(redBall.onClickSets[0].conditions.length, 0, "onClick-conditions should be removed.");
    deepEqual(redBall.onCollideSets[0].caSets[0].actions.length, 0, "onCollide-actions should be removed.");
    deepEqual(redBall.onCollideSets[0].caSets[0].conditions.length, 0, "onCollide-conditions should be removed.");
    deepEqual(redBall.onKeySets.shift[0].actions.length, 0, "onKey-actions should be removed.");
    deepEqual(redBall.onKeySets.shift[0].conditions.length, 0, "onKey-conditions should be removed.");

});

test("Remove global object removes counter references", function() {
    var redBall = createGlobalObject("PlatformObject");
    var counterDisplay = createGlobalObject("CounterDisplayText");
    var sceneCounterDisplay = GameCreator.createSceneObject(counterDisplay, GameCreator.scenes[0], {x: 5, y: 6});
    var sceneRedBall = GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
    sceneCounterDisplay.attributes.counterCarrier = sceneRedBall.attributes.instanceId;
    sceneCounterDisplay.attributes.counterName = "whatever";

    GameCreator.removeGlobalObject(redBall.id);

    deepEqual(sceneCounterDisplay.attributes.counterCarrier, null, "CounterCarrier should be reset.");
    deepEqual(sceneCounterDisplay.attributes.counterName, null, "CounterName should be reset.");
});

test("Remove global object deletes it from the list", function() {
    var redBall = createGlobalObject("PlatformObject");

    GameCreator.removeGlobalObject(redBall.id);

    deepEqual(GameCreator.globalObjects[redBall.objectName], undefined, "Global Object was removed from the list");
});



})();