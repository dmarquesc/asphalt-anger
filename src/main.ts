import * as Phaser from 'phaser'
import './style.css'

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  create() {
    this.scene.start('MenuScene')
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const { width, height } = this.scale

    this.cameras.main.setBackgroundColor('#111111')

    this.add.text(width / 2, height / 2 - 100, 'ASPHALT ANGER', {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#ff5a1f',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 - 30, 'Premium browser prototype', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5)

    const playText = this.add.text(width / 2, height / 2 + 50, 'PRESS SPACE TO START', {
      fontFamily: 'Arial Black',
      fontSize: '28px',
      color: '#ffe082',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: playText,
      alpha: 0.35,
      yoyo: true,
      repeat: -1,
      duration: 650,
    })

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('GameScene')
    })
  }
}

class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle
  private anger = 0
  private angerText!: Phaser.GameObjects.Text
  private score = 0
  private scoreText!: Phaser.GameObjects.Text
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('GameScene')
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#1a1a1a')

    const laneWidth = width / 3

    for (let i = 1; i < 3; i++) {
      this.add.rectangle(laneWidth * i, height / 2, 4, height, 0xffffff, 0.15)
    }

    this.player = this.add.rectangle(laneWidth * 1.5, height - 120, 70, 120, 0xff5a1f)
    this.player.setStrokeStyle(4, 0x000000)

    this.angerText = this.add.text(20, 20, 'ANGER: 0', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ff7043',
      stroke: '#000000',
      strokeThickness: 5,
    })

    this.scoreText = this.add.text(20, 55, 'SCORE: 0', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 5,
    })

    this.cursors = this.input.keyboard!.createCursorKeys()

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.score += 10
        this.scoreText.setText(`SCORE: ${this.score}`)
      },
    })

    this.time.addEvent({
      delay: 1400,
      loop: true,
      callback: () => {
        this.anger = Math.min(100, this.anger + 5)
        this.angerText.setText(`ANGER: ${this.anger}`)

        this.cameras.main.shake(80, 0.002 + this.anger * 0.00002)
      },
    })
  }

  update() {
    const { width } = this.scale
    const laneWidth = width / 3
    const leftLane = laneWidth * 0.5
    const middleLane = laneWidth * 1.5
    const rightLane = laneWidth * 2.5

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
      if (this.player.x === middleLane) this.player.x = leftLane
      else if (this.player.x === rightLane) this.player.x = middleLane
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
      if (this.player.x === middleLane) this.player.x = rightLane
      else if (this.player.x === leftLane) this.player.x = middleLane
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'app',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, GameScene],
}

new Phaser.Game(config)