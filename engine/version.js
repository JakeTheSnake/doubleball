GameCreator.version = {
    currentVersion: "0.0.1",
    changeMessages: [],

    convert: function(game) {
        if (game.version === undefined) {
            GameCreator.version.convertTo001(game);
            game.version = "0.0.1";
        }

        for (var i = 0; i < GameCreator.version.changeMessages.length; i += 1) {
            console.log(GameCreator.version.changeMessages[i]);
        }
    },

    convertTo001: function(game) {
        var actions = GameCreator.version.collectObject(game, 'actions');
        var conditions = GameCreator.version.collectObject(game, 'conditions');
        var nextObj, action;
        var isMoveConverted = false;
        var isSwitchStateConverted = false;
        var isCounterConverted = false;
        var isIsInStateConverted = false;

        while (!(nextObj = actions.next()).done) {
            var action = nextObj.value;
            if (action.name === 'Move') {
                action.name = 'Teleport';
                isMoveConverted = true;
            }
            if (action.name === "Counter") {
                try {
                    var parentId = GameCreator.version.getParentId(action.parameters.objId, game);
                    if (parentId !== null) {
                        action.parameters.objId = parentId;
                        isCounterConverted = true;
                    }
                } catch (e) {
                    GameCreator.version.changeMessages.push('Error: Counter action targetting object: "' + actions.parameters.objId + '" could not be found.');
                }
                
            }
            if (action.name === "SwitchState") {
                try {
                    var parentId = GameCreator.version.getParentId(action.parameters.objectId, game);
                    if (parentId !== null) {
                        action.parameters.objectId = parentId;
                        isSwitchStateConverted = true;
                    }
                } catch (e) {
                    GameCreator.version.changeMessages.push('Error: Counter action targetting object: "' + actions.parameters.objectId + '" could not be found.');
                }
            }
        }

        while (!(nextObj = conditions.next()).done) {
            var condition = nextObj.value;
            if (condition.name === "isInState") {
                isIsInStateConverted = true;
                delete condition.parameters.objId;
            }
        }

        if (isMoveConverted) {
            GameCreator.version.changeMessages.push('Your "Move"-actions have been renamed to "Teleport"');
        }
        if (isCounterConverted) {
            GameCreator.version.changeMessages.push('Your "Counter"-actions now target a Global Object instead of a Scene Object.');
        }
        if (isSwitchStateConverted) {
            GameCreator.version.changeMessages.push('Your "Switch State"-actions now target a Global Object instead of a Scene Object.');
        }
        if (isIsInStateConverted) {
            GameCreator.version.changeMessages.push('Your "Is In State"-conditions now always targets "this".');   
        }
    },

    collectObject: function*(object, targetName) {
        var i, prop;
        var properties = Object.keys(object);
        for (i = 0; i < properties.length; i += 1) {
            prop = properties[i];
            if (prop === targetName) {
                for (var j = 0; j < object[prop].length; j += 1) {
                    yield object[prop][j];
                }
            } else if (object[prop] instanceof Object && prop !== 'attributes' && prop !== 'states') {
                var recursiveGen = GameCreator.version.collectObject(object[prop], targetName);
                var nextObj;
                while (!(nextObj = recursiveGen.next()).done) {
                    yield nextObj.value;
                }
            }
        }
    },

    findGlobalObjectById: function(game, id) {
        var globalObjNames = Object.keys(game.globalObjects);
        var i, globalObj;
        for (i = 0; i < globalObjNames.length; i += 1) {
            globalObj = game.globalObjects[globalObjNames[i]];
            if (globalObj.id === Number(id)) {
                return globalObj;
            }
        }
        return null;
    },

    findSceneObject: function(game, id) {
        for (var i = 0; i < game.scenes.length; i += 1) {
            for (var j = 0; j < game.scenes[i].objects.length; j += 1) {
                if (game.scenes[i].objects[j].attributes.instanceId === id) {
                    return game.scenes[i].objects[j];
                }
            }
        }
        return null;
    },

    getParentId: function(objId, game) {
        if (objId !== 'this' && GameCreator.version.findGlobalObjectById(game, objId) === null) {
            var parentName = GameCreator.version.findSceneObject(game, objId).parent;
            if (game.globalObjects[parentName] !== undefined) {
                return game.globalObjects[parentName].id;
            } else {
                throw 'Parent of object "' + objId + '" could not be found.';
            }
        }
    }
}