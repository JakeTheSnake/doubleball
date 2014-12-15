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
    
    //Create FreeObjects
    
    var redBallImage = GameCreator.helpers.parseImage("http://i.imgur.com/MQPVf9Y.png");
    var ballImage = GameCreator.helpers.parseImage("http://i.imgur.com/OtyZQM9.png");
    var barImage = GameCreator.helpers.parseImage("http://i.imgur.com/SNwqBGp.png");
    var zerglingImage = GameCreator.helpers.parseImage("http://i.imgur.com/xkzVroj.png");
    var blackBallImage = GameCreator.helpers.parseImage("http://i.imgur.com/s5NKOGr.png");
    var zealotImage = GameCreator.helpers.parseImage("http://imgur.com/ku3doUx.png");

    var globalBall = GameCreator.addGlobalObject({image: redBallImage, objectName: "free_route_ball", width:[50],x:[1,100], y:[1,100], height:[50]}, "RouteObject");
    var globalBall2 = GameCreator.addGlobalObject({image: ballImage, objectName: "free_ball", width:[70],x:[1,100], y:[1,100], height:[70]}, "FreeObject");
    GameCreator.addGlobalObject({image: barImage, objectName:"free_bar", width:[388], height:[55], x:[1,100], y:[1,100]}, "FreeObject");
    //var sceneBall = GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:1, y:400, speedX: 340, speedY:240, speed: 200});
    //GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:200, y:400, speedX: -300, speedY:140});
    //GameCreator.createInstance(globalBall2, GameCreator.scenes[0], {x:200, y:100, speedX: -340, speedY:160});
    
    //Set route movement to sceneBall
    //sceneBall.route.push({x: 100, y: 100});
    //sceneBall.route.push({x: 100, y: 300});
    //sceneBall.route.push({x: 300, y: 300});
    //sceneBall.route.push({x: 300, y: 100, bounceNode: true});
    
    //Create Mouseobject
    
    var globalMousePlayer = GameCreator.addGlobalObject({image: zealotImage, objectName: "mouse_zealot", width: [80], height: [80]}, "MouseObject")
    
    //Create Platformobject
    
    var globalPlatformPlayer = GameCreator.addGlobalObject({image: zealotImage,objectName: "platform_zealot", width: [80], height: [80]}, "PlatformObject")
    
    //Create TopDownObject
    
    var globalTopDownPlayer = GameCreator.addGlobalObject({image: zerglingImage, x:[1,100], y:[1,100], objectName: "topdown_zerg", width: [80], height: [80]}, "TopDownObject")
    
    var globalTextCounter = GameCreator.addGlobalObject({objectName: "textCounter"}, "CounterObjectText");
    var globalImageCounter = GameCreator.addGlobalObject({image: blackBallImage, width: [50], height: [50], objectName: "imageCounter"}, "CounterObjectImage");

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

    if (window.gon && gon.game != null) {
        GameCreator.restoreState(gon.game);
        GameCreator.UI.initializeUI();
    }

    GameCreator.editScene(GameCreator.scenes[0]);
});
    
