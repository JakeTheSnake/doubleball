(function() {

var redBall;

module("SwitchScene", {
    setup: function() {
        var image = new Image();
        image.src = '../assets/red_ball.gif';
        redBall = GameCreator.addGlobalObject({image: image, unique: false, objectName: "red_ball", width:[20], height:[30]}, "TopDownObject");
        GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        GameCreator.scenes.push(new GameCreator.Scene());
        GameCreator.createSceneObject(redBall, GameCreator.scenes[1], {x: 5, y: 6});
        GameCreator.state = 'playing';
    },
    teardown: function() {
    }
});

test("State value reset to default when scene changed", function() {
	redBall.createState("Second state");
	GameCreator.scenes[0].objects[0].setState(1);
    var params = {scene: GameCreator.scenes[1].id};
    GameCreator.selectScene(params);
    deepEqual(GameCreator.scenes[1].objects[0].currentState, 0, 'State reset to default on scene switch');
});

test("State value preserved between scenes for unique object", function() {
	redBall.attributes.unique = true;
	redBall.createState("Second state");
	GameCreator.scenes[0].objects[0].setState(1);
    var params = {scene: GameCreator.scenes[1].id}
    GameCreator.selectScene(params);
    deepEqual(GameCreator.scenes[1].objects[0].currentState, 1, 'State did not change on scene switch for unique object');
});

})();