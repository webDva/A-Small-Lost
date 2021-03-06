"use strict";

/* global kontra */

kontra.init(); // Initializing the Kontra library.

// Setting the path for images
kontra.assets.imagePath = './assets/images';

// Load ghost image to function as sprite for boxes now.
let ghostImage = new Image();
ghostImage.src = './assets/images/ghost.png';

// Cat image too.
let catImage = new Image();
catImage.src = './assets/images/cat.png';

const WIDTH_AND_HEIGHT = 64;
let playingFieldArray;
let selector;
let selectedBox;
let gameChosenBoxes;
let winCounter = 0;

// Super-like class to function as elements in the playing field array.
class ExistenceBox {
    constructor(xPosition) {
        this.sprite = kontra.sprite({
            x: xPosition,
            y: kontra.canvas.height / 2,
            image: ghostImage,

            isTrapBox: false
        });
    }
}

// Function for creating new playing fields and initializing them.
const createNewPlayingField = function () {
    let newPlayingFieldArray = new Array(Math.floor(kontra.canvas.width / WIDTH_AND_HEIGHT));
    // Creating playing field boxes.
    for (let i = 0; i < newPlayingFieldArray.length; i++) {
        newPlayingFieldArray[i] = new ExistenceBox((1 + WIDTH_AND_HEIGHT) * i);
    }
    return newPlayingFieldArray;
};

// Arrow selector for selecting boxes.
class ArrowSelector {
    constructor(xPosition) {
        this.sprite = kontra.sprite({
            x: xPosition,
            y: (kontra.canvas.height / 2) + (WIDTH_AND_HEIGHT + 10),
            image: catImage,
            update: () => {
                // Change the selector's position to the selected box's position.
                this.sprite.x = playingFieldArray[selectedBox].sprite.x;
            }
        });
    }
}

// Randomly decides which boxes are traps.
const pickBoxes = function () {
    let newlyChosenBoxes = [];
    do {
        // Don't add duplicates and don't add more than the number of boxes in the playing field.
        const randomChoice = Math.floor(Math.random() * (Math.floor(playingFieldArray.length) - Math.ceil(0))) + Math.ceil(0);
        if (!newlyChosenBoxes.includes(randomChoice) || newlyChosenBoxes.length === playingFieldArray.length) {
            newlyChosenBoxes.push(randomChoice);
        }
        // Stop the loop based on a 50-50 chance.
    } while (Math.random() >= 0.5);
    for (let i = 0; i < newlyChosenBoxes.length; i++) {
        playingFieldArray[newlyChosenBoxes[i]].sprite.isTrapBox = true;
    }
    return newlyChosenBoxes;
};

// Will use this for restarting the game state when the player loses.
const startPlayingFieldAgain = function () {
    playingFieldArray = createNewPlayingField(); // Creating an array that will be used to contain boxes.    
    selector = new ArrowSelector(0); // Create box to represent a selector.
    gameChosenBoxes = pickBoxes(); // Chosen boxes in the playing field.    
    selectedBox = 0; // A player selected box, which is different from a game chosen box.

    // Binding keys for the player to choose a box.
    kontra.keys.bind(['a', 'left'], () => {
        if (selectedBox === 0) {
            selectedBox = playingFieldArray.length - 1;
        } else {
            selectedBox--;
        }
    });

    kontra.keys.bind(['d', 'right'], () => {
        if (selectedBox === playingFieldArray.length - 1) {
            selectedBox = 0;
        } else {
            selectedBox++;
        }
    });

    // key binding for destorying a box
    kontra.keys.bind(['enter', 'space'], () => {
        // If the player selects a trap box, enter a lose state.
        if (playingFieldArray[selectedBox].sprite.isTrapBox) {
            // enter lose state
            enterLoseState();
            // Otherwise, the player chose a safe box.    
        } else {
            if (selectedBox === playingFieldArray.length - 1) {
                playingFieldArray.pop();
                selectedBox = 0;
            } else {
                playingFieldArray.splice(selectedBox, 1);
            }
        }
    });
};

// Initializing game state on first run.
startPlayingFieldAgain();

// Used for entering a lose state.
const stopEverything = function () {
    // Disable playing state's keybinds.
    kontra.keys.unbind(['a', 'left', 'd', 'right', 'enter', 'space']);
};

// Handles losing.
const enterLoseState = function () {
    stopEverything();

    // Reset the player's win streak to zero.
    winCounter = 0;
    // Display losing visuals/graphics.

    startPlayingFieldAgain();
};

// Win state.
const enterWinState = function () {
    stopEverything();

    startPlayingFieldAgain();
};

// Setting how the font will be drawn
const fontHeight = 30;
kontra.context.font = fontHeight + 'px Comic Sans MS';
kontra.context.fillStyle = 'white';

// Game loop object
const mainGameLoop = kontra.gameLoop({
    /*
     * Used for controlling the game logic.
     */
    update: function () {
        // Let selector perform it's logic.
        selector.sprite.update();

        // Increment win counter if player destroyed all safe boxes and then change state.
        if (playingFieldArray.length === gameChosenBoxes.length) {
            winCounter++;
            enterWinState();
        }
    },

    /*
     * Used for rendering only.
     */
    render: function () {
        // Render the playing field.
        playingFieldArray.forEach((item) => {
            item.sprite.render();
        });

        // Render the selector.
        selector.sprite.render();

        // Render the player's win score.
        kontra.context.fillText("連勝: " + winCounter, 0, fontHeight); // Using Japanese to confuse the player.
    }
});

// Start the game loop.
mainGameLoop.start();