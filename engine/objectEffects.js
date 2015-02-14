GameCreator.effects = {};

GameCreator.effects.destroyEffects = {'None': '', 'FadeOut': 'FadeOut', 'Shrink': 'Shrink', 'RiseAndFade': 'RiseAndFade'};

GameCreator.effects.FadeOut = function(runtimeObj) {
    this.x = runtimeObj.attributes.x;
    this.y = runtimeObj.attributes.y;
    this.width = runtimeObj.attributes.width;
    this.height = runtimeObj.attributes.height;
    this.image = runtimeObj.getCurrentState().attributes.image;
    this.fadeOutTime = 200;
    this.currentAlpha = 1;
}

GameCreator.effects.FadeOut.prototype.update = function(deltaTime) {
    GameCreator.mainContext.clearRect(this.x, this.y, this.width, this.height);
    this.currentAlpha -= deltaTime / this.fadeOutTime;
}

GameCreator.effects.FadeOut.prototype.draw = function(context) {
    if (this.currentAlpha >= 0.0) {
        context.globalAlpha = this.currentAlpha;
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.globalAlpha = 1.0;
        return true;
    }
    return false;
}

GameCreator.effects.Shrink = function(runtimeObj) {
    this.runtimeObj = runtimeObj;
    this.x = runtimeObj.attributes.x;
    this.y = runtimeObj.attributes.y;
    this.width = runtimeObj.attributes.width;
    this.height = runtimeObj.attributes.height;
    this.shrinkTime = 200;
}

GameCreator.effects.Shrink.prototype.update = function(deltaTime) {
    GameCreator.mainContext.clearRect(this.x - 0.5, this.y - 0.5, this.width + 1, this.height + 1);
    this.deltaTime = deltaTime;
    var shrinkFactor = (deltaTime / this.shrinkTime);
    this.width -= this.runtimeObj.attributes.width * shrinkFactor;
    this.height -= this.runtimeObj.attributes.height * shrinkFactor;
    this.x = this.runtimeObj.attributes.x + (this.runtimeObj.attributes.width - this.width) / 2;
    this.y = this.runtimeObj.attributes.y + (this.runtimeObj.attributes.height - this.height) / 2;
}

GameCreator.effects.Shrink.prototype.draw = function(context) {
    if (this.width >= 0 && this.height >= 0) {
        context.drawImage(this.runtimeObj.getCurrentState().attributes.image, this.x, this.y, this.width, this.height);
        return true;
    }
    return false;
}

GameCreator.effects.RiseAndFade = function(runtimeObj) {
    this.y = runtimeObj.attributes.y;
    this.runtimeObj = runtimeObj;
    this.effectTime = 400;
    this.currentAlpha = 1;
}

GameCreator.effects.RiseAndFade.prototype.update = function(deltaTime) {
    GameCreator.mainContext.clearRect(this.runtimeObj.attributes.x, this.y - 0.5, this.runtimeObj.attributes.width, this.runtimeObj.attributes.height + 1);
    this.currentAlpha -= deltaTime / this.effectTime;
    this.y -= (deltaTime / this.effectTime) * this.runtimeObj.attributes.height * 3;
}

GameCreator.effects.RiseAndFade.prototype.draw = function(context) {
    if (this.currentAlpha >= 0) {
        context.globalAlpha = this.currentAlpha;
        context.drawImage(this.runtimeObj.getCurrentState().attributes.image, this.runtimeObj.attributes.x, this.y, this.runtimeObj.attributes.width, this.runtimeObj.attributes.height);
        context.globalAlpha = 1.0;
        return true;
    }
    return false;
}