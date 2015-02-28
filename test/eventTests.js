(function() {

module("EventTest");

test("Condition on event", function() {
    var testEvent = new GameCreator.ConditionActionSet();
    var testBool = false;
    GameCreator.conditions.testCondition = new GameCreator.Condition({ 
        evaluate: function(runtimeObj, parameters) { testBool = parameters.testValue; return true; },
        params: {
            testValue: GameCreator.BooleanParameter
        }
    });
    
    testEvent.addCondition(new GameCreator.RuntimeCondition("testCondition", {testValue: true}));
    deepEqual(testEvent.conditions.length, 1, "Condition was added to Event");
    ok(testEvent.checkConditions(null), "Condition returned true");
    ok(testBool, "Condition was run correctly.");
});

test("Exists condition", function() {
    var redBall = createGlobalObject();
    var existsEvent = new GameCreator.ConditionActionSet();
    existsEvent.addCondition(new GameCreator.RuntimeCondition("objectExists", {objId: redBall.id, count: 2}));
    GameCreator.createRuntimeObject(redBall, {});
    ok(!existsEvent.checkConditions(), "Only one object exists, should return false");

    GameCreator.createRuntimeObject(redBall, {});
    ok(existsEvent.checkConditions(), "Two object exists, should return true");
});

test("State condition on this", function() {
    var redBall = createGlobalObject();
    var newState = redBall.createState('UltimateState');
    var caSet = new GameCreator.ConditionActionSet();
    caSet.addCondition(new GameCreator.RuntimeCondition("isInState", {objId: 'this', state: newState.id}));
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    ok(!caSet.checkConditions(runtimeObj), 'Object should be in default state');
    runtimeObj.setState(newState.id);
    ok(caSet.checkConditions(runtimeObj), 'Object should be in new state');
});

test("State condition on instanceId", function() {
    var redBall = createGlobalObject();
    var newState = redBall.createState('Over9000');
    var caSet = new GameCreator.ConditionActionSet();
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    caSet.addCondition(new GameCreator.RuntimeCondition("isInState", {objId: runtimeObj.attributes.instanceId, state: newState.id}));
    ok(!caSet.checkConditions(runtimeObj), 'Object should be in default state');
    runtimeObj.setState(newState.id);
    ok(caSet.checkConditions(runtimeObj), 'Object should be in new state');
});

test("Counter condition", function() {
    var redBall = createGlobalObject();
    redBall.parentCounters['counter'] = new GameCreator.Counter();
    var caSet = new GameCreator.ConditionActionSet();
    caSet.addCondition(new GameCreator.RuntimeCondition("counterEquals", {objId: 'this', counter: 'counter', value: 1}));
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    runtimeObj.counters['counter'].value = 0;
    ok(!caSet.checkConditions(runtimeObj), 'Condition should fail because counter does not equal 1');
    runtimeObj.counters['counter'].value = 1;
    ok(caSet.checkConditions(runtimeObj), 'Condition should pass because counter equals 1');
});

test('Collision condition', function() {
    var redBall = createGlobalObject();
    var runtimeObj1 = GameCreator.createRuntimeObject(redBall, {x: 100, y: 200});
    var runtimeObj2 = GameCreator.createRuntimeObject(redBall, {x: 100, y: 200});
    var caSet = new GameCreator.ConditionActionSet();
    caSet.addCondition(new GameCreator.RuntimeCondition('collidesWith', {objId: runtimeObj2.attributes.instanceId}));
    ok(caSet.checkConditions(runtimeObj1), 'Objects should collide');
    runtimeObj2.attributes.x = 500;
    runtimeObj2.attributes.y = 500;
    ok(!caSet.checkConditions(runtimeObj1), 'Objects should no longer collide');
});

test('Current Scene condition', function() {
    var sceneOne = new GameCreator.Scene();
    var sceneTwo = new GameCreator.Scene();
    GameCreator.scenes.push(sceneOne);
    GameCreator.scenes.push(sceneTwo);
    GameCreator.switchScene(sceneOne);

    var caSet = new GameCreator.ConditionActionSet();
    caSet.addCondition(new GameCreator.RuntimeCondition('currentScene', {scene: sceneTwo.id, comparator: 'equals'}));
    ok(!caSet.checkConditions(), 'Condition should not pass because we are on a different scene');
    GameCreator.switchScene(sceneTwo);
    ok(caSet.checkConditions(), 'Condition should pass after scene switch.');

    caSet.conditions.length = 0;
    caSet.addCondition(new GameCreator.RuntimeCondition('currentScene', {scene: sceneTwo.id, comparator: 'lessThan'}));
    ok(!caSet.checkConditions(), 'Condition should not pass because we are on the same scene');
    GameCreator.switchScene(sceneOne);
    ok(caSet.checkConditions(), 'Condition should pass after scene switch.');

    caSet.conditions.length = 0;
    caSet.addCondition(new GameCreator.RuntimeCondition('currentScene', {scene: sceneOne.id, comparator: 'greaterThan'}));
    ok(!caSet.checkConditions(), 'Condition should not pass because we are on the same scene');
    GameCreator.switchScene(sceneTwo);
    ok(caSet.checkConditions(), 'Condition should pass after scene switch.');
});

})();