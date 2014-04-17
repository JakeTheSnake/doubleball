GameCreator.effects = {};

GameCreator.effects.destroyEffects = {"FadeOut": "FadeOut", "Shrink": "Shrink", "RiseAndFade": "RiseAndFade"};

GameCreator.effects.FadeOut = function(runtimeObj) {
    this.x = runtimeObj.x;
    this.y = runtimeObj.y;
    this.width = runtimeObj.width;
    this.height = runtimeObj.height;
    this.image = runtimeObj.parent.image;
    this.fadeOutTime = 200;
    this.currentAlpha = 1;
}

GameCreator.effects.FadeOut.prototype.update = function(deltaTime) {
    this.currentAlpha -= deltaTime / this.fadeOutTime;
}

GameCreator.effects.FadeOut.prototype.draw = function(context) {
    context.clearRect(this.x, this.y, this.width, this.height);
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
    this.x = runtimeObj.x;
    this.y = runtimeObj.y;
    this.width = runtimeObj.width;
    this.height = runtimeObj.height;
    this.shrinkTime = 200;
}

GameCreator.effects.Shrink.prototype.update = function(deltaTime) {
    this.deltaTime = deltaTime;
    var shrinkFactor = (deltaTime / this.shrinkTime);
    this.lastWidth = this.width;
    this.lastHeight = this.height;
    this.lastY = this.y;
    this.lastX = this.x;
    this.width -= this.runtimeObj.width * shrinkFactor;
    this.height -= this.runtimeObj.height * shrinkFactor;
    this.x = this.runtimeObj.x + (this.runtimeObj.width - this.width) / 2;
    this.y = this.runtimeObj.y + (this.runtimeObj.height - this.height) / 2;
}

GameCreator.effects.Shrink.prototype.draw = function(context) {
    context.clearRect(this.lastX - 0.5, this.lastY - 0.5, this.lastWidth + 1, this.lastHeight + 1);
    if (this.width >= 0 && this.height >= 0) {
        context.drawImage(this.runtimeObj.parent.image, this.x, this.y, this.width, this.height);
        return true;
    }
    return false;
}

GameCreator.effects.RiseAndFade = function(runtimeObj) {
    this.y = runtimeObj.y;
    this.runtimeObj = runtimeObj;
    this.effectTime = 400;
    this.currentAlpha = 1;
}

GameCreator.effects.RiseAndFade.prototype.update = function(deltaTime) {
    this.lastY = this.y;
    this.currentAlpha -= deltaTime / this.effectTime;
    this.y -= (deltaTime / this.effectTime) * this.runtimeObj.height * 3;
}

GameCreator.effects.RiseAndFade.prototype.draw = function(context) {
    context.clearRect(this.runtimeObj.x, this.lastY - 0.5, this.runtimeObj.width, this.runtimeObj.height + 1);
    if (this.currentAlpha >= 0) {
        context.globalAlpha = this.currentAlpha;
        context.drawImage(this.runtimeObj.parent.image, this.runtimeObj.x, this.y, this.runtimeObj.width, this.runtimeObj.height);
        context.globalAlpha = 1.0;
        return true;
    }
    return false;
}