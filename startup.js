window.onload = function () {
		GameCreator.canvas = document.createElement("canvas");
		GameCreator.context = GameCreator.canvas.getContext("2d");
		GameCreator.canvas.width = GameCreator.width;
		GameCreator.canvas.height = GameCreator.height;
		$("#mainCanvas").append(GameCreator.canvas);
		
		GameCreator.scenes.push([]);
		GameCreator.activeScene = 0;
		
		var globalBall = GameCreator.addActiveObject({src: "images/ball.png", name: "ball", width:20, height:20})
		//var globalBall2 = GameCreator.addActiveObject({src: "images/red_ball.gif", name: "red_ball", width:100, height:100})
    	
		//GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:1, y:400, speedX: 340, speedY:240});
		//GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:200, y:400, speedX: -300, speedY:140});
		//GameCreator.createInstance(globalBall2, GameCreator.scenes[0], {x:200, y:100, speedX: -340, speedY:160});
		
		//Create Mouseobject
		
		//var globalMousePlayer = GameCreator.addPlayerMouseObject({src: "images/zealot.gif", name: "mouseZealot", width: 80, height: 80})
		//GameCreator.createInstance(globalMousePlayer, GameCreator.scenes[0], {x:100, y:200})
		
		//Create Platformobject
		
		//var globalPlatformPlayer = GameCreator.addPlayerPlatformObject({src: "images/zealot.gif", name: "platformZealot", width: 80, height: 80})
		//GameCreator.createInstance(globalPlatformPlayer, GameCreator.scenes[0], {x:150, y:400, accY: 5});
		
		var globalTopDownPlayer = GameCreator.addPlayerTopDownObject({src: "images/zealot.gif", name: "topDownZealot", width: 80, height: 80})
		GameCreator.createInstance(globalTopDownPlayer, GameCreator.scenes[0], {x:150, y:400});
		
		//GameCreator.loadScene(GameCreator.scenes[0]);
		
		GameCreator.editScene(GameCreator.scenes[0]);
		
		//Mass create objects for test!
		//for(var i = 0; i < 5 ; ++i)
		//{
		//	console.log("addActiveObject");
		//	var name = "obj" + i;
		//	var x = i * 5;
		//	var y = i * 5;
		//	var speedX = i * 5;
		//	var speedY = i * 5;
		//	var height = 10 + i/5;
		//	var width = 10 + i/5;
		//	console.log(i)
		//	GameCreator.addActiveObject({
		//		name: name,
		//		width: width,
		//		height: height,
		//		x: x,
		//		y: y,
		//		speedX: speedX,
		//		speedY: speedY,
		//		src: "red_ball.gif"
		//	});
		//}
		
		$("#addPlayerObjectType").on("change", function(){switchPlayerObjectType($(this).val())})
		
		// UI
		
		$( "#direct" ).button();
		$( "#PlayerObject" ).button();
		$( "#MouseObject" ).button();
		$( "#AddActiveObject" ).button();
		$( "#selectActionWindow" ).dialog({
			autoOpen: false,
			width: 400,
			buttons: [
				{
					text: "Ok",
					click: function() {
						$( this ).dialog( "close" );
						if($("#collisionSelector").val() == "nothing")
							selectedActions = [];
						else if($("#collisionSelector").val() == "bounce")
							selectedActions = [{action: GameCreator.selectableActions.Bounce, parameters: {}}];
						else if($("#collisionSelector").val() == "stop")
							selectedActions = [{action: GameCreator.selectableActions.Stop, parameters: {}}];
						else if($("#collisionSelector").val() == "destroy")
							selectedActions = [{action: GameCreator.selectableActions.Destroy, parameters: {}}];
						else if($("#collisionSelector").val() == "shoot")
							selectedActions = [{action: GameCreator.selectableActions.Shoot, parameters: {projectileName: "ball"}}];
						GameCreator.assignSelectedActions(selectedActions);
					}
				},
				{
					text: "Cancel",
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			]
		});	
		
		
	}
	
	function addActiveObject(){
		GameCreator.addActiveObject({
			name: $("#addActiveObjectName").val(),
			width: parseInt($("#addActiveObjectWidth").val()),
			height: parseInt($("#addActiveObjectHeight").val()),
			x: parseInt($("#addActiveObjectX").val()),
			y: parseInt($("#addActiveObjectY").val()),
			speedX: parseInt($("#addActiveObjectSpeedX").val()),
			speedY: parseInt($("#addActiveObjectSpeedY").val()),
			src: $("#addActiveObjectSrc").val()
		});
	}
	
	function addPlayerMouseObject(){
		GameCreator.addPlayerMouseObject({
			name: $("#addPlayerObjectName").val(),
			width: parseInt($("#addPlayerObjectWidth").val()),
			height: parseInt($("#addPlayerObjectHeight").val()),
			x: parseInt($("#addPlayerObjectX").val()),
			y: parseInt($("#addPlayerObjectY").val()),
			speedX: parseInt($("#addPlayerObjectSpeedX").val()),
			speedY: parseInt($("#addPlayerObjectSpeedY").val()),
			src: $("#addPlayerObjectSrc").val(),
			maxX: parseInt($("#addPlayerMouseObjectMaxX").val()),
			maxY: parseInt($("#addPlayerMouseObjectMaxY").val()),
			minX: parseInt($("#addPlayerMouseObjectMinX").val()),
			minY: parseInt($("#addPlayerMouseObjectMinY").val()),
		});
	}
	
	function addPlayerPlatformObject(){
		GameCreator.addPlayerPlatformObject({
			name: $("#addPlayerObjectName").val(),
			width: parseInt($("#addPlayerObjectWidth").val()),
			height: parseInt($("#addPlayerObjectHeight").val()),
			x: parseInt($("#addPlayerObjectX").val()),
			y: parseInt($("#addPlayerObjectY").val()),
			speedX: parseInt($("#addPlayerObjectSpeedX").val()),
			speedY: parseInt($("#addPlayerObjectSpeedY").val()),
			src: $("#addPlayerObjectSrc").val(),
		});
	}
	
	function switchPane(paneId){
		$(".addObjectPane").hide();
		$(paneId).show();
	}
	
	function switchPlayerObjectType(paneId){
		$(".addPlayerObjectTypePane").hide();
		$(paneId).show();
	}
	