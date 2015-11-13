(function() {
module("Flow Tests", {
    setup: function() {

    },
    teardown: function() {

    }
});

function assertAllListenersSet() {
    ok(window.onkeyup, "onkeyup-listener should be set.");
    ok(window.onkeydown, "onkeydown-listener should be set.");
    ok(window.ontouchstart, "ontouchstart-listener should be set.");
    ok(window.ontouchend, "ontouchend-listener should be set.");
    ok(window.onmouseup, "onmouseup-listener should be set.");
    ok(window.onmousedown, "onmousedown-listener should be set.");
}

function assertAllListenersUnset() {
    notOk(window.onkeyup, "onkeyup-listener should be unset.");
    notOk(window.onkeydown, "onkeydown-listener should be unset.");
    notOk(window.ontouchstart, "ontouchstart-listener should be unset.");
    notOk(window.ontouchend, "ontouchend-listener should be unset.");
    notOk(window.onmouseup, "onmouseup-listener should be unset.");
    notOk(window.onmousedown, "onmousedown-listener should be unset.");
}

test("Play mode should add listeners to window", function() {
    GameCreator.playGame();

    assertAllListenersSet();
});

test("Direct mode should add listeners to window", function() {
    GameCreator.directActiveScene();

    assertAllListenersSet();
});

test("Edit mode should add remove listeners from window", function() {
    GameCreator.playGame();
    GameCreator.editActiveScene();

    assertAllListenersUnset();
});
})();