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
    this.createShirts()

    this.stamp = this.make.image({ key: 'tree' }, false).setScale(0.35).setOrigin(0)

    this.gr = this.add.graphics()
    this.debug = this.add.graphics().lineStyle(1, 0x000000)

    this.clearText = this.add.text(200, 340, 'LIMPAR', {
      backgroundColor: 0x333333,
      padding: 15
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.resetGraphics()
      })

    this.lastPoint = new Phaser.Math.Vector2(0, 0)

    this.createCanvas()

    this.createMesh()

    this.resetGraphics()
  }

  createShirts() {
    this.shirtSE = this.add.sprite(603, 230, 'shirt', 32).setScale(5)
    this.shirtL = this.add.sprite(820, 240, 'shirt', 64).setScale(5)
    this.shirtL = this.add.sprite(1020, 240, 'shirt', 16).setScale(5)
  }

  createMesh() {
    const vertices = [
      0, 0, 0,
      90, 0, 0,
      0, 130, 0,
      90, 130, 0
    ];

    const uvs = [
      0, 0,
      1, 0,
      0, 1,
      1, 1,
      0, 0, 0, 0
    ]

    const uvs2 = [
      0, 0,
      0.5, 0,
      0, 1,
      0.5, 1,
      0, 0, 0, 0
    ]

    const indicies = [1, 2, 0, 3, 2, 1]

    this.meshSE = this.add.mesh(595, 215)
    let mesh = this.meshSE
    // // this.meshL.addVertices(vertices, uvs, indicies, true)
    Phaser.Geom.Mesh.GenerateGridVerts({
      mesh,
      widthSegments: 10,
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
    // this.meshL.addVertices(vertices, uvs, indicies, true)
    Phaser.Geom.Mesh.GenerateGridVerts({
      mesh,
      widthSegments: 10,
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
      widthSegments: 10,
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

  createCanvas() {
    this.sensor = this.add.rectangle(150, 150, 90, 130, 0xFFFFFF, 0)
      .setOrigin(0)
      .setInteractive()
      .setStrokeStyle(1, 0x000000)

    this.sensor.on('pointerdown', (pointer) => {
      this.drawing = true
      this.gr.fillCircle(pointer.worldX, pointer.worldY, 2.5)
      this.lastPoint.set(pointer.worldX, pointer.worldY)
    })

    this.sensor.on('pointerup', (pointer) => {
      this.drawing = false
      this.createTexture()
    })

    this.sensor.on('pointermove', (pointer) => {
      if (!this.drawing) return

      if (pointer.worldX === this.lastPoint.x && pointer.worldY === this.lastPoint.y) return

      const line = new Phaser.Geom.Line(this.lastPoint.x, this.lastPoint.y, pointer.worldX, pointer.worldY)
      this.gr.strokeLineShape(line)
      this.gr.fillCircle(pointer.worldX, pointer.worldY, 2.5)
      this.lastPoint.set(pointer.worldX, pointer.worldY)
    })

    this.sensor.on('pointerout', (pointer) => {
      this.drawing = false
      this.createTexture()
    })
  }

  createTexture() {
    const rt = this.add.renderTexture(0, 0, this.sensor.width, this.sensor.height)

    rt.draw(this.stamp, 5, 20)
    rt.draw(this.gr, -this.sensor.x, -this.sensor.y)
    if (this.textures.exists('draw')) this.textures.remove('draw')
    rt.saveTexture('draw')
    rt.destroy()

    this.meshSE.setTexture('draw')
    this.meshL.setTexture('draw')
    this.meshNE.setTexture('draw')
  }

  resetGraphics() {
    this.gr
      .clear()
      .fillStyle(0x000000).lineStyle(5, 0x000000)

    this.createTexture()
  }

}