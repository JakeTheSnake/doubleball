$(document).ready(function() {
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
});
    
