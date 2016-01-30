describe("ActionRunner", function() {
    var testValue;

    beforeEach(function() {
        GameCreator.actions["testAction"] = new GameCreator.Action({
            action: function(params) {testValue += params.value;},
            runnable: function() {return true;}
        });
        testValue = 0;
    });

    afterEach(function() {
        delete GameCreator.actions["testAction"];
    });

    it("can run action", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "now"});
        runtimeAction.runAction(new Object());
        expect(testValue).toBe(1);
    });

    it("can run several actions", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "now"});
        var runtimeAction2 = new GameCreator.RuntimeAction("testAction", {value: 2}, {type: "now"});
        var runtimeAction3 = new GameCreator.RuntimeAction("testAction", {value: 4}, {type: "now"});

        var actionsToRun = [runtimeAction, runtimeAction2, runtimeAction3];
        for (var i = 0; i < actionsToRun.length; i++) {
            actionsToRun[i].runAction(new Object());    
        }

        expect(testValue).toBe(7);
    });

    it("run timed action at 1000 ms", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "at", time: 1000});

        GameCreator.timerHandler.update(500);
        expect(testValue).toBe(0);

        runtimeAction.runAction(new Object());

        GameCreator.timerHandler.update(500);
        expect(testValue).toBe(1);
    });

    it("run timed action after 1000 ms", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "after", time: 1000});

        runtimeAction.runAction(new Object());

        GameCreator.timerHandler.update(999);
        expect(testValue).toBe(0);

        GameCreator.timerHandler.update(1);
        expect(testValue).toBe(1);
    });

    it("run timed action every 1000 ms", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "every", time: 1000});
        runtimeAction.runAction(new Object());

        GameCreator.timerHandler.update(1000);
        expect(testValue).toBe(1);

        GameCreator.timerHandler.update(1000);
        expect(testValue).toBe(2);
    });
});



describe("Real Actions", function() {
    var redBall;

    beforeEach(function() {
        setup();
        GameCreator.state = 'playing';
        var image = new Image();
        redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");    
    });

    function setupCollisionEventForNewObject(action, parameters) {
        var parameters = parameters || {};
        var timing = {type: "now"};
        var bounceAction = new GameCreator.RuntimeAction(action, parameters, timing);
        var collideEvent = new GameCreator.ConditionActionSet();
        collideEvent.actions.push(bounceAction);
        redBall.events.onCollideSets.push({id: GameCreator.borderObjects.borderL.id, caSets: [collideEvent]});
        return GameCreator.createRuntimeObject(redBall, {x: -5, y: 6, speedX: -500, speedY: 50});
    }

    it("has Bounce Action", function() {
        var runtimeObj = setupCollisionEventForNewObject("Bounce");
        var oldSpeed = runtimeObj.attributes.speedX;
        GameCreator.checkCollisions();

        expect(runtimeObj.attributes.speedX).toBe(-oldSpeed);
    });

    it("has Stop Action", function() {
        var runtimeObj = setupCollisionEventForNewObject("Stop");

        GameCreator.checkCollisions();

        expect(runtimeObj.attributes.speedX).toBe(0);
    });


    it("has Destroy Action", function() {
        var runtimeObj = setupCollisionEventForNewObject("Destroy", {effect: "FadeOut"});

        GameCreator.checkCollisions();

        expect(GameCreator.objectsToDestroy[0]).toBe(runtimeObj);
        expect(GameCreator.currentEffects[0] instanceof GameCreator.effects.FadeOut).toBe(true);
    });

    it("has Create Action", function() {
        setupCollisionEventForNewObject("Create", {objectToCreate: redBall.id, x: 50, y: 60});

        GameCreator.checkCollisions();

        expect(GameCreator.renderableObjects.length).toBe(2);
        expect(GameCreator.renderableObjects[1].attributes.x).toBe(50);
        expect(GameCreator.renderableObjects[1].attributes.y).toBe(60);
    });

    function shootTest(objectType) {
        redBall = GameCreator.addGlobalObject({objectName: "red_ball", width:[20], height:[30]}, objectType);
        var objToShoot = GameCreator.addGlobalObject({objectName: "projectile", width:[20], height:[30]}, "FreeObject");
        var shooter = setupCollisionEventForNewObject("Shoot", {objectToShoot: objToShoot.id, projectileSpeed: 500, projectileDirection: {type: "Left"}});

        GameCreator.checkCollisions();

        expect(GameCreator.renderableObjects.length).toBe(2);
        expect(GameCreator.renderableObjects[1].parent.id).toBe(objToShoot.id);
        expect(GameCreator.renderableObjects[1].attributes.speedX >= -501).toBe(true);
        expect(GameCreator.renderableObjects[1].attributes.speedX <= -499).toBe(true);
        
        // Projectile should appear to the left of the shooter, thus -20
        expect(GameCreator.renderableObjects[1].attributes.x).toBe(shooter.attributes.x - 20);
        expect(GameCreator.renderableObjects[1].attributes.y).toBe(shooter.attributes.y);
    }

    function shootTowardsTest(objectType) {
        redBall = GameCreator.addGlobalObject({objectName: "red_ball", width:[20], height:[30]}, objectType);
        var objToShoot = GameCreator.addGlobalObject({objectName: "projectile", width:[20], height:[30]}, "FreeObject");
        var targetObject = GameCreator.addGlobalObject({objectName: "target", width:[20], height:[30]}, "FreeObject");
        GameCreator.createRuntimeObject(targetObject, {x: -500, y: 6, speedX: 0, speedY: 0})
        setupCollisionEventForNewObject("Shoot", {
            objectToShoot: objToShoot.id,
            projectileSpeed: 500,
            projectileDirection: {
                type: "Towards",
                target: targetObject.id
            }
        });

        GameCreator.checkCollisions();

        expect(GameCreator.renderableObjects.length).toBe(3);
        expect(GameCreator.renderableObjects[2].attributes.speedX >= -501).toBe(true);
        expect(GameCreator.renderableObjects[2].attributes.speedX <= -499).toBe(true);
    }

    it("can shoot towards another object - FreeObject", function() {
        shootTowardsTest('FreeObject');
    });

    it("can shoot towards another object - PlatformObject", function() {
        shootTowardsTest('PlatformObject');
    });

    it("can shoot towards another object - TopDownObject", function() {
        shootTowardsTest('TopDownObject');
    });

    it("can shoot towards another object - RouteObject", function() {
        shootTowardsTest('RouteObject');
    });

    it("can shoot towards another object - MouseObject", function() {
        shootTowardsTest('MouseObject');
    });

    it("can shoot - FreeObject", function() {
        shootTest('FreeObject');
    });

    it("can shoot - PlatformObject", function() {
        shootTest('PlatformObject');
    });

    it("can shoot - TopDownObject", function() {
        shootTest('TopDownObject');
    });

    it("can shoot - RouteObject", function() {
        shootTest('RouteObject');
    });

    it("can shoot - MouseObject", function() {
        shootTest('MouseObject');
    });

    it("can shoot default direction - PlatformObject", function() {
        redBall = GameCreator.addGlobalObject({objectName: "red_ball", width:[20], height:[30]}, "PlatformObject");
        var objToShoot = GameCreator.addGlobalObject({objectName: "projectile", width:[20], height:[30]}, "FreeObject");
        var shooter = setupCollisionEventForNewObject("Shoot", {objectToShoot: objToShoot.id, projectileSpeed: 500, projectileDirection: {type: "Default"}});
        shooter.facingLeft = false;

        GameCreator.checkCollisions();

        // Projectile should appear to the right of the shooter, thus -20
        expect(GameCreator.renderableObjects[1].attributes.x).toBe(shooter.attributes.x + 20);
        expect(GameCreator.renderableObjects[1].attributes.y).toBe(shooter.attributes.y);
    });

    it("has Counter Action", function() {
        redBall.parentCounters["testCounter"] = new GameCreator.Counter();
        
        var runtimeObj = setupCollisionEventForNewObject("Counter", {counter: {carrier: 'this', name: "testCounter"}, type: "set", value: 5});
        var counter = runtimeObj.counters["testCounter"];

        GameCreator.checkCollisions();

        expect(counter.value).toBe(5);
    });

    it("has GlobalCounter Action", function() {
        GameCreator.createGlobalCounter('testCounter');
        
        var runtimeObj = setupCollisionEventForNewObject("Counter", {counter: {carrier: 'globalCounters', name: "testCounter"}, type: "set", value: 5});
        var counter = GameCreator.globalCounterCarriers['testCounter'];

        GameCreator.checkCollisions();

        expect(counter.value).toBe(5);
    });


    it("has SwitchScene Action", function() {
        var newScene = new GameCreator.Scene();
        GameCreator.scenes.push(newScene);
        var runtimeObj = setupCollisionEventForNewObject("SwitchScene", {scene: newScene.id});

        GameCreator.checkCollisions();

        expect(GameCreator.activeSceneId).toBe(newScene.id);
    });

    it("has SwitchState Action", function() {
        var runtimeObj = setupCollisionEventForNewObject("SwitchState", {state: {objId: "this", stateId: "1"}});
        runtimeObj.parent.createState('TestState', {});

        GameCreator.checkCollisions();

        expect(runtimeObj.currentState).toBe(1);
    });

    it("has NextScene Action", function() {
        var sceneOne = new GameCreator.Scene();
        var sceneTwo = new GameCreator.Scene();
        GameCreator.scenes.push(sceneOne);
        GameCreator.scenes.push(sceneTwo);
        
        GameCreator.switchScene(sceneOne);
        expect(GameCreator.activeSceneId).toBe(sceneOne.id);

        var runtimeObj = setupCollisionEventForNewObject("NextScene");
        GameCreator.checkCollisions();

        expect(GameCreator.activeSceneId).toBe(sceneTwo.id);
    });


    it("Multiple CASets With Changing Conditions Test", function() {
        var sceneTwo = new GameCreator.Scene();
        var sceneThree = new GameCreator.Scene();
        GameCreator.scenes.push(sceneTwo);
        GameCreator.scenes.push(sceneThree);

        var caSet1 = new GameCreator.ConditionActionSet();
        caSet1.addCondition(new GameCreator.RuntimeCondition('currentScene', {scene: 1, comparator: 'equals'}));
        caSet1.actions.push(new GameCreator.RuntimeAction("SwitchScene", {scene: sceneTwo.id}, 'now'));

        var caSet2 = new GameCreator.ConditionActionSet();
        caSet2.addCondition(new GameCreator.RuntimeCondition('currentScene', {scene: sceneTwo.id, comparator: 'equals'}));
        caSet2.actions.push(new GameCreator.RuntimeAction("SwitchScene", {scene: sceneThree.id}, 'now'));

        redBall.events.onCollideSets.push({id: GameCreator.borderObjects.borderL.id, caSets: [caSet1, caSet2]});
        GameCreator.createRuntimeObject(redBall, {x: -5, y: 6, speedX: -500, speedY: 50});

        GameCreator.checkCollisions();

        expect(GameCreator.activeSceneId).toBe(sceneTwo.id);
    });

    it("can throw validation errors when parameters are missing", function() {
        var runtimeAction = new GameCreator.RuntimeAction('Shoot', {
            objectToShoot: undefined
        });

        var errorMsgs = runtimeAction.validate();

        expect(errorMsgs.length).toBe(1);
    });

});

describe("Action Errors", function() {
    var platformZealot, runtimeObject;

    beforeEach(function() {
        setup();
        platformZealot = GameCreator.addGlobalObject({objectName: "red_ball", width:[20], height:[30]}, "PlatformObject");
        runtimeObject = GameCreator.createRuntimeObject(platformZealot, {x: 50, y: 60, speedX: -500, speedY: 50});
    });

    it("should throw error on insufficient Bounce-parameters", function() {
        var bounceAction = new GameCreator.RuntimeAction("Bounce", {collisionObject: undefined});
        var error;
        try {
            bounceAction.runAction(runtimeObject);
        } catch (e) {
            error = e;
        }
        expect(error).toBe(GameCreator.errors.BounceActionNoCollisionObject);
    });

    it("should throw error on insufficient Stop-parameters", function() {
        var stopAction = new GameCreator.RuntimeAction("Stop", {collisionObject: undefined});
        var error;
        try {
            stopAction.runAction(runtimeObject);
        } catch (e) {
            error = e;
        }
        expect(error).toBe(GameCreator.errors.StopActionNoCollisionObject);
    });

    it("should throw error on insufficient Shoot-parameters", function() {
        var shootAction = new GameCreator.RuntimeAction("Shoot", {objectToShoot: undefined, projectileSpeed: undefined});
        expect(shootAction.runAction(runtimeObject)).toBe(false);
    });
});

describe("Action Triggers", function() {
    var newEvent, platformZealot, runtimeObject, runtimeAction, testValue;

    beforeEach(function() {
        GameCreator.actions["testAction"] = new GameCreator.Action({
            action: function(params) { testValue += params.value; },
            runnable: function() { return true; }
        });
        testValue = 0;
        var img = new Image();
        platformZealot = GameCreator.addGlobalObject({image: img, objectName: "red_ball", width:[20], height:[30]}, "PlatformObject");
        runtimeAction = new GameCreator.RuntimeAction("testAction", {value: 1}, {type: "now"});
        runtimeObject = GameCreator.createRuntimeObject(platformZealot, {x: 50, y: 60, speedX: -500, speedY: 50});
        newEvent = new GameCreator.ConditionActionSet();
        newEvent.actions.push(runtimeAction);
    });

    afterEach(function() {
        delete GameCreator.actions["testAction"];
    });

    function assertActionRun() {
        expect(testValue).toBe(1);
    }

    it("can trigger by key", function() {
        var key = "space";
        GameCreator.resetKeys();
        
        platformZealot.events.onKeySets[key] = [newEvent];
        GameCreator.keys.keyPressed[key] = true;

        runtimeObject.parent.checkEvents.call(runtimeObject);

        assertActionRun();
    });

    it("can trigger by creation", function() {
        platformZealot.events.onCreateSets = [newEvent];

        GameCreator.callOnCreateForNewObjects();

        assertActionRun();
    });


    it("can trigger by destruction", function() {
        platformZealot.events.onDestroySets = [newEvent];

        runtimeObject.parent.destroy.call(runtimeObject);

        assertActionRun();
    });
});
