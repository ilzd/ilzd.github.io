import Phaser from '../lib/phaser.js'

export default class PreloadScene extends Phaser.Scene {
  

  constructor () {
    super('preload-scene');
  }

  preload () {
    this.load.spritesheet('character', '/assets/animation.png', { frameWidth: 150, frameHeight: 220 })
    this.load.image('tileset', '/assets/tileset_grama.png')
    this.load.image('star', '/assets/star.png')
  }

  create () {
    this.scene.start('menu-scene')
  }
}
