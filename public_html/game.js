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
            damage: 100, // 0 to 100

            update: () => {
                if (this.sprite.isChosen) {
                    this.sprite.color = 'green';
                } else {
                    this.sprite.color = 'red';
                }
            },

            // Used for drawing the sprite's color based on its damage value.
            render: () => {
                this.sprite.draw(); // So we don't completely override the sprite's rendering function.

                if (!this.sprite.isChosen) {
                    this.sprite.context.fillStyle = 'rgb(' + Math.floor(255 - this.sprite.damage) 
                            + ',' + Math.floor(255 - this.sprite.damage)
                            + ',0)';
                    this.sprite.context.fillRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
                }
            }
        });
    }
}

// Sprites to represent player's chosen array index.
for (let i = 0; i < playingFieldArray.length; i++) {
    playingFieldArray[i] = new ExistenceBox((i + WIDTH_AND_HEIGHT) * i);
}

// Player's chosen box in the playing field. Initially random.
let chosenBox = Math.floor(Math.random() * (Math.floor(playingFieldArray.length) - Math.ceil(0))) + Math.ceil(0);
playingFieldArray[chosenBox].sprite.isChosen = true;

// Binding keys for the player to choice a box.
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