var game;
var config;

window.onload = function () {
    config = {
        type: Phaser.AUTO,
        parent: 'phaser-game',
        width: 800,
        height: 600,
        pixelArt: true,
        scene: [ MainScene ],
        physics: {
            default: 'arcade'
        }
    }
    game = new Phaser.Game(config);
}