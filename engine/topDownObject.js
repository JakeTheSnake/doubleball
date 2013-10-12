GameCreator.topDownObject = {
        
    New: function(image, args){
        var obj = Object.create(GameCreator.baseObject);
        GameCreator.addObjFunctions.topDownObjectFunctions(obj, args);
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
        obj.collisions = [];
        
        obj.objectType = "topDownObject";
        
        GameCreator.globalObjects[obj.name] = obj;
        return obj;
    },
    
    createFromSaved: function(savedObject){    
        var obj = Object.create(GameCreator.baseObject);
        
        var image = new Image();
        image.src = savedObject.imageSrc;
        obj.image = image;

        GameCreator.addObjFunctions.topDownObjectFunctions(obj);
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

GameCreator.addObjFunctions.topDownObjectFunctions = function(topDownObject, args)
{
    topDownObject.speedX = 0;
    topDownObject.speedY = 0;
    topDownObject.accX = 0;
    topDownObject.accY = 0;
    topDownObject.keyLeftPressed = false;
    topDownObject.keyRightPressed = false;
    topDownObject.keyUpPressed = false;
    topDownObject.keyDownPressed = false;
    topDownObject.maxSpeed = (!args.maxSpeed && args.maxSpeed != 0) ? 300 : args.maxSpeed;
    //Facing can be 1-8 where 1 is facing up and the others follow clockwise.
    topDownObject.facing = 1;
    //Dictionary where key is the keycode of a key and value is the action to perform when that key is pressed.
    
    topDownObject.update = function() {

    };

    topDownObject.initialize = function() {
        this.speedY = GameCreator.helperFunctions.getRandomFromRange(this.speedY);
        this.speedX = GameCreator.helperFunctions.getRandomFromRange(this.speedX);
        this.accY = GameCreator.helperFunctions.getRandomFromRange(this.accY);
        this.accX = GameCreator.helperFunctions.getRandomFromRange(this.accX);
        this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
    };

    topDownObject.calculateSpeed = function()
    {    
        var maxSpeed = this.maxSpeed;
        var angularMaxSpeed = GameCreator.helperFunctions.calcAngularSpeed(maxSpeed);
        //Should only be able to affect movement if there is something beneath object.
        if(this.parent.keyUpPressed && !this.parent.keyRightPressed && !this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 1;
            this.speedX = 0;
            this.speedY = -maxSpeed;
        }
        
        else if(this.parent.keyUpPressed && this.parent.keyRightPressed && !this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 2;
            this.speedX = angularMaxSpeed;
            this.speedY = -angularMaxSpeed;
        }
        
        else if(!this.parent.keyUpPressed && this.parent.keyRightPressed && !this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 3;
            this.speedX = maxSpeed;
            this.speedY = 0;
        }

        else if(!this.parent.keyUpPressed && this.parent.keyRightPressed && this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 4;
            this.speedX = angularMaxSpeed;
            this.speedY = angularMaxSpeed;
        }
        
        else if(!this.parent.keyUpPressed && !this.parent.keyRightPressed && this.parent.keyDownPressed && !this.parent.keyLeftPressed) {
            this.facing = 5;
            this.speedX = 0;
            this.speedY = maxSpeed;
        }
        
        else if(!this.parent.keyUpPressed && !this.parent.keyRightPressed && this.parent.keyDownPressed && this.parent.keyLeftPressed) {
            this.facing = 6;
            this.speedX = -angularMaxSpeed;
            this.speedY = angularMaxSpeed;
        }
        
        else if(!this.parent.keyUpPressed && !this.parent.keyRightPressed && !this.parent.keyDownPressed && this.parent.keyLeftPressed) {
            this.facing = 7;
            this.speedX = -maxSpeed;
            this.speedY = 0;
        }
        
        else if(this.parent.keyUpPressed && !this.parent.keyRightPressed && !this.parent.keyDownPressed && this.parent.keyLeftPressed) {
            this.facing = 8;
            this.speedX = -angularMaxSpeed;
            this.speedY = -angularMaxSpeed;
        }
        
        else
        {
            Math.abs(this.speedX) < 0.1 ? this.speedX = 0 : this.speedX *= 0.9;
            Math.abs(this.speedY) < 0.1 ? this.speedY = 0 : this.speedY *= 0.9;
        }
    }
    
    topDownObject.onGameStarted = function(){
        var that = this;
        $(document).on("keydown.gameKeyListener", function(e){
            switch(e.which){
                case 32:
                that.keyPressed.space = true;
                break;
                
                case 37:
                that.keyLeftPressed = true;
                break;
                
                case 38:
                that.keyUpPressed = true;
                break;
                
                case 39:
                that.keyRightPressed = true;
                break;
                
                case 40:
                that.keyDownPressed = true;
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

                case 38:
                that.keyUpPressed = false;
                break;
                
                case 39:
                that.keyRightPressed = false;
                break;
                
                case 40:
                that.keyDownPressed = false;
                break;
                
                default: return;    
            }
            e.preventDefault();
        });
    }
    
    topDownObject.shoot = function(staticParameters){
        var facing = this.facing;
        var x = 0, y = 0, speedX = 0, speedY = 0;
        var projectileSpeed = GameCreator.helperFunctions.getRandomFromRange(staticParameters.projectileSpeed);
        var angularSpeed = GameCreator.helperFunctions.calcAngularSpeed(projectileSpeed);
        switch(facing){
            case 1:
            x = this.x + this.width / 2;
            y = this.y;
            speedY = -projectileSpeed;
            break;
            
            case 2:
            x = this.x + this.width;
            y = this.y;
            speedX = angularSpeed;
            speedY = -angularSpeed;
            break;
            
            case 3:
            x = this.x + this.width;
            y = this.y + this.height / 2;
            speedX = projectileSpeed;
            break;
            
            case 4:
            x = this.x + this.width;
            y = this.y + this.height;
            speedX = angularSpeed;
            speedY = angularSpeed;
            break;
            
            case 5:
            x = this.x + this.width / 2;
            y = this.y + this.height;
            speedY = projectileSpeed;
            break;
            
            case 6:
            x = this.x;
            y = this.y + this.height;
            speedX = -angularSpeed;
            speedY = angularSpeed;
            break;
            
            case 7:
            x = this.x;
            y = this.y + this.height / 2;
            speedX = -projectileSpeed;
            break;
            
            case 8:
            x = this.x;
            y = this.y;
            speedX = -angularSpeed;
            speedY = -angularSpeed;
            break;
        }
        GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: x, y: y, speedX: speedX, speedY: speedY});
    }
    
    topDownObject.onDestroy = function(){
        
    }
}
