GameCreator.baseObject = {
	image: undefined,
	name: undefined,
	width: 0,
	height: 0,
	imageReady: false,
	objectType: "baseObject",
	
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
		
		this.parent.onDestroy.call(this);
	},
	
	instantiated: function(){},
	
	onDestroy: function(){},
	
	checkEvents: function(){},
	
	move: function(modifier){
		this.x += this.speedX * modifier;
		this.y += this.speedY * modifier;
	}
}