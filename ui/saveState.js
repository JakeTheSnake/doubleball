/*global GameCreator, $, Image, window*/
(function() {

"use strict";
$.extend(GameCreator, {
    saveState: function() {
        var results = {globalObjects: {}, scenes: [], globalCounters: {}};

        results.globalObjects = GameCreator.saveGlobalObjects();
        results.scenes = GameCreator.saveScenes();
        results.globalCounters = GameCreator.globalCounters;
        results.globalIdCounter = GameCreator.globalIdCounter;
        results.uniqueSceneId = GameCreator.uniqueSceneId;
        results.version = {
            major: GameCreator.version.major,
            minor: GameCreator.version.minor,
            patch: GameCreator.version.patch
        };
        results.props = GameCreator.props;
        return JSON.stringify(results);
    },

    dereferenceImage: function(globalObj) {
        for(var i = 0; i < globalObj.states.length; i += 1) {
            if (globalObj.states[i].attributes.image) {
                globalObj.states[i].attributes.image = globalObj.states[i].attributes.image.src;
            }
        }
    },

    saveGlobalObjects: function() {
        var savedGlobalObjects = {};
        var propsToCopy = ['attributes', 'id', 'objectName', 'objectType', 'events', 'parentCounters', 'states'];
        var objects = GameCreator.globalObjects;
        var name, names, oldObject, newObject, i, j, attribute;
        names = Object.keys(objects);
        for (j = 0; j < names.length; j += 1) {
            name = names[j];
            oldObject = $.extend(true, {}, objects[name]);
            newObject = {};
            for (i = 0; i < propsToCopy.length; i += 1) {
                attribute = propsToCopy[i];
                if (oldObject.hasOwnProperty(attribute)) {
                    newObject[attribute] = oldObject[attribute];
                }
            }
            GameCreator.dereferenceImage(newObject);
            savedGlobalObjects[newObject.objectName] = newObject;
        }
        return savedGlobalObjects;
    },

    saveScenes: function() {
        var savedScenes = [];
        var scene, newScene, newObject, oldObject;
        for (var i = 0; i < GameCreator.scenes.length; i += 1) {
            scene = GameCreator.scenes[i];
            newScene = new GameCreator.Scene(scene.id);
            for (var n = 0; n < scene.objects.length; n += 1) {
                oldObject = $.extend(true, {}, scene.objects[n]);
                newObject = {};
                newObject.attributes = oldObject.attributes;
                newObject.route = oldObject.route;
                delete newObject.attributes.image;
                
                //Need to save the name of the global object parent rather than the reference so it can be JSONified.
                newObject.parent = oldObject.parent.objectName;
                //Same for counters
                newScene.addSceneObject(newObject);
            }
            newScene.attributes.bgImage = scene.attributes.bgImage ? scene.attributes.bgImage.src : null;
            newScene.attributes.bgColor = scene.attributes.bgColor;
            newScene.attributes.name = scene.attributes.name;
            newScene.onCreateSet = scene.onCreateSet;
            savedScenes.push(newScene);
        }
        return savedScenes;
    },

    validateGame: function() {
        let errors = [];
        Object.keys(GameCreator.globalObjects).forEach(function(globalObj) {
            let obj = GameCreator.globalObjects[globalObj];
        });
    }
});

})();