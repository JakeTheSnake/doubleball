$.extend(GameCreator, {
	createSceneObject: function(globalObj, scene, args){
        var sceneObj = Object.create(GameCreator.sceneObject);
        sceneObj.instantiate(globalObj, args);
        scene.push(sceneObj);
        if(sceneObj.parent.isRenderable) {
            GameCreator.renderableObjects.push(sceneObj);
            GameCreator.render(false);
        }
        return sceneObj;
    },

	getSceneObjectById: function(id) {
    	for(var i = 0; i < GameCreator.scenes[GameCreator.activeScene].length; ++i) {
            var sceneObj = GameCreator.scenes[GameCreator.activeScene][i];
            if (sceneObj.instanceId === id) {
            	return sceneObj;
            }
        }
        return null;
    },
    
    getUniqueIDsInScene: function() {
        var result = {};
        for(var i = 0; i < GameCreator.scenes[GameCreator.activeScene].length; ++i) {
            var sceneObj = GameCreator.scenes[GameCreator.activeScene][i];
            result[sceneObj.instanceId] = sceneObj.instanceId;
        }
        return result;
    },

    selectScene: function(params) {
      var scene = GameCreator.helperFunctions.calculateScene(GameCreator.activeScene, params);
      GameCreator.activeScene = scene;
      if (GameCreator.state === 'directing') {
          GameCreator.directScene(GameCreator.scenes[scene]);
      } else if (GameCreator.state === 'playing') {
          GameCreator.playScene(GameCreator.scenes[scene]);       
      }
    },

    playScene: function(scene) {
        GameCreator.reset();
        GameCreator.resetScene(scene);
        
        //Populate the runtime arrays with clones of objects from this scene array. How do we make sure the right object ends up in the right arrays?
        //Do we need a new type of object? runtimeObject?
        for (var i=0;i < scene.length;++i) {
            var obj = jQuery.extend({}, scene[i]);
            GameCreator.addToRuntime(obj);
            obj.parent.onGameStarted();
            obj.setCounterParent();
        }

        then = Date.now();
        GameCreator.resumeGame();
        
        if(GameCreator.state = 'editing') {
            GameCreator.stopEditing();
        }
        
        GameCreator.sceneStarted();
        GameCreator.state = 'playing';
        GameCreator.gameLoop();
    },

    

	resetScene: function(scene){
    	for (var i = 0; i < scene.length; ++i) {
    		scene[i].reset();
		}
    },

    sceneStarted: function(){
        $(GameCreator.mainCanvas).on("mousedown.runningScene", function(e){
            var runtimeObj = GameCreator.getClickedObject(e.pageX - $("#mainCanvas").offset().left , e.pageY - $("#mainCanvas").offset().top);
            if(runtimeObj && runtimeObj.parent.isClickable) {
                if(runtimeObj.parent.onClickActions == undefined && GameCreator.state !== "playing")
                {
                    runtimeObj.parent.onClickActions = [];
                    GameCreator.UI.openEditActionsWindow(
                        "Clicked on " + runtimeObj.parent.name,
                         GameCreator.actionGroups.nonCollisionActions,
                         runtimeObj.parent.onClickActions,
                         null,
                         runtimeObj.parent.name
                        );
                }
                else if (runtimeObj.parent.onClickActions)
                {
                    for(var i = 0;i < runtimeObj.parent.onClickActions.length;++i)
                    {
                        GameCreator.helperFunctions.runAction(runtimeObj, runtimeObj.parent.onClickActions[i],
                        	runtimeObj.parent.onClickActions[i].parameters);
                    }
                }
            }
        });
    }
});