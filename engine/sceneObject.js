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
	
	//Name of object, same as name of global object from which it was created.
	name: undefined,
	
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
		this.name = globalObj.name;
		
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
			
		//PlayerTopDown properties

		this.facing = 1;
		
		globalObj.instantiated();
	}
}