(function() {

var redBall;
var counter;
var testString;
var redBallSceneObj;
var counterCarrierId;

function assertCounter(value) {
    expect(counter.value).toBe(value);
};

function commonCounterTests() {

    it("Default Value", function() {
        assertCounter(0, "Initial default value is set");
    });

    it("Increase counter by one", function() {
        counter.changeValue(1);
        assertCounter(1, "Counter value increased");
    });

    it("Decrease counter by one", function() {
        counter.changeValue(-1);
        assertCounter(-1, "Counter value decreased");
    });

    it("Set positive counter value", function() {
        counter.setValue(1337);
        assertCounter(1337, "Counter value set to positive value");
    });

    it("Set negative counter value", function() {
        counter.setValue(-1337);
        assertCounter(-1337, "Counter value set to negative value");
    });

    it("Test OnIncrease counter event", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: "changed"}, {type: "now"});
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(runtimeAction);
        counter.parentCounter.onIncrease.push(caSet);
        counter.changeValue(1);
        expect(testString).toBe("changed");
    });

    it("Test OnDecrease counter event", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: "changed"}, {type: "now"});
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(runtimeAction);
        counter.parentCounter.onDecrease.push(caSet);
        counter.changeValue(-1);
        expect(testString).toBe("changed");
    });

    it("Test AtValue counter event", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: "changed"}, {type: "now"});
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(runtimeAction);
        counter.parentCounter.atValue["1"] = [caSet];

        counter.changeValue(1);

        expect(testString).toBe("changed");
        testString = "";

        counter.setValue(0);
        expect(testString).toBe("");

        counter.changeValue(1);
        expect(testString).toBe("changed");
    });

    it("Nested actions manipulating counter should behave correctly", function() {
        var testAction = new GameCreator.RuntimeAction("testAction", {value: "changed"}, {type: "now"});
        var counterAction = new GameCreator.RuntimeAction("Counter", 
            {counter: { carrier: counterCarrierId, name: "testCounter" }, type: "set", value: 0}, {type: "now"}
        );
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(testAction);
        caSet.actions.push(counterAction);
        counter.parentCounter.atValue["1"] = [caSet];

        counter.changeValue(1); // counterAction should run, resetting the counter to 0 again.
        expect(testString).toBe("changed");
        testString = "";

        counter.changeValue(1); // Since counter was set to 0 between the changeValues, atValue["1"]-actions should trigger again.
        expect(testString).toBe("changed");

    });
};

describe("Unique Counter", function() {
    beforeEach(function() {
        setup();
        redBall = createGlobalObject("FreeObject");
        redBall.attributes.unique = true;
        redBall.parentCounters["testCounter"] = new GameCreator.Counter();
        redBallSceneObj = GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        GameCreator.scenes.push(new GameCreator.Scene());
        GameCreator.createSceneObject(redBall, GameCreator.scenes[1], {x: 5, y: 6});
        counter = redBall.counters["testCounter"];
        testString = "";
        counterCarrierId = redBall.id;
        GameCreator.actions["testAction"] = new GameCreator.Action({
            action: function(params) { testString = params.value; },
            runnable: function() { return true; }
        });
        GameCreator.state = 'directing';
    });

    afterEach(function() {
        redBall.parentCounters["testCounter"].value = 0;
        delete GameCreator.actions["testAction"];
    });

    commonCounterTests();

    it("Counter value preserved between scenes", function() {
        counter.changeValue(5);

        assertCounter(5);

        var params = {scene: GameCreator.scenes[1].id}
        GameCreator.selectScene(params);
        assertCounter(5);
    });
});

describe("Counter", function() {
    beforeEach(function() {
        setup();
        redBall = createGlobalObject("FreeObject");
        redBall.parentCounters["testCounter"] = new GameCreator.Counter();
        GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        counter = GameCreator.scenes[0].objects[0].counters["testCounter"];
        testString = "";
        counterCarrierId = redBall.id;
        GameCreator.actions["testAction"] = new GameCreator.Action({
            action: function(params) { testString = params.value; },
            runnable: function() { return true; }
        });
    });

    afterEach(function() {
        delete GameCreator.actions["testAction"];
    });

    commonCounterTests();
});

describe("Global Counter", function() {
    beforeEach(function() {
        setup();
        testString = "";
        GameCreator.actions["testAction"] = new GameCreator.Action({
            action: function(params) { testString = params.value; },
            runnable: function() { return true; }
        });
        GameCreator.createGlobalCounter('testCounter');
        counter = GameCreator.globalCounterCarriers['testCounter'];
        counterCarrierId = 'globalCounters';
    });

    afterEach(function() {
        delete GameCreator.actions["testAction"];
    });

    commonCounterTests();
});

})();