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
		
		var globalBall = GameCreator.addActiveObject({src: "images/ball.png", name: "ball", width:20, height:20, speed: 300, movementType: "route"})
		var globalBall2 = GameCreator.addActiveObject({src: "images/red_ball.gif", name: "red_ball", width:20, height:20})
    	
		var sceneBall = GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:1, y:400, speedX: 340, speedY:240, routeSpeed: 200});
		//GameCreator.createInstance(globalBall, GameCreator.scenes[0], {x:200, y:400, speedX: -300, speedY:140});
		//GameCreator.createInstance(globalBall2, GameCreator.scenes[0], {x:200, y:100, speedX: -340, speedY:160});
		
		//Set route movement to sceneBall
		sceneBall.route.push({x: 100, y: 100});
		sceneBall.route.push({x: 100, y: 300});
		sceneBall.route.push({x: 300, y: 300});
		sceneBall.route.push({x: 300, y: 100, bounceNode: true});
		
		//Create Mouseobject
		
		//var globalMousePlayer = GameCreator.addPlayerMouseObject({src: "images/zealot.gif", name: "mouseZealot", width: 80, height: 80})
		//GameCreator.createInstance(globalMousePlayer, GameCreator.scenes[0], {x:100, y:200})
		
		//Create Platformobject
		
		var globalPlatformPlayer = GameCreator.addPlayerPlatformObject({src: "images/zealot.gif", name: "platformZealot", width: 80, height: 80})
		GameCreator.createInstance(globalPlatformPlayer, GameCreator.scenes[0], {x:150, y:400, accY: 5});
		
		//Create TopDownObject
		
		//var globalTopDownPlayer = GameCreator.addPlayerTopDownObject({src: "images/zealot.gif", name: "topDownZealot", width: 80, height: 80})
		//GameCreator.createInstance(globalTopDownPlayer, GameCreator.scenes[0], {x:150, y:400});
		
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
		
		$("#addPlayerObjectType").on("change", function(){
		    var objectType = ($(this).val());
			GameCreator.addObject = GameCreator.UI[objectType];
		    if (objectType === "addPlayerMouseObject") {
		      $("#addPlayerMouseObjectPanel").show();
		    } else if (objectType === "addPlayerPlatformObject") {
		      $("#addPlayerMouseObjectPanel").hide();
		    } else if (objectType === "addPlayerTopDownObject") {
		      $("#addPlayerMouseObjectPanel").hide();
		    }
		   
		  });
		
		// UI
		
		$( ".ui-btn" ).button();
		$("#mode").buttonset();
		$("#addGlobalObjectWindow").tabs();
		$("#addGlobalObjectButton").button();
		$( "#selectActionAddAction" ).click(function( event ) {				
			var action = GameCreator.openSelectActionsWindow.selectableActions[$("#actionSelector").val()];
			var selectedAction = {action: action.action, parameters: {}, name: action.name};

			for (var i = 0; i < action.params.length; i++) {
				selectedAction.parameters[action.params[i].inputId] = $("#" + action.params[i].inputId).val();
			}
			GameCreator.openSelectActionsWindow.selectedActions.push(selectedAction);
			$("#selectActionResult").append(GameCreator.htmlStrings.actionRow($("#actionSelector").val(), selectedAction));
		});
		$("#addGlobalObjectWindow").dialog({
			autoOpen: false,
			width: 550,
			buttons: [
				{
					text: "Ok",
					click: function() {
						$( this ).dialog( "close" );
						GameCreator.addObject();
					}
				},
				{
					text: "Cancel",
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			],
			open: function(){
				GameCreator.addObject = GameCreator.UI.addActiveObject;
				$("#addActiveObjectMovementParameters").html(GameCreator.htmlStrings.freeMovementForm());
				$("#addActiveObjectMovementType").on("change", function(){
					if($(this).val() == "free") {
						$("#addActiveObjectMovementParameters").html(GameCreator.htmlStrings.freeMovementForm());
					}
					else {
						$("#addActiveObjectMovementParameters").html("");
					}
				});
			}
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
		
		$( "#editGlobalObjectWindow" ).dialog({
			autoOpen: false,
			width: 700,
			open: function() {
				var dialogWindow = this;
				$(dialogWindow).find("#editGlobalObjectWindowContent").html(GameCreator.htmlStrings.editGlobalObjectPropertiesContent(GameCreator.selectedGlobalObject));
				$(dialogWindow).find(".editGlobalObjectTab").on("click", function() {
					$(dialogWindow).find("#editGlobalObjectWindowContent").html(GameCreator.htmlStrings[$(this).data("htmlstring")](GameCreator.selectedGlobalObject));
				})
			},
			buttons: [
				{
					text: "Ok",
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			]
		});	
	}
	
