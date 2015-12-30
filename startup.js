$(document).ready(function() {
    var GCWidth = 1000;
    var GCHeight = 650;
    var GCviewportWidth = 1000;
    var GCviewportHeight = 650;
    try {
        GameCreator.height = window.gon.game.height || GCHeight;
        GameCreator.width = window.gon.game.width || GCWidth;
        GameCreator.viewportHeight = window.gon.game.viewportHeight || GCviewportHeight;
        GameCreator.viewportWidth = window.gon.game.viewportWidth || GCviewportWidth;
    } catch (e) {
        GameCreator.viewportHeight = GCviewportHeight;
        GameCreator.viewportWidth = GCviewportWidth;
    }
    
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
    
    var canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        canvasContainer.width = GameCreator.width;
        canvasContainer.height = GameCreator.height;
    }

    GameCreator.initialize();
 
    var selectedGameMode = "EDIT GAME";
    $("#edit-mode-label").html(selectedGameMode);

    $("#edit-mode-buttons input").on("click", function() {
        selectedGameMode = $(this).data("name");
        $("#edit-mode-label").html(selectedGameMode);
    });

    $("#edit-mode-buttons label").on("mouseover", function() {
        var inputId = $(this).attr("for");
        $("#edit-mode-label").html($("#" + inputId).data("name"));
    });

    $("#edit-mode-buttons label").on("mouseout", function() {
        $("#edit-mode-label").html(selectedGameMode);
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
            if (reply === "ok") {
                $("#save-message").html("Game was successfully saved!");
                setTimeout(function() {
                    $("#save-message").empty();
                    var currentDate = new Date();
                    var minutes = currentDate.getMinutes() < 9 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
                    $("#save-message").html("Game was last saved " + currentDate.getHours() + ":" + minutes);
                }, 3000);
            } else {
                $("#save-message").html("Game failed to save! (It might be too large)");
                setTimeout(function() {
                    $("#save-message").empty();
                }, 3000);
            }
        });
    });


    if (window.gon && gon.game != null) {
        GameCreator.restoreState(gon.game);
    } else {
        var startupScene = new GameCreator.Scene()
        GameCreator.scenes.push(startupScene);
        GameCreator.activeSceneId = startupScene.id;
    }
    GameCreator.UI.initializeUI();

    if (window.gon && gon.isFirstGame && !gon.game) {
        GameCreator.setupTutorial();
        GameCreator.launchTutorial();
    }

    setTimeout(GameCreator.editScene.bind(GameCreator, GameCreator.scenes[0]), 0);

    //Disable backspace navigation
    $(window).keydown(function (e) {
        if (e.which === 8) {
            GameCreator.UI.state.backspacePressed = true;
        }
    });

    $(window).keyup(function (e) {
        if (e.which === 8) {
            GameCreator.UI.state.backspacePressed = false;
        }
    });

    window.onbeforeunload = function() {
        if (GameCreator.UI.state.backspacePressed) {
            GameCreator.UI.state.backspacePressed = false;
            return "Are you sure you want to leave the editor? Make sure you have saved all changes.";
        }
    }
});
    
