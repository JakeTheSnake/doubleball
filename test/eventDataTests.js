(function() {

var redBall;

module("EventDataItemTests", {
  setup: function() {
    var image = new Image();
    image.src = '../assets/red_ball.gif';
    redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
  
  },
  teardown: function() {
  }
});

test("EventDataItem parameters", function() {
    var params = {objectToCreate: "red_ball", y: 60};
    var runtimeAction = new GameCreator.RuntimeAction("Create", params, {type: "at", time: 1000});
    var eventDataItem = new GameCreator.ActionItemVM(runtimeAction);
    var selectedParameters = eventDataItem.getSelectedParameters();

    deepEqual(selectedParameters.length, Object.keys(params).length, "getParameterList returned correct length of parameters.")
    deepEqual(selectedParameters[0].name, Object.keys(params)[0], "Name in parameter list corresponds with action parameter name.");
})

test("Addable parameters", function() {
    var runtimeAction = new GameCreator.RuntimeAction("Create", {}, {type: "at", time: 1000});
    var eventDataItem = new GameCreator.ActionItemVM(runtimeAction);

    var availableParameters = eventDataItem.getAvailableParameters();
    deepEqual(availableParameters.length, Object.keys(GameCreator.actions.Create.params).length, "All remaining parameters can be added");
});

test("Save parameter updates database", function() {
    var params = {objectToCreate: "red_ball", y: 60};
    var runtimeAction = new GameCreator.RuntimeAction("Create", params, {type: "at", time: 1000});
    var eventDataItem = new GameCreator.ActionItemVM(runtimeAction);

    var parameterItem = eventDataItem.getParameter("y");
    deepEqual(parameterItem.value, 60, "ParameterItem should have same value as in database");
    parameterItem.value = 70;
    parameterItem.saveParameterValue();

    deepEqual(runtimeAction.parameters.y, 70, "Parameter value was saved");
});


})();