(function(){
    var step = 0,
        steps = [
            {
                text: "Welcome to the Arcade Forge editor. If you'd like, I can take you on a short tour of the features of the editor to get you started."
            },
            {
                text: "This is the main game area. This is what the player playing the game will see, and where all the action happens.",
                elementId: "canvas-container"
            },
            {
                text: "This is a list of all the objects in your game. Here you can add new objects and edit existing objects.",
                elementId: "library"
            },
            {
                text: "Here all the scenes in your game are listed. A scene can be thought of as a level in your game, or perhaps an intro or game over screen.",
                elementId: "scenes"
            },
            {
                text: "The properties of the currently selected object in the scene can be viewed here. If no object is selected you will instead see the properties of the scene itself.",
                elementId: "properties"
            },
            {
                text: "Save your game here. Often.",
                elementId: "save-game-button"
            },
            {
                text: "There are three modes in the editor. Edit, Direct and Play.",
                elementId: "edit-mode-buttons"
            },
            {
                text: "In Edit mode you can add new objects to the game and change the properties of already added objects.",
                elementId: "edit-game-button-label"
            },
            {
                text: "In Direct mode you create the rules of the game while playing it. The game will pause whenever something happens for the first time.",
                elementId: "direct-game-button-label"
            },
            {
                text: "Play mode shows you the game just as your players will see it.",
                elementId: "play-game-button-label"
            },
            {
                text: "Once you feel that your game is ready for the world, either make it unlisted to allow peple with a direct link to play, or published to make it public for everyone on Arcade Forge.",
                elementId: "published-buttons"
            },
            {
                text: "Enough talking. Lets make a game! I suggest you start by adding your first object.",
                elementId: "add-global-object-button"
            },
        ],
        tutorialDialogue,
        nextButton,
        skipButton,
        prevButton,
        doneButton,
        previousElement;

    GameCreator.setupTutorial = function() {
        tutorialDialogue = $('#tutorial-dialogue');
        tutorialOverlay = $('#tutorial-overlay');
        nextButton = tutorialDialogue.find('#tutorial-next-button');
        skipButton = tutorialDialogue.find('#tutorial-skip-button');
        prevButton = tutorialDialogue.find('#tutorial-prev-button');
        doneButton = tutorialDialogue.find('#tutorial-done-button');
        setupButtons();
    }

    GameCreator.launchTutorial = function() {
        step = 0;
        tutorialDialogue.show();
        tutorialOverlay.show();
        runCurrentStep();
    };

    var endTutorial = function() {
        tutorialDialogue.hide();
        tutorialOverlay.hide();
        previousElement.removeClass('tutorial-highlighted');
    }

    var runCurrentStep = function() {
        var stepConfig = steps[step];

        tutorialDialogue.find('#tutorial-content').html(stepConfig.text);
        setButtonVisibility();

        var currentElement = $('#' + stepConfig.elementId);

        currentElement.addClass('tutorial-highlighted');

        if (previousElement) {
            previousElement.removeClass('tutorial-highlighted');
        }

        tutorialOverlay.hide();
        tutorialOverlay.show(0)

        var position = calculateDialoguePosition(currentElement);

        tutorialDialogue.offset({
            left: position.x,
            top: position.y 
        });

        previousElement = currentElement;
    }

    var setButtonVisibility = function() {
        if(step === 0) {
            nextButton.show();
            skipButton.show();
            prevButton.hide();
            doneButton.hide();
        } else if (step === steps.length - 1) {
            nextButton.hide();
            skipButton.hide();
            prevButton.show();
            doneButton.show();
        } else {
            nextButton.show();
            skipButton.show();
            prevButton.show();
            doneButton.hide();
        }
    }

    var setupButtons = function() {
        nextButton.click(function(evt) {
            step += 1;
            runCurrentStep();
        }.bind(this));

        skipButton.click(function(evt) {
            step = steps.length -1;
            runCurrentStep();
        }.bind(this));

        prevButton.click(function(evt) {
            step -= 1;
            runCurrentStep();
        }.bind(this));

        doneButton.click(function(evt) {
            endTutorial();
        }.bind(this));
    }

    var calculateDialoguePosition = function(targetElement) {
        var dialogueWidth = tutorialDialogue.innerWidth(),
            dialogueHeight = tutorialDialogue.innerHeight() + 60,
            targetX, targetY;

        if (targetElement[0]) {
            var onLeftHalf, onTopHalf, elementX, elementY;
            elementX = targetElement.offset().left;
            elementY = targetElement.offset().top;
            onLeftHalf = elementX < window.innerWidth / 2;
            onTopHalf = elementY < window.innerHeight / 2;
            targetX = elementX + (onLeftHalf ? ((targetElement[0].width || targetElement.width()) + 10) : -(dialogueWidth + 20));
            targetY = elementY + (onTopHalf ? 0 : -dialogueHeight);
        } else {
            targetX = window.innerWidth / 2 - dialogueWidth / 2;
            targetY = window.innerHeight / 2 - dialogueHeight / 2;
        }

        //Make sure dialogue is inside window.
        targetX = Math.min(targetX, window.innerWidth - dialogueWidth - 10);
        targetY = Math.min(targetY, window.innerHeight - dialogueHeight - 10);

        return {
            x: targetX,
            y: targetY
        }
    }
}());