(function() {

var redBall;

module("ActionItemTests", {
  setup: function() {
    container = $("#qunit-fixture");
    var image = new Image();
    image.src = '../assets/red_ball.gif';
    redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
  
  },
  teardown: function() {
  }
});

test("ActionItem parameters", function() {
    var params = {objectToCreate: "red_ball", y: 60};
    var runtimeAction = new GameCreator.RuntimeAction("Create", params, {type: "at", time: 1000});
    var actionItem = new GameCreator.ActionItem(runtimeAction, 1);
    var parameterList = actionItem.getParameterList();
    deepEqual(parameterList.length, Object.keys(params).length, "getParameterList returned correct length of parameters.")
    deepEqual(parameterList[0].name, Object.keys(params)[0], "Name in parameter list corresponds with action parameter name.");
})

test("Addable parameters", function() {
    var runtimeAction = new GameCreator.RuntimeAction("Create", {}, {type: "at", time: 1000});
    var actionItem = new GameCreator.ActionItem(runtimeAction, 1);

    var addableParameters = actionItem.getActionList();
    deepEqual(addableParameters.length, Object.keys(GameCreator.actions.Create.params).length, "All remaining parameters can be added");
});

})();