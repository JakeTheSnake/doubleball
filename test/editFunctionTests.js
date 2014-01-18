QUnit.begin = function () {
		GameCreator.bgCanvas = document.createElement("canvas");
    GameCreator.bgCanvas.id = "bgCanvas"
    GameCreator.bgContext = GameCreator.bgCanvas.getContext("2d");
    GameCreator.bgCanvas.width = GameCreator.width;
    GameCreator.bgCanvas.height = GameCreator.height;

    GameCreator.mainCanvas = document.createElement("canvas");
    GameCreator.mainCanvas.id = "mainCanvas"
    GameCreator.mainContext = GameCreator.mainCanvas.getContext("2d");
    GameCreator.mainCanvas.width = GameCreator.width;
    GameCreator.mainCanvas.height = GameCreator.height;

    GameCreator.uiCanvas = document.createElement("canvas");
    GameCreator.uiCanvas.id = "uiCanvas"
    GameCreator.uiContext = GameCreator.uiCanvas.getContext("2d");
    GameCreator.uiCanvas.width = GameCreator.width;
    GameCreator.uiCanvas.height = GameCreator.height;
	};
	
QUnit.beginTest = function() {
	GameCreator.reset();
	GameCreator.globalObjects = [];
}
module("GameCreator.addGlobalObject");
test("Add Active Object", function() {
  GameCreator.addGlobalObject({src: "../assets/red_ball.gif", name: "red_ball", width:[20], height:[30]}, "activeObject");
	ok(GameCreator.globalObjects["red_ball"], "Added to global objects.");
	deepEqual(GameCreator.globalObjects["red_ball"].width, [20], "Width is set correctly.");
	deepEqual(GameCreator.globalObjects["red_ball"].height, [30], "Height is set correctly.");
	ok(GameCreator.globalObjects["red_ball"].image.src.indexOf("red_ball.gif") != -1, "Image is set correctly.");
});

test("Add Active Object with ranges", function() {
  GameCreator.addGlobalObject({src: "../assets/red_ball.gif", name: "red_ball", width:[20,30], height:[30,40]}, "activeObject");
	deepEqual(GameCreator.globalObjects["red_ball"].width, [20,30], "Width is set correctly.");
	deepEqual(GameCreator.globalObjects["red_ball"].height, [30,40], "Height is set correctly.");
});

test("Add Platform Object", function() {
  GameCreator.addGlobalObject({src: "../assets/zealot.gif", maxSpeed: [200], accY: [5], acceleration: [6], name: "platformZealot", width: [80], height: [80]}, "platformObject");
	ok(GameCreator.globalObjects["platformZealot"], "Added to global objects.");
	deepEqual(GameCreator.globalObjects["platformZealot"].width, [80], "Width is set correctly.");
	deepEqual(GameCreator.globalObjects["platformZealot"].height, [80], "Height is set correctly.");
	deepEqual(GameCreator.globalObjects["platformZealot"].acceleration, [6], "Acceleration is set correctly.");
	deepEqual(GameCreator.globalObjects["platformZealot"].accY, [5], "Gravity is set correctly.");
	deepEqual(GameCreator.globalObjects["platformZealot"].maxSpeed, [200], "Speed is set correctly.");
	ok(GameCreator.globalObjects["platformZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

test("Add Platform Object with ranges", function() {
  GameCreator.addGlobalObject({src: "../assets/zealot.gif", maxSpeed: [200,300], accY: [5,6], acceleration: [6,7], name: "platformZealot", width: [80,90], height: [80,90]}, "platformObject");
  deepEqual(GameCreator.globalObjects["platformZealot"].width, [80,90], "Width is set correctly.");
	deepEqual(GameCreator.globalObjects["platformZealot"].height, [80,90], "Height is set correctly.");
	ok(GameCreator.globalObjects["platformZealot"], "Added to global objects.");
	deepEqual(GameCreator.globalObjects["platformZealot"].acceleration, [6,7], "Acceleration is set correctly.");
	deepEqual(GameCreator.globalObjects["platformZealot"].accY, [5,6], "Gravity is set correctly.");
	deepEqual(GameCreator.globalObjects["platformZealot"].maxSpeed, [200,300], "Speed is set correctly.");
	ok(GameCreator.globalObjects["platformZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

test("Add Top Down Object", function() {
  GameCreator.addGlobalObject({src: "../assets/zealot.gif", maxSpeed: [200], name: "topDownZealot", width: [80], height: [80]}, "topDownObject");
  deepEqual(GameCreator.globalObjects["topDownZealot"].width, [80], "Width is set correctly.");
	deepEqual(GameCreator.globalObjects["topDownZealot"].height, [80], "Height is set correctly.");
	ok(GameCreator.globalObjects["topDownZealot"], "Added to global objects.");
	deepEqual(GameCreator.globalObjects["topDownZealot"].maxSpeed, [200], "Speed is set correctly.");
	ok(GameCreator.globalObjects["topDownZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

test("Add Top Down Object with ranges", function() {
  GameCreator.addGlobalObject({src: "../assets/zealot.gif", maxSpeed: [200,300], name: "topDownZealot", width: [80,90], height: [80,90]}, "topDownObject");
	ok(GameCreator.globalObjects["topDownZealot"], "Added to global objects.");
	deepEqual(GameCreator.globalObjects["topDownZealot"].width, [80,90], "Width is set correctly.");
	deepEqual(GameCreator.globalObjects["topDownZealot"].height, [80,90], "Height is set correctly.");
	deepEqual(GameCreator.globalObjects["topDownZealot"].maxSpeed, [200,300], "Speed is set correctly.");
	ok(GameCreator.globalObjects["topDownZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

test("Add Mouse Object", function() {
  GameCreator.addGlobalObject({src: "../assets/zealot.gif", minX: [200], minY: [300], maxX: [400], maxY: [500], name: "mouseZealot", width: [80], height: [80]}, "mouseObject");
  deepEqual(GameCreator.globalObjects["mouseZealot"].width, [80], "Width is set correctly.");
	deepEqual(GameCreator.globalObjects["mouseZealot"].height, [80], "Height is set correctly.");
	ok(GameCreator.globalObjects["mouseZealot"], "Added to global objects.");
	deepEqual(GameCreator.globalObjects["mouseZealot"].minX, [200], "MinX is set correctly.");
	deepEqual(GameCreator.globalObjects["mouseZealot"].minY, [300], "MinY is set correctly.");
	deepEqual(GameCreator.globalObjects["mouseZealot"].maxX, [400], "MaxX is set correctly.");
	deepEqual(GameCreator.globalObjects["mouseZealot"].maxY, [500], "MaxY is set correctly.");
	ok(GameCreator.globalObjects["mouseZealot"].image.src.indexOf("zealot.gif") != -1, "Image is set correctly.");
});

