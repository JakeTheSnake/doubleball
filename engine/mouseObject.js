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
        
        obj.objectType = "mouseObject";
        
        GameCreator.globalObjects[obj.name] = obj;
        return obj;
    },
    
    createFromSaved: function(savedObject){    
        var obj = Object.create(GameCreator.baseObject);
        
        var image = new Image();
        image.src = savedObject.imageSrc;
        obj.image = image;
        
        GameCreator.addObjFunctions.mouseObjectFunctions(obj);
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
        
        obj.instantiated();
        
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

    mouseObject.initialize = function(){};
    
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
    
    mouseObject.shoot = function() {
        console.log("Mouse shoot!");
    };
    
    mouseObject.onDestroy = function()
    {
        $(GameCreator.canvas).off("mousemove." + this.name);
    };
}