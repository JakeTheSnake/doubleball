GameCreator.UI = {
	addActiveObject: function(){
		var obj = GameCreator.addActiveObject({
			name: $("#addActiveObjectName").val(),
			width: parseInt($("#addActiveObjectWidth").val()),
			height: parseInt($("#addActiveObjectHeight").val()),
			src: $("#addActiveObjectSrc").val(),
			movementType: $("#addActiveObjectMovementType").val(),
			speedX: parseFloat($("#addObjectSpeedX").val()) || 0,
			speedY: parseFloat($("#addObjectSpeedY").val()) || 0,
			accX: parseFloat($("#addObjectAccX").val()) || 0,
			accY: parseFloat($("#addObjectAccY").val()) || 0
		});
	},
	
	addPlayerMouseObject: function(){
		var obj = GameCreator.addPlayerMouseObject({
			name: $("#addPlayerObjectName").val(),
			width: parseInt($("#addPlayerObjectWidth").val()),
			height: parseInt($("#addPlayerObjectHeight").val()),
			src: $("#addPlayerObjectSrc").val(),
		});
	},
	
	addPlayerPlatformObject: function(){
		var obj = GameCreator.addPlayerPlatformObject({
			name: $("#addPlayerObjectName").val(),
			width: parseInt($("#addPlayerObjectWidth").val()),
			height: parseInt($("#addPlayerObjectHeight").val()),
			src: $("#addPlayerObjectSrc").val(),
		});
	},
	
	addPlayerTopDownObject: function(){
		var obj = GameCreator.addPlayerTopDownObject({
			name: $("#addPlayerObjectName").val(),
			width: parseInt($("#addPlayerObjectWidth").val()),
			height: parseInt($("#addPlayerObjectHeight").val()),
			src: $("#addPlayerObjectSrc").val(),
		});
	}
}