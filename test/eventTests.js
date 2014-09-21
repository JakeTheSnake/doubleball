(function() {

module("EventTest");

test("Test condition on event", function() {
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

test("Test exists condition", function() {
    var redBall = createGlobalObject();
    var existsEvent = new GameCreator.ConditionActionSet();
    existsEvent.addCondition(new GameCreator.RuntimeCondition("exists", {objId: redBall.id, count: 2}));
    GameCreator.createRuntimeObject(redBall, {});
    ok(!existsEvent.checkConditions(), "Only one object exists, should return false");

    GameCreator.createRuntimeObject(redBall, {});
    ok(existsEvent.checkConditions(), "Two object exists, should return true");
});

test("Test state condition on this", function() {
    var redBall = createGlobalObject();
    var newState = redBall.createState('UltimateState');
    var caSet = new GameCreator.ConditionActionSet();
    caSet.addCondition(new GameCreator.RuntimeCondition("state", {objId: 'this', state: newState.id}));
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    ok(!caSet.checkConditions(runtimeObj), 'Object should be in default state');
    runtimeObj.setState(newState.id);
    ok(caSet.checkConditions(runtimeObj), 'Object should be in new state');
});

test("Test state condition on instanceId", function() {
    var redBall = createGlobalObject();
    var newState = redBall.createState('Over9000');
    var caSet = new GameCreator.ConditionActionSet();
    var runtimeObj = GameCreator.createRuntimeObject(redBall, {instanceId: 'Goku'});
    caSet.addCondition(new GameCreator.RuntimeCondition("state", {objId: runtimeObj.instanceId, state: newState.id}));
    ok(!caSet.checkConditions(runtimeObj), 'Object should be in default state');
    runtimeObj.setState(newState.id);
    ok(caSet.checkConditions(runtimeObj), 'Object should be in new state');
});

})();