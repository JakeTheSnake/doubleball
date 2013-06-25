GameCreator.platformObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		GameCreator.addObjFunctions.platformObjectFunctions(obj);
		GameCreator.addObjFunctions.collidableObjectFunctions(obj);
		GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
		GameCreator.addObjFunctions.bounceableObjectFunctions(obj);
		obj.image = image;
		obj.name = args.name;
		obj.width = args.width;
		obj.height = args.height;

		obj.isCollidable = true;
		obj.isMovable = true;
		obj.isRenderable = true;
		obj.isEventable = true;
		GameCreator.globalObjects[obj.name] = obj;
		return obj;
	}
}

GameCreator.addObjFunctions.platformObjectFunctions = function(platformObject)
{
	platformObject.accY = 2;
	platformObject.moveSpeed = 200;
	platformObject.keyLeftPressed = false;
	platformObject.keyRightPressed = false;
	platformObject.keyUpPressed = false;
	platformObject.speedX = 0;
	platformObject.speedY = 0;
	//Dictionary where key is the keycode of a key and value is the action to perform when that key is pressed.
	platformObject.facingLeft = true;
	platformObject.keyActions = {
		space: {pressed: false, actions: undefined}
	};
	
	platformObject.move = function(modifier)
	{	
		//Should only be able to affect movement if there is something beneath object.
		if(this.parent.keyUpPressed && this.objectBeneath)
			this.speedY = -600;
	
		if(this.parent.keyRightPressed)
		{
			this.facingLeft = false;
			this.accX = 8;
		}
		else if(this.parent.keyLeftPressed)
		{
			this.facingLeft = true;
			this.accX = -8;
		}
		else if(this.objectBeneath)
		{
			this.accX = 0;
			Math.abs(this.speedX) < 0.1 ? this.speedX = 0 : this.speedX *= 0.9;
		}
		else
			this.accX = 0;
			
		this.x += this.speedX * modifier;
		this.y += this.speedY * modifier;
		
		//Add acceleration only if object is moving below max movement speed in that direction.
		if(this.accX > 0 && this.speedX < 250 || this.accX < 0 && this.speedX > -250)
			this.speedX += this.accX;
			
		this.speedY += this.accY;
	}
	
	platformObject.instantiated = function(){
		var that = this;
		$(document).on("keydown." + this.name, function(e){
			console.log(e.which)
			switch(e.which){
				case 32:
				that.keyActions.space.pressed = true;
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
		
		$(document).on("keyup." + this.name, function(e){
			switch(e.which){
				case 32:
				that.keyActions.space.pressed = false;
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
	}
	
	platformObject.shoot = function(staticParameters){
		GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.projectileName], {x: this.x, y: this.y, speedX: this.facingLeft ? -500 : 500});
	}
	
	platformObject.onDestroy = function(){
		$(document).off("keydown." + this.name);
		$(document).off("keyup." + this.name);
	}
	
	platformObject.checkEvents = function(){
		//Loop over keyactions, see which are pressed and perform actions of those that are pressed.
		var keyActions = this.parent.keyActions;
		for(var key in keyActions)
		{
			if(keyActions.hasOwnProperty(key))
			{
				var keyAction = keyActions[key];
				if(keyAction.pressed)
				{
					if(keyAction.actions == undefined)
					{
						GameCreator.openSelectActionsWindow(
							"Pressed " + key + " actions for " + this.parent.name,
							function(actions) {keyAction.actions = actions});
					}
					else
					{
						for(var i = 0;i < keyAction.actions.length;++i)
						{
							keyAction.actions[i].action.call(this, keyAction.actions[i].parameters);
						}
					}
				}
			}
		}
	}
}
