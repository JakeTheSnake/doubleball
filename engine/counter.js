GameCreator.resetCounters = function(sceneObject, parentCounters) {
	var counterCarrier;
	if (sceneObject.parent.unique) {
		counterCarrier = sceneObject.parent;
	} else {
		counterCarrier = sceneObject;
	}
	for (var counter in parentCounters) {
		if (parentCounters.hasOwnProperty(counter)) {
			if(counterCarrier.counters[counter]) {
				if (!sceneObject.parent.unique) {
					counterCarrier.counters[counter].reset();
				}
			} else {
				counterCarrier.counters[counter] = GameCreator.sceneObjectCounter.New(sceneObject, parentCounters[counter]);	
			}
		}
	}
}

GameCreator.sceneObjectCounter = {
	parentCounter: null,
	parentObject: null,
	value: 0,
	
	atValueStates: {},
	aboveValueStates: {},
	belowValueStates: {},
	
	New: function(parentObject, parentCounter){
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
		this.value += GameCreator.helperFunctions.getRandomFromRange(change);
		
		//Check if change triggers any actions
		if(change > 0) {
			for(var i = 0 ; i < this.parentCounter.onIncrease.length ; i++) {
				GameCreator.helperFunctions.runAction(this.parentObject, this.parentCounter.onIncrease[i], this.parentCounter.onIncrease[i].parameters, this.parentCounter.onIncrease[i].timing);
			}
		} else if(change < 0) {
			for(var i = 0 ; i < this.parentCounter.onDecrease.length ; i++) {
				GameCreator.helperFunctions.runAction(this.parentObject, this.parentCounter.onDecrease[i], this.parentCounter.onDecrease[i].parameters, this.parentCounter.onDecrease[i].timing);
			}
		};
		
		this.checkEvents();
	},
	
	setValue: function(inValue) {
		var value = GameCreator.helperFunctions.getRandomFromRange(inValue);

		if (value > this.value) {
			for(var i = 0 ; i < this.parentCounter.onIncrease.length ; i++) {
				GameCreator.helperFunctions.runAction(this.parentObject, this.parentCounter.onIncrease[i], this.parentCounter.onIncrease[i].parameters, this.parentCounter.onIncrease[i].timing);
			}
		} else if (value < this.value) {
			for(var i = 0 ; i < this.parentCounter.onDecrease.length ; i++) {
				GameCreator.helperFunctions.runAction(this.parentObject, this.parentCounter.onDecrease[i], this.parentCounter.onDecrease[i].parameters, this.parentCounter.onDecrease[i].timing);
			}
		}
		
		this.value = value;
		
		this.checkEvents();
	},

	checkEvents: function(){
		this.checkAtValue();
		this.checkAboveValue();
		this.checkBelowValue();
	},
	
	checkAtValue: function() {
		var callbacks;
		for (var value in this.parentCounter.atValue) { 
			if (this.parentCounter.atValue.hasOwnProperty(value)) {
				if (parseInt(value) === this.value && !this.atValueStates[value]) {
					callbacks = this.parentCounter.atValue[value];
					for (var i = 0; i < callbacks.length; i++) {
						GameCreator.helperFunctions.runAction(this.parentObject, callbacks[i], callbacks[i].parameters, callbacks[i].timing);
					}
					this.atValueStates[value] = true;
				} else if (parseInt(value) !== this.value) {
					this.atValueStates[value] = false;
				}
			} 
		};
	},

	checkAboveValue: function() {
		var callbacks;
		for (var value in this.parentCounter.aboveValue) {
			if (this.parentCounter.aboveValue.hasOwnProperty(value)) {
				if (this.value > parseInt(value) && !this.aboveValueStates[value]) {
					callbacks = this.parentCounter.aboveValue[value];
					for (var i = 0; i < callbacks.length; i++) {
						GameCreator.helperFunctions.runAction(this.parentObject, callbacks[i], callbacks[i].parameters, callbacks[i].timing);
					}
					this.aboveValueStates[value] = true;
				} else if (this.value <= parseInt(value)) {
					this.aboveValueStates[value] = false;
				}
			} 
		};
	},

	checkBelowValue: function() {
		var callbacks;
		for (var value in this.parentCounter.belowValue) {
			if (this.parentCounter.belowValue.hasOwnProperty(value)) {
				if (this.value < parseInt(value) && !this.belowValueStates[value]) {
					callbacks = this.parentCounter.belowValue[value];
					for (var i = 0; i < callbacks.length; i++) {
						GameCreator.helperFunctions.runAction(this.parentObject, callbacks[i], callbacks[i].parameters, callbacks[i].timing);
					}
					this.belowValueStates[value] = true;
				} else if (this.value >= parseInt(value)) {
					this.belowValueStates[value] = false;
				}
			} 
		};
	},
	
	reset: function() {
		this.value = this.parentCounter.initialValue || 0;
		var value;
		for (value in this.atValueStates) {
			if (this.atValueStates.hasOwnProperty(value)) {
				this.atValueStates[value] = false;
			} 
		};
		
		for (value in this.aboveValueStates) {
			if (this.aboveValueStates.hasOwnProperty(value)) {
				this.aboveValueStates[value] = false;
			} 
		};
		
		for (value in this.belowValueStates) {
			if (this.belowValueStates.hasOwnProperty(value)) {
				this.belowValueStates[value] = false;
			} 
		};
	},
}

GameCreator.counter = {
	
	initialValue: 0,
	
	New: function(){
		var obj = Object.create(GameCreator.counter);
		obj.onIncrease = [];
		obj.onDecrease = [];
		obj.atValue = {};
		obj.aboveValue = {};
		obj.belowValue = {};
		obj.initialValue = 0;
		return obj;
	}
}

GameCreator.counterObject = {
	
	isClickable: false,
	
	New: function(image, args) {
		var obj = Object.create(GameCreator.counterObject);
		
		obj.image = image;
		obj.name = args.name;
		
		if(args.representation === 'text') {
			obj.textCounter = true;
			obj.font = args.font || 'Arial';
			obj.color = args.color || '#000';
			obj.size = args.size || 20;
			obj.image.src = 'assets/textcounter.png';
		} else if (args.representation === 'image') {
			obj.imageCounter = true;
			obj.size = args.size || 20;
		}
		
		obj.width = [100]; //TODO: How to handle width and height of counters?
		obj.height = [100];
		
		obj.isRenderable = true;
		
		obj.objectType = "counterObject";
	
		GameCreator.globalObjects[obj.name] = obj;
		
		return obj;
	},
	
	draw: function(context, obj) {
		GameCreator.invalidate(obj); //TODO: Handle this in a better way.
		var value = obj.parent.textCounter ? "---" : 0;
		var sceneObject = GameCreator.getSceneObjectById(obj.counterObject);
		if (sceneObject) {
			if (sceneObject.parent.unique && sceneObject.parent.counters[obj.counterName]) {
				value = sceneObject.parent.counters[obj.counterName].value;
			} else if (sceneObject.counters[obj.counterName]) {
				value = sceneObject.counters[obj.counterName].value;
			}
		}
    	if(obj.parent.textCounter) {
    		context.font = obj.size + "px " + obj.font;
    		context.fillStyle = obj.color;
    		context.fillText(value, obj.x, obj.y + obj.size);
    	} else if (obj.parent.imageCounter){
    		if (obj.parent.imageReady) {
    			//Draw 3 semitransparent icons if in edit mode. 
			    if(GameCreator.state === 'editing') {
					value = 3;
					context.globalAlpha = 0.5;
				} else {
					context.globalAlpha = 1;
				}
    			for(var i = 0; i < value; i++) {
    				context.drawImage(obj.parent.image, obj.x + i * obj.size + i * 3, obj.y, obj.size, obj.size);
				}
			}
    	}
	},
	
	initialize: function() {
		this.width = GameCreator.helperFunctions.getRandomFromRange(this.width);
        this.height = GameCreator.helperFunctions.getRandomFromRange(this.height);
	},
	
	onGameStarted: function() {},
	
	onCreate: function() {}
}
