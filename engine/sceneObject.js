GameCreator.sceneObject = {
    x: 0,
    y: 0,
    accX: 0,
    accY: 0,
    speedX: 0,
    speedY: 0,
    displayWidth: 0,
    displayHeight: 0,    
    image: undefined,
    
    clickOffsetX: 0,
    clickOffsetY: 0,
    
    //Global object this refers to.
    parent: undefined,
    
    //Name of object, by default same as the name of global object from which it was created.
    name: undefined,
    
    //Unique ID for this specific scene object.
    instanceId: undefined,
    insertNode: function(index) {
        this.route.splice(index + 1, 0, {x: 10, y:10});
        GameCreator.drawRoute(this.route);
    },
    
    removeNode: function(index) {
        this.route.splice(index, 1);
        GameCreator.drawRoute(this.route);
    },
    update: function() {
        this.displayWidth = parseInt(this.width[this.width.length - 1]);
        this.displayHeight = parseInt(this.height[this.height.length - 1]);
    },
    instantiate: function(globalObj, args){
        this.x = args.x != undefined ? args.x : 0
        this.y = args.y != undefined ? args.y : 0
        this.accX = args.accX != undefined ? args.accX : globalObj.accX;
        this.accY = args.accY != undefined ? args.accY : globalObj.accY;
        this.speedX = args.speedX != undefined ? args.speedX : globalObj.speedX;
        this.speedY = args.speedY != undefined ? args.speedY : globalObj.speedY;
        this.width = args.width != undefined ? args.width : globalObj.width;
        this.height = args.height != undefined ? args.height : globalObj.height;
        this.parent = globalObj;
        this.name = args.name != undefined ? args.name : globalObj.name;
        this.instanceId = this.name + GameCreator.getUniqueId();
        
        //PlayerMouse properties
        
        this.maxX = args.maxX != undefined ? args.maxX : globalObj.maxX;
        this.maxY = args.maxY != undefined ? args.maxY : globalObj.maxY;
        this.minX = args.minX != undefined ? args.minX : globalObj.minX;
        this.minY = args.minY != undefined ? args.minY : globalObj.minY;
            
        //PlayerPlatform properties
        
        this.objectBeneath = false;
        this.acceleration = args.acceleration != undefined ? args.acceleration : globalObj.acceleration;
        
        //If it is a platformObject add gravity by default.
        if(globalObj.objectType == "platformObject") {
            this.accY = args.accY != undefined ? args.accY : globalObj.accY;
        }
            
        //PlayerTopDown properties

        this.facing = 1;
        
        //TopDown and Platform
        
        this.maxSpeed = args.maxSpeed != undefined ? args.maxSpeed : globalObj.maxSpeed;
        this.keyCooldown = {space: false};
        
        //ActiveObject properties
        
        //Array of Points. Points are {x:, y:, bounceNode} objects.
        this.route = [{x: this.x, y: this.y}];
        //Index of point that is currently the target.
        this.targetNode = args.targetNode != undefined ? args.targetNode : 0;
        //If heading backwards or forwards through the grid. (Should switch when reaching a bounce node.)
        this.routeForward = args.routeForward != undefined ? args.routeForward : true;
        this.speed = args.speed != undefined ? args.speed : globalObj.speed;
        this.update();
    },
    delete: function() {
        var activeScene = GameCreator.scenes[GameCreator.activeScene];
        activeScene.splice(activeScene.indexOf(this), 1);
        GameCreator.renderableObjects.splice(GameCreator.renderableObjects.indexOf(this), 1);
        GameCreator.render();
    }
}