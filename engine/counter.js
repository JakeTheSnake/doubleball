/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.resetCounters = function(sceneObject, parentCounters) {
        if (sceneObject.parent instanceof GameCreator.CounterObjectText ||
            sceneObject.parent instanceof GameCreator.CounterObjectImage || 
            sceneObject.parent instanceof GameCreator.TextObject) {
            // CounterObjects and TextObjects do not have counters themselves.
            return;
        }
        var counterCarrier, counter;
        if (sceneObject.parent.attributes.unique) {
            counterCarrier = sceneObject.parent;
        } else {
            counterCarrier = sceneObject;
        }
        for (counter in parentCounters) {
            if (parentCounters.hasOwnProperty(counter)) {
                if (counterCarrier.counters[counter]) {
                    if (!sceneObject.parent.attributes.unique) {
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
            this.value += GameCreator.helpers.getRandomFromRange(change);

            //Check if change triggers any actions
            if (change > 0) {
                for (i = 0; i < this.parentCounter.onIncrease.length; i += 1) {
                    this.parentCounter.onIncrease[i].runActions(this.parentObject);
                }
            } else if (change < 0) {
                for (i = 0; i < this.parentCounter.onDecrease.length; i += 1) {
                    this.parentCounter.onDecrease[i].runActions(this.parentObject);
                }
            }
            this.checkEvents();
        },

        setValue: function(inValue) {
            var i;
            var value = GameCreator.helpers.getRandomFromRange(inValue);

            if (value > this.value) {
                for (i = 0; i < this.parentCounter.onIncrease.length; i += 1) {
                    this.parentCounter.onIncrease[i].runActions(this.parentObject);
                }
            } else if (value < this.value) {
                for (i = 0; i < this.parentCounter.onDecrease.length; i += 1) {
                    this.parentCounter.onDecrease[i].runActions(this.parentObject);
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
                            callbacks[i].runActions(this.parentObject);
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
                            callbacks[i].runActions(this.parentObject);
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
                            callbacks[i].runActions(this.parentObject);
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

    GameCreator.Counter.prototype.getCounterEventSets = function(eventType, eventValue) {
        if (eventType === 'onIncrease' || eventType === 'onDecrease') {
            return this[eventType];
        } else {
            return this[eventType][eventValue];
        }
    };

}());
