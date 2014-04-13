

test("Save Form Data to Object", function() {
    var rangeField = GameCreator.htmlStrings.rangeInput('rangeField', 'range', '1:300');
    var numberField = GameCreator.htmlStrings.numberInput('numberField', 'number', '200');
    var stringField = GameCreator.htmlStrings.stringInput('textField', 'string', 'kastrull');
    var checkbox = GameCreator.htmlStrings.checkboxInput('checkboxField', 'checkbox', true);
    $("#qunit-fixture").html('<form id="test-form">' + rangeField + numberField + stringField + checkbox + '</form>');
    var obj = {};

    GameCreator.saveFormInputToObject('test-form', obj);
    
    deepEqual(obj.string, 'kastrull', 'String parsing.');
    deepEqual(obj.range, [1,300], 'Range parsing.');
    deepEqual(obj.number, 200, 'Number parsing.');
    deepEqual(obj.checkbox, true);
});

(function() {

var redBall;

module("Scene Object Tests", {
    setup: function() {
        redBall = GameCreator.addGlobalObject({image: {src: "../assets/red_ball.gif"}, objectName: "red_ball", width:[20], height:[30]}, "ActiveObject");
        GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
    },
    teardown: function() {

    }
});

test("Add Object to scene", function() {
    var sceneObject = GameCreator.scenes[0][0];
    ok(sceneObject, "Scene object added to scene");
    deepEqual(sceneObject.x, 5, "Scene object correct x.");
    deepEqual(sceneObject.y, 6, "Scene object correct y.");
});

test("Get Clicked Object in edit mode", function() {
    var sceneObject = GameCreator.getClickedObjectEditing(6, 7);
    ok(sceneObject, "Got scene object");
});

test("Delete selected scene object", function() {
    var sceneObject = GameCreator.getClickedObjectEditing(6, 7);
    GameCreator.selectedObject = sceneObject;

    deepEqual(GameCreator.scenes[0].length, 1, "Scene object was added to scene.");
    GameCreator.deleteSelectedObject();
    deepEqual(GameCreator.scenes[0].length, 0, "Delete scene object from scene.");
});

})();

(function() {

module("GameCreator.addGlobalObject");

test("Add Active Object", function() {
    GameCreator.addGlobalObject({image: {src: "../assets/red_ball.gif"}, objectName: "red_ball", width:[20], height:[30]}, "ActiveObject");
    ok(GameCreator.globalObjects["red_ball"], "Added to global objects.");
    deepEqual(GameCreator.globalObjects["red_ball"].width, [20], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["red_ball"].height, [30], "Height is set correctly.");
    ok(GameCreator.globalObjects["red_ball"].image.src.indexOf("red_ball.gif") != -1, "Image is set correctly.");
});

test("Add Active Object with ranges", function() {
    GameCreator.addGlobalObject({image: {src: "../assets/red_ball.gif"}, objectName: "red_ball", width:[20,30], height:[30,40]}, "ActiveObject");
    deepEqual(GameCreator.globalObjects["red_ball"].width, [20,30], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["red_ball"].height, [30,40], "Height is set correctly.");
});

test("Add Platform Object", function() {
    GameCreator.addGlobalObject({image: {src: "../assets/zealot.gif"}, maxSpeed: [200], accY: [5], acceleration: [6], objectName: "platformZealot", width: [80], height: [80]}, "PlatformObject");
    ok(GameCreator.globalObjects["platformZealot"], "Added to global objects.");
    deepEqual(GameCreator.globalObjects["platformZealot"].width, [80], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["platformZealot"].height, [80], "Height is set correctly.");
    deepEqual(GameCreator.globalObjects["platformZealot"].acceleration, [6], "Acceleration is set correctly.");
    deepEqual(GameCreator.globalObjects["platformZealot"].accY, [5], "Gravity is set correctly.");
    deepEqual(GameCreator.globalObjects["platformZealot"].maxSpeed, [200], "Speed is set correctly.");
    ok(GameCreator.globalObjects["platformZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

test("Add Platform Object with ranges", function() {
    GameCreator.addGlobalObject({image: {src: "../assets/zealot.gif"}, maxSpeed: [200,300], accY: [5,6], acceleration: [6,7], objectName: "platformZealot", width: [80,90], height: [80,90]}, "PlatformObject");
    deepEqual(GameCreator.globalObjects["platformZealot"].width, [80,90], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["platformZealot"].height, [80,90], "Height is set correctly.");
    ok(GameCreator.globalObjects["platformZealot"], "Added to global objects.");
    deepEqual(GameCreator.globalObjects["platformZealot"].acceleration, [6,7], "Acceleration is set correctly.");
    deepEqual(GameCreator.globalObjects["platformZealot"].accY, [5,6], "Gravity is set correctly.");
    deepEqual(GameCreator.globalObjects["platformZealot"].maxSpeed, [200,300], "Speed is set correctly.");
    ok(GameCreator.globalObjects["platformZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

test("Add Top Down Object", function() {
    GameCreator.addGlobalObject({image: {src: "../assets/zealot.gif"}, maxSpeed: [200], objectName: "topDownZealot", width: [80], height: [80]}, "TopDownObject");
    deepEqual(GameCreator.globalObjects["topDownZealot"].width, [80], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["topDownZealot"].height, [80], "Height is set correctly.");
    ok(GameCreator.globalObjects["topDownZealot"], "Added to global objects.");
    deepEqual(GameCreator.globalObjects["topDownZealot"].maxSpeed, [200], "Speed is set correctly.");
    ok(GameCreator.globalObjects["topDownZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

test("Add Top Down Object with ranges", function() {
    GameCreator.addGlobalObject({image: {src: "../assets/zealot.gif"}, maxSpeed: [200,300], objectName: "topDownZealot", width: [80,90], height: [80,90]}, "TopDownObject");
    ok(GameCreator.globalObjects["topDownZealot"], "Added to global objects.");
    deepEqual(GameCreator.globalObjects["topDownZealot"].width, [80,90], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["topDownZealot"].height, [80,90], "Height is set correctly.");
    deepEqual(GameCreator.globalObjects["topDownZealot"].maxSpeed, [200,300], "Speed is set correctly.");
    ok(GameCreator.globalObjects["topDownZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

test("Add Mouse Object", function() {
    GameCreator.addGlobalObject({image: {src: "../assets/zealot.gif"}, minX: [200], minY: [300], maxX: [400], maxY: [500], objectName: "mouseZealot", width: [80], height: [80]}, "MouseObject");
    deepEqual(GameCreator.globalObjects["mouseZealot"].width, [80], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["mouseZealot"].height, [80], "Height is set correctly.");
    ok(GameCreator.globalObjects["mouseZealot"], "Added to global objects.");
    deepEqual(GameCreator.globalObjects["mouseZealot"].minX, [200], "MinX is set correctly.");
    deepEqual(GameCreator.globalObjects["mouseZealot"].minY, [300], "MinY is set correctly.");
    deepEqual(GameCreator.globalObjects["mouseZealot"].maxX, [400], "MaxX is set correctly.");
    deepEqual(GameCreator.globalObjects["mouseZealot"].maxY, [500], "MaxY is set correctly.");
    ok(GameCreator.globalObjects["mouseZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});
})();