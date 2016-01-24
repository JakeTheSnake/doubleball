describe('GameCreator', function() {
    beforeEach(function() {
        setup();
        GameCreator.state = 'playing';
    });
    

    it("can create runtime object", function() {
        var redBall = createGlobalObject("FreeObject");

        var runtimeObj = GameCreator.createRuntimeObject(redBall, {});

        expect(GameCreator.renderableObjects.length).toBe(1);
        expect(GameCreator.movableObjects.length).toBe(1);
        expect(GameCreator.eventableObjects.length).toBe(0);
        var redBallCollidables = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, redBall.id);
        expect(redBallCollidables.runtimeObjects.length).toBe(1);
    });

    it("can create Runtime Player Object", function() {
        var redBall = createGlobalObject("PlatformObject");

        var runtimeObj = GameCreator.createRuntimeObject(redBall, {});

        expect(GameCreator.renderableObjects.length).toBe(1);
        expect(GameCreator.movableObjects.length).toBe(1);
        expect(GameCreator.eventableObjects.length).toBe(1);
        var redBallCollidables = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, redBall.id);
        expect(redBallCollidables.runtimeObjects.length).toBe(1);
    });

    it("can create Runtime Counter Object", function() {
        var redBall = createGlobalObject("CounterDisplayText");

        var runtimeObj = GameCreator.createRuntimeObject(redBall, {});

        expect(GameCreator.renderableObjects.length).toBe(1);
        expect(GameCreator.movableObjects.length).toBe(0);
        expect(GameCreator.eventableObjects.length).toBe(0);
        expect(GameCreator.collidableObjects.length).toBe(0);
    });

    it("can destroy runtime object", function() {
        var redBall = createGlobalObject("FreeObject");
        var runtimeObj = GameCreator.createRuntimeObject(redBall, {});

        runtimeObj.parent.destroy.call(runtimeObj);
        GameCreator.cleanupDestroyedObjects();

        expect(GameCreator.renderableObjects.length).toBe(0);
        expect(GameCreator.movableObjects.length).toBe(0);
        expect(GameCreator.eventableObjects.length).toBe(0);
        var redBallCollidables = GameCreator.helpers.getObjectById(GameCreator.collidableObjects, redBall.id);
        expect(redBallCollidables).toBe(undefined);
    });

    it("can run actions on collision", function() {
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
        redBall.events.onCollideSets.push({id: GameCreator.borderObjects.borderL.id, caSets: [collideEvent]});

        GameCreator.checkCollisions();

        expect(testValue).toBe(1);
        expect(runtimeObj.alreadyCollidesWith(GameCreator.borderObjects.borderL.objectName)).toBe(true);

        GameCreator.checkCollisions();

        expect(testValue).toBe(1);
    });

});

