GameCreator.CounterDisplayImage = function(args) {
    GameCreator.addObjFunctions.commonObjectFunctions(this);
    this.events = {};
        
    if (GameCreator.state !== 'playing') {
        GameCreator.commonObjectControllers.addCounterObjectControllers(this);
        GameCreator.commonObjectViews.addCounterObjectViews(this);
    }

    this.states = [{
        name: "Default",
        id: 0,
        attributes: {}
    }];

    this.getDefaultState().attributes.image = args.image;
    this.getDefaultState().attributes.width = [100];
    this.getDefaultState().attributes.height = [100];

    this.objectName = args.objectName;
    this.isClickable =  false;
    this.isResizeable = true;
    
    this.isRenderable = true;
    this.objectType = "CounterDisplayImage";
};

GameCreator.CounterDisplayImage.objectAttributes = GameCreator.helpers.getStandardAttributes();

GameCreator.CounterDisplayImage.prototype.onAddedToGame = function() {
    var globalCounterNames = Object.keys(GameCreator.globalCounters)

    if(globalCounterNames.indexOf(this.objectName) === -1) {
        GameCreator.createGlobalCounter(this.objectName);
    }
}

GameCreator.CounterDisplayImage.prototype.draw = function(context, obj) {
    GameCreator.invalidate(obj); //TODO: Handle this in a better way.
    var counterCarrier = GameCreator.getSceneObjectById(obj.attributes.counterCarrier);
    var i, renderWidth, renderHeight;
    var value = 0;
    if (counterCarrier) {
        if (counterCarrier.parent.attributes.unique && counterCarrier.parent.counters[obj.attributes.counterName]) {
            value = counterCarrier.parent.counters[obj.attributes.counterName].value;
        } else if (counterCarrier.counters[obj.attributes.counterName]) {
            value = counterCarrier.counters[obj.attributes.counterName].value;
        }
    } else if (GameCreator.globalCounters[obj.attributes.counterName]) {
        // The counter carrier is nested within global counters.
        value = GameCreator.globalCounterCarriers[obj.attributes.counterName].value;
    }
    var currentAttributes = obj.parent.getDefaultState().attributes;
    if ($(currentAttributes.image).data('loaded')) {
        if (GameCreator.state === 'editing') {
            value = 1;
            context.globalAlpha = 0.5;
        } else {
            context.globalAlpha = 1;
        }
        if (Array.isArray(obj.attributes.width)) {
            renderWidth = obj.attributes.width[obj.attributes.width.length - 1]; //TODO: Correctly display random sized counter objects or make them nonrandomable.
            renderHeight = obj.attributes.height[obj.attributes.height.length - 1];
        } else {
            renderWidth = obj.attributes.width;
            renderHeight = obj.attributes.height;
        }
        for (i = 0; i < value; i += 1) {
            context.drawImage(currentAttributes.image, obj.attributes.x + i * renderWidth + i * 3, obj.attributes.y, renderWidth, renderHeight);
        }
    }
};

GameCreator.CounterDisplayImage.prototype.initialize = function() {
    this.attributes.width = GameCreator.helpers.getRandomFromRange(this.attributes.width);
    this.attributes.height = GameCreator.helpers.getRandomFromRange(this.attributes.height);
};

GameCreator.CounterDisplayImage.prototype.onGameStarted = function() {};

GameCreator.CounterDisplayImage.prototype.onCreate = function() {};

GameCreator.CounterDisplayImage.prototype.objectEnteredGame = function() {};

GameCreator.CounterDisplayImage.prototype.instantiateSceneObject = function(sceneObject, args) {
    sceneObject.attributes.counterCarrier = args.counterCarrier || 'globalCounters';
    sceneObject.attributes.counterName = args.counterName || this.objectName;
};
