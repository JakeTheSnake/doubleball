(function() {

var redBall;

module("SwitchScene", {
    setup: function() {
        var image = new Image();
        image.src = '../assets/red_ball.gif';
        redBall = GameCreator.addGlobalObject({image: image, unique: false, objectName: "red_ball", width:[20], height:[30]}, "TopDownObject");
        
        GameCreator.scenes.push(new GameCreator.Scene());
        GameCreator.createSceneObject(redBall, GameCreator.scenes[1], {x: 5, y: 6});
        GameCreator.state = 'playing';
        redBall.createState("Second state");
    },
    teardown: function() {
    }
});

test("State value reset to default when scene changed", function() {
    GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
	GameCreator.scenes[0].objects[0].setState(1);
    var params = {scene: GameCreator.scenes[1].id};
    GameCreator.selectScene(params);
    deepEqual(GameCreator.scenes[1].objects[0].getCurrentState().id, 0, 'State reset to default on scene switch');
});

test("State value preserved between scenes for unique object", function() {
	redBall.attributes.unique = true;
    GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
	GameCreator.scenes[0].objects[0].setState(1);
    var params = {scene: GameCreator.scenes[1].id}
    GameCreator.selectScene(params);
    deepEqual(GameCreator.scenes[1].objects[0].getCurrentState().id, 1, 'State did not change on scene switch for unique object');
});

test("It should be possible to change state for unique object in another state", function() {
    redBall.attributes.unique = true;
    redBall.states[1].attributes.width = [40];
    var selectStateParams = {objectId: redBall.id, objectState: 1};
    var selectSceneParams = {scene: GameCreator.scenes[1].id};

    GameCreator.changeState(null, selectStateParams);
    GameCreator.selectScene(selectSceneParams);

    deepEqual(40, GameCreator.scenes[1].objects[0].attributes.width, "Width should have been changed.");
});

test("Setting a global counter value on scene start should work", function() {
    GameCreator.createGlobalCounter('testCounter');
    var parameters = {objId: 'globalCounters', counter: 'testCounter', type: 'set', value: 5};
    var timing = {type: "now"};
    var action = new GameCreator.RuntimeAction('Counter', parameters, timing);
    var caSet = new GameCreator.ConditionActionSet();
    caSet.actions.push(action);
    GameCreator.scenes[0].onCreateSet = caSet;

    GameCreator.playScene(GameCreator.scenes[0]);

    deepEqual(5, GameCreator.globalCounterCarriers['testCounter'].value);
});

})();