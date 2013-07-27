GameCreator.activeObject = {
		
	New: function(image, args){
		var obj = Object.create(GameCreator.baseObject);
		GameCreator.addObjFunctions.activeObjectFunctions(obj);
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
		
		obj.objectType = "activeObject";
		
		obj.movementType = args.movementType ? args.movementType : "free";
		
		GameCreator.globalObjects[obj.name] = obj;
		return obj;
	},
	
	createFromSaved: function(savedObject){
		
		var obj = Object.create(GameCreator.baseObject);
		
		var image = new Image();
		image.src = savedObject.imageSrc;
		obj.image = image;	
		
		GameCreator.addObjFunctions.activeObjectFunctions(obj);
		GameCreator.addObjFunctions.collidableObjectFunctions(obj);
		GameCreator.addObjFunctions.stoppableObjectFunctions(obj);
		GameCreator.addObjFunctions.bounceableObjectFunctions(obj);
		
		obj.isCollidable = true;
		obj.isMovable = true;
		obj.isRenderable = true;
		
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

GameCreator.addObjFunctions.activeObjectFunctions = function(activeObject)
{	
	activeObject.calculateSpeed = function(modifier){
		this.speedY += this.accY;
		this.speedX += this.accX;
	}
	
	activeObject.shoot = function(staticParameters){
		var projectileSpeed = 600;
		var unitVector = GameCreator.helperFunctions.calcUnitVector(this.speedX, this.speedY);
		GameCreator.createRuntimeObject(GameCreator.globalObjects[staticParameters.objectToShoot], {x: this.x, y: this.y, speedX: unitVector.x * projectileSpeed, speedY: unitVector.y * projectileSpeed});
	}
	
	activeObject.move = function(modifier){
		switch(this.parent.movementType){
			
			case "free":
				this.x += this.speedX * modifier;
				this.y += this.speedY * modifier;
				break;
			
			case "route":
				if(this.route.length == 0)
					return;
				var targetX = this.route[this.routeTarget].x;
				var targetY = this.route[this.routeTarget].y;
				var preDiffX = this.x - targetX;
				var preDiffY = this.y - targetY;
				var unitVector = GameCreator.helperFunctions.calcUnitVector(preDiffX, preDiffY);
				this.x -= unitVector.x * this.routeSpeed * modifier;
				this.y -= unitVector.y * this.routeSpeed * modifier;
				var postDiffX = this.x - targetX;
				var postDiffY = this.y - targetY;
				//Check if preDiff and postDiff have different "negativity" or are 0. If so we have reached (or moved past) our target.
				if(preDiffX * postDiffX <= 0 && preDiffY * postDiffY <= 0) {
					if(this.routeForward) {
						if(this.route[this.routeTarget].next == null) {
							this.routeForward = false;
							this.routeTarget = this.route[this.routeTarget].prev;
						}
						else {
							this.routeTarget = this.route[this.routeTarget].next;
						}
					} 
					else {
						if(this.route[this.routeTarget].prev == null) {
							this.routeForward = true;
							this.routeTarget = this.route[this.routeTarget].next;
						}
						else {
							this.routeTarget = this.route[this.routeTarget].prev;
						}
					}
				}
				break;
		}
	}
}
