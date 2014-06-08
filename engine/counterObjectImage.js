GameCreator.CounterObjectImage = function(args) {
    GameCreator.addObjFunctions.commonObjectFunctions(this);
    GameCreator.commonObjectControllers.addCounterObjectControllers(this);
    GameCreator.commonObjectViews.addCounterObjectViews(this);

    this.states = [{
        name: "Default",
        id: 0,
        attributes: {}
    }];

    this.getDefaultState().attributes.image = args.image;
    this.getDefaultState().attributes.width = [100]; //TODO: Handle width and height of counters?
    this.getDefaultState().attributes.height = [100];
    this.getDefaultState().attributes.size = args.size || 20;

    this.objectName = args.objectName;
    this.isClickable =  false;
    
    this.isRenderable = true;
    this.objectType = "CounterObjectImage";
    GameCreator.globalObjects[this.objectName] = this;
};

GameCreator.CounterObjectImage.objectAttributes = GameCreator.helpers.getStandardAttributes();

GameCreator.CounterObjectImage.objectAttributes = $.extend(GameCreator.CounterObjectImage.objectAttributes, {
                        "size": GameCreator.htmlStrings.numberInput
                     });
delete GameCreator.CounterObjectImage.objectAttributes["width"];
delete GameCreator.CounterObjectImage.objectAttributes["height"];

GameCreator.CounterObjectImage.objectSceneAttributes = $.extend({}, GameCreator.CounterObjectImage.objectAttributes);
delete GameCreator.CounterObjectImage.objectSceneAttributes["image"];

GameCreator.CounterObjectImage.prototype.draw = function(context, obj) {
    GameCreator.invalidate(obj); //TODO: Handle this in a better way.
    var counterCarrier = GameCreator.getSceneObjectById(obj.counterCarrier);
    var i;
    var value = 0;
    if (counterCarrier) {
        if (counterCarrier.parent.unique && counterCarrier.parent.counters[obj.counterName]) {
            value = counterCarrier.parent.counters[obj.counterName].value;
        } else if (counterCarrier.counters[obj.counterName]) {
            value = counterCarrier.counters[obj.counterName].value;
        }
    }
    var currentAttributes = obj.parent.getDefaultState().attributes;
    if ($(currentAttributes.image).data('loaded')) {
        //Draw 3 semitransparent icons if in edit mode. 
        if (GameCreator.state === 'editing') {
            value = 3;
            context.globalAlpha = 0.5;
        } else {
            context.globalAlpha = 1;
        }
        for (i = 0; i < value; i += 1) {
            context.drawImage(currentAttributes.image, obj.x + i * obj.size + i * 3, obj.y, obj.size, obj.size);
        }
    }
};

GameCreator.CounterObjectImage.prototype.initialize = function() {
    this.width = GameCreator.helpers.getRandomFromRange(this.width);
    this.height = GameCreator.helpers.getRandomFromRange(this.height);
};

GameCreator.CounterObjectImage.prototype.onGameStarted = function() {};

GameCreator.CounterObjectImage.prototype.onCreate = function() {};

GameCreator.CounterObjectImage.prototype.instantiateSceneObject = function(sceneObject, args) {
    var state = sceneObject.parent.getDefaultState();
    sceneObject.size = state.attributes.size;
};
