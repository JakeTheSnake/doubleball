$(document).ready(function() {
    GameCreator.bgCanvas = document.createElement("canvas");
    GameCreator.bgCanvas.id = "bg-canvas"
    GameCreator.bgContext = GameCreator.bgCanvas.getContext("2d");
    GameCreator.bgCanvas.width = GameCreator.width;
    GameCreator.bgCanvas.height = GameCreator.height;
    $("#canvas-container").append(GameCreator.bgCanvas);

    GameCreator.mainCanvas = document.createElement("canvas");
    GameCreator.mainCanvas.id = "main-canvas"
    GameCreator.mainContext = GameCreator.mainCanvas.getContext("2d");
    GameCreator.mainCanvas.width = GameCreator.width;
    GameCreator.mainCanvas.height = GameCreator.height;
    $("#canvas-container").append(GameCreator.mainCanvas);
   
    GameCreator.state = 'playing';
    GameCreator.engineOnly = true;

    GameCreator.initialize();

    if (window.gon && gon.game != null) {
        GameCreator.restoreState(gon.game);
        setTimeout(GameCreator.playGame, 0)
    }

    
});
    
