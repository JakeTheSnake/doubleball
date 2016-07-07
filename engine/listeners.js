GameCreator.listeners = {
    updateTouch: function(e) {
        window.onmousedown(e);
        GameCreator.touch.x = e.touches[0].clientX;
        GameCreator.touch.y = e.touches[0].clientY;
        GameCreator.touch.isActive = true;
    },

    mouseUp: function(e) {
        switch (e.which) {
            case 1:
                GameCreator.keys.pendingRelease.leftMouse = true;
                break;
            case 3:
                GameCreator.keys.pendingRelease.rightMouse = true;
                break;
            default:
                return;
        }
        if (!GameCreator.paused) {
            e.preventDefault();    
        }
    },

    touchEnd: function(e) {
        GameCreator.listeners.mouseUp(e);
        GameCreator.touch.isActive = false;
    },

    mouseDown: function(e) {
        switch (e.which) {
            case 1:
                GameCreator.keys.keyPressed.leftMouse = true;
                break;
            case 3:
                GameCreator.keys.keyPressed.rightMouse = true;
                break;
            default:
                return;
        }
        if (!GameCreator.paused) {
            e.preventDefault();    
        }
    },

    keyDown: function(e) {
        var key = e.keyCode || e.which;
        GameCreator.listeners.updateKeyPressedStatus(key, true);
        if (!GameCreator.paused) {
            e.preventDefault();    
        }
    },

    keyUp: function(e) {
        var key = e.keyCode || e.which;
        GameCreator.listeners.updateKeyPressedStatus(key, false);
        if (!GameCreator.paused) {
            e.preventDefault();    
        }
    },

    mouseMove: function(e) {
        GameCreator.keys.latestMouseX = e.pageX;
        GameCreator.keys.latestMouseY = e.pageY;
    },

    visibilityChange: function(e) {
        GameCreator.windowActive = !document.hidden;
        if (GameCreator.windowActive) {
            GameCreator.then = Date.now();
            GameCreator.gameLoop();
        }
    },

    updateKeyPressedStatus: function(keycode, status) {
        switch (keycode) {
            case 16:
                GameCreator.keys.keyPressed.shift = status;
                break;
            case 17:
                GameCreator.keys.keyPressed.ctrl = status;
                break;
            case 18:
                GameCreator.keys.keyPressed.alt = status;
                break;
            case 32:
                GameCreator.keys.keyPressed.space = status;
                break;
            case 65:
            case 37:
                GameCreator.keys.keyLeftPressed = status;
                break;
            case 87:
            case 38:
                GameCreator.keys.keyUpPressed = status;
                break;
            case 68:
            case 39:
                GameCreator.keys.keyRightPressed = status;
                break;
            case 83:
            case 40:
                GameCreator.keys.keyDownPressed = status;
                break;
            default:
                return;
        }
    }
}