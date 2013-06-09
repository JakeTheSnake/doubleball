GameCreator.baseObject = {
	image: undefined,
	name: undefined,
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	accX: 0,
	accY: 0,
	imageReady: false,
	clickOffsetX: 0,
	clickOffsetY: 0,
	
	//Remove object from game arrays
	destroy: function(){	
		
		//Collidables
		var names = GameCreator.collidableObjects.map(function(x){return x.name});
		var index = $.inArray(this.name, names);
		if(index != -1)
			GameCreator.collidableObjects.splice(index, 1);
			
		//Movables
		names = GameCreator.movableObjects.map(function(x){return x.name});
		index = $.inArray(this.name, names);
		if(index != -1)
			GameCreator.movableObjects.splice(index, 1);
		
		//Renderables
		names = GameCreator.renderableObjects.map(function(x){return x.name});
		index = $.inArray(this.name, names);
		if(index != -1)
			GameCreator.renderableObjects.splice(index, 1);
	}
}