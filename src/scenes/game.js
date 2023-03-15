import Phaser from '../lib/phaser.js'
import { cartToIso } from '../utils/math.js'

export default class GameScene extends Phaser.Scene {

  constructor() {
    super('game-scene')

    this.mapData = {
      width: 5,
      height: 5,
      start: { x: 0, y: 0 },
      end: { x: 4, y: 4 },
      path: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 4, y: 4 },
      ]
    }

    this.TILE_SIZE = 64
    this.TILE_ISO_WIDTH = 128
    this.TILE_ISO_HEIGHT = 64
    this.TILE_ISO_VISUAL_HEIGHT = 96

    this.dirs = [
      { name: 'N', coords: { x: 0, y: -1 } },
      { name: 'L', coords: { x: 1, y: 0 } },
      { name: 'S', coords: { x: 0, y: 1 } },
      { name: 'O', coords: { x: -1, y: 0 } }
    ]
    this.character
    this.mapPos = { x: 0, y: 0 }
    this.pathPos = 0
    this.lastAnim
    this.walking = false
    this.dist = 0
    this.moveSpeed = 100
    this.selectedDir = 1
    this.userPath = []
    this.arrows
    this.pathArrows
    this.running = false
  }

  preload() {
  }

  create() {
    this.buildTilemap()
    this.createGrid()
    this.buildReward()
    this.buildAnimations()
    this.buildCharacter()
    // this.buildInterface()

    this.updateCamera()
    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      this.updateCamera()
    })

    window.phaserClear = () => this.clearPath()
    window.phaserWalk = () => this.walk()
    window.phaserRight = () => this.turnRight()
    window.phaserLeft = () => this.turnLeft()
    window.phaserRun = () => this.run()
  }

  update(time, delta) {
    const deltaTime = delta / 1000.0
    if (this.walking) {
      const dir = this.userPath[this.pathPos]
      const speed = new Phaser.Math.Vector2(dir.coords.x * this.moveSpeed * deltaTime, dir.coords.y * this.moveSpeed * deltaTime)
      const frameDist = speed.length()
      const isoSpeed = cartToIso(speed.x, speed.y)
      this.dist += frameDist
      this.character.x += isoSpeed.x
      this.character.y += isoSpeed.y

      if (this.dist >= this.TILE_SIZE) {
        this.dist = 0
        this.mapPos.x += dir.coords.x
        this.mapPos.y += dir.coords.y
        if (!this.mapPosIsValid() || this.pathPos === this.userPath.length - 1) {
          this.reset()
        } else if (this.checkIfWon()) {
          this.reset()
        } else {
          this.pathPos++
          const dir = this.userPath[this.pathPos]
          this.playAnimation(`Walk_${dir.name}`)
        }
      }
    }
  }

  updateCamera() {
    const wRatio = this.scale.gameSize.width / 640
    const hRatio = this.scale.gameSize.height / 640
    const ration = Math.min(wRatio, hRatio)
    this.cameras.main.centerOn(0, 140)
    this.cameras.main.setZoom(ration)
  }

  turnRight() {
    if(this.running) return
    this.selectedDir++
    if (this.selectedDir === this.dirs.length) his.selectedDir = 0
  }

  turnLeft() {
    if(this.running) return
    this.selectedDir--
    if (this.selectedDir === -1) this.selectedDir = this.dirs.length - 1
  }

  walk() {
    if (this.running) return
    this.addToPath(this.dirs[this.selectedDir])
  }

  reset() {
    this.walking = false
    this.running = false
    this.pathPos = 0
    this.selectedDir = 1
    this.buildCharacter()
  }

  buildReward() {
    const endPos = this.mapData.end
    this.mapPos.x = endPos.x
    this.mapPos.y = endPos.y
    const cartPos = this.tileCenter(endPos.x, endPos.y)
    const isoPos = cartToIso(cartPos.x, cartPos.y)
    const star = this.add.image(isoPos.x, isoPos.y, 'star').setScale(0.05)

    this.tweens.add({
      targets: star,
      scale: 0.03,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
  }

  createGrid() {
    const grid = this.add.graphics({
      lineStyle: { color: 0xFFFFFF, alpha: 0.3, width: 1 }
    })

    const maxWidth = this.mapData.width * this.TILE_ISO_WIDTH / 2
    const maxHeight = this.mapData.height * this.TILE_ISO_HEIGHT

    grid.beginPath()
    for (let i = 0; i <= this.mapData.width; i++) {
      const posX = i * this.TILE_ISO_WIDTH / 2
      const pt1 = cartToIso(posX, 0)
      const pt2 = cartToIso(posX, maxHeight)

      grid
        .moveTo(pt1.x, pt1.y)
        .lineTo(pt2.x, pt2.y)
    }
    for (let i = 0; i <= this.mapData.width; i++) {
      const posY = i * this.TILE_ISO_HEIGHT
      const pt1 = cartToIso(0, posY)
      const pt2 = cartToIso(maxWidth, posY)

      grid
        .moveTo(pt1.x, pt1.y)
        .lineTo(pt2.x, pt2.y)
    }
    grid
      .closePath()
      .stroke()
  }

  checkIfWon() {
    return this.mapPos.x === this.mapData.end.x && this.mapPos.y === this.mapData.end.y
  }

  mapPosIsValid() {
    const tile = this.mapData.path.find(pathTile => {
      return pathTile.x === this.mapPos.x && pathTile.y === this.mapPos.y
    })

    return tile !== undefined
  }

  addToPath(dir) {
    if (this.running) return
    this.userPath.push(dir)
    // this.buildPathArrows()
  }

  clearPath() {
    if (this.running) return
    this.userPath = []
    // this.buildPathArrows()
  }

  eraseLast() {
    if (this.running) return
    if (!this.userPath.length) return
    this.userPath.splice(this.userPath.length - 1, 1)
    this.buildPathArrows()
  }

  buildInterface() {
    this.buildArrows()
    this.buildButtons()
  }

  buildButtons() {
    const clearButton = this.add.text(100, this.scale.gameSize.height * 0.5, 'LIMPAR', {
      color: '#FF0000',
      backgroundColor: '#FFFFFF',
      padding: 10,
      fontSize: 32
    })
      .setScrollFactor(0)
      .setInteractive()
      .setOrigin(0)
      .on('pointerdown', () => {
        this.clearPath()
      })
      .on('pointerover', () => {
        clearButton.setBackgroundColor('#AAAAAA')
      })
      .on('pointerout', () => {
        clearButton.setBackgroundColor('#FFFFFF')
      })

    const eraseButton = this.add.text(40, this.scale.gameSize.height * 0.5, '<', {
      color: '#FF0000',
      backgroundColor: '#FFFFFF',
      padding: 10,
      fontSize: 32
    })
      .setScrollFactor(0)
      .setInteractive()
      .setOrigin(0)
      .on('pointerdown', () => {
        this.eraseLast()
      })
      .on('pointerover', () => {
        eraseButton.setBackgroundColor('#AAAAAA')
      })
      .on('pointerout', () => {
        eraseButton.setBackgroundColor('#FFFFFF')
      })

    const runButton = this.add.text(400, this.scale.gameSize.height * 0.85, 'EXECUTAR', {
      color: '#FF0000',
      backgroundColor: '#FFFFFF',
      padding: 15,
      fontSize: 50
    })
      .setScrollFactor(0)
      .setInteractive()
      .setOrigin(0)
      .on('pointerdown', () => {
        this.run()
      })
      .on('pointerover', () => {
        runButton.setBackgroundColor('#AAAAAA')
      })
      .on('pointerout', () => {
        runButton.setBackgroundColor('#FFFFFF')
      })
  }

  run() {
    if (this.running || !this.userPath.length) return

    this.running = true
    this.walking = true

    const dir = this.userPath[this.pathPos]
    this.playAnimation(`Walk_${dir.name}`)
  }

  buildArrows() {
    this.arrows?.destroy(true, true)

    this.arrows = this.add.group()
    this.dirs.forEach((dir) => {
      const arrow = this.add.text(0, this.scale.gameSize.height * 0.85, dir.name, {
        color: '#FF0000',
        backgroundColor: '#FFFFFF',
        padding: 15,
        fontSize: 50
      })
        .setOrigin(0)
        .setScrollFactor(0)
        .setInteractive()
        .on('pointerdown', () => {
          this.addToPath(dir)
        })
        .on('pointerover', () => {
          arrow.setBackgroundColor('#AAAAAA')
        })
        .on('pointerout', () => {
          arrow.setBackgroundColor('#FFFFFF')
        })

      this.arrows.add(arrow)
    })

    Phaser.Actions.SetX(this.arrows.getChildren(), 40, 80)
  }

  buildPathArrows() {
    this.pathArrows?.destroy(true, true)

    this.pathArrows = this.add.group()
    this.userPath.forEach((dir) => {
      const arrow = this.add.text(0, this.scale.gameSize.height * 0.7, dir.name, {
        color: '#FFFFFF',
        backgroundColor: '#333333',
        padding: 15,
        fontSize: 50
      })
        .setScrollFactor(0)
        .setOrigin(0)

      this.pathArrows.add(arrow)
    })

    Phaser.Actions.SetX(this.pathArrows.getChildren(), 40, 80)
  }

  buildCharacter() {
    this.character?.destroy()
    const startPos = this.mapData.start
    this.mapPos.x = startPos.x
    this.mapPos.y = startPos.y
    const cartPos = this.tileCenter(startPos.x, startPos.y)
    const isoPos = cartToIso(cartPos.x, cartPos.y)
    this.character = this.add.sprite(isoPos.x, isoPos.y, 'character')
      .setOrigin(0.5, 0.83)

    this.playAnimation('Idle_L')
  }

  tileCenter(x, y) {
    return { x: x * this.TILE_SIZE + this.TILE_SIZE / 2, y: y * this.TILE_SIZE + this.TILE_SIZE / 2 }
  }

  playAnimation(animName) {
    if (animName === this.lastAnim) return
    this.lastAnim = animName

    this.character.play(animName)

    this.character.flipX = animName.indexOf('_S') !== -1 || animName.indexOf('_O') !== -1
  }

  buildAnimations() {
    this.anims.create({
      key: 'Walk_N',
      frames: this.anims.generateFrameNames('character', { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'Walk_L',
      frames: this.anims.generateFrameNames('character', { start: 24, end: 31 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'Walk_S',
      frames: this.anims.generateFrameNames('character', { start: 24, end: 31 }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'Walk_O',
      frames: this.anims.generateFrameNames('character', { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1
    })

    this.anims.create({
      key: 'Idle_N',
      frames: this.anims.generateFrameNames('character', { start: 48, end: 55 }),
      yoyo: true,
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'Idle_L',
      frames: this.anims.generateFrameNames('character', { start: 64, end: 71 }),
      frameRate: 8,
      yoyo: true,
      repeat: -1
    })
    this.anims.create({
      key: 'Idle_S',
      frames: this.anims.generateFrameNames('character', { start: 64, end: 71 }),
      yoyo: true,
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'Idle_O',
      frames: this.anims.generateFrameNames('character', { start: 48, end: 55 }),
      yoyo: true,
      frameRate: 8,
      repeat: -1
    })
  }

  buildTilemap() {
    const mapData = new Phaser.Tilemaps.MapData({
      width: this.mapData.width,
      height: this.mapData.height,
      tileWidth: this.TILE_ISO_WIDTH,
      tileHeight: this.TILE_ISO_HEIGHT,
      // @ts-expect-error
      orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
      version: 1
    })

    const tilemap = new Phaser.Tilemaps.Tilemap(this, mapData)

    const tileset = tilemap.addTilesetImage('tileset', 'tileset', this.TILE_ISO_WIDTH, this.TILE_ISO_VISUAL_HEIGHT)

    const layer = tilemap.createBlankLayer('layer', tileset, -this.TILE_ISO_WIDTH / 2, -16)
    tilemap.setLayerTileSize(this.TILE_ISO_WIDTH, this.TILE_ISO_VISUAL_HEIGHT, layer)

    this.mapData.path.forEach(tile => {
      layer.putTileAt(Phaser.Math.Between(0, 9), tile.x, tile.y)
    })
  }
}
