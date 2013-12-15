GameCreator.resetCounters = function(object, counters) {
	for(var counter in counters){
		if(counters.hasOwnProperty(counter)){
			if(object.counters[counter]){
				object.counters[counter].reset();
			} else {
				object.counters[counter] = GameCreator.sceneObjectCounter.New(object, counters[counter]);	
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
		obj.value = parentCounter.initialValue;
		
		obj.atValueStates = {};
		obj.aboveValueStates = {};
		obj.belowValueStates = {};
		
		for(value in parentCounter.atValue){
			if(parentCounter.atValue.hasOwnProperty(value)) {
				obj.atValueStates[value] = false;
			}
		}
		
		for(value in parentCounter.aboveValue){
			if(parentCounter.aboveValue.hasOwnProperty(value)) {
				obj.aboveValueStates[value] = false;
			}
		}
		
		for(value in parentCounter.belowValue){
			if(parentCounter.belowValue.hasOwnProperty(value)) {
				obj.belowValueStates[value] = false;
			}
		}
		
		return obj;
	},
	
	changeValue: function(change) {
		this.value += GameCreator.helperFunctions.getRandomFromRange(change);
		
		//Check if change triggers any actions
		if(change > 0) {
			for(var i = 0 ; i < this.parentCounter.onIncrease.length ; i++) {
				GameCreator.helperFunctions.runAction(this.parentObject, this.parentCounter.onIncrease[i], this.parentCounter.onIncrease[i].parameters);
			}
		} else if(change < 0) {
			for(var i = 0 ; i < this.parentCounter.onDecrease.length ; i++) {
				GameCreator.helperFunctions.runAction(this.parentObject, this.parentCounter.onDecrease[i], this.parentCounter.onDecrease[i].parameters);
			}
		};
		
		this.checkEvents();
	},
	
	setValue: function(inValue) {
		var value = GameCreator.helperFunctions.getRandomFromRange(inValue);
		
		if(value > this.value) {
			for(var i = 0 ; i < this.parentCounter.onIncrease.length ; i++) {
				GameCreator.helperFunctions.runAction(this.parentObject, this.parentCounter.onIncrease[i], this.parentCounter.onIncrease[i].parameters);
			}
		} else if (value < this.value) {
			for(var i = 0 ; i < this.parentCounter.onDecrease.length ; i++) {
				GameCreator.helperFunctions.runAction(this.parentObject, this.parentCounter.onDecrease[i], this.parentCounter.onDecrease[i].parameters);
			}
		}
		
		this.value = value;
		
		this.checkEvents();
	},
	
	checkEvents: function(){
		
		var callbacks;
		
		for (value in this.parentCounter.atValue) {
			if (this.parentCounter.atValue.hasOwnProperty(value)) {
				if (parseInt(value) === this.value && !this.atValueStates[value]) {
					callbacks = this.parentCounter.atValue[value];
					for (var i = 0; i < callbacks.length; i++) {
						GameCreator.helperFunctions.runAction(this.parentObject, callbacks[i], callbacks[i].parameters);
					}
					this.atValueStates[value] = true;
				} else if (parseInt(value) !== this.value) {
					this.atValueStates[value] = false;
				}
			} 
		};
		
		for (value in this.parentCounter.aboveValue) {
			if (this.parentCounter.aboveValue.hasOwnProperty(value)) {
				if (this.value > parseInt(value) && !this.aboveValueStates[value]) {
					callbacks = this.parentCounter.aboveValue[value];
					for (var i = 0; i < callbacks.length; i++) {
						GameCreator.helperFunctions.runAction(this.parentObject, callbacks[i], callbacks[i].parameters);
					}
					this.aboveValueStates[value] = true;
				} else if (this.value <= parseInt(value)) {
					this.aboveValueStates[value] = false;
				}
			} 
		};
		
		for (value in this.parentCounter.belowValue) {
			if (this.parentCounter.belowValue.hasOwnProperty(value)) {
				if (this.value < parseInt(value) && !this.belowValueStates[value]) {
					callbacks = this.parentCounter.belowValue[value];
					for (var i = 0; i < callbacks.length; i++) {
						GameCreator.helperFunctions.runAction(this.parentObject, callbacks[i], callbacks[i].parameters);
					}
					this.belowValueStates[value] = true;
				} else if (this.value >= parseInt(value)) {
					this.belowValueStates[value] = false;
				}
			} 
		};
	},
	
	reset: function() {
		this.value = this.parentCounter.initialValue;
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
		
		obj.counterObject = args.counterObject;
		obj.counterName = args.counterName;
		
		if(args.representation === "text") {
			obj.textCounter = true;
			obj.font = args.font || 'Arial';
			obj.color = args.color || '#000';
			obj.size = args.size || 20;
			obj.src = 'assets/textcounter.png';
		} else if (args.representation == "image") {
			obj.imageCounter = true;
			obj.src = args.src;
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
		var value = obj.parent.textCounter ? "---" : 0;
		if(GameCreator.getSceneObjectById(obj.parent.counterObject) && GameCreator.getSceneObjectById(obj.parent.counterObject).counters[obj.parent.counterName]) {
			value = GameCreator.getSceneObjectById(obj.parent.counterObject).counters[obj.parent.counterName].value;
		}
    	if(obj.parent.textCounter) {
    		context.font = obj.size + "px " + obj.font;
    		context.fillStyle = obj.color;
    		context.fillText(value, obj.x, obj.y + obj.size);
    	} else if (obj.parent.imageCounter){
    		if (obj.parent.imageReady) {
    			//Draw 3 semitransparent hearts if in edit mode. 
			    if(GameCreator.state === 'editing') {
					value = 3;
					context.globalAlpha = 0.5;
				} else {
					context.globalAlpha = 1;
				}
    			for(var i = 0;i < value; i++) {
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
