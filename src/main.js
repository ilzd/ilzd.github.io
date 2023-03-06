import Phaser from './lib/phaser.js'
import Game from './scenes/game.js'

export default new Phaser.Game({
  type: Phaser.WEBGL,
  width: 1100,
  height: 700,
  transparent: true,
  scene: [Game]
})