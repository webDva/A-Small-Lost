"use strict";

/* global kontra */

kontra.init(); // Initializing the Kontra library.

// Creating an enemy that randomly appears on-screen.

// Default random enemy sprite.
const randomEnemySprite = {
    ttl: 500,
    width: 32,
    height: 32,
    color: 'red',

    x: Math.floor(Math.random() * (Math.floor(kontra.canvas.width) - Math.ceil(0))) + Math.ceil(0),
    y: Math.floor(Math.random() * (Math.floor(kontra.canvas.height) - Math.ceil(0))) + Math.ceil(0)
};

// Spawns bullets for random enemies.
var shootBullets = function (enemyX, enemyY) {
    // Use bullet pattern #2.
    for (let i = 0; i < 600; i++) {
        genericBulletPool.get({
            ttl: defaultGenericBullet.ttl,
            width: defaultGenericBullet.width,
            height: defaultGenericBullet.height,
            color: 'green',

            x: enemyX,
            y: enemyY,

            theta: i,
            update: function () {
                this.advance();
                this.theta += i / 360 * Math.PI;
                this.dx += Math.cos(this.theta) * 0.3;
                this.dy += Math.sin(this.theta) * 0.3;
            }
        });
    }
};

// Create an object pool for the random enemy sprite
const randomEnemyPool = kontra.pool({
    create: kontra.sprite,
    maxSize: 9000
});

// Create a recycling generic bullet particle that will be used by both player and enemies.
const genericBulletPool = kontra.pool({
    create: kontra.sprite,
    maxSize: 9000
});

// Generic bullet's default properties
const defaultGenericBullet = {
    ttl: 390, // would like 6.5 seconds for each bullet
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
        // Generate random enemies.
        for (let i = 0; i < 20; i++) {
            randomEnemyPool.get({
                x: Math.floor(Math.random() * (Math.floor(kontra.canvas.width) - Math.ceil(0))) + Math.ceil(0),
                y: Math.floor(Math.random() * (Math.floor(kontra.canvas.height) - Math.ceil(0))) + Math.ceil(0),
                update: function () {
                    this.advance();
                    shootBullets(this.x, this.y);
                }
            });
        }

        randomEnemyPool.update();
        genericBulletPool.update();
    },

    /*
     * Used for rendering only, it seems.
     */
    render: function () {
        randomEnemyPool.render();
        genericBulletPool.render();
    }
});

// Start the game loop.
mainGameLoop.start();