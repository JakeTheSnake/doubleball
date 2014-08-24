/*global GameCreator, $*/
(function() {
    "use strict";

    GameCreator.Scene = function() {
        this.objects = [];
        this.id = GameCreator.getUniqueSceneId();
        this.attributes = {
            name: 'Scene ' + this.id,
            backgroundColor: "#FFFFFF",
            backgroundImage: null
        }
    };

    GameCreator.Scene.prototype.drawBackground = function() {
        var context = GameCreator.bgContext;
        context.clearRect(0, 0, GameCreator.width, GameCreator.height)
        context.fillStyle = this.attributes.backgroundColor;
        context.fillRect(0, 0, GameCreator.width, GameCreator.height);

        if (this.attributes.backgroundImage != null) {
            context.drawImage(this.attributes.backgroundImage, 0, 0, GameCreator.width, GameCreator.height);
        }
    };

    GameCreator.Scene.prototype.addSceneObject = function(sceneObject) {
        this.objects.push(sceneObject);
    };

    GameCreator.Scene.prototype.reset = function() {
        var i;
        for (i = 0; i < this.objects.length; i += 1) {
            this.objects[i].reset();
        }
    };

    $.extend(GameCreator, {
        createSceneObject: function (globalObj, scene, args) {
            var sceneObj = new GameCreator.SceneObject();
            sceneObj.instantiate(globalObj, args);
            scene.addSceneObject(sceneObj);
            if (sceneObj.parent.isRenderable) {
                GameCreator.renderableObjects.push(sceneObj);
                GameCreator.render(false);
            }
            return sceneObj;
        },

        getActiveScene: function() {
            return GameCreator.getSceneById(GameCreator.activeSceneId);
        },

        getSceneObjectById: function(id) {
            var i, sceneObj;
            var activeScene;
            if (id !== undefined) {
                activeScene = GameCreator.getActiveScene();
                for (i = 0; i < activeScene.objects.length; i += 1) {
                    sceneObj = activeScene.objects[i];
                    if (sceneObj.instanceId === id) {
                        return sceneObj;
                    }
                }
            }
            return null;
        },

        getSceneById: function(id) {
            return GameCreator.helpers.getObjectById(GameCreator.scenes, id);
        },

        getUniqueIDsInActiveScene: function() {
            var result = {};
            var i, sceneObj, activeScene;
            activeScene = GameCreator.getActiveScene();
            for (i = 0; i < activeScene.objects.length; i += 1) {
                sceneObj = activeScene.objects[i];
                result[sceneObj.instanceId] = sceneObj.instanceId;
            }
            return result;
        },

        selectScene: function(params) {
            var scene = GameCreator.helpers.calculateScene(GameCreator.activeSceneId, params);
            GameCreator.activeSceneId = scene.id;
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
            scene.reset();
            scene.drawBackground();
            for (i = 0; i < scene.objects.length; i += 1) {
                obj = $.extend({}, scene.objects[i]);
                obj.attributes = $.extend({}, scene.objects[i].attributes);
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

        sceneStarted: function() {
            $(GameCreator.mainCanvas).on("mousedown.runningScene", function(e) {
                var runtimeObj = GameCreator.getClickedObject(e.pageX - $("#main-canvas").offset().left, e.pageY - $("#main-canvas").offset().top);
                if (runtimeObj && runtimeObj.parent) {
                    runtimeObj.parent.runOnClickActions.call(runtimeObj);
                }
            });
        }
    });
}());