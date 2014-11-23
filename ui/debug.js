/*global GameCreator, $*/
(function() {
    "use strict";
    GameCreator.debug = {

        framesCount: 0,
        renderTimeSum: 0,

        calculateDebugInfo: function(renderTime) {
            var numberOfRenderables = GameCreator.renderableObjects.length;
            var fps;
            GameCreator.debug.renderTimeSum += renderTime;
            GameCreator.debug.framesCount += 1;
            if (GameCreator.debug.framesCount >= 100) {
                GameCreator.debug.framesCount = 0;
                fps = parseInt(1000 / (GameCreator.debug.renderTimeSum / 100), 10);
                GameCreator.UI.showDebugInformation({numberOfRenderables: numberOfRenderables, fps: fps});
                GameCreator.debug.renderTimeSum = 0;
            }
        }
    };
}());