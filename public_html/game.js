"use strict";

/* global kontra */

kontra.init(); // Initializing the Kontra library.

// Creating an enemy that randomly appears on-screen.

// The sprite for the enemy (its logic will be done elsewhere).
const randomEnemySprite = kontra.sprite({
    x: 300,
    y: 300,
    width: 32,
    height: 32,
    color: 'red'
});

// Game loop object
const mainGameLoop = kontra.gameLoop({
    /*
     * Used for controlling the game logic.
     */
    update: function() {
        randomEnemySprite.update();
    },
    
    /*
     * Used for rendering only, it seems.
     */
    render: function() {
        randomEnemySprite.render();
    }
});

// Start the game loop.
mainGameLoop.start();