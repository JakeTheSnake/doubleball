(function() {

module("GameCreator Tests", {
  setup: function() {
    
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
    var collideEvent = new GameCreator.ConditionActionSet(redBall);
    collideEvent.actions.push(runtimeAction);
    redBall.onCollideSets.push({id: GameCreator.borderObjects.borderL.id, caSets: [collideEvent]});

    GameCreator.checkCollisions();

    deepEqual(testValue, 1, "Action should run as a result of the collision.");
    ok(runtimeObj.alreadyCollidesWith(GameCreator.borderObjects.borderL.objectName), "Object already collides with border");

    GameCreator.checkCollisions();

    deepEqual(testValue, 1, "Action should not run twice for the same collision.");
});

})();