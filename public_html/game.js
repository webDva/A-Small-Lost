"use strict";

/* global kontra */

kontra.init(); // Initializing the Kontra library.

// Creating an array that will be used to contain existence boxes.
let playingFieldArray = new Array(5);

const WIDTH_AND_HEIGHT = 64;

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

// Creating playing field boxes.
for (let i = 0; i < playingFieldArray.length; i++) {
    playingFieldArray[i] = new ExistenceBox((1 + WIDTH_AND_HEIGHT) * i);
}

// Create box to represent a selector.
let selector = new ArrowSelector(0);

// Chosen box in the playing field. Initially random.
let gameChosenBox = Math.floor(Math.random() * (Math.floor(playingFieldArray.length) - Math.ceil(0))) + Math.ceil(0);
playingFieldArray[gameChosenBox].sprite.isChosen = true;

// A player selected box, which is different from a game chosen box.
let selectedBox = 0;

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
    if (selectedBox === playingFieldArray.length - 1) {
        playingFieldArray.pop();
        selectedBox = 0;
    } else {
        playingFieldArray.splice(selectedBox, 1);
    }
});

// 

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