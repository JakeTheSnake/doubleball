//Contains "name: counter" pairs.
GameCreator.globalCounters = {};

GameCreator.counter = {
	
	value: 0,
	
	onIncrease: [],
	onDecrease: [],
	atValue: {},
	aboveValue: {},
	belowValue: {},

	changeValue: function(change) {
		this.value += change;
		
		//Check if change triggers any actions
		if(change > 0) {
			for(var i = 0 ; i < onIncrease.length ; i++) {
				onIncrease[i]();
			}
		} else if(change < 0) {
			for(var i = 0 ; i < onDecrease.length ; i++) {
				onDecrease[i]();
			}
		};
		
		this.checkEvents();
	},
	
	setValue: function(value) {
		this.value = value;
		
		this.checkEvents();
	},
	
	checkEvents: function(){
		for (value in this.atValue) {
			if (this.atValue.hasOwnProperty(value)) {
				if (parseInt(value) === this.value) {
					for (var i = 0; i < this.atValue[value].length; i++) {
						this.atValue[value][i]();
					}
					delete this.atValue[value];
				}
			}
		};
		
		for (value in this.aboveValue) {
			if (this.aboveValue.hasOwnProperty(value)) {
				if (parseInt(value) >= this.value) {
					for (var i = 0; i < this.aboveValue[value].length; i++) {
						this.aboveValue[value][i]();
					}
					delete this.aboveValue[value];
				}
			}
		};
		
		for (value in this.belowValue) {
			if (this.belowValue.hasOwnProperty(value)) {
				if (parseInt(value) <= this.value) {
					for (var i = 0; i < this.belowValue[value].length; i++) {
						this.belowValue[value][i]();
					}
					delete this.belowValue[value];
				}
			}
		};
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
	}
}
