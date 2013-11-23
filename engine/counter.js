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
