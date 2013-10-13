$.extend(GameCreator, {
    addActiveObject: function(args){
        var image = new Image();
        image.src = args.src;
        var activeObj = GameCreator.activeObject.New(image, args);
        GameCreator.UI.createGlobalListElement(activeObj);
        image.onload = function() {
            activeObj.imageReady = true;
            GameCreator.render();
        };
        return activeObj;
    },
    
    addPlayerMouseObject: function(args){
        var image = new Image();
        image.src = args.src;
        var mouseObj = this.mouseObject.New(image, args);
        GameCreator.UI.createGlobalListElement(mouseObj);
        image.onload = function() {
            mouseObj.imageReady = true;
            GameCreator.render();
        };
        return mouseObj;
    },
    
    addPlayerPlatformObject: function(args){
        var image = new Image();
        image.src = args.src;
        var platformObj = this.platformObject.New(image, args);
        GameCreator.UI.createGlobalListElement(platformObj);
        image.onload = function() {
            platformObj.imageReady = true;
            GameCreator.render();
        };
        return platformObj;
    },
    
    addPlayerTopDownObject: function(args){
        var image = new Image();
        image.src = args.src;
        var topDownObj = this.topDownObject.New(image, args);
        GameCreator.UI.createGlobalListElement(topDownObj);
        image.onload = function() {
            topDownObj.imageReady = true;
            GameCreator.render();
        };
        return topDownObj;
    },
    
    directActiveScene: function(){
        this.directScene(GameCreator.scenes[GameCreator.activeScene]);
    },
    
    directScene: function(scene){
        GameCreator.reset();
        for (var i=0;i < scene.length;++i) {
            var obj = jQuery.extend({}, scene[i]);
            GameCreator.addToRuntime(obj);
            obj.parent.onGameStarted();
        }
        
        $(".routeNodeContainer").remove();
        $("#directSceneButton").hide();
        $("#editSceneButton").show();
        then = Date.now();
        GameCreator.resumeGame();
        
        if(GameCreator.state = 'editing') {
        	GameCreator.stopEditing();
        }

		GameCreator.sceneStarted();
        
        GameCreator.state = 'directing';
        GameCreator.timer = setInterval(this.gameLoop, 1);
    },
    
    stopEditing: function(){
    	$(GameCreator.canvas).off("mousedown.editScene");
    	GameCreator.selectedObject = null;
    	$("#editSceneObjectTitle").html("");
    	$("#editSceneObjectContent").html("");
    },
    
    editActiveScene: function(){
        this.editScene(GameCreator.scenes[GameCreator.activeScene]);
    },

    editScene: function(scene){
        GameCreator.reset();
        //Here we populate the renderableObjects only since the other find are unused for editing. Also we use the actual sceneObjects in the
        //renderableObjects array and not copies. This is because we want to change the properties on the actual scene objects when editing.
        for (var i=0;i < scene.length;++i) {
            var obj = scene[i];
            if(obj.parent.isRenderable) {
                GameCreator.renderableObjects.push(obj);
                GameCreator.render();
            }
        }
        
        $(window).on("mousemove", function(e) {
            if (GameCreator.draggedNode) {
                $(GameCreator.draggedNode).parent().css("top", e.pageY - 10);
                $(GameCreator.draggedNode).parent().css("left", e.pageX - 10);
                return false;
            }
        });
        
        $(window).on("mouseup", function(e) {
            if (GameCreator.draggedNode) {
                GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].x = e.pageX - GameCreator.canvasOffsetX - 10;
                GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].y = e.pageY - GameCreator.canvasOffsetY - 10;
                GameCreator.draggedNode = undefined;
                GameCreator.drawRoute(GameCreator.selectedObject.route);
                return false;
            }
        });
        
        $(GameCreator.canvas).on("mousedown.editScene", function(e){
            GameCreator.draggedObject = GameCreator.findClickedObject(e.pageX - $("#mainCanvas").offset().left , e.pageY - $("#mainCanvas").offset().top);
            if(GameCreator.draggedObject) {
                GameCreator.selectedObject = GameCreator.draggedObject;
                GameCreator.editSceneObject();
            } else {
                GameCreator.unselectSceneObject();
            }
            GameCreator.render();
        });
        
        $(GameCreator.canvas).on("mouseup", function(){
            GameCreator.draggedObject = undefined;
        });
        
        $(GameCreator.canvas).on("mousemove", function(e){
            if(GameCreator.draggedObject)
            {
                GameCreator.draggedObject.x = e.pageX - $("#mainCanvas").offset().left - GameCreator.draggedObject.clickOffsetX;
                GameCreator.draggedObject.y = e.pageY - $("#mainCanvas").offset().top - GameCreator.draggedObject.clickOffsetY;
                GameCreator.render();
            }
        });
        
        $(window).on("mousemove", function(e){
            var pic = GameCreator.draggedGlobalElement;
            if (pic) {
                $(pic).css("top", e.pageY - 45);
                $(pic).css("left", e.pageX - 45);
            }
            return false;
        });
        
        $(window).on("mouseup", function(e){
            var pic = GameCreator.draggedGlobalElement;
            if (!pic) {
                return;
            }
            $(pic).remove();
            var x = e.pageX;
            var y = e.pageY;
            var offsetX = $("#mainCanvas").offset().left;
            var offsetY = $("#mainCanvas").offset().top;
            if (x > offsetX    && x < offsetX + GameCreator.width
                && y > offsetY && y < offsetY + GameCreator.height) {
                    var newInstance = GameCreator.createInstance(GameCreator.globalObjects[$(pic).attr("data-name")], GameCreator.scenes[0], {x:x-offsetX, y:y-offsetY});
                    if(newInstance.parent.isRenderable) {
                        GameCreator.renderableObjects.push(newInstance);
                        GameCreator.render();
                    }
            }
                
            GameCreator.draggedGlobalElement = undefined;
        });
        
        $("#directSceneButton").show();
        $("#editSceneButton").hide();
    },
    
    saveState: function() {
        var results = {globalObjects: {}, scenes: [], idCounter: 0};
        //TODO: Put this array somewhere more "configy"
        
        //Save global objects
        var attrsToCopy = ["accX", "accY", "speedX", "speedY", "collideBorderB", "collideBorderL", "collideBorderR", "collideBorderT", "collisionActions", "facing", "height", "width", "keyActions", "maxSpeed", "name", "objectType"];
        var objects = GameCreator.globalObjects;
        for (name in objects) {
            if (objects.hasOwnProperty(name)) {
                var oldObject = objects[name];
                var newObject = {};
                for (i in attrsToCopy) {
                    var attribute = attrsToCopy[i]
                    if(oldObject.hasOwnProperty(attribute))
                        newObject[attribute] = oldObject[attribute];    
                }
                newObject.imageSrc = $(oldObject.image).attr("src");
                results.globalObjects[newObject.name] = newObject;
            }
        };
        
        //Save scenes
        for(var i = 0; i < GameCreator.scenes.length; i++){
            var scene = GameCreator.scenes[i]
            var newScene = [];
            for(var n = 0; n < scene.length; n++){
                var oldObject = scene[n];
                var newObject = jQuery.extend({}, oldObject);
                //Need to save the name of the global object parent rather than the reference so it can be JSONified.
                newObject.parent = parent.name;
                newObject.instantiate = undefined;
                newScene.push(newObject);
            }
            results.scenes.push(newScene);
        }
        
        results.idCounter = GameCreator.idCounter;
        
        return JSONfn.stringify(results);
    },
    
    restoreState: function(savedJson) {
        //Remove old state
        for (var i = 0; i < GameCreator.scenes.length; i++) {
            for(var n = 0; n < GameCreator.scenes[i].length; n++) {
                GameCreator.scenes[i][n].parent.destroy.call(GameCreator.scenes[i][n]);
            }
        }
        GameCreator.scenes = [];
        GameCreator.globalObjects = {};
        $("#globalObjectList").html("");
        //Load globalObjects
        var parsedSave = JSONfn.parse(savedJson);
        for (name in parsedSave.globalObjects) {
            if (parsedSave.globalObjects.hasOwnProperty(name)) {
                var object = parsedSave.globalObjects[name];
                var newObject = GameCreator[object.objectType].createFromSaved(object);
                GameCreator.UI.createGlobalListElement(newObject);
            }
        }
        
        //Load scenes
        for (var i = 0; i < parsedSave.scenes.length; i++) {
            var newScene = [];
            var savedScene = parsedSave.scenes[i];
            for(var n = 0; n < savedScene.length; n++) {
                var object = savedScene[n];
                object.parent = GameCreator.globalObjects[object.name];
                newScene.push(object);
            }
            GameCreator.scenes.push(newScene);
        }
        
        GameCreator.idCounter = parsedSave.idCounter;
        
        GameCreator.editScene(GameCreator.scenes[0]);
    },
    
    editSceneObject: function() {
        $("#editSceneObjectTitle").html('<div class="headingNormalBlack">' + GameCreator.selectedObject.name + '</div>');
        if(GameCreator.selectedObject.parent.objectType == "activeObject") {
            $("#editSceneObjectContent").html(GameCreator.htmlStrings.editActiveObjectForm(GameCreator.selectedObject));
        }
        else if(GameCreator.selectedObject.parent.objectType == "mouseObject") {
            $("#editSceneObjectContent").html(GameCreator.htmlStrings.editMouseObjectForm(GameCreator.selectedObject));
        }
        else if(GameCreator.selectedObject.parent.objectType == "platformObject") {
            $("#editSceneObjectContent").html(GameCreator.htmlStrings.editPlatformObjectForm(GameCreator.selectedObject));
        }
        else if(GameCreator.selectedObject.parent.objectType == "topDownObject") {
            $("#editSceneObjectContent").html(GameCreator.htmlStrings.editTopDownObjectForm(GameCreator.selectedObject));
        }
    },
    
    //Since all inputs are tagged with "data-attrName" and "data-type" we have this general function for saving all object types.
    saveFormInputToObject: function(formId, obj) {
        var inputs = $("#" + formId + " input, #" + formId + " select");
        var input;
        for(var i = 0; i < inputs.length; i++) {
            input = $(inputs[i]);
            obj[input.attr("data-attrName")] = GameCreator.helperFunctions.getValue(input);
        }
    },
    
    deleteSelectedObject: function() {
        GameCreator.selectedObject.delete();
        GameCreator.unselectSceneObject();
        GameCreator.render();
        $("#editSceneObjectContent").html("");
        $("#editSceneObjectTitle").html("");
    },

    saveSceneObject: function(formId, obj) {
        GameCreator.saveFormInputToObject(formId, obj);
        obj.update();
        GameCreator.render();
    },

    unselectSceneObject: function() {
        GameCreator.selectedObject = null;
        $("#editSceneObjectTitle").html("");
        $("#editSceneObjectContent").html("");
    },
    
    drawRoute: function(route) {
        $(".routeNodeContainer").remove();
        var node;
        for(var i = 0; i < route.length; i++) {
            node = route[i];
            $("body").append(GameCreator.htmlStrings.routeNode(node, i));
        }
        $(".routeNode").on("mousedown", function(e) {
            GameCreator.draggedNode = this;
            return false;
        });
    }
});