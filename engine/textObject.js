/*global GameCreator, $, document*/
(function() {
    "use strict";
    GameCreator.TextObject = function(args) {
        GameCreator.addObjFunctions.commonObjectFunctions(this);

        if (GameCreator.state !== 'playing') {
            GameCreator.commonObjectControllers.addTextObjectControllers(this);
            GameCreator.commonObjectViews.addTextObjectViews(this);
        }

        this.states = [{
            name: "Default",
            id: 0,
            attributes: {}
        }];

        this.getDefaultState().attributes.width = [100]; //TODO: Handle width and height of textOjects?
        this.getDefaultState().attributes.height = [50];
        this.getDefaultState().attributes.font = args.font || 'Arial';
        this.getDefaultState().attributes.color = args.color || '#000';
        this.getDefaultState().attributes.size = args.size || 20;
        this.getDefaultState().attributes.text = args.text || "";
        this.getDefaultState().attributes.image = new Image();
        this.getDefaultState().attributes.image.src = 'assets/textobject.png';

        this.objectName = args.objectName;
        this.isClickable =  false;
        
        this.isRenderable = true;
        this.objectType = "TextObject";
    };

    GameCreator.TextObject.objectAttributes = {
        "text": GameCreator.htmlStrings.stringInput,
        "font": GameCreator.htmlStrings.stringInput, 
        "color": GameCreator.htmlStrings.stringInput,
        "size": GameCreator.htmlStrings.numberInput
     };

    GameCreator.TextObject.prototype.draw = function(context, obj) {
        context.font = obj.attributes.size + "px " + obj.attributes.font;
        context.fillStyle = obj.attributes.color;
        context.fillText(obj.attributes.text, obj.attributes.x, obj.attributes.y + obj.attributes.size);
    };

    GameCreator.TextObject.prototype.initialize = function() {
        this.attributes.width = GameCreator.helpers.getRandomFromRange(this.attributes.width);
        this.attributes.height = GameCreator.helpers.getRandomFromRange(this.attributes.height);
    };

    GameCreator.TextObject.prototype.onGameStarted = function() {};

    GameCreator.TextObject.prototype.onCreate = function() {};

    GameCreator.TextObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.parent.getDefaultState();
        sceneObject.attributes.font = args.font || state.attributes.font;
        sceneObject.attributes.color = args.color || state.attributes.color;
        sceneObject.attributes.size = args.size != undefined ? args.size : state.attributes.size;
        sceneObject.attributes.text = args.text != undefined ? args.text : state.attributes.text;
    };
}());