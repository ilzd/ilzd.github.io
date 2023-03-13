import Phaser from 'phaser'
import GameScene from './game'

export default class MenuScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'menu-scene'

  constructor () {
    super(MenuScene.SCENE_KEY)
  }

  preload () {
  }

  create () {
    this.scene.start(GameScene.SCENE_KEY)
  }
}
