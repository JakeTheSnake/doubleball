(function() {

module("GameCreator Tests", {
  setup: function() {
    
  },
  teardown: function() {

  }
});

test("Create Runtime Active Object", function() {
    var redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", name: "red_ball", width:[20], height:[30]}, "activeObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    deepEqual(GameCreator.renderableObjects.length, 1, "Added to renderableObjects");
    deepEqual(GameCreator.movableObjects.length, 1, "Added to movableObjects");
    deepEqual(GameCreator.eventableObjects.length, 0, "Added to eventableObjects");
    var redBallCollidables = GameCreator.helperFunctions.getObjectById(GameCreator.collidableObjects, redBall.id);
    deepEqual(redBallCollidables.runtimeObjects.length, 1, "Added to collidableObjects");
});

test("Create Runtime Player Object", function() {
    var redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", name: "red_ball", width:[20], height:[30]}, "topDownObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    deepEqual(GameCreator.renderableObjects.length, 1, "Added to renderableObjects");
    deepEqual(GameCreator.movableObjects.length, 1, "Added to movableObjects");
    deepEqual(GameCreator.eventableObjects.length, 1, "Added to eventableObjects");
    var redBallCollidables = GameCreator.helperFunctions.getObjectById(GameCreator.collidableObjects, redBall.id);
    deepEqual(redBallCollidables.runtimeObjects.length, 1, "Added to collidableObjects");
});

test("Create Runtime Counter Object", function() {
    var redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", name: "red_ball", width:[20], height:[30]}, "counterObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    deepEqual(GameCreator.renderableObjects.length, 1, "Added to renderableObjects");
    deepEqual(GameCreator.movableObjects.length, 0, "Added to movableObjects");
    deepEqual(GameCreator.eventableObjects.length, 0, "Added to eventableObjects");
    deepEqual(GameCreator.collidableObjects.length, 0, "Added to collidableObjects");
});

test("Destroy Active Object", function() {
    var redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", name: "red_ball", width:[20], height:[30]}, "activeObject");
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});

    runtimeObj.parent.destroy.call(runtimeObj);
    GameCreator.cleanupDestroyedObjects();

    deepEqual(GameCreator.renderableObjects.length, 0, "Removed from renderableObjects");
    deepEqual(GameCreator.movableObjects.length, 0, "Removed from movableObjects");
    deepEqual(GameCreator.eventableObjects.length, 0, "Removed from eventableObjects");
    var redBallCollidables = GameCreator.helperFunctions.getObjectById(GameCreator.collidableObjects, redBall.id);
    deepEqual(redBallCollidables.runtimeObjects.length, 0, "Removed from collidableObjects");
});

})();