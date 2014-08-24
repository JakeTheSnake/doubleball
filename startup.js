debugCounter = 0;

window.onload = function () {
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
        
        var redBallImage = GameCreator.helpers.parseImage("assets/red_ball.gif");
        var ballImage = GameCreator.helpers.parseImage("assets/ball.png");
        var barImage = GameCreator.helpers.parseImage("assets/bar1.png");
        var zerglingImage = GameCreator.helpers.parseImage("assets/zergling.png");
        var blackBallImage = GameCreator.helpers.parseImage("assets/black_ball.gif");
        var zealotImage = GameCreator.helpers.parseImage("assets/zealot.gif");

        var globalBall = GameCreator.addGlobalObject({image: redBallImage, objectName: "free_red_ball", width:[50],x:[1,100], y:[1,100], height:[50]}, "FreeObject");
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
        //GameCreator.loadScene(GameCreator.scenes[0]);
        
        GameCreator.editScene(GameCreator.scenes[0]);
        
        //Mass create objects for test!
        //for(var i = 0; i < 5 ; ++i)
        //{
        //    console.log("addFreeObject");
        //    var name = "obj" + i;
        //    var x = i * 5;
        //    var y = i * 5;
        //    var speedX = i * 5;
        //    var speedY = i * 5;
        //    var height = 10 + i/5;
        //    var width = 10 + i/5;
        //    console.log(i)
        //    GameCreator.addFreeObject({
        //        objectName: name,
        //        width: width,
        //        height: height,
        //        x: x,
        //        y: y,
        //        speedX: speedX,
        //        speedY: speedY,
        //        src: "red_ball.gif"
        //    });
        //}
        
        // UI
         
        $("#dialogue-overlay").on("click", GameCreator.UI.closeDialogue);
        $("#add-global-object-button").on("click", GameCreator.UI.openAddGlobalObjectDialogue)
        $("#run-game-button").on("click", GameCreator.playGame)
        $("#edit-game-button").on("click", GameCreator.editActiveScene)
        $("#direct-game-button").on("click", GameCreator.directActiveScene)
    }
    
