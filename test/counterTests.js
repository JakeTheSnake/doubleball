(function() {

var redBall;
var counter;
var testString;
var redBallSceneObj;
var counterCarrierId;

function assertCounter(value, message) {
    deepEqual(counter.value, value, message);
};

function commonCounterTests() {

    test("Default Value", function() {
        assertCounter(0, "Initial default value is set");
    });

    test("Increase counter by one", function() {
        counter.changeValue(1);
        assertCounter(1, "Counter value increased");
    });

    test("Decrease counter by one", function() {
        counter.changeValue(-1);
        assertCounter(-1, "Counter value decreased");
    });

    test("Set positive counter value", function() {
        counter.setValue(1337);
        assertCounter(1337, "Counter value set to positive value");
    });

    test("Set negative counter value", function() {
        counter.setValue(-1337);
        assertCounter(-1337, "Counter value set to negative value");
    });

    test("Test OnIncrease counter event", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: "changed"}, {type: "now"});
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(runtimeAction);
        counter.parentCounter.onIncrease.push(caSet);
        counter.changeValue(1);
        deepEqual(testString, "changed", "OnIncrease Action");
    });

    test("Test OnDecrease counter event", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: "changed"}, {type: "now"});
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(runtimeAction);
        counter.parentCounter.onDecrease.push(caSet);
        counter.changeValue(-1);
        deepEqual(testString, "changed", "OnDecrease action");
    });

    test("Test AtValue counter event", function() {
        var runtimeAction = new GameCreator.RuntimeAction("testAction", {value: "changed"}, {type: "now"});
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(runtimeAction);
        counter.parentCounter.atValue["1"] = [caSet];

        counter.changeValue(1);

        deepEqual(testString, "changed", "AtValue should trigger");
        testString = "";

        counter.setValue(0);
        deepEqual(testString, "", "AtValue should not trigger");

        counter.changeValue(1);
        deepEqual(testString, "changed", "AtValue should trigger again");
    });

    test("Nested actions manipulating counter should behave correctly", function() {
        var testAction = new GameCreator.RuntimeAction("testAction", {value: "changed"}, {type: "now"});
        var counterAction = new GameCreator.RuntimeAction("Counter", {objId: counterCarrierId, counter: "testCounter", type: "set", value: 0}, {type: "now"});
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(testAction);
        caSet.actions.push(counterAction);
        counter.parentCounter.atValue["1"] = [caSet];

        counter.changeValue(1); // counterAction should run, resetting the counter to 0 again.
        deepEqual(testString, "changed", "AtValue should trigger");
        testString = "";

        counter.changeValue(1); // Since counter was set to 0 between the changeValues, atValue["1"]-actions should trigger again.
        deepEqual(testString, "changed", "AtValue should trigger again");

    });
};

module("UniqueCounter", {
    setup: function() {
        var image = new Image();
        image.src = '../assets/red_ball.gif';
        redBall = GameCreator.addGlobalObject({image: image, unique: true, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
        redBall.parentCounters["testCounter"] = new GameCreator.Counter();
        redBallSceneObj = GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        GameCreator.scenes.push(new GameCreator.Scene());
        GameCreator.createSceneObject(redBall, GameCreator.scenes[1], {x: 5, y: 6});
        counter = GameCreator.globalObjects["red_ball"].counters["testCounter"];
        testString = "";
        counterCarrierId = redBall.id;
        GameCreator.actions["testAction"] = new GameCreator.Action({
                                                action: function(params) {testString = params.value;},
                                                runnable: function() {return true;}
                                            });
        GameCreator.state = 'directing';
    },
    teardown: function() {
        redBall.parentCounters["testCounter"].value = 0;
        delete GameCreator.actions["testAction"];
    }
});

commonCounterTests();

test("Counter value preserved between scenes", function() {
    counter.changeValue(5);
    assertCounter(5, "Counter value increased");
    var params = {scene: GameCreator.scenes[1].id}
    GameCreator.selectScene(params);
    assertCounter(5, "Counter value preserved");
});

module("Counter", {
  setup: function() {
    var image = new Image();
    redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
    redBall.parentCounters["testCounter"] = new GameCreator.Counter();
    GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
    counter = GameCreator.scenes[0].objects[0].counters["testCounter"];
    testString = "";
    counterCarrierId = redBall.id;
    GameCreator.actions["testAction"] = new GameCreator.Action({
        action: function(params) { testString = params.value; },
        runnable: function() { return true; }
    });
  },
  teardown: function() {
    delete GameCreator.actions["testAction"];
  }
});

commonCounterTests();

module("GlobalCounter", {
    setup: function() {
        testString = "";
        GameCreator.actions["testAction"] = new GameCreator.Action({
            action: function(params) { testString = params.value; },
            runnable: function() { return true; }
        });
        GameCreator.createGlobalCounter('testCounter');
        counter = GameCreator.globalCounterCarriers['testCounter'];
        counterCarrierId = 'globalCounters';
    },
    teardown: function() {
        delete GameCreator.actions["testAction"];
    }
});

commonCounterTests();



})();