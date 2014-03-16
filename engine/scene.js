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
      GameCreator.switchScene(scene);
    },

    playScene: function(scene) {
        GameCreator.switchScene(scene);
        GameCreator.resetGlobalCounters();
        GameCreator.then = Date.now();
        GameCreator.state = 'playing';
        GameCreator.gameLoop();
    },

    switchScene: function(scene) {
        GameCreator.reset();
        GameCreator.resetScene(scene);
        for (var i=0; i < scene.length; ++i) {
            var obj = jQuery.extend({}, scene[i]);
            GameCreator.addToRuntime(obj);
            obj.parent.onGameStarted();
            obj.setCounterParent();
        }

        GameCreator.resumeGame();

        if(GameCreator.state === 'editing') {
            GameCreator.stopEditing();
        }

        GameCreator.sceneStarted();
    }, 

	resetScene: function(scene){
    	for (var i = 0; i < scene.length; ++i) {
    		scene[i].reset();
		}
    },

    sceneStarted: function(){
        $(GameCreator.mainCanvas).on("mousedown.runningScene", function(e){
            var runtimeObj = GameCreator.getClickedObject(e.pageX - $("#main-canvas").offset().left , e.pageY - $("#main-canvas").offset().top);
            if(runtimeObj && runtimeObj.parent.isClickable) {
                if(runtimeObj.parent.onClickActions == undefined && GameCreator.state !== 'playing' && !GameCreator.paused) {
                    runtimeObj.parent.onClickActions = [];
                    GameCreator.UI.openEditActionsWindow(
                        "Clicked on " + runtimeObj.parent.name,
                         GameCreator.actionGroups.nonCollisionActions,
                         runtimeObj.parent.onClickActions,
                         runtimeObj.parent.name
                        );
                }
                else if (runtimeObj.parent.onClickActions)
                {
                    for(var i = 0;i < runtimeObj.parent.onClickActions.length;++i)
                    {
                        GameCreator.helperFunctions.runAction(runtimeObj, runtimeObj.parent.onClickActions[i]);
                    }
                }
            }
        });
    }
});