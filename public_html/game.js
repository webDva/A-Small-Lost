"use strict";

/* global kontra */

kontra.init(); // Initializing the Kontra library.

const WIDTH_AND_HEIGHT = 64;
let playingFieldArray;
let selector;
let selectedBox;
let gameChosenBoxes;

// Super-like class to function as elements in the playing field array.
class ExistenceBox {
    constructor(xPosition) {
        this.sprite = kontra.sprite({
            x: xPosition,
            y: kontra.canvas.height / 2,
            color: 'red',
            width: WIDTH_AND_HEIGHT,
            height: WIDTH_AND_HEIGHT,

            isChosen: false,

            update: () => {
                if (this.sprite.isChosen) {
                    this.sprite.color = 'green';
                } else {
                    this.sprite.color = 'red';
                }
            }
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
            color: 'white', // A white box for now--or, maybe, forever!
            width: WIDTH_AND_HEIGHT,
            height: WIDTH_AND_HEIGHT,
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
        playingFieldArray[newlyChosenBoxes[i]].sprite.isChosen = true;
    }
    return newlyChosenBoxes;
};

// Will use this for restarting the game state when the player loses.
const startPlayingFieldAgain = function () {
    playingFieldArray = createNewPlayingField(); // Creating an array that will be used to contain boxes.    
    selector = new ArrowSelector(0); // Create box to represent a selector.
    gameChosenBoxes = pickBoxes(); // Chosen boxes in the playing field.    
    selectedBox = 0; // A player selected box, which is different from a game chosen box.
};

startPlayingFieldAgain();

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
    if (playingFieldArray[selectedBox].sprite.isChosen) {
        // enter lose state
        startPlayingFieldAgain();
    } else if (selectedBox === playingFieldArray.length - 1) {
        playingFieldArray.pop();
        selectedBox = 0;
    } else {
        playingFieldArray.splice(selectedBox, 1);
    }
});

// Game loop object
const mainGameLoop = kontra.gameLoop({
    /*
     * Used for controlling the game logic.
     */
    update: function () {
        // Perform the playing field's logic.
        playingFieldArray.forEach((item) => {
            item.sprite.update();
        });

        // Let selector perform it's logic.
        selector.sprite.update();
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
    }
});

// Start the game loop.
mainGameLoop.start();