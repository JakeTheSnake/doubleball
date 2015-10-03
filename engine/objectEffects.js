GameCreator.effects = {};

GameCreator.effects.destroyEffects = {
    'None': 'none',
    'FadeOut': 'FadeOut',
    'Shrink': 'Shrink',
    'RiseAndFade': 'RiseAndFade',
    'Explode': 'Explode'
};

GameCreator.effects.FadeOut = function(runtimeObj) {
    this.x = runtimeObj.attributes.x;
    this.y = runtimeObj.attributes.y;
    this.width = runtimeObj.attributes.width;
    this.height = runtimeObj.attributes.height;
    this.image = runtimeObj.getCurrentImage();
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
        try {
            context.drawImage(this.runtimeObj.getCurrentImage(), this.x, this.y, this.width, this.height);
        } catch (e) {
            console.log("Could not draw image for object: " + this.runtimeObj);
        }
        
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
        context.drawImage(this.runtimeObj.getCurrentImage(), this.runtimeObj.attributes.x, this.y, this.runtimeObj.attributes.width, this.runtimeObj.attributes.height);
        context.globalAlpha = 1.0;
        return true;
    }
    return false;
}

GameCreator.effects.Explode = function(runtimeObj) {
    this.runtimeObj = runtimeObj;
    this.fadeEffect = new GameCreator.effects.FadeOut(runtimeObj);
    this.growthEffect = new GameCreator.effects.Shrink(runtimeObj);
    this.growthEffect.shrinkTime = -200;
}

GameCreator.effects.Explode.prototype.update = function(deltaTime) {
    this.fadeEffect.update(deltaTime);
    this.growthEffect.update(deltaTime);
}

GameCreator.effects.Explode.prototype.draw = function(context) {
    if (this.fadeEffect.currentAlpha >= 0) {
        try {
            context.globalAlpha = this.fadeEffect.currentAlpha;
            context.drawImage(this.runtimeObj.getCurrentImage(), this.growthEffect.x, this.growthEffect.y, this.growthEffect.width, this.growthEffect.height);
            context.globalAlpha = 1.0;
        } catch (e) {
            console.log("Could not draw image for object: " + this.runtimeObj);
        }
        
        return true;
    }
    return false;
}