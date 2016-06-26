describe("Game Flow", function() {
    function assertAllListenersSet() {
        expect(window.onkeyup).toBeTruthy();
        expect(window.onkeydown).toBeTruthy();
        expect(window.ontouchstart).toBeTruthy();
        expect(window.ontouchmove).toBeTruthy();
        expect(window.onmousemove).toBeTruthy();
        expect(window.ontouchend).toBeTruthy();
        expect(window.onmouseup).toBeTruthy();
        expect(window.onmousedown).toBeTruthy();
    }

    function assertAllListenersUnset() {
        expect(window.onkeyup).toBeFalsy();
        expect(window.onkeydown).toBeFalsy();
        expect(window.ontouchstart).toBeFalsy();
        expect(window.ontouchmove).toBeFalsy();
        expect(window.onmousemove).toBeFalsy();
        expect(window.ontouchend).toBeFalsy();
        expect(window.onmouseup).toBeFalsy();
        expect(window.onmousedown).toBeFalsy();
    }

    it("Play mode should add listeners to window", function() {
        GameCreator.playGame();

        assertAllListenersSet();
    });

    it("Direct mode should add listeners to window", function() {
        GameCreator.directActiveScene();

        assertAllListenersSet();
    });

    it("Edit mode should add remove listeners from window", function() {
        GameCreator.playGame();
        GameCreator.editActiveScene();

        assertAllListenersUnset();
    });

    it("should be set listeners after scene swap", function() {
        GameCreator.scenes.push(new GameCreator.Scene());
        GameCreator.playGame();

        GameCreator.switchScene(GameCreator.scenes[1]);
        
        assertAllListenersSet();
    });    
})

