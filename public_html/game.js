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

// Create a recycling generic bullet particle that will be used by both player and enemies.
const genericBulletPool = kontra.pool({
    create: kontra.sprite,
    maxSize: 5000
});

// Generic bullet's default properties
const defaultGenericBullet = {
    ttl: 150, // would like 12 seconds for each bullet
    width: 4,
    height: 4,
    color: 'red'
};

// Game loop object
const mainGameLoop = kontra.gameLoop({
    /*
     * Used for controlling the game logic.
     */
    update: function () {
        randomEnemySprite.update();

        // Create a bullet pattern.
        for (let i = 0; i < 300; i++) {
            genericBulletPool.get({
                ttl: defaultGenericBullet.ttl,
                width: defaultGenericBullet.width,
                height: defaultGenericBullet.height,
                color: defaultGenericBullet.color,

                x: kontra.canvas.width / 2,
                y: kontra.canvas.height / 2,
                dx: 0,
                dy: 0,
                update: function () {
                    this.advance();
                    const theta = i / 50 * Math.PI * 16;
                    this.dx += Math.cos(theta) * 0.02;
                    this.dy += Math.sin(theta) * 0.02;
                }
            });
        }

        genericBulletPool.update();
    },

    /*
     * Used for rendering only, it seems.
     */
    render: function () {
        randomEnemySprite.render();

        genericBulletPool.render();
    }
});

// Start the game loop.
mainGameLoop.start();