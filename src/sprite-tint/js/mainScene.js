class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('phone' ,'../assets/images/phone.png')
        this.load.image('geladeira' ,'../assets/images/geladeira.png')
    }

    create() {
        const original = this.add.image(0, 0, 'phone').setScale(0.3).setOrigin(0)
        const red = this.add.image(200, 0, 'phone').setScale(0.3).setOrigin(0).setTint(0xFF0000)
        const green = this.add.image(400, 0, 'phone').setScale(0.3).setOrigin(0).setTint(0x00FF00)
        const blue = this.add.image(600, 0, 'phone').setScale(0.3).setOrigin(0).setTint(0x0000FF)

        const goriginal = this.add.image(50, 400, 'geladeira').setOrigin(0)
        const gred = this.add.image(250, 400, 'geladeira').setOrigin(0).setTint(0xFF0000)
        const ggreen = this.add.image(450, 400, 'geladeira').setOrigin(0).setTint(0x00FF00)
        const gblue = this.add.image(650, 400, 'geladeira').setOrigin(0).setTint(0x0000FF)
    }

    update() {
    }
}