/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.resetCounters = function(sceneObject, parentCounters) {
        var counterCarrier, counter;
        if (sceneObject.parent.unique) {
            counterCarrier = sceneObject.parent;
        } else {
            counterCarrier = sceneObject;
        }
        for (counter in parentCounters) {
            if (parentCounters.hasOwnProperty(counter)) {
                if (counterCarrier.counters[counter]) {
                    if (!sceneObject.parent.unique) {
                        counterCarrier.counters[counter].reset();
                    }
                } else {
                    counterCarrier.counters[counter] = GameCreator.sceneObjectCounter.New(sceneObject, parentCounters[counter]);
                }
            }
        }
    };

    GameCreator.sceneObjectCounter = {
        parentCounter: null,
        parentObject: null,
        value: 0,

        atValueStates: {},
        aboveValueStates: {},
        belowValueStates: {},

        New: function(parentObject, parentCounter) {
            var obj = Object.create(GameCreator.sceneObjectCounter);

            obj.parentObject = parentObject;
            obj.parentCounter = parentCounter;

            obj.atValueStates = {};
            obj.aboveValueStates = {};
            obj.belowValueStates = {};

            obj.reset();

            return obj;
        },

        changeValue: function(change) {
            var i;
            this.value += GameCreator.helperFunctions.getRandomFromRange(change);

            //Check if change triggers any actions
            if (change > 0) {
                for (i = 0; i < this.parentCounter.onIncrease.length; i += 1) {
                    this.parentCounter.onIncrease[i].runAction(this.parentObject);
                }
            } else if (change < 0) {
                for (i = 0; i < this.parentCounter.onDecrease.length; i += 1) {
                    this.parentCounter.onDecrease[i].runAction(this.parentObject);
                }
            }
            this.checkEvents();
        },

        setValue: function(inValue) {
            var i;
            var value = GameCreator.helperFunctions.getRandomFromRange(inValue);

            if (value > this.value) {
                for (i = 0; i < this.parentCounter.onIncrease.length; i += 1) {
                    this.parentCounter.onIncrease[i].runAction(this.parentObject);
                }
            } else if (value < this.value) {
                for (i = 0; i < this.parentCounter.onDecrease.length; i += 1) {
                    this.parentCounter.onDecrease[i].runAction(this.parentObject);
                }
            }
            this.value = value;
            this.checkEvents();
        },

        checkEvents: function() {
            this.checkAtValue();
            this.checkAboveValue();
            this.checkBelowValue();
        },

        checkAtValue: function() {
            var callbacks, value, i;
            for (value in this.parentCounter.atValue) {
                if (this.parentCounter.atValue.hasOwnProperty(value)) {
                    if (parseInt(value, 10) === this.value && !this.atValueStates[value]) {
                        callbacks = this.parentCounter.atValue[value];
                        for (i = 0; i < callbacks.length; i += 1) {
                            callbacks[i].runAction(this.parentObject);
                        }
                        this.atValueStates[value] = true;
                    } else if (parseInt(value, 10) !== this.value) {
                        this.atValueStates[value] = false;
                    }
                }
            }
        },

        checkAboveValue: function() {
            var callbacks, value, i;
            for (value in this.parentCounter.aboveValue) {
                if (this.parentCounter.aboveValue.hasOwnProperty(value)) {
                    if (this.value > parseInt(value, 10) && !this.aboveValueStates[value]) {
                        callbacks = this.parentCounter.aboveValue[value];
                        for (i = 0; i < callbacks.length; i += 1) {
                            callbacks[i].runAction(this.parentObject);
                        }
                        this.aboveValueStates[value] = true;
                    } else if (this.value <= parseInt(value, 10)) {
                        this.aboveValueStates[value] = false;
                    }
                }
            }
        },

        checkBelowValue: function() {
            var callbacks, value, i;
            for (value in this.parentCounter.belowValue) {
                if (this.parentCounter.belowValue.hasOwnProperty(value)) {
                    if (this.value < parseInt(value, 10) && !this.belowValueStates[value]) {
                        callbacks = this.parentCounter.belowValue[value];
                        for (i = 0; i < callbacks.length; i += 1) {
                            callbacks[i].runAction(this.parentObject);
                        }
                        this.belowValueStates[value] = true;
                    } else if (this.value >= parseInt(value, 10)) {
                        this.belowValueStates[value] = false;
                    }
                }
            }
        },

        reset: function() {
            this.value = this.parentCounter.initialValue || 0;
            var value;
            for (value in this.atValueStates) {
                if (this.atValueStates.hasOwnProperty(value)) {
                    this.atValueStates[value] = false;
                }
            }
            for (value in this.aboveValueStates) {
                if (this.aboveValueStates.hasOwnProperty(value)) {
                    this.aboveValueStates[value] = false;
                }
            }
            for (value in this.belowValueStates) {
                if (this.belowValueStates.hasOwnProperty(value)) {
                    this.belowValueStates[value] = false;
                }
            }
        }
    };

    GameCreator.Counter = function() {
        this.onIncrease = [];
        this.onDecrease = [];
        this.atValue = {};
        this.aboveValue = {};
        this.belowValue = {};
        this.initialValue = 0;
    };

    GameCreator.CounterObject = function(image, args) {
        GameCreator.addObjFunctions.commonObjectFunctions(this);

        this.states = [{
            name: "Default",
            id: 0
        }];
        
        this.getDefaultState().image = image;
        this.objectName = args.objectName;
        this.isClickable =  false;

        if (args.representation === 'text') {
            this.textCounter = true;
            this.getDefaultState().font = args.font || 'Arial';
            this.getDefaultState().color = args.color || '#000';
            this.getDefaultState().size = args.size || 20;
            this.getDefaultState().image.src = 'assets/textcounter.png';
        } else if (args.representation === 'image') {
            this.imageCounter = true;
            this.getDefaultState().size = args.size || 20;
        }
        this.getDefaultState().width = [100]; //TODO: Handle width and height of counters?
        this.getDefaultState().height = [100];
        this.isRenderable = true;
        this.objectType = "CounterObject";
        GameCreator.globalObjects[this.objectName] = this;
    };

    GameCreator.CounterObject.prototype.draw = function(context, obj) {
        GameCreator.invalidate(obj); //TODO: Handle this in a better way.
        var value = obj.parent.textCounter ? "---" : 0;
        var sceneObject = GameCreator.getSceneObjectById(obj.counterObject);
        var i;
        if (sceneObject) {
            if (sceneObject.parent.unique && sceneObject.parent.counters[obj.counterName]) {
                value = sceneObject.parent.counters[obj.counterName].value;
            } else if (sceneObject.counters[obj.counterName]) {
                value = sceneObject.counters[obj.counterName].value;
            }
        }
        if (obj.parent.textCounter) {
            context.font = obj.size + "px " + obj.font;
            context.fillStyle = obj.color;
            context.fillText(value, obj.x, obj.y + obj.size);
        } else if (obj.parent.imageCounter) {
            if (obj.parent.imageReady) {
                //Draw 3 semitransparent icons if in edit mode. 
                if (GameCreator.state === 'editing') {
                    value = 3;
                    context.globalAlpha = 0.5;
                } else {
                    context.globalAlpha = 1;
                }
                for (i = 0; i < value; i += 1) {
                    context.drawImage(obj.parent.image, obj.x + i * obj.size + i * 3, obj.y, obj.size, obj.size);
                }
            }
        }
    };

    GameCreator.CounterObject.prototype.initialize = function() {
        this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
    };

    GameCreator.CounterObject.prototype.onGameStarted = function() {};

    GameCreator.CounterObject.prototype.onCreate = function() {};

    GameCreator.CounterObject.prototype.instantiateSceneObject = function(sceneObject, args) {
        var state = sceneObject.getCurrentState();
        sceneObject.font = state.font;
        sceneObject.color = state.color;
        sceneObject.size = state.size;
    };
}());
