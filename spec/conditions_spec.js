describe("Conditions", function() {
    it("can be added to events and evaluated", function() {
        var testEvent = new GameCreator.ConditionActionSet();
        var testBool = false;
        GameCreator.conditions.testCondition = new GameCreator.Condition({ 
            evaluate: function(runtimeObj, parameters) { testBool = parameters.testValue; return true; },
            params: {
                testValue: GameCreator.BooleanParameter
            }
        });
        
        testEvent.addCondition(new GameCreator.RuntimeCondition("testCondition", {testValue: true}));
        expect(testEvent.conditions.length).toBe(1);
        expect(testEvent.checkConditions(null)).toBe(true);
        expect(testBool).toBe(true);
    });

    it("has an object exists condition", function() {
        var redBall = createGlobalObject();
        var existsEvent = new GameCreator.ConditionActionSet();
        existsEvent.addCondition(new GameCreator.RuntimeCondition("objectExists", {objId: redBall.id, count: 2}));
        GameCreator.createRuntimeObject(redBall, {});
        expect(!existsEvent.checkConditions()).toBe(true);

        GameCreator.createRuntimeObject(redBall, {});
        expect(existsEvent.checkConditions()).toBe(true);
    });

    it("has a state condition that can target 'this'", function() {
        var redBall = createGlobalObject();
        var newState = redBall.createState('UltimateState');
        var caSet = new GameCreator.ConditionActionSet();
        caSet.addCondition(new GameCreator.RuntimeCondition("isInState", {state: newState.id}));
        var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
        expect(!caSet.checkConditions(runtimeObj)).toBe(true);
        runtimeObj.setState(newState.id);
        expect(caSet.checkConditions(runtimeObj)).toBe(true);
    });

    it("has a state condition that targets specific instances", function() {
        var redBall = createGlobalObject();
        var newState = redBall.createState('Over9000');
        var caSet = new GameCreator.ConditionActionSet();
        var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
        caSet.addCondition(new GameCreator.RuntimeCondition("isInState", {state: newState.id}));
        expect(!caSet.checkConditions(runtimeObj)).toBe(true);
        runtimeObj.setState(newState.id);
        expect(caSet.checkConditions(runtimeObj)).toBe(true);
    });

    it("has a counter condition", function() {
        var redBall = createGlobalObject();
        redBall.parentCounters['counter'] = new GameCreator.Counter();
        var caSet = new GameCreator.ConditionActionSet();
        caSet.addCondition(new GameCreator.RuntimeCondition("counterEquals", {counter: 'counter', value: 1}));
        var runtimeObj = GameCreator.createRuntimeObject(redBall, {});
        runtimeObj.counters['counter'].value = 0;
        expect(!caSet.checkConditions(runtimeObj)).toBe(true);
        runtimeObj.counters['counter'].value = 1;
        expect(caSet.checkConditions(runtimeObj)).toBe(true);
    });

    it('has a collision condition', function() {
        var redBall = createGlobalObject();
        var runtimeObj1 = GameCreator.createRuntimeObject(redBall, {x: 100, y: 200});
        var runtimeObj2 = GameCreator.createRuntimeObject(redBall, {x: 100, y: 200});
        var caSet = new GameCreator.ConditionActionSet();
        caSet.addCondition(new GameCreator.RuntimeCondition('collidesWith', {objId: redBall.id}));
        expect(caSet.checkConditions(runtimeObj1)).toBe(true);
        runtimeObj2.attributes.x = 500;
        runtimeObj2.attributes.y = 500;
        expect(!caSet.checkConditions(runtimeObj1)).toBe(true);
    });

    it('has a current Scene condition', function() {
        var sceneOne = new GameCreator.Scene();
        var sceneTwo = new GameCreator.Scene();
        GameCreator.scenes.push(sceneOne);
        GameCreator.scenes.push(sceneTwo);
        GameCreator.switchScene(sceneOne);

        var caSet = new GameCreator.ConditionActionSet();
        caSet.addCondition(new GameCreator.RuntimeCondition('currentScene', {scene: sceneTwo.id, comparator: 'equals'}));
        expect(!caSet.checkConditions()).toBe(true);
        GameCreator.switchScene(sceneTwo);
        expect(caSet.checkConditions()).toBe(true);

        caSet.conditions.length = 0;
        caSet.addCondition(new GameCreator.RuntimeCondition('currentScene', {scene: sceneTwo.id, comparator: 'lessThan'}));
        expect(!caSet.checkConditions()).toBe(true);
        GameCreator.switchScene(sceneOne);
        expect(caSet.checkConditions()).toBe(true);

        caSet.conditions.length = 0;
        caSet.addCondition(new GameCreator.RuntimeCondition('currentScene', {scene: sceneOne.id, comparator: 'greaterThan'}));
        expect(!caSet.checkConditions()).toBe(true);
        GameCreator.switchScene(sceneTwo);
        expect(caSet.checkConditions()).toBe(true);
    });

    it('can throw validation error when containing missing parameters', function() {
        var runtimeCondition = new GameCreator.RuntimeCondition('objectExists', {
            objId: undefined,
            comparator: undefined,
        });

        var errorMsgs = runtimeCondition.validate();

        expect(errorMsgs.length).toBe(2);


    })

});
