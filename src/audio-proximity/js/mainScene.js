class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.audio('music', '../assets/sounds/music1.mp3')
    }

    create() {
        this.add.text(5, 5, "Clique na tela para permitir a execução do som")
        this.music = this.sound.add('music', { loop: true })
        this.music.play()

        this.i = 0

        this.add.text(400, 300, 'PLAYER', { fontSize: 32 }).setOrigin(0.5, 0.5)
        this.soundPosition = this.add.text(0, 0, 'SOM', { fontSize: 32 }).setOrigin(0.5, 0.5)
    }

    update() {
        this.i++
        this.soundPosition.setPosition(this.input.mousePointer.x, this.input.mousePointer.y)

        const dirVector = new Phaser.Math.Vector2(400 - this.soundPosition.x, 300 - this.soundPosition.y)
        const dist = dirVector.length()
        dirVector.normalize()
        this.music.volume = 1 - Phaser.Math.Clamp(dist / 400, 0, 1)
        this.music.pan = -dirVector.x
    }
}