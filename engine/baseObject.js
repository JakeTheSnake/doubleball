GameCreator.baseObject = {
    image: undefined,
    name: undefined,
    width: 0,
    height: 0,
    imageReady: false,
    objectType: "baseObject",
    isDestroyed: false,
    isClickable: true,
    
    /**
     * Called when an object is being destroyed through an action. Marks
     * this object for imminent destruction and carries out onDestroy-actions.
     */
    destroy: function(staticParameters){
        GameCreator.objectsToDestroy.push(this);
        this.parent.onDestroy.call(this);
    },

    onDestroy: function(){
        if (!GameCreator.paused) {
            if (!this.parent.onDestroyActions && GameCreator.state !== 'playing') {
                this.parent.onDestroyActions = [];
                GameCreator.UI.openEditActionsWindow(
                    "'" + this.parent.name + "' is has been destroyed!",
                    GameCreator.actionGroups.nonCollisionActions,
                    this.parent.onDestroyActions,
                    this.name
                );
                return;
            }
            if (this.parent.onDestroyActions) {
                for (var i = 0; i < this.parent.onDestroyActions.length; i++) {
                    GameCreator.helperFunctions.runAction(this, this.parent.onDestroyActions[i],this.parent.onDestroyActions[i].parameters);
                }
            }
            var index = GameCreator.objectsToDestroy.indexOf(this);
            if (index !== -1) {
                GameCreator.objectsToDestroy.splice(index,1);
            }
        }
    },

    onCreate: function(staticParameters){
        if (!GameCreator.paused) {
            if (!this.parent.onCreateActions && GameCreator.state !== 'playing') {
                this.parent.onCreateActions = [];
                GameCreator.UI.openEditActionsWindow(
                    "'" + this.parent.name + "' has been created!",
                    GameCreator.actionGroups.nonCollisionActions,
                    this.parent.onCreateActions,
                    this.name
                );
            }
            if (this.parent.onCreateActions) {
                for (var i = 0; i < this.parent.onCreateActions.length; i++) {
                    GameCreator.helperFunctions.runAction(this, this.parent.onCreateActions[i], this.parent.onCreateActions[i].parameters);
                }
            }
            var index = GameCreator.newlyCreatedObjects.indexOf(this);
            if (index !== -1) {
                GameCreator.newlyCreatedObjects.splice(index,1);
            }
        }
    },
    
    removeFromGame: function() {
        GameCreator.invalidate(this);

        GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.collidableObjects, this.instanceId);
        GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.movableObjects, this.instanceId);
        GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.renderableObjects, this.instanceId);
        GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.eventableObjects, this.instanceId);

        this.isDestroyed = true;
    },
    
    onGameStarted: function(){},
    
    checkEvents: function(){},
    
    move: function(modifier){
        if (this.speedX != 0 || this.speedY != 0) {
            GameCreator.invalidate(this);
            this.x += this.speedX * modifier;
            this.y += this.speedY * modifier;
        }
    },
    
    draw: function(context, obj) {
        if (obj.parent.imageReady) {
            if (Array.isArray(obj.width) || Array.isArray(obj.height)) {
                var maxHeight;
                var minHeight;
                var maxWidth;
                var minWidth;
                if (obj.width.length === 2) {
                    maxWidth = obj.width[1];
                    minWidth = obj.width[0];
                } else if (obj.width.length === 1) {
                    maxWidth = obj.width[0];
                    minWidth = obj.width[0];
                } else {
                    maxWidth = obj.width;
                    minWidth = obj.width;
                }
                if (obj.height.length === 2) {
                    maxHeight = obj.height[1];
                    minHeight = obj.height[0];
                } else if (obj.height.length === 1) {
                    maxHeight = obj.height[0];
                    minHeight = obj.height[0];
                } else {
                    maxHeight = obj.height;
                    minHeight = obj.height;
                }
                context.globalAlpha = 0.5;
                context.drawImage(obj.parent.image, obj.x, obj.y, maxWidth, maxHeight);
                context.globalAlpha = 1.0;
                context.drawImage(obj.parent.image, obj.x, obj.y, minWidth, minHeight);
            }
            else {
                context.drawImage(obj.parent.image, obj.x, obj.y, obj.width, obj.height);
            }
            obj.invalidated = false;
        }
    }
}