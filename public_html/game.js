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
            height: WIDTH_AND_HEIGHT
        });
    }
}

// Sprites to represent player's chosen array index.
for (let i = 0; i < playingFieldArray.length; i++) {
    playingFieldArray[i] = new ExistenceBox((i + WIDTH_AND_HEIGHT) * i);
}

// Create box to represent a selector.
let selector = new ArrowSelector(0);

// Player's chosen box in the playing field. Initially random.
let chosenBox = Math.floor(Math.random() * (Math.floor(playingFieldArray.length) - Math.ceil(0))) + Math.ceil(0);
playingFieldArray[chosenBox].sprite.isChosen = true;

// Binding keys for the player to choose a box.
kontra.keys.bind(['a', 'left'], () => {
    playingFieldArray[chosenBox].sprite.isChosen = false;
    if (chosenBox === 0) {
        chosenBox = playingFieldArray.length - 1;
    } else {
        chosenBox--;
    }
    playingFieldArray[chosenBox].sprite.isChosen = true;
});

kontra.keys.bind(['d', 'right'], () => {
    playingFieldArray[chosenBox].sprite.isChosen = false;
    if (chosenBox === playingFieldArray.length - 1) {
        chosenBox = 0;
    } else {
        chosenBox++;
    }
    playingFieldArray[chosenBox].sprite.isChosen = true;
});

// key binding for destorying a box
kontra.keys.bind(['enter', 'space'], () => {
    playingFieldArray[chosenBox].sprite.isChosen = false;
    if (chosenBox === playingFieldArray.length - 1) {
        playingFieldArray.pop(); 
        chosenBox = 0;
    } else {
        playingFieldArray.splice(chosenBox, 1);
    }
    playingFieldArray[chosenBox].sprite.isChosen = true;
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