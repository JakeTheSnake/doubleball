GameCreator.sceneObject = {
	x: 0,
	y: 0,
	accX: 0,
	accY: 0,
	speedX: 0,
	speedY: 0,	
	image: undefined,
	
	clickOffsetX: 0,
	clickOffsetY: 0,
	
	//Global object this refers to.
	parent: undefined,
	
	//Name of object, by default same as the name of global object from which it was created.
	name: undefined,
	
	//Unique ID for this specific scene object.
	instanceId: undefined,
	
	instantiate: function(globalObj, args){
		this.x = args.x != undefined ? args.x : 0
		this.y = args.y != undefined ? args.y : 0
		this.accX = args.accX != undefined ? args.accX : 0;
		this.accY = args.accY != undefined ? args.accY : 0;
		this.speedX = args.speedX != undefined ? args.speedX : 0;
		this.speedY = args.speedY != undefined ? args.speedY : 0;
		this.width = args.width != undefined ? args.width : globalObj.width;
		this.height = args.height != undefined ? args.height : globalObj.height;
		this.parent = globalObj;
		this.name = args.name != undefined ? args.name : globalObj.name;
		this.instanceId = this.name + GameCreator.getUniqueId();
		
		//PlayerMouse properties
		
		this.maxX = GameCreator.width - this.width;
		this.maxY = GameCreator.height - this.height;
		this.minX = 0;
		this.minY = 0;
		
		if(args.maxX)
			this.maxX = args.maxX - this.width;
		if(args.maxY)
			this.maxY = args.maxY - this.height;;
		if(args.minX)
			this.minX = args.minX;
		if(args.minY)
			this.minY = args.minY;
			
		//PlayerPlatform properties
		
		this.objectBeneath = false;
		
		//If it is a platformObject add gravity by default.
		if(globalObj.objectType == "platformObject") {
			this.accY = args.accY != undefined ? args.accY : 5;
		}
			
		//PlayerTopDown properties

		this.facing = 1;
		
		//ActiveObject properties
		
		//Array of Points. Points are {x: y: next: prev:} objects.
		this.route = [];
		//Index of point that is currently the target.
		this.routeTarget = null;
		//If heading backwards or forwards through the grid. (Should switch when reaching a dead end.)
		this.routeForward = true;
		
		globalObj.instantiated();
	}
}