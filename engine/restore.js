$.extend(GameCreator, {
    restoreState: function(savedGame) {
        var i, n, name, oldObject, newObject, newScene, savedScene;
        GameCreator.version.convert(savedGame);
        GameCreator.scenes = [];
        GameCreator.globalObjects = {};
        GameCreator.renderableObjects = [];
        GameCreator.width = savedGame.width || GameCreator.width;
        GameCreator.height = savedGame.height || GameCreator.height;

        //Load globalObjects
        var globalObjects = Object.keys(savedGame.globalObjects);
        globalObjects.forEach(function(objName) {
            oldObject = savedGame.globalObjects[objName];

            newObject = new GameCreator[oldObject.objectType]({});
    
            $.extend(newObject, oldObject);

            if (newObject.onClickSets) {
                newObject.onClickSets = newObject.onClickSets.map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
            }
            if (newObject.onCreateSets) {
                newObject.onCreateSets = newObject.onCreateSets.map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
            }
            if (newObject.onDestroySets) {
                newObject.onDestroySets = newObject.onDestroySets.map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
            }
            if (newObject.onCollideSets) {
                newObject.onCollideSets.forEach(function(collideArray){
                    collideArray.caSets = collideArray.caSets.map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
                });
            }
            if (newObject.onKeySets) {
                var keys = Object.keys(newObject.onKeySets);
                keys.forEach(function(key){
                    newObject.onKeySets[key] = newObject.onKeySets[key].map(function(caSet){ return GameCreator.restoreCaSet(caSet); });
                });
            }

            if (newObject.parentCounters) {
                var keys = Object.keys(newObject.parentCounters);
                keys.forEach(function(key){
                    newObject.parentCounters[key] = GameCreator.restoreParentCounter(newObject.parentCounters[key]);
                });
            }

            GameCreator.globalObjects[newObject.objectName] = newObject;
            GameCreator.referenceImage(newObject);

        });
        
        //Load scenes
        for (i = 0; i < savedGame.scenes.length; i += 1) {
            savedScene = savedGame.scenes[i];
            newScene = new GameCreator.Scene(savedScene.id);
            for (n = 0; n < savedScene.objects.length; n += 1) {
                var loadedObject = savedScene.objects[n];
                newObject = GameCreator.createSceneObject(GameCreator.globalObjects[loadedObject.parent], newScene, loadedObject.attributes);
                newObject.route = loadedObject.route;
            }

            newScene.attributes.bgImage = savedScene.attributes.bgImage ? GameCreator.createImageElement(savedScene.attributes.bgImage) : null;
            newScene.attributes.bgColor = savedScene.attributes.bgColor;
            newScene.attributes.name = savedScene.attributes.name;
            newScene.onCreateSet = GameCreator.restoreCaSet(savedScene.onCreateSet);
            GameCreator.scenes.push(newScene);
        }

        GameCreator.globalCounters = GameCreator.restoreGlobalCounters(savedGame.globalCounters);

        GameCreator.idCounter = savedGame.idCounter;
        GameCreator.globalIdCounter = savedGame.globalIdCounter;
        GameCreator.uniqueSceneId = savedGame.uniqueSceneId;
        GameCreator.activeSceneId = GameCreator.scenes[0].id;
    },

    restoreGlobalCounters: function(savedGlobalCounters) {
        var restoredGlobalCounters = {};
        var globalCounterNames = Object.keys(savedGlobalCounters || {});
        globalCounterNames.forEach(function(globalCounterName) {
            restoredGlobalCounters[globalCounterName] = GameCreator.restoreParentCounter(savedGlobalCounters[globalCounterName]);
        });
        return restoredGlobalCounters;
    },

    restoreCaSet: function(caSet) {
        var newCaSet = new GameCreator.ConditionActionSet();
        $.extend(newCaSet, caSet);
        newCaSet.actions = newCaSet.actions.map(function(action) {
            return new GameCreator.RuntimeAction(action.name, action.parameters, action.timing);
        });
        newCaSet.conditions = newCaSet.conditions.map(function(condition) {
            return new GameCreator.RuntimeCondition(condition.name, condition.parameters);
        });
        return newCaSet;
    },

    restoreParentCounter: function(parentCounter) {
        var keys, newParentCounter = new GameCreator.Counter();
        $.extend(newParentCounter, parentCounter);
        keys = Object.keys(newParentCounter.aboveValue)
        keys.forEach(function(key){
            newParentCounter.aboveValue[key] = newParentCounter.aboveValue[key].map(function(caSet){
                return GameCreator.restoreCaSet(caSet);
            });
        });

        keys = Object.keys(newParentCounter.belowValue)
        keys.forEach(function(key){
            newParentCounter.belowValue[key] = newParentCounter.belowValue[key].map(function(caSet){
                return GameCreator.restoreCaSet(caSet);
            });
        });

        keys = Object.keys(newParentCounter.atValue)
        keys.forEach(function(key){
            newParentCounter.atValue[key] = newParentCounter.atValue[key].map(function(caSet){
                return GameCreator.restoreCaSet(caSet);
            });
        });

        newParentCounter.onIncrease = newParentCounter.onIncrease.map(function(caSet){
            return GameCreator.restoreCaSet(caSet);
        });
        newParentCounter.onDecrease = newParentCounter.onDecrease.map(function(caSet){
            return GameCreator.restoreCaSet(caSet);
        });
        return newParentCounter;
    },

    referenceImage: function(globalObj) {
        var i;
        for(i = 0; i < globalObj.states.length; i += 1) {
            if (globalObj.states[i].attributes.image) {
                globalObj.states[i].attributes.image = GameCreator.createImageElement(globalObj.states[i].attributes.image);
            }
        }
    },

    createImageElement: function(src) {
        var img = new Image();
        img.src = src;
        img.onload = function(img) {
            $(img).data('loaded', true);
            GameCreator.render();
        }.bind(this, img);
        return img;
    },
});