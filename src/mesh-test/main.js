import phaser from '../lib/phaser.js'
import Game from './scenes/game.js'

export default new Phaser.Game({
  type: Phaser.WEBGL,
  width: 2000,
  height: 2000,
  transparent: true,
  scene: [Game]
})