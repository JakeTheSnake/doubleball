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
};
    
QUnit.testStart = function() {
    GameCreator.reset();
    GameCreator.globalObjects = [];
    GameCreator.scenes = [];
    GameCreator.scenes.push([]);
    GameCreator.activeScene = 0;
};