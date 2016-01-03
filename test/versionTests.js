(function() {
var major;
var minor;
var patch;

function convertGame() {
    var savedGame = saveGame();
    return restoreGame(savedGame);
}

function saveGame() {
    var savedGame = JSON.parse(GameCreator.saveState());
    // Set version to version before conversion that should be tested.
    savedGame.version = {
        major: major,
        minor: minor,
        patch: patch
    }
    return savedGame;
}

function restoreGame(savedGame) {
    GameCreator.restoreState(savedGame);
    return savedGame;
}

module("Version 0.2.0 Conversion Tests", {
    setup: function() {
        major = 0;
        minor = 1;
        patch = 1;
    },
    teardown: function() {

    }
});


test("Direction parameter should be converted from two parameters to one", function() {
    var redBall = createGlobalObject('PlatformObject');
    var shootAction = new GameCreator.RuntimeAction('Shoot', {
        projectileDirection: 'Towards',
        target: 2
    });
    redBall.onCreateSets.push(new GameCreator.ConditionActionSet());
    redBall.onCreateSets[0].actions.push(shootAction);

    var loadedGame = convertGame();

    var convertedAction = loadedGame.globalObjects[redBall.objectName].onCreateSets[0].actions[0];
    deepEqual(convertedAction.parameters.projectileDirection.type, 'Towards', "Type parameter should be set.");
    deepEqual(convertedAction.parameters.projectileDirection.target, 2, "Target parameter should be set.");
    deepEqual(convertedAction.parameters.target, undefined, "Old target-parameter should have been removed.");
});

module("Version 0.3.0 Conversion Tests", {
    setup: function() {
        major = 0;
        minor = 2;
        patch = 1;
    },
    teardown: function() {

    }
});


test("Counter parameter should be converted from two parameters to one", function() {
    var redBall = createGlobalObject('PlatformObject');
    var counterAction = new GameCreator.RuntimeAction('Counter', {
        objId: 1,
        counter: "abcd"
    });
    redBall.onCreateSets.push(new GameCreator.ConditionActionSet());
    redBall.onCreateSets[0].actions.push(counterAction);

    var loadedGame = convertGame();

    var convertedAction = loadedGame.globalObjects[redBall.objectName].onCreateSets[0].actions[0];
    deepEqual(convertedAction.parameters.counter.carrier, 1, "Carrier parameter should be set.");
    deepEqual(convertedAction.parameters.counter.counter, "abcd", "Counter parameter should be set.");
    deepEqual(convertedAction.parameters.objId, undefined, "Old objId-parameter should have been removed.");
});

test("Switch State parameter should be converted from two parameters to one", function() {
    var redBall = createGlobalObject('PlatformObject');
    var switchStateAction = new GameCreator.RuntimeAction('SwitchState', {
        objectId: 1,
        objectState: 2
    });
    redBall.onCreateSets.push(new GameCreator.ConditionActionSet());
    redBall.onCreateSets[0].actions.push(switchStateAction);

    var loadedGame = convertGame();

    var convertedAction = loadedGame.globalObjects[redBall.objectName].onCreateSets[0].actions[0];
    deepEqual(convertedAction.parameters.state.objId, 1, "objId parameter should be set.");
    deepEqual(convertedAction.parameters.state.stateId, 2, "state parameter should be set.");
    deepEqual(convertedAction.parameters.objectId, undefined, "Old objectId-parameter should have been removed.");
    deepEqual(convertedAction.parameters.objectState, undefined, "Old objectState-parameter should have been removed.");
});

module("Version 0.4.0 Conversion Tests", {
    setup: function() {
        major = 0;
        minor = 3;
        patch = 1;
    },
});

test("Width/Height should be set on GameCreator.props", function() {
    delete GameCreator.props;

    var savedGame = saveGame();
    savedGame.width = 10;
    savedGame.height = 20;
    var loadedGame = restoreGame(savedGame);

    deepEqual(GameCreator.props.width, 10);
    deepEqual(GameCreator.props.height, 20);
    deepEqual(GameCreator.props.viewportWidth, 10);
    deepEqual(GameCreator.props.viewportHeight, 20);
    deepEqual(GameCreator.width, undefined);
    deepEqual(GameCreator.height, undefined);
});

})();
