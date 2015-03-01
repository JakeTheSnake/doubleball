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
        var actions = GameCreator.version.collectObject(game, "actions");
        var nextObj, action;
        var moveWasConverted = false;

        while (!(nextObj = actions.next()).done) {
            var action = nextObj.value;
            if (action.name === "Move") {
                action.name = "Teleport";
                moveWasConverted = true;
            }
        }

        if (moveWasConverted) {
            GameCreator.version.changeMessages.push('Your "Move"-actions have been renamed to "Teleport"');
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
            } else if (object[prop] instanceof Object && prop !== "attributes" && prop !== "states") {
                var recursiveGen = GameCreator.version.collectObject(object[prop], targetName);
                var nextObj;
                while (!(nextObj = recursiveGen.next()).done) {
                    yield nextObj.value;
                }
            }
        }
    },
}