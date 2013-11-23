GameCreator.addObjFunctions.bounceableObjectFunctions = function(object)
{
    object.bounce = function(params)
    {
        switch(GameCreator.helperFunctions.determineQuadrant(params.collisionObject, this)){
            case 1:
            this.speedY = -Math.abs(this.speedY);
            break;
            
            case 2:
            this.speedX = Math.abs(this.speedX);
            break;
            
            case 3:
            this.speedY = Math.abs(this.speedY);
            break;
            
            case 4:
            this.speedX = -Math.abs(this.speedX);
            break;
        }
    }
    
}

GameCreator.addObjFunctions.collidableObjectFunctions = function(object)
{    
    //Contains Key/Value pairs of other objs and the function to run when colliding with them.
    //TODO: Switch to dictionary where key is the name of the object.
    object.collisionActions = {};
},

GameCreator.addObjFunctions.keyObjectFunctions = function(object) 
{
    object.keyPressed = {
        space: false,
        leftMouse: false,
        rightMouse: false
    };
    object.keyActions = {};
    
    object.checkEvents = function(){
        //Loop over keyactions, see which are pressed and perform actions of those that are pressed.
        for(var key in this.parent.keyPressed)
        {
            if(this.parent.keyPressed.hasOwnProperty(key))
            {
                var isKeyPressed = this.parent.keyPressed[key];
                var keyAction = this.parent.keyActions[key];
                if(isKeyPressed && !this.keyCooldown[key])
                {
                    if(keyAction == undefined)
                    {
                        GameCreator.UI.openEditActionsWindow(
                            "Pressed " + key + " actions for " + this.parent.name,
                             GameCreator.actionGroups.nonCollisionActions,
                             this.parent.keyActions,
                             key,
                             this.parent.name
                            );
                    }
                    else
                    {
                        for(var i = 0;i < keyAction.length;++i)
                        {
                            GameCreator.helperFunctions.runAction(this, keyAction[i], keyAction[i].parameters);
                            this.keyCooldown[key] = true;
                            // This anonymous function should ensure that keyAction in the timeout callback
                            // has the state that it has when the timeout is declared.
                            (function(keyCooldown, key){
                                setTimeout(function(){keyCooldown[key] = false}, 300);
                            })(this.keyCooldown, key);
                        }
                    }
                }
            }
        }
    };
},

GameCreator.addObjFunctions.stoppableObjectFunctions = function(object)
{    
    object.stop = function(params)
    {
        if(!params || !params.hasOwnProperty("collisionObject"))
        {
            this.speedY = 0;
            this.speedX = 0;    
        }
        else
        {
            var obj = params.collisionObject
            var quadrant = GameCreator.helperFunctions.determineQuadrant(obj, this);
            if(this.speedY > 0 && quadrant == 1)
            {
                this.speedY = 0;
                this.objectBeneath = true;
            }
            
            if(this.speedX < 0 && quadrant == 2)
                this.speedX = 0;
    
            if(this.speedY < 0 && quadrant == 3)
                this.speedY = 0;
            
            if(this.speedX > 0 && quadrant == 4)
            {
                this.speedX = 0;
            }    
        }
    };
},

GameCreator.addObjFunctions.clickableObjectFunctions = function(object)
{
	object.onClickActions = undefined;
	object.isClickable = true;
}