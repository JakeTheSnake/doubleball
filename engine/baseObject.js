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
		var ids = GameCreator.collidableObjects.map(function(x){return x.instanceId});
		var index = $.inArray(this.instanceId, ids);
		if(index != -1)
			GameCreator.collidableObjects.splice(index, 1);
			
		//Movables
		ids = GameCreator.movableObjects.map(function(x){return x.instanceId});
		index = $.inArray(this.instanceId, ids);
		if(index != -1)
			GameCreator.movableObjects.splice(index, 1);
		
		//Renderables
		ids = GameCreator.renderableObjects.map(function(x){return x.instanceId});
		index = $.inArray(this.instanceId, ids);
		if(index != -1)
			GameCreator.renderableObjects.splice(index, 1);
		
		this.parent.onDestroy.call(this);
	},
	
	onDestroy: function(){},
	
    onGameStarted: function(){},
    
	checkEvents: function(){},
	
	move: function(modifier){
		this.x += this.speedX * modifier;
		this.y += this.speedY * modifier;
	}
}