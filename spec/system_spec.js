describe('Play Mode - PlatformObject', function() {
    var redBall, runtimeObj;

    beforeEach(function() {
        redBall = createGlobalObject("PlatformObject");
        GameCreator.playScene(GameCreator.scenes[0]);
        runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
    });

    it("can move left", function() {
        GameCreator.keys.keyLeftPressed = true;

        GameCreator.runFrame(10);

        expect(runtimeObj.attributes.x).toBeLessThan(70);
    });

    it("can move right", function() {
        GameCreator.keys.keyRightPressed = true;

        GameCreator.runFrame(10);

        expect(runtimeObj.attributes.x).toBeGreaterThan(70);
    });
});

describe("Direct Mode", function() {
    ReactTestUtils = React.addons.TestUtils;
    var redBall, actionWasRun, runtimeObj;

    function addAction(actionName) {
        ReactTestUtils.Simulate.click($("#dialogue-right-action-column a")[0]);
        ReactTestUtils.Simulate.click($('#dialogue-right-select-column a:contains("' + GameCreator.helpers.labelize(actionName) + '")')[0]);
    }

    beforeEach(function() {
        setup();
        redBall = createGlobalObject("PlatformObject");
        GameCreator.actions["testAction"] = new GameCreator.Action({
                                                action: function() {actionWasRun = true;},
                                                name: "testAction",
                                                runnable: function() {return true;},
                                                timing: {at: true, every: true, after: true},
                                            });
        GameCreator.actionGroups.nonCollisionActions["testAction"] = GameCreator.actions.testAction;
        actionWasRun = false;
        GameCreator.gameLoop = function() {};
        GameCreator.directScene(GameCreator.scenes[0]);
    });

    it("should be possible to add action through keypress", function() {
        var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
        runtimeObj.parent.events.onCreateSets.push(new GameCreator.ConditionActionSet());
        $("#fixture").append('<div id="dialogue-window"></div>');
        GameCreator.keys.keyPressed.space = true;

        GameCreator.runFrame(10);

        expect($("#select-action-window").length).toBe(1);

        addAction("testAction");

        expect(runtimeObj.parent.events.onKeySets.space.length).toBe(1);
        expect(runtimeObj.parent.events.onKeySets.space[0].actions.length).toBe(1);

        GameCreator.keys.pendingRelease.space = true;
        GameCreator.runFrame(10);

        expect(GameCreator.keys.keyPressed.space).toBe(false);
        expect(GameCreator.keys.pendingRelease.space).toBe(false);

        expect(actionWasRun).toBe(true);
    });

    it("should be possible to add action through object creation", function() {
        var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
        $("#fixture").append('<div id="dialogue-window"></div>');

        GameCreator.runFrame(10);

        expect($("#select-action-window").length).toBe(1);

        addAction("testAction");

        expect(runtimeObj.parent.events.onCreateSets.length).toBe(1);
        expect(runtimeObj.parent.events.onCreateSets[0].actions.length).toBe(1);

        GameCreator.runFrame(10);

        expect(actionWasRun).toBe(true);
    });

    it("should be possible to add action through object destruction", function() {
        var runtimeObj = GameCreator.createRuntimeObject(redBall, {x: 70, y: 70, speed: 300});
        $("#fixture").append('<div id="dialogue-window"></div>');
        runtimeObj.parent.events.onCreateSets.push(new GameCreator.ConditionActionSet());
        runtimeObj.parent.destroy.call(runtimeObj);

        expect($("#select-action-window").length).toBe(1);

        addAction("testAction");

        expect(runtimeObj.parent.events.onDestroySets.length).toBe(1);
        expect(runtimeObj.parent.events.onDestroySets[0].actions.length).toBe(1);

        GameCreator.runFrame(10);

        expect(actionWasRun).toBe(true);
    });

});
