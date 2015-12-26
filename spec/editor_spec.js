describe('Remove GlobalObject function', function() {
    beforeEach(function() {
        setup();
    });

    it("removes related scene objects", function() {
        var redBall = createGlobalObject("FreeObject");
        var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
        GameCreator.scenes.push(new GameCreator.Scene());
        GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        GameCreator.createSceneObject(redBall, GameCreator.scenes[1], {x: 5, y: 6});

        GameCreator.removeGlobalObject(redBall.id);

        expect(GameCreator.scenes[0].objects.length).toBe(0);
        expect(GameCreator.scenes[1].objects.length).toBe(0);
    });

    it("removes related actions and conditions.", function() {
        var redBall = createGlobalObject("PlatformObject");
        var blackBall = createGlobalObject("FreeObject");

        var createCaSet = function() {
            var caSet = new GameCreator.ConditionActionSet();
            caSet.actions.push(new GameCreator.RuntimeAction("Shoot", {objectToShoot: blackBall.id}));
            caSet.actions.push(new GameCreator.RuntimeAction("Create", {objectToCreate: blackBall.id}));
            caSet.actions.push(new GameCreator.RuntimeAction("Counter", {counter: {carrier: blackBall.id}}));
            caSet.actions.push(new GameCreator.RuntimeAction("SwitchState", {state: {objId: blackBall.id, stateId: 0}}));
            caSet.conditions.push(new GameCreator.RuntimeCondition("objectExists", {objId: blackBall.id}));
            caSet.conditions.push(new GameCreator.RuntimeCondition("collidesWith", {objId: blackBall.id}));
            return caSet;
        }    

        redBall.onCreateSets.push(createCaSet());
        redBall.onDestroySets.push(createCaSet());
        redBall.onClickSets.push(createCaSet());
        redBall.onCollideSets.push({id: GameCreator.borderObjects.borderL.id, caSets: [createCaSet()]});
        redBall.onKeySets.shift.push(createCaSet());
        GameCreator.scenes[0].onCreateSet = createCaSet();

        GameCreator.removeGlobalObject(blackBall.id);

        expect(redBall.onCreateSets[0].actions.length).toBe(0);
        expect(redBall.onCreateSets[0].conditions.length).toBe(0);
        expect(redBall.onDestroySets[0].actions.length).toBe(0);
        expect(redBall.onDestroySets[0].conditions.length).toBe(0);
        expect(redBall.onClickSets[0].actions.length).toBe(0);
        expect(redBall.onClickSets[0].conditions.length).toBe(0);
        expect(redBall.onCollideSets[0].caSets[0].actions.length).toBe(0);
        expect(redBall.onCollideSets[0].caSets[0].conditions.length).toBe(0);
        expect(redBall.onKeySets.shift[0].actions.length).toBe(0);
        expect(redBall.onKeySets.shift[0].conditions.length).toBe(0);
        expect(GameCreator.scenes[0].onCreateSet.actions.length).toBe(0);
        expect(GameCreator.scenes[0].onCreateSet.conditions.length).toBe(0);

    });

    it("removes counter references", function() {
        var redBall = createGlobalObject("PlatformObject");
        var counterDisplay = createGlobalObject("CounterDisplayText");
        var sceneCounterDisplay = GameCreator.createSceneObject(counterDisplay, GameCreator.scenes[0], {x: 5, y: 6});
        var sceneRedBall = GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        sceneCounterDisplay.attributes.counterCarrier = sceneRedBall.attributes.instanceId;
        sceneCounterDisplay.attributes.counterName = "whatever";

        GameCreator.removeGlobalObject(redBall.id);

        expect(sceneCounterDisplay.attributes.counterCarrier).toBe(null);
        expect(sceneCounterDisplay.attributes.counterName).toBe(null);
    });

    it("deletes it from the list", function() {
        var redBall = createGlobalObject("PlatformObject");

        GameCreator.removeGlobalObject(redBall.id);

        expect(GameCreator.globalObjects[redBall.objectName]).toBe(undefined);
    });

    it("removes on collision references", function() {
        var redBall = createGlobalObject("PlatformObject");
        var collidingObject = createGlobalObject("FreeObject");
        var fill1 = {id: collidingObject.id+1, caSets: [new GameCreator.ConditionActionSet()]};
        var collisionItem = {id: collidingObject.id, caSets: [new GameCreator.ConditionActionSet()]};
        var fill2 = {id: collidingObject.id+2, caSets: [new GameCreator.ConditionActionSet()]};
        redBall.onCollideSets.push(fill1);
        redBall.onCollideSets.push(collisionItem);
        redBall.onCollideSets.push(fill2);

        GameCreator.removeGlobalObject(collidingObject.id);

        expect(redBall.onCollideSets.length).toBe(2);
        expect(redBall.onCollideSets[0].id).toBe(collidingObject.id+1);
        expect(redBall.onCollideSets[1].id).toBe(collidingObject.id+2);
    });
});
