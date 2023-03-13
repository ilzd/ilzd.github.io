import Phaser from 'phaser';
import GameScene from './scenes/game';
import MenuScene from './scenes/menu';
import PreloadScene from './scenes/preload';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: 0x66AAFF,
  width: 1366,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [PreloadScene, MenuScene, GameScene]
});
