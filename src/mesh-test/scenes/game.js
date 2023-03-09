import Phaser from '../../lib/phaser.js'

export default class Game extends Phaser.Scene {
  constructor() {
    super('game')
  }

  preload() {
    this.load.spritesheet('shirt', '/assets/clothing_top_1.png', { frameWidth: 150, frameHeight: 220 })
    this.load.image('tree', '/assets/arvore.png')
  }

  create() {
    const bg = this.add.rectangle(0, 0, 1250, 700, 0xDDDDDD, 0.5)
      .setOrigin(0)
      .setStrokeStyle(10, 0x000000)

    this.createShirts()

    this.stamp = this.make.image({ key: 'tree' }, false).setScale(0.35).setOrigin(0)

    this.gr1 = this.add.graphics()
    this.gr2 = this.add.graphics()
    this.debug = this.add.graphics().lineStyle(1, 0x000000)

    this.topLabel = this.add.text(195, 130, 'FRONTAL', {
      color: 0x444444,
      fontSize: 22
    })
      .setOrigin(0.5)

    this.clearTopText = this.add.text(195, 310, 'LIMPAR', {
      backgroundColor: 0x333333,
      padding: 15
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.resetTopGraphics()
      })

    this.bottomLabel = this.add.text(195, 380, 'TRASEIRO', {
      color: 0x444444,
      fontSize: 22
    })
      .setOrigin(0.5)

    this.clearBottomText = this.add.text(195, 560, 'LIMPAR', {
      backgroundColor: 0x333333,
      padding: 15
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.resetBottomGraphics()
      })

    this.lastPoint = new Phaser.Math.Vector2(0, 0)

    this.createCanvas()

    this.createTopMesh()
    this.createBottomMesh()

    this.resetTopGraphics()
    this.resetBottomGraphics()
  }

  createShirts() {
    this.shirtSE = this.add.sprite(603, 230, 'shirt', 32).setScale(5)
    this.shirtL = this.add.sprite(820, 240, 'shirt', 64).setScale(5)
    this.shirtL = this.add.sprite(1020, 240, 'shirt', 16).setScale(5)

    this.shirtNO = this.add.sprite(723, 510, 'shirt', 0).setScale(5)
    this.shirtN = this.add.sprite(960, 510, 'shirt', 8).setScale(5)
  }

  createTopMesh() {
    this.meshSE = this.add.mesh(595, 215)
    let mesh = this.meshSE
    Phaser.Geom.Mesh.GenerateGridVerts({
      mesh,
      widthSegments: 6,
      flipY: true,
      width: 123,
      height: 123
    });
    this.meshSE.vertices.forEach(vertex => {
      const distFromCenter = 61.5 - Math.abs(vertex.x)
      vertex.z = Math.pow(distFromCenter, 0.8)
      vertex.y -= Math.pow(distFromCenter, 0.5)
    })
    this.meshSE.modelRotation.x += 0.1
    this.meshSE.panZ(300)
    // this.meshSE.setDebug(this.debug)

    this.meshL = this.add.mesh(845, 215)
    mesh = this.meshL
    Phaser.Geom.Mesh.GenerateGridVerts({
      mesh,
      widthSegments: 6,
      flipY: true,
      width: 123,
      height: 123
    });
    this.meshL.vertices.forEach(vertex => {
      const distFromCenter = 61.5 - Math.abs(vertex.x)
      vertex.z = Math.pow(distFromCenter, 0.8)
      vertex.y -= Math.pow(distFromCenter, 0.5)
    })
    this.meshL.panZ(300)
    this.meshL.modelRotation.y += 0.6
    // this.meshL.setDebug(this.debug)

    this.meshNE = this.add.mesh(1070, 210)
    mesh = this.meshNE
    const grid2 = Phaser.Geom.Mesh.GenerateGridVerts({
      mesh,
      widthSegments: 6,
      flipY: true,
      width: 123,
      height: 123
    });
    this.meshNE.vertices.forEach(vertex => {
      const distFromCenter = 61.4 - Math.abs(vertex.x)
      vertex.z = Math.pow(distFromCenter, 0.8)
      vertex.y -= Math.pow(distFromCenter, 0.5)
    })
    this.meshNE.panZ(300)
    this.meshNE.modelRotation.y += 3.14 / 2
    // this.meshNE.setDebug(this.debug)
  }

  createBottomMesh() {
    this.meshNO = this.add.mesh(708, 480)
    let mesh = this.meshNO
    Phaser.Geom.Mesh.GenerateGridVerts({
      mesh,
      widthSegments: 6,
      flipY: true,
      width: 123,
      height: 123
    });
    this.meshNO.vertices.forEach(vertex => {
      const distFromCenter = 61.5 - Math.abs(vertex.x)
      vertex.z = Math.pow(distFromCenter, 0.8)
      vertex.y -= Math.pow(distFromCenter, 0.5)
    })
    this.meshNO.modelRotation.x += 0.1
    this.meshNO.panZ(300)
    // this.meshNO.setDebug(this.debug)

    this.meshN = this.add.mesh(940, 480)
    mesh = this.meshN
    Phaser.Geom.Mesh.GenerateGridVerts({
      mesh,
      widthSegments: 6,
      flipY: true,
      width: 123,
      height: 123
    });
    this.meshN.vertices.forEach(vertex => {
      const distFromCenter = 61.5 - Math.abs(vertex.x)
      vertex.z = Math.pow(distFromCenter, 0.8)
      vertex.y -= Math.pow(distFromCenter, 0.5)
    })
    this.meshN.panZ(300)
    this.meshN.modelRotation.y -= 0.4
    this.meshN.modelRotation.x += 0.2
    // this.meshN.setDebug(this.debug)
  }

  createCanvas() {
    this.topSensor = this.add.rectangle(150, 150, 90, 130, 0xFFFFFF, 0)
      .setOrigin(0)
      .setInteractive()
      .setStrokeStyle(1, 0x000000)

    this.topSensor.on('pointerdown', (pointer) => {
      this.drawing = true
      this.gr1.fillCircle(pointer.worldX, pointer.worldY, 2.5)
      this.lastPoint.set(pointer.worldX, pointer.worldY)
    })

    this.topSensor.on('pointerup', (pointer) => {
      this.drawing = false
      this.createTopTexture()
    })

    this.topSensor.on('pointermove', (pointer) => {
      if (!this.drawing) return

      if (pointer.worldX === this.lastPoint.x && pointer.worldY === this.lastPoint.y) return

      const line = new Phaser.Geom.Line(this.lastPoint.x, this.lastPoint.y, pointer.worldX, pointer.worldY)
      this.gr1.strokeLineShape(line)
      this.gr1.fillCircle(pointer.worldX, pointer.worldY, 2.5)
      this.lastPoint.set(pointer.worldX, pointer.worldY)
    })

    this.topSensor.on('pointerout', (pointer) => {
      this.drawing = false
      this.createTopTexture()
    })

    this.bottomSensor = this.add.rectangle(150, 400, 90, 130, 0xFFFFFF, 0)
      .setOrigin(0)
      .setInteractive()
      .setStrokeStyle(1, 0x000000)

    this.bottomSensor.on('pointerdown', (pointer) => {
      this.drawing = true
      this.gr2.fillCircle(pointer.worldX, pointer.worldY, 2.5)
      this.lastPoint.set(pointer.worldX, pointer.worldY)
    })

    this.bottomSensor.on('pointerup', (pointer) => {
      this.drawing = false
      this.createBottomTexture()
    })

    this.bottomSensor.on('pointermove', (pointer) => {
      if (!this.drawing) return

      if (pointer.worldX === this.lastPoint.x && pointer.worldY === this.lastPoint.y) return

      const line = new Phaser.Geom.Line(this.lastPoint.x, this.lastPoint.y, pointer.worldX, pointer.worldY)
      this.gr2.strokeLineShape(line)
      this.gr2.fillCircle(pointer.worldX, pointer.worldY, 2.5)
      this.lastPoint.set(pointer.worldX, pointer.worldY)
    })

    this.bottomSensor.on('pointerout', (pointer) => {
      this.drawing = false
      this.createBottomTexture()
    })
  }

  createTopTexture() {
    const rt = this.add.renderTexture(0, 0, this.topSensor.width, this.topSensor.height)

    rt.draw(this.stamp, 5, 20)
    rt.draw(this.gr1, -this.topSensor.x, -this.topSensor.y)
    if (this.textures.exists('draw')) this.textures.remove('draw')
    rt.saveTexture('draw')
    rt.destroy()

    this.meshSE.setTexture('draw')
    this.meshL.setTexture('draw')
    this.meshNE.setTexture('draw')
  }

  createBottomTexture() {
    const rt = this.add.renderTexture(0, 0, this.topSensor.width, this.topSensor.height)

    rt.draw(this.stamp, 5, 20)
    rt.draw(this.gr2, -this.bottomSensor.x, -this.bottomSensor.y)
    if (this.textures.exists('draw2')) this.textures.remove('draw2')
    rt.saveTexture('draw2')
    rt.destroy()

    this.meshNO.setTexture('draw2')
    this.meshN.setTexture('draw2')
  }

  resetTopGraphics() {
    this.gr1
      .clear()
      .fillStyle(0x000000).lineStyle(5, 0x000000)

    this.createTopTexture()
  }

  resetBottomGraphics() {
    this.gr2
      .clear()
      .fillStyle(0x000000).lineStyle(5, 0x000000)

    this.createBottomTexture()
  }

}