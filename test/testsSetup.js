QUnit.begin = function() {
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
    
    GameCreator.initialize();
};
    
QUnit.testStart = function() {
    GameCreator.reset();
    GameCreator.globalObjects = [];
    GameCreator.collidableObjects = [];
    GameCreator.movableObjects = [];
    GameCreator.renderableObjects = [];
    GameCreator.eventableObjects = [];
    GameCreator.objectsToDestroy = [];
    GameCreator.newlyCreatedObjects = [];
    GameCreator.currentEffects = [];
    GameCreator.bufferedActions = [];
    GameCreator.scenes = [];
    GameCreator.uniqueSceneId = 0;
    var newScene = new GameCreator.Scene();
    GameCreator.scenes.push(newScene);
    GameCreator.activeSceneId = newScene.id;
    GameCreator.paused = false;
};

function createGlobalObject(type, args) {
    args = args || {};
    $.extend(args, {image: {src: "../assets/red_ball.gif"}, objectName: type || "red_ball", width:[20], height:[30]});
    return GameCreator.addGlobalObject(args, type || "FreeObject");
}