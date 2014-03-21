/*global GameCreator, $*/
(function() {
    "use strict";
    $.extend(GameCreator, {
        createSceneObject: function (globalObj, scene, args) {
            var sceneObj = Object.create(GameCreator.sceneObject);
            sceneObj.instantiate(globalObj, args);
            scene.push(sceneObj);
            if (sceneObj.parent.isRenderable) {
                GameCreator.renderableObjects.push(sceneObj);
                GameCreator.render(false);
            }
            return sceneObj;
        },

        getSceneObjectById: function(id) {
            var i, sceneObj;
            for (i = 0; i < GameCreator.scenes[GameCreator.activeScene].length; i += 1) {
                sceneObj = GameCreator.scenes[GameCreator.activeScene][i];
                if (sceneObj.instanceId === id) {
                    return sceneObj;
                }
            }
            return null;
        },

        getUniqueIDsInScene: function() {
            var result = {};
            var i, sceneObj;
            for (i = 0; i < GameCreator.scenes[GameCreator.activeScene].length; i += 1) {
                sceneObj = GameCreator.scenes[GameCreator.activeScene][i];
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
            var i, obj;
            GameCreator.reset();
            GameCreator.resetScene(scene);
            for (i = 0; i < scene.length; i += 1) {
                obj = $.extend({}, scene[i]);
                GameCreator.addToRuntime(obj);
                obj.parent.onGameStarted();
                obj.setCounterParent();
            }

            GameCreator.resumeGame();

            if (GameCreator.state === 'editing') {
                GameCreator.stopEditing();
            }

            GameCreator.sceneStarted();
        },

        resetScene: function(scene) {
            var i;
            for (i = 0; i < scene.length; i += 1) {
                scene[i].reset();
            }
        },

        sceneStarted: function() {
            $(GameCreator.mainCanvas).on("mousedown.runningScene", function(e) {
                var i;
                var runtimeObj = GameCreator.getClickedObject(e.pageX - $("#main-canvas").offset().left, e.pageY - $("#main-canvas").offset().top);
                if (runtimeObj && runtimeObj.parent.isClickable) {
                    if (runtimeObj.parent.onClickActions === undefined && GameCreator.state !== 'playing' && !GameCreator.paused) {
                        runtimeObj.parent.onClickActions = [];
                        GameCreator.UI.openEditActionsWindow(
                            "Clicked on " + runtimeObj.parent.objectName,
                             GameCreator.actionGroups.nonCollisionActions,
                             runtimeObj.parent.onClickActions,
                             runtimeObj.parent.objectName
                            );
                    } else if (runtimeObj.parent.onClickActions) {
                        for (i = 0; i < runtimeObj.parent.onClickActions.length; i += 1) {
                            runtimeObj.parent.onClickActions[i].runAction(runtimeObj);
                        }
                    }
                }
            });
        }
    });
}());