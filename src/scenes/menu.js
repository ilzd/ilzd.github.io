import Phaser from '../lib/phaser.js'
export default class MenuScene extends Phaser.Scene {
  constructor () {
    super('menu-scene')
  }

  preload () {
  }

  create () {
    this.scene.start('game-scene')
  }
}
