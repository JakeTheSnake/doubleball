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
        
        GameCreator.scenes.push([]);
        GameCreator.activeScene = 0;
        
        //Create ActiveObjects
        
        var globalBall = GameCreator.addGlobalObject({src: "assets/red_ball.gif", name: "red_ball", width:[50],x:[1,100], y:[1,100], height:[50]}, "activeObject");
        var globalBall2 = GameCreator.addGlobalObject({src: "assets/ball.png", name: "ball", width:[70],x:[1,100], y:[1,100], height:[70]}, "activeObject");
        GameCreator.addGlobalObject({src: "assets/bar1.png", name:"bar", width:[388], height:[55], x:[1,100], y:[1,100]}, "activeObject");
        //var sceneBall = GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:1, y:400, speedX: 340, speedY:240, speed: 200});
        //GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:200, y:400, speedX: -300, speedY:140});
        //GameCreator.createInstance(globalBall2, GameCreator.scenes[0], {x:200, y:100, speedX: -340, speedY:160});
        
        //Set route movement to sceneBall
        //sceneBall.route.push({x: 100, y: 100});
        //sceneBall.route.push({x: 100, y: 300});
        //sceneBall.route.push({x: 300, y: 300});
        //sceneBall.route.push({x: 300, y: 100, bounceNode: true});
        
        //Create Mouseobject
        
        var globalMousePlayer = GameCreator.addGlobalObject({src: "assets/zealot.gif", name: "mouseZealot",x:[1,100], y:[1,100], width: [80], height: [80]}, "mouseObject")
        //GameCreator.createInstance(globalMousePlayer, GameCreator.scenes[0], {x:100, y:200})
        
        //Create Platformobject
        
        var globalPlatformPlayer = GameCreator.addGlobalObject({src: "assets/zealot.gif", x:[1,100], y:[1,100],name: "platformZealot", width: [80], height: [80]}, "platformObject")
        //GameCreator.createInstance(globalPlatformPlayer, GameCreator.scenes[0], {x:150, y:400, accY: 5});
        
        //Create TopDownObject
        
        var globalTopDownPlayer = GameCreator.addGlobalObject({src: "assets/zergling.png", x:[1,100], y:[1,100], name: "topDownLing", width: [80], height: [80]}, "topDownObject")
        
        
        //GameCreator.loadScene(GameCreator.scenes[0]);
        
        GameCreator.editScene(GameCreator.scenes[0]);
        
        //Mass create objects for test!
        //for(var i = 0; i < 5 ; ++i)
        //{
        //    console.log("addActiveObject");
        //    var name = "obj" + i;
        //    var x = i * 5;
        //    var y = i * 5;
        //    var speedX = i * 5;
        //    var speedY = i * 5;
        //    var height = 10 + i/5;
        //    var width = 10 + i/5;
        //    console.log(i)
        //    GameCreator.addActiveObject({
        //        name: name,
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
        
        $( ".ui-btn" ).button();
        $("#mode").buttonset();
        
    }
    
