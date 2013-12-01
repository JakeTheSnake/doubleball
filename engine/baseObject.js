GameCreator.baseObject = {
	image: undefined,
	name: undefined,
	width: 0,
	height: 0,
	imageReady: false,
	objectType: "baseObject",
	isDestroyed: false,
	
	/**
	 * Called when an object is being destroyed through an action. Marks
	 * this object for imminent destruction and carries out onDestroy-actions.
	 */
	destroy: function(staticParameters){
		GameCreator.objectsToDestroy.push(this);
		this.parent.onDestroy.call(this);
	},

	onDestroy: function(){
		if (!this.parent.onDestroyActions) {
			this.parent.onDestroyActions = [];
			GameCreator.UI.openEditActionsWindow(
	            "'" + this.parent.name + "' is has been destroyed!",
	            GameCreator.actionGroups.nonCollisionActions,
	            this.parent.onDestroyActions,
	            null,
	            this.parent.name
        	);
        	return;
		}
		for (var i = 0; i < this.parent.onDestroyActions.length; i++) {
			GameCreator.helperFunctions.runAction(this, this.parent.onDestroyActions[i],this.parent.onDestroyActions[i].parameters);
		}
	},

	onCreate: function(staticParameters){
		if (!this.parent.onCreateActions) {
			this.parent.onCreateActions = [];
			GameCreator.UI.openEditActionsWindow(
	            "'" + this.parent.name + "' has been created!",
	            GameCreator.actionGroups.nonCollisionActions,
	            this.parent.onCreateActions,
	            null,
	            this.parent.name
        	);
		}
		for (var i = 0; i < this.parent.onCreateActions.length; i++) {
			GameCreator.helperFunctions.runAction(this, this.parent.onCreateActions[i], this.parent.onCreateActions[i].parameters);
		}
	},
	
	removeFromGame: function() {
		//Collidables
		var ids = GameCreator.collidableObjects.map(function(x){return x.instanceId});
		var index = $.inArray(this.instanceId, ids);
		if(index != -1) {
			GameCreator.collidableObjects.splice(index, 1);
		}
			
		//Movables
		ids = GameCreator.movableObjects.map(function(x){return x.instanceId});
		index = $.inArray(this.instanceId, ids);
		if(index != -1) {
			GameCreator.movableObjects.splice(index, 1);
		}

		//Renderables
		ids = GameCreator.renderableObjects.map(function(x){return x.instanceId});
		index = $.inArray(this.instanceId, ids);
		if(index != -1) {
			GameCreator.renderableObjects.splice(index, 1);
		}

		//Eventables
		ids = GameCreator.eventableObjects.map(function(x){return x.instanceId});
		index = $.inArray(this.instanceId, ids);
		if(index != -1) {
			GameCreator.eventableObjects.splice(index, 1);
		}
		
		this.isDestroyed = true;
	},
	
    onGameStarted: function(){},
    
	checkEvents: function(){},
	
	move: function(modifier){
		this.x += this.speedX * modifier;
		this.y += this.speedY * modifier;
	}
}