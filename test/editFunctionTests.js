

test("Save Form Data to Object", function() {
    var rangeField = GameCreator.htmlStrings.rangeInput('range', '1:300');
    var numberField = GameCreator.htmlStrings.numberInput('number', '200');
    var stringField = GameCreator.htmlStrings.stringInput('string', 'kastrull');
    var checkbox = GameCreator.htmlStrings.checkboxInput('checkbox', true);
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
        var image = new Image();
        image.src = '../assets/red_ball.gif';
        redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
        GameCreator.createSceneObject(redBall, GameCreator.scenes[0], {x: 5, y: 6});
    },
    teardown: function() {

    }
});

test("Add Object to scene", function() {
    var sceneObject = GameCreator.scenes[0].objects[0];
    ok(sceneObject, "Scene object added to scene");
    deepEqual(sceneObject.attributes.x, 5, "Scene object correct x.");
    deepEqual(sceneObject.attributes.y, 6, "Scene object correct y.");
});

test("Get Clicked Object in edit mode", function() {
    var sceneObject = GameCreator.getClickedObjectEditing(6, 7);
    ok(sceneObject, "Got scene object");
});

test("Delete selected scene object", function() {
    var sceneObject = GameCreator.getClickedObjectEditing(6, 7);
    GameCreator.selectedObject = sceneObject;

    deepEqual(GameCreator.scenes[0].objects.length, 1, "Scene object was added to scene.");
    GameCreator.deleteSelectedObject();
    deepEqual(GameCreator.scenes[0].objects.length, 0, "Delete scene object from scene.");
});

})();

(function() {

module("GameCreator.addGlobalObject");

var image = new Image();
image.src = '../assets/red_ball.gif';

test("Add Active Object", function() {
    GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30]}, "FreeObject");
    ok(GameCreator.globalObjects["red_ball"], "Added to global objects.");
    deepEqual(GameCreator.globalObjects["red_ball"].getDefaultState().attributes.width, [20], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["red_ball"].getDefaultState().attributes.height, [30], "Height is set correctly.");
    ok(GameCreator.globalObjects["red_ball"].getDefaultState().attributes.image.src.indexOf("red_ball.gif") != -1, "Image is set correctly.");
});

test("Add Active Object with ranges", function() {
    GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20,30], height:[30,40]}, "FreeObject");
    deepEqual(GameCreator.globalObjects["red_ball"].getDefaultState().attributes.width, [20,30], "Width is set correctly.");
    deepEqual(GameCreator.globalObjects["red_ball"].getDefaultState().attributes.height, [30,40], "Height is set correctly.");
});

test("Add Platform Object", function() {
    var platformZealot = GameCreator.addGlobalObject({image: image, maxSpeed: [200], accY: [5], acceleration: [6], objectName: "platformZealot", width: [80], height: [80]}, "PlatformObject");
    ok(platformZealot, "Added to global objects.");
    deepEqual(platformZealot.getDefaultState().attributes.width, [80], "Width is set correctly.");
    deepEqual(platformZealot.getDefaultState().attributes.height, [80], "Height is set correctly.");
    deepEqual(platformZealot.getDefaultState().attributes.acceleration, [6], "Acceleration is set correctly.");
    deepEqual(platformZealot.getDefaultState().attributes.accY, [5], "Gravity is set correctly.");
    deepEqual(platformZealot.getDefaultState().attributes.maxSpeed, [200], "Speed is set correctly.");
    ok(platformZealot.getDefaultState().attributes.image.src.indexOf("red_ball.gif") != -1, "Image is set correctly.");
});

test("Add Platform Object with ranges", function() {
    var platformZealot = GameCreator.addGlobalObject({image: image, maxSpeed: [200,300], accY: [5,6], acceleration: [6,7], objectName: "platformZealot", width: [80,90], height: [80,90]}, "PlatformObject");
    deepEqual(platformZealot.getDefaultState().attributes.width, [80,90], "Width is set correctly.");
    deepEqual(platformZealot.getDefaultState().attributes.height, [80,90], "Height is set correctly.");
    ok(platformZealot, "Added to global objects.");
    deepEqual(platformZealot.getDefaultState().attributes.acceleration, [6,7], "Acceleration is set correctly.");
    deepEqual(platformZealot.getDefaultState().attributes.accY, [5,6], "Gravity is set correctly.");
    deepEqual(platformZealot.getDefaultState().attributes.maxSpeed, [200,300], "Speed is set correctly.");
    ok(platformZealot.getDefaultState().attributes.image.src.indexOf("red_ball.gif") != -1, "Image is set correctly.");
});

test("Add Top Down Object", function() {
    var topDownZealot = GameCreator.addGlobalObject({image: image, maxSpeed: [200], objectName: "topDownZealot", width: [80], height: [80]}, "TopDownObject");
    deepEqual(topDownZealot.getDefaultState().attributes.width, [80], "Width is set correctly.");
    deepEqual(topDownZealot.getDefaultState().attributes.height, [80], "Height is set correctly.");
    ok(topDownZealot, "Added to global objects.");
    deepEqual(topDownZealot.getDefaultState().attributes.maxSpeed, [200], "Speed is set correctly.");
    ok(topDownZealot.getDefaultState().attributes.image.src.indexOf("red_ball.gif") != -1, "Image is set correctly.");
});

test("Add Top Down Object with ranges", function() {
    var topDownZealot = GameCreator.addGlobalObject({image: image, maxSpeed: [200,300], objectName: "topDownZealot", width: [80,90], height: [80,90]}, "TopDownObject");
    ok(topDownZealot, "Added to global objects.");
    deepEqual(topDownZealot.getDefaultState().attributes.width, [80,90], "Width is set correctly.");
    deepEqual(topDownZealot.getDefaultState().attributes.height, [80,90], "Height is set correctly.");
    deepEqual(topDownZealot.getDefaultState().attributes.maxSpeed, [200,300], "Speed is set correctly.");
    ok(topDownZealot.getDefaultState().attributes.image.src.indexOf("red_ball.gif") != -1, "Image is set correctly.");
});

test("Add Mouse Object", function() {
    var mouseZealot = GameCreator.addGlobalObject({image: image, minX: [200], minY: [300], maxX: [400], maxY: [500], objectName: "mouseZealot", width: [80], height: [80]}, "MouseObject");
    deepEqual(mouseZealot.getDefaultState().attributes.width, [80], "Width is set correctly.");
    deepEqual(mouseZealot.getDefaultState().attributes.height, [80], "Height is set correctly.");
    ok(mouseZealot, "Added to global objects.");
    deepEqual(mouseZealot.getDefaultState().attributes.minX, [200], "MinX is set correctly.");
    deepEqual(mouseZealot.getDefaultState().attributes.minY, [300], "MinY is set correctly.");
    deepEqual(mouseZealot.getDefaultState().attributes.maxX, [400], "MaxX is set correctly.");
    deepEqual(mouseZealot.getDefaultState().attributes.maxY, [500], "MaxY is set correctly.");
    ok(mouseZealot.getDefaultState().attributes.image.src.indexOf("red_ball.gif") != -1, "Image is set correctly.");
});

var redBall;

module("State Tests", {
    setup: function() {
        var image = new Image();
        image.src = '../assets/red_ball.gif';
        redBall = GameCreator.addGlobalObject({image: image, objectName: "red_ball", width:[20], height:[30], speedX: -500, speedY: 50}, "FreeObject");
    },
    teardown: function() {

    }
});

test("Add State", function() {
    var state = redBall.createState('Teststate', {});
    ok(redBall.getState(state.id), 'State was added');
    deepEqual(Object.keys(redBall.getState).length, 0, 'State attributes is empty');
});

test("Remove State", function() {
    var state = redBall.createState('Teststate', $.extend({}, redBall.getDefaultState().attributes));
    ok(state.attributes.width, 'State created with width attribute');
    redBall.removeAttributeFromState('width', state.id);
    deepEqual(state.attributes.width, undefined, 'Width removed from state');
});

test("Reset State", function() {
    var state = redBall.createState('Teststate', {});
    redBall.resetStateAttributes(state.id);
    deepEqual(state.attributes.length, redBall.getDefaultState().attributes.length);
});

test("Change State", function() {
    var state = redBall.createState('Teststate', {});
    redBall.resetStateAttributes(state.id);
    var runtimeObject = GameCreator.createRuntimeObject(redBall, {x: 50, y: 60});
    state.attributes.width = [100];
    state.attributes.height = [200];
    state.attributes.speedX = 10;
    state.attributes.speedY = 20;
    runtimeObject.setState(state.id);
    deepEqual(runtimeObject.currentState, state.id);
    deepEqual(runtimeObject.width, 100);
    deepEqual(runtimeObject.height, 200);
    deepEqual(runtimeObject.speedX, 10);
    deepEqual(runtimeObject.speedY, 20);
});

})();