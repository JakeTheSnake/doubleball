GameCreator.BaseObject = function() {
    this.image = undefined;
    this.width = 0;
    this.height = 0;
    this.imageReady = false;
    this.objectType = "baseObject";
    this.isDestroyed = false;
    this.isClickable = true;
}
    
    /**
     * Called when an object is being destroyed through an action. Marks
     * this object for imminent destruction and carries out onDestroy-actions.
     */
GameCreator.BaseObject.prototype.destroy = function() {
    GameCreator.objectsToDestroy.push(this);
    this.parent.onDestroy.call(this);
};

GameCreator.BaseObject.prototype.onDestroy = function() {
    this.parent.runOnDestroyActions.call(this);
}

GameCreator.BaseObject.prototype.runOnDestroyActions = function() {
    if (!GameCreator.paused) {
        if (!this.parent.onDestroyActions && GameCreator.state !== 'playing') {
            this.parent.onDestroyActions = [];
            GameCreator.UI.openEditActionsWindow(
                "'" + this.parent.objectName + "' is has been destroyed!",
                GameCreator.actionGroups.nonCollisionActions,
                this.parent.onDestroyActions,
                this.objectName
            );
            return;
        }
        if (this.parent.onDestroyActions) {
            for (var i = 0; i < this.parent.onDestroyActions.length; i++) {
                this.parent.onDestroyActions[i].runAction(this);
            }
        }
    }
};

GameCreator.BaseObject.prototype.onCreate = function(){
    this.parent.runOnCreateActions.call(this);
}

GameCreator.BaseObject.prototype.runOnCreateActions = function(){
    if (!GameCreator.paused) {
        if (!this.parent.onCreateActions && GameCreator.state !== 'playing') {
            this.parent.onCreateActions = [];
            GameCreator.UI.openEditActionsWindow(
                "'" + this.parent.objectName + "' has been created!",
                GameCreator.actionGroups.nonCollisionActions,
                this.parent.onCreateActions,
                this.objectName
            );
        }
        if (this.parent.onCreateActions) {
            for (var i = 0; i < this.parent.onCreateActions.length; i++) {
                this.parent.onCreateActions[i].runAction(this);
            }
        }
        var index = GameCreator.newlyCreatedObjects.indexOf(this);
        if (index !== -1) {
            GameCreator.newlyCreatedObjects.splice(index,1);
        }
    }
};

GameCreator.BaseObject.prototype.removeFromGame = function() {
    GameCreator.invalidate(this);
    GameCreator.helperFunctions.removeObjectFromArrayById(
        GameCreator.helperFunctions.getObjectById(GameCreator.collidableObjects, this.parent.id).runtimeObjects,
        this.instanceId);
    GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.movableObjects, this.instanceId);
    GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.renderableObjects, this.instanceId);
    GameCreator.helperFunctions.removeObjectFromArrayById(GameCreator.eventableObjects, this.instanceId);
    var index = GameCreator.objectsToDestroy.indexOf(this);
    if (index !== -1) {
        GameCreator.objectsToDestroy.splice(index,1);
    }
    this.isDestroyed = true;
};

GameCreator.BaseObject.prototype.onGameStarted = function() {},

GameCreator.BaseObject.prototype.checkEvents = function() {},

GameCreator.BaseObject.prototype.move = function(modifier){
    if (this.speedX != 0 || this.speedY != 0) {
        GameCreator.invalidate(this);
        this.x += this.speedX * modifier;
        this.y += this.speedY * modifier;
    }
};

GameCreator.BaseObject.prototype.draw = function(context, obj) {
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
};

GameCreator.BaseObject.createFromSaved = function(savedObject){    
    var obj = new GameCreator[objectType](image, args);
    
    var image = new Image();
    image.src = savedObject.imageSrc;
    obj.image = image;    
    
    image.onload = function() {
        obj.imageReady = true;
        GameCreator.render();
    };
    
    for(var name in savedObject){
        if (savedObject.hasOwnProperty(name)) {
            obj[name] = savedObject[name];    
        }
    }
    
    GameCreator.globalObjects[obj.objectName] = obj;
    
    return obj;
}
