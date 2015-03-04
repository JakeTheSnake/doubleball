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
        var wasMoveConverted = false;
        var wasSwitchStateConverted = false;
        var wasCounterConverted = false;
        var wasIsInStateConverted = false;
        var wasCounterEqualsConverted = false;

        for (var i = 0; i < actions.length; i += 1) {
            var action = actions[i];
            if (action.name === 'Move') {
                action.name = 'Teleport';
                wasMoveConverted = true;
            }
            if (action.name === "Counter") {
                try {
                    var parentId = GameCreator.version.getParentId(action.parameters.objId, game);
                    if (parentId !== null) {
                        action.parameters.objId = parentId;
                        wasCounterConverted = true;
                    }
                } catch (e) {
                    GameCreator.version.changeMessages.push('Error: Counter action targeting object: "' + actions.parameters.objId + '" could not be found.');
                }
                
            }
            if (action.name === "SwitchState") {
                try {
                    var parentId = GameCreator.version.getParentId(action.parameters.objectId, game);
                    if (parentId !== null) {
                        action.parameters.objectId = parentId;
                        wasSwitchStateConverted = true;
                    }
                } catch (e) {
                    GameCreator.version.changeMessages.push('Error: Switch State action targeting object: "' + actions.parameters.objectId + '" could not be found.');
                }
            }
        }

        for (var i = 0; i < conditions.length; i += 1) {
            var condition = conditions[i];
            if (condition.name === "isInState") {
                wasIsInStateConverted = true;
                delete condition.parameters.objId;
            }
            if (condition.name === "counterEquals") {
                wasCounterEqualsConverted = true;
                delete condition.parameters.objId;
            }
            if (condition.name === "collidesWith") {
                try {
                    var parentId = GameCreator.version.getParentId(condition.parameters.objId, game);
                    if (parentId !== null) {
                        condition.parameters.objId = parentId;
                        wasCollidesWithConverted = true;
                    }
                } catch (e) {
                    GameCreator.version.changeMessages.push('Error: Collides With condition targeting object: "' + condition.parameters.objId + '" could not be found.');
                }
            }
        }

        if (wasMoveConverted) {
            GameCreator.version.changeMessages.push('Your "Move"-actions have been renamed to "Teleport"');
        }
        if (wasCounterConverted) {
            GameCreator.version.changeMessages.push('Your "Counter"-actions now target a Global Object instead of a Scene Object.');
        }
        if (wasSwitchStateConverted) {
            GameCreator.version.changeMessages.push('Your "Switch State"-actions now target a Global Object instead of a Scene Object.');
        }
        if (wasIsInStateConverted) {
            GameCreator.version.changeMessages.push('Your "Is In State"-conditions now always targets "this".');   
        }
        if (wasCounterEqualsConverted) {
            GameCreator.version.changeMessages.push('Your "Counter Equals"-conditions now always targets "this".');   
        }
        if (wasCollidesWithConverted) {
            GameCreator.version.changeMessages.push('Your "Collides With"-conditions now always targets "this".');   
        }
    },

    collectObject: function(object, targetName) {
        var i, prop;
        var properties = Object.keys(object);
        var result = [];
        for (i = 0; i < properties.length; i += 1) {
            prop = properties[i];
            if (prop === targetName) {
                for (var j = 0; j < object[prop].length; j += 1) {
                    result.push(object[prop][j]);
                }
            } else if (object[prop] instanceof Object && prop !== 'attributes' && prop !== 'states') {
                result = result.concat(GameCreator.version.collectObject(object[prop], targetName));
            }
        }
        return result;
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
        return null;
    }
}