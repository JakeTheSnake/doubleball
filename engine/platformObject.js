GameCreator.platformObject = {
        
    New: function(image, args){
        var obj = Object.create(GameCreator.baseObject);
        GameCreator.addObjFunctions.platformObjectFunctions(obj, args);
        GameCreator.addObjFunctions.collidableObjectFunctions(obj);
        GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
        GameCreator.addObjFunctions.bounceableObjectFunctions(obj);
        GameCreator.addObjFunctions.keyObjectFunctions(obj);
        GameCreator.addObjFunctions.clickableObjectFunctions(obj);
        
        obj.image = image;
        obj.name = args.name;
        obj.width = args.width;
        obj.height = args.height;

        obj.isCollidable = true;
        obj.isMovable = true;
        obj.isRenderable = true;
        obj.isEventable = true;
        
        obj.objectType = "platformObject";
        
        GameCreator.globalObjects[obj.name] = obj;
        return obj;
    },
    
    createFromSaved: function(savedObject){
        var obj = Object.create(GameCreator.baseObject);
        
        var image = new Image();
        image.src = savedObject.imageSrc;
        obj.image = image;
        
        GameCreator.addObjFunctions.platformObjectFunctions(obj);
        GameCreator.addObjFunctions.collidableObjectFunctions(obj);
        GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
        GameCreator.addObjFunctions.bounceableObjectFunctions(obj);
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
        
        obj.instantiated();
        
        return obj;
    }
}

GameCreator.addObjFunctions.platformObjectFunctions = function(platformObject, args)
{
    platformObject.accX = [0];
    platformObject.accY = (!args.accY && args.accY != 0) ? [5] : args.accY;
    platformObject.acceleration = (!args.acceleration && args.acceleration != 0) ? [8] : args.acceleration;
    platformObject.maxSpeed = (!args.maxSpeed && args.maxSpeed != 0) ? [300] : args.maxSpeed;
    platformObject.keyLeftPressed = false;
    platformObject.keyRightPressed = false;
    platformObject.keyUpPressed = false;
    platformObject.speedX = [0];
    platformObject.speedY = [0];
    //Dictionary where key is the keycode of a key and value is the action to perform when that key is pressed.
    platformObject.facingLeft = true;
    
    platformObject.calculateSpeed = function()
    {    
        //Should only be able to affect movement if there is something beneath object.
        if(this.parent.keyUpPressed && this.objectBeneath)
            this.speedY = -600;
    
        if(this.parent.keyRightPressed)
        {
            this.facingLeft = false;
            this.accX = this.acceleration;
        }
        else if(this.parent.keyLeftPressed)
        {
            this.facingLeft = true;
            this.accX = -this.acceleration;
        }
        else if(this.objectBeneath)
        {
            this.accX = 0;
            Math.abs(this.speedX) < 0.1 ? this.speedX = 0 : this.speedX *= 0.9;
        }
        else
            this.accX = 0;
        
        //Add acceleration only if object is moving below max movement speed in that direction.
        if(this.accX > 0 && this.speedX < this.maxSpeed || this.accX < 0 && this.speedX > -this.maxSpeed)
            this.speedX += this.accX;
            
        this.speedY += this.accY;
    }
    
    platformObject.onGameStarted = function(){
        var that = this;
        $(document).on("keydown.gameKeyListener", function(e){
            switch(e.which){
                case 32:
                that.keyPressed.space = true;
                break;
                
                case 37:
                that.keyLeftPressed = true;
                break;
                
                case 39:
                that.keyRightPressed = true;
                break;
                
                case 38:
                that.keyUpPressed = true;
                break;
                
                default: return;
            }
            e.preventDefault();
        });
        
        $(document).on("keyup.gameKeyListener", function(e){
            switch(e.which){
                case 32:
                that.keyPressed.space = false;
                break;
            
                case 37:
                that.keyLeftPressed = false;
                break;
                
                case 39:
                that.keyRightPressed = false;
                break;
                
                case 38:
                that.keyUpPressed = false;
                break;
                
                default: return;    
            }
            e.preventDefault();
        });
    };

    platformObject.initialize = function() {
        this.speedY = GameCreator.helperFunctions.getRandomFromRange(this.speedY);
        this.speedX = GameCreator.helperFunctions.getRandomFromRange(this.speedX);
        this.accY = GameCreator.helperFunctions.getRandomFromRange(this.accY);
        this.accX = GameCreator.helperFunctions.getRandomFromRange(this.accX);
        this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
        this.acceleration = GameCreator.helperFunctions.getRandomFromRange(this.acceleration);
        this.maxSpeed = GameCreator.helperFunctions.getRandomFromRange(this.maxSpeed);
    }
    
    platformObject.shoot = function(staticParameters){
        var projectileSpeed = GameCreator.helperFunctions.getRandomFromRange(staticParameters.projectileSpeed);
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: this.x + (this.facingLeft ? 0 : this.width), y: this.y, speedX: this.facingLeft ? -projectileSpeed : projectileSpeed});
    };
    
    platformObject.onDestroy = function(){

    };
}
