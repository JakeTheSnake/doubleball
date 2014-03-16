(function() {

var redBall;
var counter;
var testString;

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
        assertCounter(-1, "Counter value increased");
    });

    test("Set positive counter value", function() {
        counter.setValue(1337);
        assertCounter(1337, "Counter value increased");
    });

    test("Set negative counter value", function() {
        counter.setValue(-1337);
        assertCounter(-1337, "Counter value increased");
    });

    test("Test OnIncrease counter event", function() {
        var action = {action: GameCreator.testAction, parameters: {value: "changed"}, timing: {type: "now"}, name: "testAction"};
        counter.parentCounter.onIncrease.push(action);
        counter.changeValue(1);
        deepEqual(testString, "changed", "OnIncrease Action");
    });

    test("Test OnDecrease counter event", function() {
        var action = {action: GameCreator.testAction, parameters: {value: "changed"}, timing: {type: "now"}, name: "testAction"};
        counter.parentCounter.onDecrease.push(action);
        counter.changeValue(-1);
        deepEqual(testString, "changed", "OnDecrease action");
    });
};

module("UniqueCounter", {
    setup: function() {
        redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", unique: true, objectName: "red_ball", width:[20], height:[30]}, "ActiveObject");
        redBall.parentCounters["testCounter"] = new GameCreator.Counter();
        GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        GameCreator.scenes.push([]);
        GameCreator.createSceneObject(redBall, GameCreator.scenes[1], {x: 5, y: 6});
        counter = GameCreator.globalObjects["red_ball"].counters["testCounter"];
        testString = "";
        GameCreator.actions["testAction"] = {action: function(params) {testString = params.value;}, runnable: function() {return true;} };
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
    GameCreator.selectScene({changeType: "setScene", changeValue: 1});
    assertCounter(5, "Counter value preserved");
});

module("Counter", {
  setup: function() {
    redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", objectName: "red_ball", width:[20], height:[30]}, "ActiveObject");
    redBall.parentCounters["testCounter"] = new GameCreator.Counter();
    GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
    counter = GameCreator.scenes[0][0].counters["testCounter"];
    testString = "";
    GameCreator.actions["testAction"] = {action: function(params) {testString = params.value;}, runnable: function() {return true;} }
  },
  teardown: function() {
    redBall.parentCounters["testCounter"].value = 0;
    delete GameCreator.actions["testAction"];
  }
});

commonCounterTests();


})();