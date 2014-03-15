$.extend(GameCreator, {

    directions: {
        Default: "Default",
        Up: "Up",
        Down: "Down",
        Left: "Left",
        Right: "Right"
    },
       
    addGlobalObject: function(args, objectType) {
        var image = new Image();
        image.src = args.src;
        var globalObj = GameCreator[objectType].New(image, args);
        globalObj.id = GameCreator.globalIdCounter++;
        GameCreator.UI.createLibraryItem(globalObj);
        image.onload = function() {
            globalObj.imageReady = true;
            GameCreator.render();
        };

        GameCreator.globalObjects[globalObj.name] = globalObj;
        
        return globalObj;
    },
    
    directActiveScene: function(){
        GameCreator.directScene(GameCreator.scenes[GameCreator.activeScene]);
    },
    
    directScene: function(scene) {
        GameCreator.switchScene(scene);
        GameCreator.resetGlobalCounters();
        GameCreator.then = Date.now();
        GameCreator.UI.directSceneMode();
        GameCreator.state = 'directing';

        GameCreator.gameLoop();
    },

    drawSelectionLine: function() {
        GameCreator.uiContext.clearRect(0, 0, GameCreator.width, GameCreator.height);
        if(GameCreator.selectedObject) {
            var selobj = GameCreator.selectedObject;
            GameCreator.uiContext.beginPath();
            GameCreator.uiContext.moveTo(selobj.x, selobj.y);
            GameCreator.uiContext.lineTo(selobj.x + selobj.displayWidth, selobj.y);
            GameCreator.uiContext.lineTo(selobj.x + selobj.displayWidth, selobj.y + selobj.displayHeight);
            GameCreator.uiContext.lineTo(selobj.x, selobj.y + selobj.displayHeight);
            GameCreator.uiContext.closePath();
            GameCreator.uiContext.stroke();
        }
    },
    
    stopEditing: function(){
        $(GameCreator.mainCanvas).off(".editScene");
        GameCreator.selectedObject = null;
        GameCreator.UI.unselectSceneObject();
    },
    
    editActiveScene: function(){
        this.editScene(GameCreator.scenes[GameCreator.activeScene]);
    },

    editScene: function(scene){
        GameCreator.reset();
        GameCreator.resetScene(scene);
        GameCreator.state = 'editing';
        //Here we populate the renderableObjects only since the other kinds are unused for editing. Also we use the actual sceneObjects in the
        //renderableObjects array and not copies. This is because we want to change the properties on the actual scene objects when editing.
        for (var i=0;i < scene.length;++i) {
            var obj = scene[i];
            if(obj.parent.isRenderable) {
                GameCreator.renderableObjects.push(obj);
                GameCreator.render(true);
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
                GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].x = e.pageX - GameCreator.mainCanvasOffsetX - 10;
                GameCreator.selectedObject.route[$(GameCreator.draggedNode).attr("data-index")].y = e.pageY - GameCreator.mainCanvasOffsetY - 10;
                GameCreator.draggedNode = undefined;
                GameCreator.drawRoute(GameCreator.selectedObject.route);
                return false;
            }
        });
        
        $(GameCreator.mainCanvas).on("mousedown.editScene", function(e){
            GameCreator.draggedObject = GameCreator.getClickedObjectEditing(e.pageX - $("#main-canvas").offset().left , e.pageY - $("#main-canvas").offset().top);
            if(GameCreator.draggedObject) {
                GameCreator.selectedObject = GameCreator.draggedObject;
                GameCreator.UI.editSceneObject();
            } else {
                GameCreator.unselectSceneObject();
                GameCreator.drawSelectionLine();
            }
            GameCreator.render(false);
        });
        
        $(GameCreator.mainCanvas).on("mouseup", function(){
            GameCreator.draggedObject = undefined;
        });
        
        $(GameCreator.mainCanvas).on("mousemove", function(e){
            if(GameCreator.draggedObject)
            {
                GameCreator.invalidate(GameCreator.draggedObject);
                GameCreator.draggedObject.x = e.pageX - $("#main-canvas").offset().left - GameCreator.draggedObject.clickOffsetX;
                GameCreator.draggedObject.y = e.pageY - $("#main-canvas").offset().top - GameCreator.draggedObject.clickOffsetY;
                GameCreator.render(true);
            }
        });
        
        GameCreator.UI.setupSceneTabs(GameCreator.scenes);
        GameCreator.render(false);
    },
    
    dereferenceCounters: function(counterCarrier) {
        for(var counterName in counterCarrier.counters){
            if(counterCarrier.counters.hasOwnProperty(counterName)){
                counterCarrier.counters[counterName].parentCounter = counterName;
                counterCarrier.counters[counterName].parentObject = newObject.counters[counterName].parentObject.name;
            }
        }
    },

    referenceCounters: function(counterCarrier) {
        for(var counterName in counterCarrier.counters){
            if(counterCarrier.counters.hasOwnProperty(counterName)){
                var oldCounter = counterCarrier.counters[counterName]
                //Set the reference to the parent object from the name currently saved in its place.
                counterCarrier.counters[counterName] = GameCreator.sceneObjectCounter.New(GameCreator.globalObjects[oldCounter.parentObject], GameCreator.globalObjects[oldCounter.parentObject].counters[counterName]);
                counterCarrier.counters[counterName].aboveValueStates = oldCounter.aboveValueStates;
                counterCarrier.counters[counterName].belowValueStates = oldCounter.belowValueStates;
                counterCarrier.counters[counterName].atValueStates = oldCounter.atValueStates;
                counterCarrier.counters[counterName].value = oldCounter.value;
            }
        }
    },

    saveState: function() {
        var results = {globalObjects: {}, scenes: [], idCounter: 0};
        
        //TODO: Put this array somewhere more "configy"
        //Save global objects
        var attrsToCopy = ["id", "accX", "accY", "speedX", "speedY", "collideBorderB", "collideBorderL", "collideBorderR", "collideBorderT", "collisionActions", "facing", "height", "width", "keyActions", "maxSpeed", "name", "objectType", "maxX", "maxY", "minX", "minY", "movementType", "onClickActions", "onCreateActions", "onDestroyActions", "parentCounters", "counters"];
        var objects = GameCreator.globalObjects;
        for (var name in objects) {
            if (objects.hasOwnProperty(name)) {
                var oldObject = objects[name];
                var newObject = {};
                for (var i in attrsToCopy) {
                    var attribute = attrsToCopy[i]
                    if(oldObject.hasOwnProperty(attribute))
                        newObject[attribute] = oldObject[attribute];    
                }
                
                this.dereferenceCounters(newObject);

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
                //Need to reset counters before saving to make sure mappings to parentcounters are set up.
                GameCreator.resetCounters(oldObject, oldObject.parent.parentCounters);
                var newObject = jQuery.extend({}, oldObject);
                //Need to save the name of the global object parent rather than the reference so it can be JSONified.
                newObject.parent = oldObject.parent.name;
                //Same for counters
                this.dereferenceCounters(newObject);
                newObject.instantiate = undefined;
                newScene.push(newObject);
            }
            results.scenes.push(newScene);
        }
        
        results.idCounter = GameCreator.idCounter;
        results.globalIdCounter = GameCreator.globalIdCounter;
        
        return JSON.stringify(results);
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
        $("#global-object-list").html("");
        //Load globalObjects
        var parsedSave = JSON.parse(savedJson);
        for (var name in parsedSave.globalObjects) {
            if (parsedSave.globalObjects.hasOwnProperty(name)) {
                var object = parsedSave.globalObjects[name];
                var newObject = GameCreator[object.objectType].createFromSaved(object);

                GameCreator.referenceCounters(object);

                GameCreator.UI.createLibraryItem(newObject);
            }
        }
        
        //Load scenes
        for (var i = 0; i < parsedSave.scenes.length; i++) {
            var newScene = [];
            var savedScene = parsedSave.scenes[i];
            for(var n = 0; n < savedScene.length; n++) {
                var object = savedScene[n];
                GameCreator.createSceneObject(GameCreator.globalObjects[object.name], newScene, object);
                GameCreator.referenceCounters(object);
            }
            GameCreator.scenes.push(newScene);
        }
        
        GameCreator.idCounter = parsedSave.idCounter;
        GameCreator.globalIdCounter = parsedSave.globalIdCounter;
        
        GameCreator.editScene(GameCreator.scenes[0]);
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
        GameCreator.invalidate(GameCreator.selectedObject);
        GameCreator.selectedObject.delete();
        GameCreator.unselectSceneObject();
        GameCreator.render();
    },

    saveSceneObject: function(formId, obj) {
        GameCreator.saveFormInputToObject(formId, obj);
        GameCreator.hideRoute();
        obj.update();
        GameCreator.render();
    },

    unselectSceneObject: function() {
        GameCreator.selectedObject = null;
        GameCreator.UI.unselectSceneObject();
    },

    hideRoute: function() {
        $(".routeNodeContainer").remove();
    },
    
    drawRoute: function(route) {
        GameCreator.hideRoute();
        var node;
        for(var i = 0; i < route.length; i++) {
            node = route[i];
            $("body").append(GameCreator.htmlStrings.routeNode(node, i));
        }
        $(".routeNode").on("mousedown", function(e) {
            GameCreator.draggedNode = this;
            return false;
        });
    },
    
    getClickedObjectEditing: function(x, y) {
        for (var i=GameCreator.renderableObjects.length - 1;i >= 0;--i) {
            var obj = GameCreator.renderableObjects[i];
            if(x >= obj.x && x <= obj.x + obj.displayWidth && y >= obj.y && y <= obj.y + obj.displayHeight)
            {
                obj.clickOffsetX = x - obj.x;
                obj.clickOffsetY = y - obj.y;
                return obj;
            }
        }
        return null;
    },
    addScene: function() {
        GameCreator.scenes.push([]);
        GameCreator.UI.setupSceneTabs(GameCreator.scenes);
    }
});