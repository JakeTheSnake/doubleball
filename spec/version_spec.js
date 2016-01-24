describe("Version conversion", function() {
    
    // Tests should set version to version before the conversion to be tested.
    // (Example: If you want to test 0.3.0, set it to 0.2.1)
    var major;
    var minor;
    var patch;

    it("0.2.0: should convert direction parameter", function() {
        setVersion(0,1,1);
        var redBall = createGlobalObject('PlatformObject');
        var shootAction = new GameCreator.RuntimeAction('Shoot', {
            projectileDirection: 'Towards',
            target: 2
        });
        redBall.events.onCreateSets.push(new GameCreator.ConditionActionSet());
        redBall.events.onCreateSets[0].actions.push(shootAction);

        var loadedGame = convertGame();

        var convertedAction = loadedGame.globalObjects[redBall.objectName].events.onCreateSets[0].actions[0];
        expect(convertedAction.parameters.projectileDirection.type).toBe('Towards');
        expect(convertedAction.parameters.projectileDirection.target).toBe(2);
        expect(convertedAction.parameters.target).toBe(undefined);
    });

    it("0.3.0: should convert counter parameter", function() {
        setVersion(0,2,1);
        var redBall = createGlobalObject('PlatformObject');
        var counterAction = new GameCreator.RuntimeAction('Counter', {
            objId: 1,
            counter: "abcd"
        });
        redBall.events.onCreateSets.push(new GameCreator.ConditionActionSet());
        redBall.events.onCreateSets[0].actions.push(counterAction);

        var loadedGame = convertGame();

        var convertedAction = loadedGame.globalObjects[redBall.objectName].events.onCreateSets[0].actions[0];
        expect(convertedAction.parameters.counter.carrier).toBe(1);
        expect(convertedAction.parameters.counter.name).toBe("abcd");
        expect(convertedAction.parameters.objId).toBe(undefined);
    });

    it("0.3.0: should convert switch state parameters", function() {
        var redBall = createGlobalObject('PlatformObject');
        var switchStateAction = new GameCreator.RuntimeAction('SwitchState', {
            objectId: 1,
            objectState: 2
        });
        redBall.events.onCreateSets.push(new GameCreator.ConditionActionSet());
        redBall.events.onCreateSets[0].actions.push(switchStateAction);

        var loadedGame = convertGame();

        var convertedAction = loadedGame.globalObjects[redBall.objectName].events.onCreateSets[0].actions[0];
        expect(convertedAction.parameters.state.objId).toBe(1);
        expect(convertedAction.parameters.state.stateId).toBe(2);
        expect(convertedAction.parameters.objectId).toBe(undefined);
        expect(convertedAction.parameters.objectState).toBe(undefined);
    });

    it("0.4.0: should move Width/Height to GameCreator.props", function() {
        setVersion(0,3,1);
        delete GameCreator.props;

        var savedGame = saveGame();
        savedGame.width = 10;
        savedGame.height = 20;
        var loadedGame = restoreGame(savedGame);

        expect(GameCreator.props.width).toBe(10);
        expect(GameCreator.props.height).toBe(20);
        expect(GameCreator.props.viewportWidth).toBe(10);
        expect(GameCreator.props.viewportHeight).toBe(20);
        expect(GameCreator.width).toBe(undefined);
        expect(GameCreator.height).toBe(undefined);
    });

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

    function setVersion(maj, min, pat) {
        major = maj;
        minor = min;
        patch = patch;
    }
});
