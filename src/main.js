import Phaser from './lib/phaser.js'
import GameScene from './scenes/game.js';
import MenuScene from './scenes/menu.js';
import PreloadScene from './scenes/preload.js';

export default new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: 0x66AAFF,
  width: 1366,
  height: 768,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [PreloadScene, MenuScene, GameScene]
});