(function() {

module("EventTest");

test("Test condition on event", function() {
    var testEvent = new GameCreator.ConditionActionSet();
    var testBool = false;
    GameCreator.conditions.testCondition = new GameCreator.Condition({ 
        evaluate: function(parameters) { testBool = parameters.testValue; return true; },
        params: {
            testValue: GameCreator.BooleanParameter
        }
    });
    
    testEvent.addCondition(new GameCreator.RuntimeCondition("testCondition", {testValue: true}));
    deepEqual(testEvent.conditions.length, 1, "Condition was added to Event");
    ok(testEvent.checkConditions(), "Condition returned true");
    ok(testBool, "Condition was run correctly.");
});

test("Test exists condition", function() {
    var redBall = createGlobalObject();
    var existsEvent = new GameCreator.ConditionActionSet();
    existsEvent.addCondition(new GameCreator.RuntimeCondition("exists", {objId: redBall.id, count: 1}));
    ok(!existsEvent.checkConditions(), "No object exists, should return false");

    var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
    ok(existsEvent.checkConditions(), "Object exists, should return true");
});

})();