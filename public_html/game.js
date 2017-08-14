"use strict";

/* global kontra */

kontra.init(); // Initializing the Kontra library.

// Creating an enemy that randomly appears on-screen.

// The sprite for the enemy. A custom sprite.
function CustomRandomEnemySprite(properties) {
    properties.ttl = 500;
    properties.width = 32;
    properties.height = 32;
    properties.color = 'red';

    // Initialize the sprite.
    kontra.sprite.prototype.init.call(this, properties);
}
CustomRandomEnemySprite.prototype = Object.create(kontra.sprite.prototype);

// Creating custom functions for the custom random enemy sprite, such as shooting bullets.
CustomRandomEnemySprite.prototype.shootBullets = function () {
    // Use bullet pattern #2.
    for (let i = 0; i < 600; i++) {
        genericBulletPool.get({
            ttl: defaultGenericBullet.ttl,
            width: defaultGenericBullet.width,
            height: defaultGenericBullet.height,
            color: 'green',

            x: this.x,
            y: this.y,

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
    create: function () {
        return new CustomRandomEnemySprite({});
    },
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
                x: Math.floor(Math.random() * (Math.floor(kontra.canvas.width) - Math.ceil(-kontra.canvas.width))) + Math.ceil(-kontra.canvas.width),
                y: Math.floor(Math.random() * (Math.floor(kontra.canvas.height) - Math.ceil(-kontra.canvas.height))) + Math.ceil(-kontra.canvas.height),
                update: function () {
                    this.advance();
                    this.shootBullets();
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