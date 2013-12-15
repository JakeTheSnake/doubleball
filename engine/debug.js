GameCreator.debug = {

	framesCount: 0,
	renderTimeSum: 0,

    calculateDebugInfo: function(renderTime){
        var numberOfRenderables = GameCreator.renderableObjects.length;
        GameCreator.debug.renderTimeSum += renderTime;
        GameCreator.debug.framesCount++;
        if(GameCreator.debug.framesCount >= 100) {
        	GameCreator.debug.framesCount = 0;
        	var fps = parseInt(1000 / (GameCreator.debug.renderTimeSum / 100));
        	GameCreator.UI.showDebugInformation({numberOfRenderables: numberOfRenderables, fps: fps});
        	GameCreator.debug.renderTimeSum = 0;
        }
    }
}