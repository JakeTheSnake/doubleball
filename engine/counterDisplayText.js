GameCreator.CounterDisplayText = function(args) {
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

    this.getDefaultState().attributes.width = [100];
    this.getDefaultState().attributes.height = [50];
    this.getDefaultState().attributes.font = args.font || 'Arial';
    this.getDefaultState().attributes.color = args.color || '#000';
    this.getDefaultState().attributes.size = args.size || 20;
    this.getDefaultState().attributes.image = new Image();

    this.objectName = args.objectName;
    this.isClickable =  false;
    this.isResizeable = false;
    
    this.isRenderable = true;
    this.objectType = "CounterDisplayText";
};

GameCreator.CounterDisplayText.objectAttributes = {
                        "font": GameCreator.htmlStrings.stringInput, 
                        "color": GameCreator.htmlStrings.stringInput,
                        "size": GameCreator.htmlStrings.numberInput
                     };

GameCreator.CounterDisplayText.prototype.onAddedToGame = function() {
    var globalCounterNames = Object.keys(GameCreator.globalCounters)

    if(globalCounterNames.indexOf(this.objectName) === -1) {
        GameCreator.createGlobalCounter(this.objectName);
    }
}

GameCreator.CounterDisplayText.prototype.draw = function(context, obj) {
    GameCreator.invalidate(obj); //TODO: Handle this in a better way.
    var value = 0;
    var counterCarrier = GameCreator.getSceneObjectById(obj.attributes.counterCarrier);
    var i;
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
    context.font = obj.attributes.size + "px " + obj.attributes.font;
    context.fillStyle = obj.attributes.color;
    context.fillText(value, obj.attributes.x, obj.attributes.y + obj.attributes.size);
};

GameCreator.CounterDisplayText.prototype.initialize = function() {
    this.attributes.width = GameCreator.helpers.getRandomFromRange(this.attributes.width);
    this.attributes.height = GameCreator.helpers.getRandomFromRange(this.attributes.height);
};

GameCreator.CounterDisplayText.prototype.onGameStarted = function() {};

GameCreator.CounterDisplayText.prototype.onCreate = function() {};

GameCreator.CounterDisplayText.prototype.objectEnteredGame = function() {};

GameCreator.CounterDisplayText.prototype.onSceneObjectUpdated = function(sceneObject) {
    GameCreator.mainContext.font = sceneObject.attributes.size + "px " + sceneObject.attributes.font;
    sceneObject.attributes.width = [GameCreator.mainContext.measureText("0").width];
    sceneObject.attributes.height = [sceneObject.attributes.size + 5];
};

GameCreator.CounterDisplayText.prototype.instantiateSceneObject = function(sceneObject, args) {
    var state = sceneObject.parent.getDefaultState();
    sceneObject.attributes.font = args.font || state.attributes.font;
    sceneObject.attributes.color = args.color || state.attributes.color;
    sceneObject.attributes.size = args.size != undefined ? args.size : state.attributes.size;
    sceneObject.attributes.counterCarrier = args.counterCarrier || 'globalCounters';
    sceneObject.attributes.counterName = args.counterName || this.objectName;

    GameCreator.mainContext.font = sceneObject.attributes.size + "px " + sceneObject.attributes.font;
    sceneObject.attributes.width = [GameCreator.mainContext.measureText("0").width]
    sceneObject.attributes.height = [sceneObject.attributes.size + 5];
};