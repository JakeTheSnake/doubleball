GameCreator.mouseObject = {
        
    New: function(image, args){
        var obj = Object.create(GameCreator.baseObject);
        GameCreator.addObjFunctions.mouseObjectFunctions(obj, args);
        GameCreator.addObjFunctions.collidableObjectFunctions(obj);
        GameCreator.addObjFunctions.keyObjectFunctions(obj);
        obj.image = image;
        obj.name = args.name;
        obj.width = args.width;
        obj.height = args.height;
        
        obj.isCollidable = true;
        obj.isMovable = true;
        obj.isRenderable = true;
        obj.isEventable = true;
        
        obj.counters = {};
        
        obj.objectType = "mouseObject";
        
        GameCreator.globalObjects[obj.name] = obj;
        return obj;
    },
    
    createFromSaved: function(savedObject){    
        var obj = Object.create(GameCreator.baseObject);
        
        var image = new Image();
        image.src = savedObject.imageSrc;
        obj.image = image;
        
        GameCreator.addObjFunctions.mouseObjectFunctions(obj, savedObject);
        GameCreator.addObjFunctions.collidableObjectFunctions(obj);
        GameCreator.addObjFunctions.keyObjectFunctions(obj);
        
        obj.isCollidable = true;
        obj.isMovable = true;
        obj.isRenderable = true;
        obj.isEventable = true;
        
        image.onload = function() {
            obj.imageReady = true;
            GameCreator.render();
        };
        
        for(name in savedObject){
            if (savedObject.hasOwnProperty(name)) {
                obj[name] = savedObject[name];    
            }
        }
        
        GameCreator.globalObjects[obj.name] = obj;
        
        return obj;
    }
}

GameCreator.addObjFunctions.mouseObjectFunctions = function(mouseObject, args)
{
    mouseObject.latestMouseX = 0;
    mouseObject.latestMouseY = 0;
    mouseObject.maxX = (!args.maxX && args.maxX != 0) ? GCWidth : args.maxX;
    mouseObject.maxY = (!args.maxY && args.maxY != 0) ? GCHeight : args.maxY;
    mouseObject.minX = args.minX || 0;
    mouseObject.minY = args.minY || 0;
    
    mouseObject.calculateSpeed = function(){};

    mouseObject.initialize = function(){
        this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
        this.x = GameCreator.helperFunctions.getRandomFromRange(this.x);
        this.y = GameCreator.helperFunctions.getRandomFromRange(this.y);
    };
    
    mouseObject.move = function()
    {   
        var offset = $(GameCreator.canvas).offset();
        this.x = this.parent.latestMouseX - offset.left;
        this.y = this.parent.latestMouseY - offset.top;
        if(this.x > this.maxX)
            this.x = this.maxX;
        else if(this.x < this.minX)
            this.x = this.minX;
        if(this.y > this.maxY)
            this.y = this.maxY;
        else if(this.y < this.minY)
            this.y = this.minY;
    };
    
    mouseObject.onGameStarted = function()
    {
        $(GameCreator.canvas).css("cursor", "none");
        var that = this;
        $(document).on("mousemove.gameKeyListener", function(evt)
        {
            that.latestMouseX = evt.pageX;
            that.latestMouseY = evt.pageY;
        });
        $(document).on("mousedown.gameKeyListener", function(e){
            switch(e.which){
                case 1:
                that.keyPressed.leftMouse = true;
                break;
                
                case 3:
                that.keyPressed.rightMouse = true;
                break;
                
                default: return;
            }
            e.preventDefault();
        });
        $(document).on("mouseup.gameKeyListener", function(e){
            switch(e.which){
                case 1:
                that.keyPressed.leftMouse = false;
                break;
                
                case 3:
                that.keyPressed.rightMouse = false;
                break;
                
                default: return;
            }
            e.preventDefault();
        });
    };
    
    mouseObject.shoot = function(staticParameters) {
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var projectileSpeed = GameCreator.helperFunctions.getRandomFromRange(staticParameters.projectileSpeed);
        
        switch(staticParameters.projectileDirection){
            case "Default":
            case "Up":
                x = this.x + this.width / 2;
                y = this.y;
                speedY = -projectileSpeed;
                break;
            case "Down":
                x = this.x + this.width / 2;
                y = this.y + this.height;
                speedY = projectileSpeed;
                break;
            case "Left":
                x = this.x;
                y = this.y + this.height / 2;
                speedX = -projectileSpeed;
                break;
            case "Right":
                x = this.x + this.width;
                y = this.y + this.height / 2;
                speedX = projectileSpeed;
                break;
            default:
            	var target = GameCreator.getRuntimeObject(staticParameters.projectileDirection);
                if (!target) {
                    // We did not find the target, return without shooting anything.
                    return;
                }
                x = this.x + this.width / 2;
                y = this.y + this.height / 2;
                var unitVector = GameCreator.helperFunctions.calcUnitVector(target.x - (this.x + this.width / 2), target.y - (this.y + this.height / 2));
                speedX = unitVector.x * projectileSpeed;
                speedY = unitVector.y * projectileSpeed;
                break;
        }
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: x, y: y, speedX: speedX, speedY: speedY});
    };
    
    mouseObject.onDestroy = function()
    {
        $(GameCreator.canvas).off("mousemove." + this.name);
    };
}