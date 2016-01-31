GameCreator.version = {
    major: 0, // Incremented on model changes that are not fully or not at all backwards-compatible even with conversion
    minor: 5, // Incremented on model changes that are fully backwards-compatible after conversion
    patch: 0, // Incremented on model changes that are backwards-compatible without the need of conversion.

    changeMessages: [],



    convert: function(game) {
        if (game.version === undefined) {
            GameCreator.version.convertTo010(game);
            game.version = {
                major: 0,
                minor: 1,
                patch: 0
            };
        }

        if (GameCreator.version.isVersionOlderThan(0, 2, 0, game)) {
            GameCreator.version.convertTo020(game);
        }

        if (GameCreator.version.isVersionOlderThan(0, 3, 0, game)) {
            GameCreator.version.convertTo030(game);
        }

        if (GameCreator.version.isVersionOlderThan(0, 4, 0, game)) {
            GameCreator.version.convertTo040(game);
        }

        if (GameCreator.version.isVersionOlderThan(0, 5, 0, game)) {
            GameCreator.version.convertTo050(game);
        }

        for (var i = 0; i < GameCreator.version.changeMessages.length; i += 1) {
            console.log(GameCreator.version.changeMessages[i]);
        }
    },

    isVersionOlderThan: function(major, minor, patch, game) {
        return game.version.major < major ||
            game.version.minor < minor ||
            game.version.patch < patch;
    },

    convertTo010: function(game) {
        var actions = GameCreator.version.collectObject(game, 'actions');
        var conditions = GameCreator.version.collectObject(game, 'conditions');
        var nextObj, action;
        var wasMoveConverted = false;
        var wasSwitchStateConverted = false;
        var wasCounterConverted = false;
        var wasIsInStateConverted = false;
        var wasCounterEqualsConverted = false;
        var wasCollidesWithConverted = false;

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
                    GameCreator.version.changeMessages.push('Error: Counter action targeting missing object: "' + action.parameters.objId + '".');
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
                    GameCreator.version.changeMessages.push('Error: Switch State action targeting missing object: "' + action.parameters.objectId + '".');
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

    convertTo020: function(game) {
        var actions = GameCreator.version.collectObject(game, 'actions');
        for (var i = 0; i < actions.length; i += 1) {
            var action = actions[i];
            if (action.name === 'Shoot') {
                var direction = action.parameters.projectileDirection;
                var target = action.parameters.target;
                action.parameters.projectileDirection = {
                    type: direction,
                    target: target
                };
                delete action.parameters.target;
            }
        }
    },

    convertTo030: function(game) {
        var actions = GameCreator.version.collectObject(game, 'actions');
        for (var i = 0; i < actions.length; i += 1) {
            var action = actions[i];
            if (action.name === 'Counter') {
                var carrier = action.parameters.objId;
                var counter = action.parameters.counter;
                action.parameters.counter = {
                    carrier: carrier,
                    name: counter
                };
                delete action.parameters.objId;
            } else if (action.name === 'SwitchState') {
                var objectId = action.parameters.objectId;
                var objectState = action.parameters.objectState;
                action.parameters.state = {
                    objId: objectId,
                    stateId: objectState
                };
                delete action.parameters.objectId;
                delete action.parameters.objectState;
            }
        }
    },

    convertTo040: function(game) {
        game.props = {};
        game.props.width = game.width || GameCreator.props.width;
        game.props.height = game.height || GameCreator.props.height;
        game.props.viewportWidth = game.width || GameCreator.props.width;
        game.props.viewportHeight = game.height || GameCreator.props.height;
        delete game.width;
        delete game.height;
    },

    convertTo050: function(game) {
        var globalObjNames = Object.keys(game.globalObjects);
        for (var i = 0; i < globalObjNames.length; i += 1) {
            globalObj = game.globalObjects[globalObjNames[i]];
            globalObj.events = globalObj.events || {};
            globalObj.events.onCreateSets = globalObj.events.onCreateSets || globalObj.onCreateSets;
            globalObj.events.onDestroySets = globalObj.events.onDestroySets || globalObj.onDestroySets;
            globalObj.events.onCollideSets = globalObj.events.onCollideSets || globalObj.onCollideSets;
            globalObj.events.onClickSets = globalObj.events.onClickSets || globalObj.onClickSets;
            globalObj.events.onKeySets = globalObj.events.onKeySets || globalObj.onKeySets;
            if (!globalObj.events.onKeySets) {
                delete globalObj.events.onKeySets;
            }
            if (!globalObj.events.onClickSets) {
                delete globalObj.events.onClickSets;
            }
            if (!globalObj.events.onCollideSets) {
                delete globalObj.events.onCollideSets;
            }
            if (!globalObj.events.onDestroySets) {
                delete globalObj.events.onDestroySets;
            }
            if (!globalObj.events.onCreateSets) {
                delete globalObj.events.onCreateSets;
            }
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
