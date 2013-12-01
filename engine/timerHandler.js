GameCreator.timerHandler = {
	gameTime: 0,
	timeSinceLastUpdate: 0,
	fixed: {},
	interval: {},
	clear: function() {
		GameCreator.timerHandler.fixed = {};
		GameCreator.timerHandler.interval = {};
		GameCreator.timerHandler.timeSinceLastUpdate = 0;
		GameCreator.timerHandler.gameTime = 0;
	},
	update: function(deltaTime) {
		var gameTime = GameCreator.timerHandler.gameTime += deltaTime;
		var fixed = GameCreator.timerHandler.fixed;
		var interval = GameCreator.timerHandler.interval;
		GameCreator.timerHandler.timeSinceLastUpdate += deltaTime;
		if (GameCreator.timerHandler.timeSinceLastUpdate > 100) {
			GameCreator.timerHandler.timeSinceLastUpdate -= 100;
			// Check for timeouts
			var time;
			for (time in fixed) {
				if (fixed.hasOwnProperty(time)) {
					if (parseInt(time) <= gameTime) {
						for (var i = 0; i < fixed[time].length; i++) {
							fixed[time][i]();
						}
						delete fixed[time];
					}
				}
			}

			for (time in interval) {
				if (interval.hasOwnProperty(time)) {
					if (gameTime % parseInt(time) <= 100) {
						for (var i = 0; i < interval[time].length; i++) {
							if(!interval[time][i]()) {
								interval[time].splice(i, 1); 
								i--;
							}
						}
						if(interval[time].length === 0) {
							delete interval[time];
						}
					}
				}
			}
		}
	},

	registerFixed: function(time, callback) {
		var fixed = GameCreator.timerHandler.fixed;
		if (!fixed[time]) {
			fixed[time] = [callback];
		} else {
			fixed[time].push(callback);
		}
	},

	registerOffset: function(offset, callback) {
		var time = GameCreator.timerHandler.gameTime + offset;
		var fixed = GameCreator.timerHandler.fixed;
		if (!fixed[time]) {
			fixed[time] = [callback];
		} else {
			fixed[time].push(callback);
		}
	},

	registerInterval: function(time, callback) {
		var interval = GameCreator.timerHandler.interval;
		if (!interval[time]) {
			interval[time] = [callback];
		} else {
			interval[time].push(callback);
		}
	}
}
