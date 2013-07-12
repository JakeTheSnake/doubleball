debugCounter = 0;

window.onload = function () {
		GameCreator.canvas = document.createElement("canvas");
		GameCreator.context = GameCreator.canvas.getContext("2d");
		GameCreator.canvas.width = GameCreator.width;
		GameCreator.canvas.height = GameCreator.height;
		$("#mainCanvas").append(GameCreator.canvas);
		
		GameCreator.scenes.push([]);
		GameCreator.activeScene = 0;
		
		//Create ActiveObjects
		
		var globalBall = GameCreator.addActiveObject({src: "images/ball.png", name: "ball", width:20, height:20})
		var globalBall2 = GameCreator.addActiveObject({src: "images/red_ball.gif", name: "red_ball", width:20, height:20})
    	
		GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:1, y:400, speedX: 340, speedY:240});
		//GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:200, y:400, speedX: -300, speedY:140});
		//GameCreator.createInstance(globalBall2, GameCreator.scenes[0], {x:200, y:100, speedX: -340, speedY:160});
		
		//Create Mouseobject
		
		//var globalMousePlayer = GameCreator.addPlayerMouseObject({src: "images/zealot.gif", name: "mouseZealot", width: 80, height: 80})
		//GameCreator.createInstance(globalMousePlayer, GameCreator.scenes[0], {x:100, y:200})
		
		//Create Platformobject
		
		//var globalPlatformPlayer = GameCreator.addPlayerPlatformObject({src: "images/zealot.gif", name: "platformZealot", width: 80, height: 80})
		//GameCreator.createInstance(globalPlatformPlayer, GameCreator.scenes[0], {x:150, y:400, accY: 5});
		
		//Create TopDownObject
		
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
		$( "#selectActionAddAction" ).click(function( event ) {				
				var action = GameCreator.openSelectActionsWindow.selectableActions[$("#actionSelector").val()];
				selectedAction = {action: action.action, parameters: {}};

				for (var i = 0; i < action.params.length; i++) {
					selectedAction.parameters[action.params[i].inputId] = $("#"+action.params[i].inputId).val();
				}
				GameCreator.openSelectActionsWindow.selectedActions.push(selectedAction);
				$("#selectActionResult").append(GameCreator.htmlStrings.actionRow($("#actionSelector").val(), selectedAction));
			});
		
		$( "#selectActionWindow" ).dialog({
			autoOpen: false,
			open: function(event, ui) {
				$( "#selectActionAddAction" ).button();
				},
			width: 400,
			buttons: [
				{
					text: "Ok",
					click: function() {
						$( this ).dialog( "close" );
						$("#selectActionResult").html("");
						GameCreator.assignSelectedActions(GameCreator.openSelectActionsWindow.selectedActions);
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
		var obj = GameCreator.addActiveObject({
			name: $("#addActiveObjectName").val(),
			width: parseInt($("#addActiveObjectWidth").val()),
			height: parseInt($("#addActiveObjectHeight").val()),
			src: $("#addActiveObjectSrc").val()
		});
		var sceneObj = GameCreator.createInstance(obj, GameCreator.scenes[0], {x: parseInt($("#addActiveObjectX").val()), y: parseInt($("#addActiveObjectY").val()), speedX: parseInt($("#addActiveObjectSpeedX").val()), speedY: parseInt($("#addActiveObjectSpeedY").val())});
		GameCreator.renderableObjects.push(sceneObj);
	}
	
	function addPlayerMouseObject(){
		var obj = GameCreator.addPlayerMouseObject({
			name: $("#addPlayerObjectName").val(),
			width: parseInt($("#addPlayerObjectWidth").val()),
			height: parseInt($("#addPlayerObjectHeight").val()),
			src: $("#addPlayerObjectSrc").val(),
		});
		var sceneObj = GameCreator.createInstance(obj, GameCreator.scenes[0], {x: parseInt($("#addPlayerObjectX").val()), y: parseInt($("#addPlayerObjectY").val()), maxX: parseInt($("#addPlayerMouseObjectMaxX").val()), maxY: parseInt($("#addPlayerMouseObjectMaxY").val()), minX: parseInt($("#addPlayerMouseObjectMinX").val()), minY: parseInt($("#addPlayerMouseObjectMinY").val())});
		GameCreator.renderableObjects.push(sceneObj);
	}
	
	function addPlayerPlatformObject(){
		var obj = GameCreator.addPlayerPlatformObject({
			name: $("#addPlayerObjectName").val(),
			width: parseInt($("#addPlayerObjectWidth").val()),
			height: parseInt($("#addPlayerObjectHeight").val()),
			src: $("#addPlayerObjectSrc").val(),
		});
		var sceneObj = GameCreator.createInstance(obj, GameCreator.scenes[0], {x: parseInt($("#addPlayerObjectX").val()), y: parseInt($("#addPlayerObjectY").val())});
		GameCreator.renderableObjects.push(sceneObj);
	}
	
	function addPlayerTopDownObject(){
		var obj = GameCreator.addPlayerTopDownObject({
			name: $("#addPlayerObjectName").val(),
			width: parseInt($("#addPlayerObjectWidth").val()),
			height: parseInt($("#addPlayerObjectHeight").val()),
			src: $("#addPlayerObjectSrc").val(),
		});
		var sceneObj = GameCreator.createInstance(obj, GameCreator.scenes[0], {x: parseInt($("#addPlayerObjectX").val()), y: parseInt($("#addPlayerObjectY").val())});
		GameCreator.renderableObjects.push(sceneObj);
	}
	
	function switchPane(paneId){
		$(".addObjectPane").hide();
		$(paneId).show();
	}
	
	function switchPlayerObjectType(paneId){
		$(".addPlayerObjectTypePane").hide();
		$(paneId).show();
	}
	