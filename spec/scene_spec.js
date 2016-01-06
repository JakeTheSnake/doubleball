describe("Scenes", function() {
    var redBall;

    beforeEach(function() {
        setup();
        redBall = createGlobalObject('TopDownObject');
        
        GameCreator.scenes.push(new GameCreator.Scene());
        GameCreator.createSceneObject(redBall, GameCreator.scenes[1], {x: 5, y: 6});
        GameCreator.state = 'playing';
        redBall.createState("Second state");
    });

    it("should reset state of objects on change", function() {
        redBall.attributes.unique = false;
        GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        GameCreator.scenes[0].objects[0].setState(1);
        var params = {scene: GameCreator.scenes[1].id};
        GameCreator.selectScene(params);
        expect(GameCreator.scenes[1].objects[0].getCurrentState().id).toBe(0);
    });

    it("should not reset state of unique object on scene change", function() {
        redBall.attributes.unique = true;
        GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
        GameCreator.scenes[0].objects[0].setState(1);
        var params = {scene: GameCreator.scenes[1].id}
        GameCreator.selectScene(params);
        expect(GameCreator.scenes[1].objects[0].getCurrentState().id).toBe(1);
    });

    it("should be possible to change state for unique object in another scene", function() {
        redBall.attributes.unique = true;
        redBall.states[1].attributes.width = [40];
        var selectStateParams = {state: {objId: redBall.id, stateId: 1}};
        var selectSceneParams = {scene: GameCreator.scenes[1].id};

        GameCreator.changeState(null, selectStateParams);
        GameCreator.selectScene(selectSceneParams);

        expect(GameCreator.scenes[1].objects[0].attributes.width).toBe(40);
    });

    it("should be possible to set a global counter value as scene start action", function() {
        GameCreator.createGlobalCounter('testCounter');
        var parameters = {counter: {carrier: 'globalCounters', name: 'testCounter'}, type: 'set', value: 5};
        var timing = {type: "now"};
        var action = new GameCreator.RuntimeAction('Counter', parameters, timing);
        var caSet = new GameCreator.ConditionActionSet();
        caSet.actions.push(action);
        GameCreator.scenes[0].onCreateSet = caSet;

        GameCreator.playScene(GameCreator.scenes[0]);

        expect(GameCreator.globalCounterCarriers['testCounter'].value).toBe(5);
    });
});
