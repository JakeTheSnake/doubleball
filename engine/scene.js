/*global GameCreator, $*/
(function() {
    "use strict";

    GameCreator.Scene = function(id) {
        this.objects = [];
        this.id = (id !== undefined ? id : GameCreator.getUniqueSceneId());
        this.attributes = {
            name: 'Scene ' + this.id,
            bgColor: "white",
            bgImage: null
        }
    };

    GameCreator.Scene.prototype.drawBackground = function() {
        var context = GameCreator.bgContext;
        context.clearRect(0, 0, GameCreator.width, GameCreator.height)
        context.fillStyle = this.attributes.bgColor;
        context.fillRect(0, 0, GameCreator.width, GameCreator.height);

        if (this.attributes.bgImage != null) {
            if ($(this.attributes.bgImage).data('loaded')) {
                context.drawImage(this.attributes.bgImage, 0, 0, GameCreator.width, GameCreator.height);
            } else {
                this.attributes.bgImage.onload = function() {
                    $(this).data('loaded', true);
                    context.drawImage(this, 0, 0, GameCreator.width, GameCreator.height);
                }
            }
        }
    };

    GameCreator.Scene.prototype.addSceneObject = function(sceneObject) {
        this.objects.push(sceneObject);
    };

    GameCreator.Scene.prototype.getSelectableCounters = function(globalObj) {
        var i, counterNames, result = {};
        counterNames = Object.keys(globalObj.parentCounters);
        counterNames.forEach(function(name){
            result['This - ' + name] = 'this::' + name;
        });
        this.objects.forEach(function(object) {
            counterNames = Object.keys(object.counters);
            counterNames.forEach(function(name) {
                result[object.attributes.instanceId + ' - ' + name] = object.attributes.instanceId + '::' + name;
            });
        });
        return result;
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
                if (activeScene) {
                    for (i = 0; i < activeScene.objects.length; i += 1) {
                        sceneObj = activeScene.objects[i];
                        if (sceneObj.attributes.instanceId === id) {
                            return sceneObj;
                        }
                    }
                }
            }
            return null;
        },

        insertSceneAfter: function(sceneIdToBeMoved, insertAfterSceneId) {
            var i;

            var sceneToBeMovedIndex = GameCreator.helpers.getIndexOfObjectWithId(sceneIdToBeMoved);
            var tempScene = GameCreator.scenes.splice(sceneToBeMovedIndex, 1)[0];
            var insertAfterSceneIndex = GameCreator.helpers.getIndexOfObjectWithId(insertAfterSceneId);
            GameCreator.scenes.splice(insertAfterSceneIndex+1, 0, tempScene);

            GameCreator.UI.drawSceneTabs();
        },

        getSceneById: function(id) {
            return GameCreator.helpers.getObjectById(GameCreator.scenes, id);
        },

        getUniqueIDsInActiveScene: function() {
            var result = {'this': 'this'};
            var i, sceneObj, activeScene;
            activeScene = GameCreator.getActiveScene();
            for (i = 0; i < activeScene.objects.length; i += 1) {
                sceneObj = activeScene.objects[i];
                result[sceneObj.attributes.instanceId] = sceneObj.attributes.instanceId;
            }
            return result;
        },

        getUniqueIDsWithCountersInActiveScene: function() {
            var i, sceneObj, activeScene, result = {};
            activeScene = GameCreator.getActiveScene();
            for (i = 0; i < activeScene.objects.length; i += 1) {
                sceneObj = activeScene.objects[i];
                if(Object.keys(sceneObj.counters).length || (sceneObj.parent.attributes && sceneObj.parent.attributes.unique && Object.keys(sceneObj.parent.counters))) {
                    result[sceneObj.attributes.instanceId] = sceneObj.attributes.instanceId;
                }
            }
            return result;
        },

        selectScene: function(params) {
            GameCreator.activeSceneId = Number(params.scene);
            GameCreator.switchScene(GameCreator.getSceneById(GameCreator.activeSceneId));
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
            GameCreator.activeSceneId = scene.id;
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