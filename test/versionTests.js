(function() {
var major;
var minor;
var patch;
module("Version 0.2.0 Conversion Tests", {
    setup: function() {
        major = 0;
        minor = 1;
        patch = 1;
    },
    teardown: function() {

    }
});

function convertGame() {
    var savedGame = JSON.parse(GameCreator.saveState());
    // Set version to version before conversion that should be tested.
    savedGame.version = {
        major: major,
        minor: minor,
        patch: patch
    }
    GameCreator.restoreState(savedGame);
    return savedGame;
}

test("Direction parameter should be converted from two parameters to one", function() {
    var redBall = createGlobalObject('PlatformObject');
    var shootAction = new GameCreator.RuntimeAction('Shoot', {
        projectileDirection: 'Towards',
        target: 2
    });
    redBall.onCreateSets.push(new GameCreator.ConditionActionSet());
    redBall.onCreateSets[0].actions.push(shootAction);

    var savedGame = convertGame();

    var resultShootAction = savedGame.globalObjects[redBall.objectName].onCreateSets[0].actions[0];
    deepEqual(resultShootAction.parameters.projectileDirection.type, 'Towards');
    deepEqual(resultShootAction.parameters.projectileDirection.target, 2);
});

})();