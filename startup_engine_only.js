$(document).ready(function() {
    var GCWidth = 1000;
    var GCHeight = 650;
    try {
        GameCreator.height = window.gon.game.height || GCHeight;
        GameCreator.width = window.gon.game.width || GCWidth;
    } catch (e) {
        GameCreator.height = GCHeight;
        GameCreator.width = GCWidth;
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
   
    GameCreator.state = 'playing';
    GameCreator.engineOnly = true;

    GameCreator.initialize();

    if (window.gon && gon.game != null) {
        GameCreator.restoreState(gon.game);
        setTimeout(GameCreator.playGame, 0)
    }
    /*
    var getQueryParam = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    if (window.gon && gon.game != null) {
        GameCreator.restoreState(gon.game);
        setTimeout(GameCreator.playGame, 0);
        if (gon.gameId === 2 && ) {
            var a = getQueryParam('a');
            setTimeout(function() {
                if (false) { // Replace with check if score should be sent.
                    var s = 5; // Replace with the score counter value.
                    var url = 'http://www.what.se/?a=' + a + '&s=' + btoa(s); // Score should be base64-encoded
                    document.location.href = url;
                }
            })
        }
    }
    */

    
});
    
