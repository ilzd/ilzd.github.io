import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {
  constructor() {
    super('game')
  }

  preload() {
    // this.load.image('clothing_top_0_img', '/assets/clothing_top_0.png')
    // this.load.image('clothing_top_1_img', '/assets/clothing_top_1.png')
    // this.load.image('clothing_top_2_img', '/assets/clothing_top_2.png')
    // this.load.image('body_img', '/assets/body.png')
    // this.load.image('leg0_img', '/assets/leg0.png')
    // this.load.image('leg2_img', '/assets/leg2.png')
    // this.load.image('arm2_img', '/assets/arm2.png')
    // this.load.image('arm0_img', '/assets/arm0.png')


    this.load.spritesheet('clothing_top_0', '/assets/clothing_top_0.png', { frameWidth: 150, frameHeight: 220 })
    this.load.spritesheet('clothing_top_1', '/assets/clothing_top_1.png', { frameWidth: 150, frameHeight: 220 })
    this.load.spritesheet('clothing_top_2', '/assets/clothing_top_2.png', { frameWidth: 150, frameHeight: 220 })

    this.load.spritesheet('body', '/assets/body.png', { frameWidth: 150, frameHeight: 220 })
    this.load.spritesheet('leg0', '/assets/leg0.png', { frameWidth: 150, frameHeight: 220 })
    this.load.spritesheet('leg2', '/assets/leg2.png', { frameWidth: 150, frameHeight: 220 })
    this.load.spritesheet('arm2', '/assets/arm2.png', { frameWidth: 150, frameHeight: 220 })
    this.load.spritesheet('arm0', '/assets/arm0.png', { frameWidth: 150, frameHeight: 220 })

    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });
  }

  create() {
    const bg = this.add.rectangle(0, 0, 1100, 700, 0xCCCCCC)
      .setOrigin(0)
      .setStrokeStyle(10, 0x000000)

    this.animNames = [
      'Walk_NO',
      'Walk_N',
      'Walk_NE',
      'Walk_L',
      'Walk_SE'
    ]
    this.currAnimIndex = 3

    this.createColorPicker()

    this.createHUD()

    this.input.on('pointerup', () => {
      if (this.previourColor !== this.color) this.createVisualization()
    })
  }

  createColorPicker() {
    this.rexUI.add.colorPicker({
      x: 750, y: 300,
      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x424242),
      svPalette: {
        width: 400,
        height: 400
      },
      hPalette: {
        size: 16
      },
      space: {
        left: 10, right: 10, top: 10, bottom: 10,
        item: 10,
      },
      valuechangeCallback: (value) => {
        const pickerColor = new Phaser.Display.Color.IntegerToColor(value)
        const tintColor = new Phaser.Display.Color.RGBStringToColor(`rgb(${pickerColor.b},${pickerColor.g},${pickerColor.r})`)
        this.color = tintColor.color
        if (!this.previourColor) this.createVisualization()
      },
      value: 0xFFFFFF
    }).layout()
  }

  createHUD() {
    const exportText = this.add.text(750, 600, 'EXPORTAR', {
      backgroundColor: '#333333',
      color: '#FFFFFF',
      padding: 20
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.export()
      })
      .on('pointerover', () => {
        exportText.setBackgroundColor('#555555')
      })
      .on('pointerout', () => {
        exportText.setBackgroundColor('#333333')
      })

    const nextAnimText = this.add.text(400, 350, '>', {
      backgroundColor: '#333333',
      color: '#FFFFFF',
      padding: 20
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.currAnimIndex++
        if (this.currAnimIndex === this.animNames.length) this.currAnimIndex = 0
        this.createVisualization()
      })
      .on('pointerover', () => {
        nextAnimText.setBackgroundColor('#555555')
      })
      .on('pointerout', () => {
        nextAnimText.setBackgroundColor('#333333')
      })

    const prevAnimText = this.add.text(50, 350, '<', {
      backgroundColor: '#333333',
      color: '#FFFFFF',
      padding: 20
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.currAnimIndex--
        if (this.currAnimIndex === -1) this.currAnimIndex = this.animNames.length - 1
        this.createVisualization()
      })
      .on('pointerover', () => {
        prevAnimText.setBackgroundColor('#555555')
      })
      .on('pointerout', () => {
        prevAnimText.setBackgroundColor('#333333')
      })
  }

  createVisualization() {
    this.visualization?.destroy()

    this.previourColor = this.color
    const animName = this.animNames[this.currAnimIndex]

    const frames0 = this.anims.generateFrameNames('clothing_top_0')
    for (let i = 0; i < frames0.length; i++) {
      const renderTexture = this.add.renderTexture(0, 0, 150, 220)

      if (animName.indexOf('_SE') !== -1 || animName.indexOf('_NO') !== -1) {
        renderTexture.drawFrame('arm0', i)
        renderTexture.drawFrame('leg0', i)
        renderTexture.drawFrame('body', i)
        renderTexture.drawFrame('leg2', i)
        renderTexture.drawFrame('arm2', i)
        renderTexture.drawFrame('clothing_top_0', i, 0, 0, 1, this.color)
        renderTexture.drawFrame('clothing_top_1', i, 0, 0, 1, this.color)
        renderTexture.drawFrame('clothing_top_2', i, 0, 0, 1, this.color)
      } else {
        renderTexture.drawFrame('arm0', i)
        renderTexture.drawFrame('clothing_top_0', i, 0, 0, 1, this.color)
        renderTexture.drawFrame('leg0', i)
        renderTexture.drawFrame('body', i)
        renderTexture.drawFrame('clothing_top_1', i, 0, 0, 1, this.color)
        renderTexture.drawFrame('leg2', i)
        renderTexture.drawFrame('arm2', i)
        renderTexture.drawFrame('clothing_top_2', i, 0, 0, 1, this.color)
      }

      if (this.textures.exists(`frame${i}`)) this.textures.remove(`frame${i}`)
      renderTexture.saveTexture(`frame${i}`)
      renderTexture.destroy()
    }

    this.createAnimations()

    this.visualization = this.add.sprite(225, 350, 'frame0').play(animName).setOrigin(0.5).setScale(3)
  }

  generateFrames(prefix, start, end) {
    const frames = []
    for (let i = start; i <= end; i++) {
      frames.push({ key: `${prefix}${i}` })
    }
    return frames
  }

  export() {
    const img = this.make.image({ key: 'clothing_top_1', frame: '__BASE' }, false).setOrigin(0)
    const sprite = this.make.sprite({ key: 'frame0', frame: '__BASE' }, false).setOrigin(0).setScale(4)

    const poseTexture = this.add.renderTexture(0, 0, sprite.width, sprite.height).setVisible(false).setScale(4) 
    poseTexture.drawFrame('arm0', 64)
    poseTexture.drawFrame('clothing_top_0', 64, 0, 0, 1, this.color)
    poseTexture.drawFrame('leg0', 64)
    poseTexture.drawFrame('body', 64)
    poseTexture.drawFrame('clothing_top_1', 64, 0, 0, 1, this.color)
    poseTexture.drawFrame('leg2', 64)
    poseTexture.drawFrame('arm2', 64)
    poseTexture.drawFrame('clothing_top_2', 64, 0, 0, 1, this.color)
    if (this.textures.exists('poseTexture')) this.textures.remove('poseTexture')
    poseTexture.saveTexture('poseTexture')
    
    const poseSprite = this.make.sprite({key: 'poseTexture'}, true).setScale(4).setOrigin(0)

    const exportTexture0 = this.add.renderTexture(0, 0, img.width, img.height).setVisible(false)
    const exportTexture1 = this.add.renderTexture(0, 0, img.width, img.height).setVisible(false)
    const exportTexture2 = this.add.renderTexture(0, 0, img.width, img.height).setVisible(false)
    const exportTexture3 = this.add.renderTexture(0, 0, img.width, img.height).setVisible(false)
    const exportTexture4 = this.add.renderTexture(0, 0, sprite.displayWidth, sprite.displayHeight).setVisible(false).setScale(4)

    exportTexture0.drawFrame('clothing_top_0', '__BASE', 0, 0, 1, this.color)
    exportTexture1.drawFrame('clothing_top_1', '__BASE', 0, 0, 1, this.color)
    exportTexture2.drawFrame('clothing_top_2', '__BASE', 0, 0, 1, this.color)

    exportTexture3.drawFrame('arm0', '__BASE')
    exportTexture3.drawFrame('clothing_top_0', '__BASE', 0, 0, 1, this.color)
    exportTexture3.drawFrame('leg0', '__BASE')
    exportTexture3.drawFrame('body', '__BASE')
    exportTexture3.drawFrame('clothing_top_1', '__BASE', 0, 0, 1, this.color)
    exportTexture3.drawFrame('leg2', '__BASE')
    exportTexture3.drawFrame('arm2', '__BASE')
    exportTexture3.drawFrame('clothing_top_2', '__BASE', 0, 0, 1, this.color)

    exportTexture4.draw(poseSprite)

    let exportCount = 0
    const exportResult = []

    const exportFunc = () => {
      if (exportCount === 3) {
        console.log(exportResult)
        this.scale.setGameSize(1100, 700)
      }
    }

    this.scale.setGameSize(img.width, img.height)

    exportTexture0.snapshot((image) => {
      exportCount++
      exportResult.push(image.src)
      exportFunc()
    })

    exportTexture1.snapshot((image) => {
      exportCount++
      exportResult.push(image.src)
      exportFunc()
    })

    exportTexture2.snapshot((image) => {
      exportCount++
      exportResult.push(image.src)
      exportFunc()
    })

    exportTexture3.snapshot((image) => {
      exportCount++
      exportResult.push(image.src)
      exportFunc()
    })

    exportTexture4.snapshot((image) => {
      exportCount++
      exportResult.push(image.src)
      exportFunc()
    })
  }

  createAnimations() {
    if (!this.spritesheetAnims) this.spritesheetAnims = []

    this.spritesheetAnims.forEach(anim => anim.destroy())
    this.spritesheetAnims.splice(0, this.spritesheetAnims.length)

    this.spritesheetAnims.push(
      this.anims.create({
        key: 'Walk_NO',
        frames: this.generateFrames('frame', 0, 7),
        duration: 1000,
        repeat: -1
      })
    )
    this.spritesheetAnims.push(
      this.anims.create({
        key: 'Walk_N',
        frames: this.generateFrames('frame', 8, 15),
        duration: 1000,
        repeat: -1
      })
    )
    this.spritesheetAnims.push(
      this.anims.create({
        key: 'Walk_NE',
        frames: this.generateFrames('frame', 16, 23),
        duration: 1000,
        repeat: -1
      })
    )
    this.spritesheetAnims.push(
      this.anims.create({
        key: 'Walk_L',
        frames: this.generateFrames('frame', 24, 31),
        duration: 1000,
        repeat: -1
      })
    )
    this.spritesheetAnims.push(
      this.anims.create({
        key: 'Walk_SE',
        frames: this.generateFrames('frame', 32, 39),
        duration: 1000,
        repeat: -1
      })
    )
  }

}