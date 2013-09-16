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
    object.keyActionInfo = {
        space: {pressed: false, onCooldown: false}
    };
    object.keyActions = {};
    
    object.checkEvents = function(){
        //Loop over keyactions, see which are pressed and perform actions of those that are pressed.
        for(var key in this.parent.keyActionInfo)
        {
            if(this.parent.keyActionInfo.hasOwnProperty(key))
            {
                var keyActionInfo = this.parent.keyActionInfo[key];
                var keyAction = this.parent.keyActions[key];
                if(keyActionInfo.pressed && !keyActionInfo.onCooldown)
                {
                    if(keyAction == undefined)
                    {
                        GameCreator.UI.openEditActionsWindow(
                            "Pressed " + key + " actions for " + this.parent.name,
                             $.extend(GameCreator.actions.commonSelectableActions, GameCreator.actions.generalSelectableActions),
                             this.parent.keyActions,
                             key
                            );
                    }
                    else
                    {
                        for(var i = 0;i < keyAction.length;++i)
                        {
                            console.log("keyACtion");
                            console.log(keyAction);
                            keyAction[i].action.call(this, keyAction[i].parameters);
                            keyActionInfo.onCooldown = true;
                            //This anonymous function should ensure that keyAction in the timeout callback has the state that it has when the timeout is declared.
                            (function(keyActionInfo){
                                setTimeout(function(){keyActionInfo.onCooldown = false}, 300);
                            })(keyActionInfo);
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
}