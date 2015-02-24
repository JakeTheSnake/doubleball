GameCreator.CounterDisplayText = function(args) {
    GameCreator.addObjFunctions.commonObjectFunctions(this);

    if (GameCreator.state !== 'playing') {
        GameCreator.commonObjectControllers.addCounterObjectControllers(this);
        GameCreator.commonObjectViews.addCounterObjectViews(this);
    }

    this.states = [{
        name: "Default",
        id: 0,
        attributes: {}
    }];

    this.getDefaultState().attributes.width = [100]; //TODO: Handle width and height of counters?
    this.getDefaultState().attributes.height = [50];
    this.getDefaultState().attributes.font = args.font || 'Arial';
    this.getDefaultState().attributes.color = args.color || '#000';
    this.getDefaultState().attributes.size = args.size || 20;
    this.getDefaultState().attributes.image = new Image();
    this.getDefaultState().attributes.image.src = 'assets/textcounter.png';

    this.objectName = args.objectName;
    this.isClickable =  false;
    
    this.isRenderable = true;
    this.objectType = "CounterDisplayText";
};

GameCreator.CounterDisplayText.objectAttributes = {
                        "font": GameCreator.htmlStrings.stringInput, 
                        "color": GameCreator.htmlStrings.stringInput,
                        "size": GameCreator.htmlStrings.numberInput
                     };

GameCreator.CounterDisplayText.prototype.draw = function(context, obj) {
    GameCreator.invalidate(obj); //TODO: Handle this in a better way.
    var value = 0;
    var sceneObject = GameCreator.getSceneObjectById(obj.attributes.counterCarrier);
    var i;
    if (sceneObject) {
        if (sceneObject.parent.attributes.unique && sceneObject.parent.counters[obj.attributes.counterName]) {
            value = sceneObject.parent.counters[obj.attributes.counterName].value;
        } else if (sceneObject.counters[obj.attributes.counterName]) {
            value = sceneObject.counters[obj.attributes.counterName].value;
        }
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

GameCreator.CounterDisplayText.prototype.instantiateSceneObject = function(sceneObject, args) {
    var state = sceneObject.parent.getDefaultState();
    sceneObject.attributes.font = state.attributes.font;
    sceneObject.attributes.color = state.attributes.color;
    sceneObject.attributes.size = state.attributes.size;
    sceneObject.attributes.counterCarrier = args.counterCarrier || '';
    sceneObject.attributes.counterName = args.counterName || '';
};