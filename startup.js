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

    GameCreator.uiCanvas = document.createElement("canvas");
    GameCreator.uiCanvas.id = "ui-canvas"
    GameCreator.uiContext = GameCreator.uiCanvas.getContext("2d");
    GameCreator.uiCanvas.width = GameCreator.width;
    GameCreator.uiCanvas.height = GameCreator.height;
    $("#canvas-container").append(GameCreator.uiCanvas);
    
    var startupScene = new GameCreator.Scene()
    GameCreator.scenes.push(startupScene);
    GameCreator.activeSceneId = startupScene.id;
    
    GameCreator.initialize();

    $("#dialogue-overlay").on("click", GameCreator.UI.closeDialogue);
    $("#add-global-object-button").on("click", GameCreator.UI.openAddGlobalObjectDialogue);
    $("#edit-global-object-button").on("click", function(){
        GameCreator.UI.openEditGlobalObjectDialogue(GameCreator.selectedLibraryObject);
    });
    $("#toolbar-top button").on('click', function() {
        $("#toolbar-top button").removeClass('btn-active');
        $(this).addClass('btn-active');
    });
    $("#run-game-button").on("click", GameCreator.playGameEditing);
    $("#edit-game-button").on("click", GameCreator.editActiveScene);
    $("#direct-game-button").on("click", GameCreator.directActiveScene);
    $("#save-game-button").click(function() {
        $.ajax({
            type: "POST",
            url: "savegame",
            data: {game: {data: GameCreator.saveState()}}
        }).done(function(reply) {
            console.log(reply);
        });
    });

    if (gon && gon.game != null) {
        GameCreator.restoreState(gon.game);
        GameCreator.UI.initializeUI();
    }

    GameCreator.editScene(GameCreator.scenes[0]);
});
    
