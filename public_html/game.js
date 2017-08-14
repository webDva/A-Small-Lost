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
            height: WIDTH_AND_HEIGHT
        });
    }
}

// Sprites to represent player's chosen array index.
for (let i = 0; i < playingFieldArray.length; i++) {
    playingFieldArray[i] = new ExistenceBox((i + WIDTH_AND_HEIGHT) * i);
}

// Player's chosen box in the playing field. Initially random.
let chosenBox = Math.floor(Math.random() * (Math.floor(playingFieldArray.length) - Math.ceil(0))) + Math.ceil(0);
playingFieldArray[chosenBox].sprite.color = 'green';

// Game loop object
const mainGameLoop = kontra.gameLoop({
    /*
     * Used for controlling the game logic.
     */
    update: function () {
        // Why update the sprites that don't do anything? Can this be removed?
        playingFieldArray.forEach((item) => {
            item.sprite.update();
        });
    },

    /*
     * Used for rendering only.
     */
    render: function () {
        playingFieldArray.forEach((item) => {
            item.sprite.render();
        });
    }
});

// Start the game loop.
mainGameLoop.start();