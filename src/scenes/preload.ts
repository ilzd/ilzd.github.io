import Phaser from 'phaser'
import MenuScene from './menu'

export default class PreloadScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'preload-scene'

  constructor () {
    super(PreloadScene.SCENE_KEY);
  }

  preload () {
    this.load.spritesheet('character', 'public/assets/animation.png', { frameWidth: 150, frameHeight: 220 })
    this.load.image('tileset', 'public/assets/tileset_grama.png')
    this.load.image('star', 'public/assets/star.png')
  }

  create () {
    this.scene.start(MenuScene.SCENE_KEY)
  }
}
