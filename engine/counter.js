GameCreator.sceneObjectCounter = {
	parentCounter: null,
	parentObject: null,
	value: 0,
	
	atValueStates: {},
	aboveValueStates: {},
	belowValueStates: {},
	
	changeValue: function(change) {
		this.value += change;
		
		//Check if change triggers any actions
		if(change > 0) {
			for(var i = 0 ; i < this.parentCounter.onIncrease.length ; i++) {
				this.parentCounter.onIncrease[i].action.call(object, this.parentCounter.onIncrease[i].parameters);
			}
		} else if(change < 0) {
			for(var i = 0 ; i < this.parentCounter.onDecrease.length ; i++) {
				this.parentCounter.onDecrease[i].action.call(object, this.parentCounter.onDecrease[i].parameters);
			}
		};
		
		this.checkEvents();
	},
	
	setValue: function(value) {	
		if(value > this.value) {
			for(var i = 0 ; i < this.parentCounter.onIncrease.length ; i++) {
				this.parentCounter.onIncrease[i].action.call(object, this.parentCounter.onIncrease[i].parameters);
			}
		} else if (value < this.value) {
			for(var i = 0 ; i < this.parentCounter.onDecrease.length ; i++) {
				this.parentCounter.onDecrease[i].action.call(object, this.parentCounter.onDecrease[i].parameters);
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
						callbacks[i].action.call(parentObject, callbacks[i].parameters);
					}
					this.atValueStates[value] = true;
				} else if (parseInt(value) !== this.value) {
					this.atValueStates[value] = false;
				}
			} 
		};
		
		for (value in this.parentCounter.aboveValue) {
			if (this.parentCounter.aboveValue.hasOwnProperty(value)) {
				if (parseInt(value) > this.value && !this.aboveValueStates[value]) {
					callbacks = this.parentCounter.aboveValue[value];
					for (var i = 0; i < callbacks.length; i++) {
						callbacks[i].action.call(parentObject, callbacks[i].parameters);
					}
					this.aboveValueStates[value] = true;
				} else if (parseInt(value) <= this.value) {
					this.aboveValueStates[value] = false;
				}
			} 
		};
		
		for (value in this.parentCounter.belowValue) {
			if (this.parentCounter.belowValue.hasOwnProperty(value)) {
				if (parseInt(value) < this.value && !this.belowValueStates[value]) {
					callbacks = this.parentCounter.belowValue[value];
					for (var i = 0; i < callbacks.length; i++) {
						callbacks[i].action.call(parentObject, callbacks[i].parameters);
					}
					this.belowValueStates[value] = true;
				} else if (parseInt(value) >= this.value) {
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
	
	instantiate: function() {
		//Set parentObject and parentCounter, Populate state trackers from parentCounter. 
	}
}

GameCreator.counter = {
	
	name: null,
	initialValue: 0,
	
	New: function(){
		var obj = Object.create(GameCreator.counter);
		obj.onIncrease = [];
		obj.onDecrease = [];
		obj.atValue = {};
		obj.aboveValue = {};
		obj.belowValue = {};
		return obj;
	},
	
	registerOnIncrease: function(callback) {
		this.onIncrease.push(callback);
	},
	
	registerOnDecrease: function(callback) {
		this.onDecrease.push(callback);
	},
	
	registerAtValue: function(value, callback) {
		if (!this.atValue[value]) {
			this.atValue[value] = [callback];
		} else {
			this.atValue[value].push(callback);
		}
	},
	
	registerAboveValue: function(value, callback) {
		if (!this.aboveValue[value]) {
			this.aboveValue[value] = [callback];
		} else {
			this.aboveValue[value].push(callback);
		}
	},
	
	registerBelowValue: function(value, callback) {
		if (!this.belowValue[value]) {
			this.belowValue[value] = [callback];
		} else {
			this.belowValue[value].push(callback);
		}
	},
}
