(function() {

var redBall;
var counter;
var testString;

module("Counter", {
  setup: function() {
    redBall = GameCreator.addGlobalObject({src: "../assets/red_ball.gif", name: "red_ball", width:[20], height:[30]}, "activeObject");
    redBall.counters["testCounter"] = GameCreator.counter.New();
    GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
    counter = GameCreator.scenes[0][0].counters["testCounter"];
    testString = "";
    GameCreator.actions["testAction"] = {action: function(params) {testString = params.value;}, runnable: function() {return true;}, }
  },
  teardown: function() {
    redBall.counters["testCounter"].value = 0;
    delete GameCreator.actions["testAction"];
  }
});

function assertCounter(value, message) {
    deepEqual(counter.value, value, message);
};

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

})();