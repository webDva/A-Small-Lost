"use strict";

/* global kontra */

kontra.init(); // Initializing the Kontra library.

// Creating an array that will be used to contain existence boxes.
let playingFieldArray = new Array(5);

const WIDTH_AND_HEIGHT = 64;

// Super-like class to function as elements in the playing field array.
class ExistenceBox {
    constructor(xPosition) {
        this.x = xPosition;
        this.y = kontra.canvas.height / 2;
        this.color = 'red';
        this.width = WIDTH_AND_HEIGHT;
        this.height = WIDTH_AND_HEIGHT;
        
        this.sprite = kontra.sprite({
            x: this.x,
            y: this.y,
            color: this.color,
            width: this.width,
            height: this.height
        });
    }
}

// Sprites to represent player's chosen array index.
for (let i = 0; i < playingFieldArray.length; i++) {
    playingFieldArray[i] = new ExistenceBox((i + WIDTH_AND_HEIGHT) * i);
}

// Game loop object
const mainGameLoop = kontra.gameLoop({
    /*
     * Used for controlling the game logic.
     */
    update: function () {
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