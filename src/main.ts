import * as Phaser from 'phaser'
import './style.css'

type EnemyCar = {
  container: Phaser.GameObjects.Container
  shadow: Phaser.GameObjects.Ellipse
  laneIndex: number
  depth: number
  speed: number
}

type RoadLight = {
  side: 'left' | 'right'
  depth: number
  pole: Phaser.GameObjects.Rectangle
  lamp: Phaser.GameObjects.Rectangle
  glow: Phaser.GameObjects.Ellipse
}

type SpeedStreak = {
  side: 'left' | 'right'
  depth: number
  line: Phaser.GameObjects.Rectangle
}

type CoffeeProjectile = {
  container: Phaser.GameObjects.Container
  laneIndex: number
  depth: number
  speed: number
}

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    this.load.image('angryBob', 'sprites/angry-bob.png')
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

    this.cameras.main.setBackgroundColor('#07070d')

    const bg = this.add.graphics()
    bg.fillStyle(0x080913, 1)
    bg.fillRect(0, 0, width, height)

    const sunsetOuter = this.add.circle(width * 0.5, 165, 160, 0xff6f2d, 0.12)
    sunsetOuter.setBlendMode(Phaser.BlendModes.ADD)

    const sunsetInner = this.add.circle(width * 0.5, 165, 92, 0xffc97b, 0.16)
    sunsetInner.setBlendMode(Phaser.BlendModes.ADD)

    for (let i = 0; i < 20; i++) {
      const bw = Phaser.Math.Between(30, 82)
      const bh = Phaser.Math.Between(90, 220)
      const x = i * 70 + Phaser.Math.Between(-12, 12)
      const y = 255 - bh / 2

      this.add.rectangle(x, y, bw, bh, 0x11131a, 0.96)

      const lights = Phaser.Math.Between(2, 6)
      for (let j = 0; j < lights; j++) {
        this.add.rectangle(
          x - bw / 4 + Phaser.Math.Between(0, Math.max(8, Math.floor(bw / 2))),
          y - bh / 3 + j * 18,
          6,
          10,
          0xffc76c,
          0.25,
        )
      }
    }

    this.add.text(width / 2, height / 2 - 130, 'ASPHALT ANGER', {
      fontFamily: 'Arial Black',
      fontSize: '64px',
      color: '#ff5a1f',
      stroke: '#000000',
      strokeThickness: 10,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 - 48, 'Cinematic browser prototype', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 + 6, '← → SWITCH    Z HORN    X COFFEE TOSS', {
      fontFamily: 'Arial Black',
      fontSize: '20px',
      color: '#ffe5b3',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    const bobPanelShadow = this.add.rectangle(width / 2, height / 2 + 150, 250, 150, 0x000000, 0.28)
    bobPanelShadow.y += 6

    this.add.rectangle(width / 2, height / 2 + 150, 250, 150, 0x000000, 0.46)
    this.add.rectangle(width / 2, height / 2 + 150, 254, 154, 0xff6a2a, 0.16)

    const bobPortrait = this.add.image(width / 2, height / 2 + 145, 'angryBob')
    bobPortrait.setDisplaySize(220, 134)

    this.add.text(width / 2, height / 2 + 226, 'ANGRY BOB', {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    const startText = this.add.text(width / 2, height / 2 + 310, 'PRESS SPACE TO START', {
      fontFamily: 'Arial Black',
      fontSize: '30px',
      color: '#ffe082',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: startText,
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

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene')
  }

  create(data: { score?: number; best?: number }) {
    const { width, height } = this.scale
    const score = Math.floor(data.score ?? 0)
    const best = Math.floor(data.best ?? 0)

    this.cameras.main.setBackgroundColor('#050505')
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.72)

    this.add.text(width / 2, height / 2 - 120, 'WRECKED', {
      fontFamily: 'Arial Black',
      fontSize: '60px',
      color: '#ff5a1f',
      stroke: '#000000',
      strokeThickness: 10,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 - 30, `SCORE: ${score}`, {
      fontFamily: 'Arial Black',
      fontSize: '30px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 + 22, `BEST: ${best}`, {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffd7a3',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    const retryText = this.add.text(width / 2, height / 2 + 110, 'PRESS SPACE TO RUN IT BACK', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffe082',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: retryText,
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
  private roadGraphics!: Phaser.GameObjects.Graphics

  private player!: Phaser.GameObjects.Container
  private playerShadow!: Phaser.GameObjects.Ellipse

  private enemyCars: EnemyCar[] = []
  private roadLights: RoadLight[] = []
  private speedStreaks: SpeedStreak[] = []
  private projectiles: CoffeeProjectile[] = []

  private anger = 0
  private angerFill!: Phaser.GameObjects.Rectangle
  private angerText!: Phaser.GameObjects.Text

  private score = 0
  private displayedScore = 0
  private scoreText!: Phaser.GameObjects.Text

  private combo = 0
  private comboTimer = 0
  private comboText!: Phaser.GameObjects.Text

  private hornText!: Phaser.GameObjects.Text
  private coffeeText!: Phaser.GameObjects.Text
  private heatOverlay!: Phaser.GameObjects.Rectangle
  private speedOverlay!: Phaser.GameObjects.Rectangle

  private bobPortrait!: Phaser.GameObjects.Image
  private bobPortraitBaseScaleX = 1
  private bobPortraitBaseScaleY = 1
  private bobMoodText!: Phaser.GameObjects.Text
  private reactionBg!: Phaser.GameObjects.Rectangle
  private reactionText!: Phaser.GameObjects.Text
  private reactionTimer = 0
  private heatedTriggered = false
  private furiousTriggered = false

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keyZ!: Phaser.Input.Keyboard.Key
  private keyX!: Phaser.Input.Keyboard.Key

  private dashDepths: number[] = []

  private roadSpeed = 0.36
  private currentLaneIndex = 1
  private isChangingLanes = false
  private hornCooldown = 0
  private coffeeCooldown = 0
  private gameEnded = false

  private centerX = 0
  private horizonY = 0
  private bottomY = 0
  private roadTopHalfWidth = 0
  private roadBottomHalfWidth = 0
  private playerBaseY = 0
  private laneBottomXs: number[] = []

  constructor() {
    super('GameScene')
  }

  private project(depth: number) {
    const d = Phaser.Math.Clamp(depth, 0, 1)
    const eased = d * d
    const y = Phaser.Math.Linear(this.horizonY, this.bottomY, eased)
    const halfWidth = Phaser.Math.Linear(this.roadTopHalfWidth, this.roadBottomHalfWidth, eased)
    const left = this.centerX - halfWidth
    const right = this.centerX + halfWidth
    const scale = Phaser.Math.Linear(0.24, 1.12, eased)
    return { y, halfWidth, left, right, scale, eased }
  }

  private laneCenterX(laneIndex: number, depth: number) {
    const p = this.project(depth)
    const fullWidth = p.halfWidth * 2
    const laneWidth = fullWidth / 3
    return p.left + laneWidth * (laneIndex + 0.5)
  }

  private roadEdgeX(side: 'left' | 'right', depth: number, padding = 0) {
    const p = this.project(depth)
    return side === 'left' ? p.left - padding : p.right + padding
  }

  private createPlayerCar(x: number, y: number) {
    const car = this.add.container(x, y)

    const bodyGlow = this.add.rectangle(0, 0, 92, 142, 0xff6126, 0.16)
    bodyGlow.setBlendMode(Phaser.BlendModes.ADD)

    const body = this.add.rectangle(0, 0, 78, 128, 0xdb4718)
    body.setStrokeStyle(4, 0x000000)

    const roof = this.add.rectangle(0, -8, 50, 60, 0xff7540)
    roof.setStrokeStyle(3, 0x000000)

    const windshield = this.add.rectangle(0, -25, 34, 24, 0x99d8ff, 0.88)
    windshield.setStrokeStyle(2, 0x000000)

    const rearGlass = this.add.rectangle(0, 19, 30, 18, 0x79bfe6, 0.7)
    rearGlass.setStrokeStyle(2, 0x000000)

    const wheelFL = this.add.rectangle(-34, -31, 10, 24, 0x111111)
    const wheelFR = this.add.rectangle(34, -31, 10, 24, 0x111111)
    const wheelRL = this.add.rectangle(-34, 31, 10, 24, 0x111111)
    const wheelRR = this.add.rectangle(34, 31, 10, 24, 0x111111)

    const headlightsL = this.add.rectangle(-18, -59, 12, 8, 0xfff2b5, 1)
    const headlightsR = this.add.rectangle(18, -59, 12, 8, 0xfff2b5, 1)

    const headlightGlowL = this.add.rectangle(-18, -66, 22, 20, 0xffd47b, 0.18)
    const headlightGlowR = this.add.rectangle(18, -66, 22, 20, 0xffd47b, 0.18)
    headlightGlowL.setBlendMode(Phaser.BlendModes.ADD)
    headlightGlowR.setBlendMode(Phaser.BlendModes.ADD)

    const taillightL = this.add.rectangle(-18, 59, 12, 8, 0xff3131, 0.95)
    const taillightR = this.add.rectangle(18, 59, 12, 8, 0xff3131, 0.95)

    car.add([
      bodyGlow,
      body,
      roof,
      windshield,
      rearGlass,
      wheelFL,
      wheelFR,
      wheelRL,
      wheelRR,
      headlightsL,
      headlightsR,
      headlightGlowL,
      headlightGlowR,
      taillightL,
      taillightR,
    ])

    this.tweens.add({
      targets: [headlightGlowL, headlightGlowR],
      alpha: 0.05,
      yoyo: true,
      repeat: -1,
      duration: 260,
    })

    return car
  }

  private createEnemyCar(colorBody: number, colorRoof: number) {
    const car = this.add.container(0, 0)

    const glow = this.add.rectangle(0, 0, 84, 134, colorBody, 0.1)
    glow.setBlendMode(Phaser.BlendModes.ADD)

    const body = this.add.rectangle(0, 0, 72, 122, colorBody)
    body.setStrokeStyle(4, 0x000000)

    const roof = this.add.rectangle(0, -6, 44, 54, colorRoof)
    roof.setStrokeStyle(3, 0x000000)

    const rearGlass = this.add.rectangle(0, 14, 28, 18, 0x7db7de, 0.65)
    rearGlass.setStrokeStyle(2, 0x000000)

    const windshield = this.add.rectangle(0, -22, 30, 22, 0xb5e2ff, 0.8)
    windshield.setStrokeStyle(2, 0x000000)

    const wheelFL = this.add.rectangle(-31, -28, 10, 22, 0x111111)
    const wheelFR = this.add.rectangle(31, -28, 10, 22, 0x111111)
    const wheelRL = this.add.rectangle(-31, 28, 10, 22, 0x111111)
    const wheelRR = this.add.rectangle(31, 28, 10, 22, 0x111111)

    const taillightL = this.add.rectangle(-18, 55, 12, 7, 0xff5555, 0.95)
    const taillightR = this.add.rectangle(18, 55, 12, 7, 0xff5555, 0.95)

    car.add([
      glow,
      body,
      roof,
      rearGlass,
      windshield,
      wheelFL,
      wheelFR,
      wheelRL,
      wheelRR,
      taillightL,
      taillightR,
    ])

    return car
  }

  private createCoffeeProjectile(laneIndex: number) {
    const mug = this.add.container(0, 0)

    const cup = this.add.rectangle(0, 0, 20, 24, 0xf5f0e8)
    cup.setStrokeStyle(2, 0x000000)

    const lid = this.add.rectangle(0, -12, 22, 4, 0xd9d0c5)
    lid.setStrokeStyle(2, 0x000000)

    const coffee = this.add.rectangle(0, -4, 16, 8, 0x5b341d)

    const handle = this.add.rectangle(11, 0, 5, 10, 0xf5f0e8)
    handle.setStrokeStyle(2, 0x000000)

    mug.add([cup, lid, coffee, handle])

    const projectile: CoffeeProjectile = {
      container: mug,
      laneIndex,
      depth: 0.86,
      speed: 0.95,
    }

    const p = this.project(projectile.depth)
    mug.x = this.laneCenterX(laneIndex, projectile.depth)
    mug.y = p.y - 40
    mug.setScale(p.scale * 0.18)

    this.projectiles.push(projectile)
  }

  private spawnSparkBurst(x: number, y: number, color = 0xffb347) {
    for (let i = 0; i < 10; i++) {
      const spark = this.add.rectangle(x, y, 6, 6, color, 0.95)
      const angle = Phaser.Math.FloatBetween(-2.45, -0.7)
      const distance = Phaser.Math.Between(24, 88)

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: 260,
        ease: 'Quad.Out',
        onComplete: () => spark.destroy(),
      })
    }
  }

  private spawnScorePopup(x: number, y: number, text: string, color = '#ffe082') {
    const popup = this.add.text(x, y, text, {
      fontFamily: 'Arial Black',
      fontSize: '20px',
      color,
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.tweens.add({
      targets: popup,
      y: y - 50,
      alpha: 0,
      duration: 550,
      ease: 'Quad.Out',
      onComplete: () => popup.destroy(),
    })
  }

  private showBobReaction(message: string) {
    this.reactionText.setText(message)
    this.reactionBg.width = Math.max(160, this.reactionText.width + 28)

    this.reactionBg.setAlpha(0.78)
    this.reactionText.setAlpha(1)
    this.reactionTimer = 1400

    this.tweens.killTweensOf([this.reactionBg, this.reactionText])
    this.reactionBg.y = 214
    this.reactionText.y = 214

    this.tweens.add({
      targets: [this.reactionBg, this.reactionText],
      y: 208,
      duration: 100,
      ease: 'Quad.Out',
    })
  }

  private updateBobMood() {
    if (this.anger < 35) {
      this.bobMoodText.setText('BOB: LOCKED IN')
      this.bobMoodText.setColor('#ffe8c8')
      this.bobPortrait.setTint(0xffffff)
    } else if (this.anger < 70) {
      this.bobMoodText.setText('BOB: HEATED')
      this.bobMoodText.setColor('#ffcb9a')
      this.bobPortrait.setTint(0xffd0a8)
    } else {
      this.bobMoodText.setText('BOB: BERSERK')
      this.bobMoodText.setColor('#ff9d73')
      this.bobPortrait.setTint(0xffb28a)
    }
  }

  private addCombo(amount = 1) {
    this.combo += amount
    this.comboTimer = 2600
    this.comboText.setText(`COMBO x${Math.max(1, this.combo + 1)}`)
    this.comboText.setAlpha(1)

    this.tweens.killTweensOf(this.comboText)
    this.comboText.setScale(1.18)
    this.tweens.add({
      targets: this.comboText,
      scale: 1,
      duration: 130,
      ease: 'Quad.Out',
    })
  }

  private resetEnemyCar(enemy: EnemyCar, extraOffset = 0) {
    enemy.laneIndex = Phaser.Math.Between(0, 2)
    enemy.depth = Phaser.Math.FloatBetween(0.02, 0.16)
    enemy.speed = Phaser.Math.FloatBetween(0.19, 0.31)
    enemy.container.x = this.laneCenterX(enemy.laneIndex, enemy.depth)
    enemy.container.y = this.project(enemy.depth).y - extraOffset
    enemy.shadow.x = enemy.container.x
    enemy.shadow.y = enemy.container.y + 18
    enemy.container.setData('nearMissed', false)
  }

  private moveToLane(targetLaneIndex: number) {
    if (this.isChangingLanes || this.gameEnded) return
    if (targetLaneIndex < 0 || targetLaneIndex > 2) return
    if (targetLaneIndex === this.currentLaneIndex) return

    this.isChangingLanes = true
    this.currentLaneIndex = targetLaneIndex
    this.anger = Math.min(100, this.anger + 1.2)

    const targetX = this.laneBottomXs[targetLaneIndex]

    this.tweens.add({
      targets: [this.player, this.playerShadow],
      x: targetX,
      duration: 130,
      ease: 'Sine.Out',
      onComplete: () => {
        this.isChangingLanes = false
      },
    })

    this.tweens.add({
      targets: this.player,
      angle: targetLaneIndex === 0 ? -8 : targetLaneIndex === 2 ? 8 : 0,
      duration: 80,
      yoyo: true,
      ease: 'Sine.Out',
    })
  }

  private triggerHornBlast() {
    if (this.hornCooldown > 0 || this.gameEnded) return

    this.hornCooldown = 900
    this.showBobReaction('MOVE!')

    const pulse = this.add.ellipse(this.player.x, this.player.y - 82, 28, 18, 0xffcc7a, 0.9)
    pulse.setBlendMode(Phaser.BlendModes.ADD)

    this.tweens.add({
      targets: pulse,
      width: 320,
      height: 170,
      alpha: 0,
      duration: 220,
      ease: 'Quad.Out',
      onComplete: () => pulse.destroy(),
    })

    let hitSomething = false

    for (const enemy of this.enemyCars) {
      const inSameLane = enemy.laneIndex === this.currentLaneIndex
      const inFront = enemy.depth > 0.36 && enemy.depth < 0.76

      if (inSameLane && inFront) {
        hitSomething = true
        this.score += 140 + this.combo * 20
        this.anger = Math.min(100, this.anger + 6)
        this.addCombo()
        this.spawnSparkBurst(enemy.container.x, enemy.container.y + 16, 0xffd27a)
        this.spawnScorePopup(enemy.container.x, enemy.container.y - 10, `+${140 + this.combo * 20}`)
        this.resetEnemyCar(enemy, Phaser.Math.Between(180, 360))
      }
    }

    if (hitSomething) {
      this.cameras.main.shake(100, 0.0028)
    }
  }

  private triggerCoffeeToss() {
    if (this.coffeeCooldown > 0 || this.gameEnded) return

    this.coffeeCooldown = 650
    this.anger = Math.min(100, this.anger + 2)
    this.showBobReaction('HOT COFFEE!')
    this.createCoffeeProjectile(this.currentLaneIndex)
  }

  private endRun() {
    if (this.gameEnded) return

    this.gameEnded = true
    this.showBobReaction('NOOO!')
    this.cameras.main.shake(180, 0.006)
    this.cameras.main.flash(180, 255, 120, 60)

    this.spawnSparkBurst(this.player.x, this.player.y - 10, 0xff7a2f)
    this.spawnSparkBurst(this.player.x, this.player.y + 24, 0xffc86b)

    const finalScore = Math.floor(this.score)
    const storedBest = Number(localStorage.getItem('asphalt-anger-best') ?? '0')
    const best = Math.max(finalScore, storedBest)
    localStorage.setItem('asphalt-anger-best', String(best))

    this.time.delayedCall(420, () => {
      this.scene.start('GameOverScene', { score: finalScore, best })
    })
  }

  private drawRoad() {
    const g = this.roadGraphics
    g.clear()

    const top = this.project(0)
    const bottom = this.project(1)

    g.fillStyle(0x2a1630, 0.75)
    g.beginPath()
    g.moveTo(top.left - 90, top.y)
    g.lineTo(top.right + 90, top.y)
    g.lineTo(bottom.right + 110, bottom.y)
    g.lineTo(bottom.left - 110, bottom.y)
    g.closePath()
    g.fillPath()

    g.fillStyle(0x1a1a1f, 1)
    g.beginPath()
    g.moveTo(top.left, top.y)
    g.lineTo(top.right, top.y)
    g.lineTo(bottom.right, bottom.y)
    g.lineTo(bottom.left, bottom.y)
    g.closePath()
    g.fillPath()

    g.lineStyle(8, 0xffa95a, 0.16)
    g.beginPath()
    g.moveTo(top.left - 10, top.y)
    g.lineTo(bottom.left - 10, bottom.y)
    g.strokePath()

    g.beginPath()
    g.moveTo(top.right + 10, top.y)
    g.lineTo(bottom.right + 10, bottom.y)
    g.strokePath()

    g.lineStyle(4, 0xfff0c8, 0.5)
    g.beginPath()
    g.moveTo(top.left + 6, top.y)
    g.lineTo(bottom.left + 6, bottom.y)
    g.strokePath()

    g.beginPath()
    g.moveTo(top.right - 6, top.y)
    g.lineTo(bottom.right - 6, bottom.y)
    g.strokePath()

    for (const divider of [1, 2]) {
      for (const dashDepth of this.dashDepths) {
        const d1 = dashDepth
        const d2 = Math.min(1, dashDepth + 0.08)

        const p1 = this.project(d1)
        const p2 = this.project(d2)

        const x1 = p1.left + ((p1.halfWidth * 2) / 3) * divider
        const x2 = p2.left + ((p2.halfWidth * 2) / 3) * divider

        g.lineStyle(Phaser.Math.Linear(1.5, 9, p1.eased), 0xffffff, 0.26 + p1.eased * 0.18)
        g.beginPath()
        g.moveTo(x1, p1.y)
        g.lineTo(x2, p2.y)
        g.strokePath()
      }
    }
  }

  create() {
    const { width, height } = this.scale

    this.centerX = width / 2
    this.horizonY = 126
    this.bottomY = height + 40
    this.roadTopHalfWidth = 108
    this.roadBottomHalfWidth = 360
    this.playerBaseY = height - 118

    this.cameras.main.setBackgroundColor('#07070d')

    const bg = this.add.graphics()
    bg.fillStyle(0x080913, 1)
    bg.fillRect(0, 0, width, height)

    const sunsetOuter = this.add.circle(this.centerX, 165, 160, 0xff6f2d, 0.12)
    sunsetOuter.setBlendMode(Phaser.BlendModes.ADD)

    const sunsetInner = this.add.circle(this.centerX, 165, 92, 0xffc97b, 0.16)
    sunsetInner.setBlendMode(Phaser.BlendModes.ADD)

    for (let i = 0; i < 20; i++) {
      const bw = Phaser.Math.Between(30, 82)
      const bh = Phaser.Math.Between(90, 220)
      const x = i * 70 + Phaser.Math.Between(-12, 12)
      const y = 255 - bh / 2

      this.add.rectangle(x, y, bw, bh, 0x11131a, 0.96)

      const lights = Phaser.Math.Between(2, 6)
      for (let j = 0; j < lights; j++) {
        this.add.rectangle(
          x - bw / 4 + Phaser.Math.Between(0, Math.max(8, Math.floor(bw / 2))),
          y - bh / 3 + j * 18,
          6,
          10,
          0xffc76c,
          0.25,
        )
      }
    }

    this.roadGraphics = this.add.graphics()

    for (let i = 0; i < 8; i++) {
      this.dashDepths.push(i * 0.14)
    }

    this.laneBottomXs = [
      this.laneCenterX(0, 0.98),
      this.laneCenterX(1, 0.98),
      this.laneCenterX(2, 0.98),
    ]

    const enemyColors = [
      { body: 0x2f7bff, roof: 0x5ca1ff },
      { body: 0x8d4dff, roof: 0xb27bff },
      { body: 0x19b46b, roof: 0x48d894 },
      { body: 0xf0c41d, roof: 0xffdf69 },
    ]

    enemyColors.forEach((colors, index) => {
      const laneIndex = Phaser.Math.Between(0, 2)
      const container = this.createEnemyCar(colors.body, colors.roof)
      const shadow = this.add.ellipse(0, 0, 50, 16, 0x000000, 0.22)

      const enemy: EnemyCar = {
        container,
        shadow,
        laneIndex,
        depth: 0.04 + index * 0.12,
        speed: Phaser.Math.FloatBetween(0.19, 0.31),
      }

      enemy.container.x = this.laneCenterX(enemy.laneIndex, enemy.depth)
      enemy.container.y = this.project(enemy.depth).y
      enemy.shadow.x = enemy.container.x
      enemy.shadow.y = enemy.container.y + 18
      enemy.container.setData('nearMissed', false)

      this.enemyCars.push(enemy)
    })

    for (let i = 0; i < 8; i++) {
      const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right'
      const depth = 0.05 + (i % 4) * 0.22

      const pole = this.add.rectangle(0, 0, 4, 40, 0x30333a, 0.9)
      const lamp = this.add.rectangle(0, 0, 12, 6, 0xffefbf, 0.9)
      const glow = this.add.ellipse(0, 0, 24, 12, 0xffc76c, 0.12)
      glow.setBlendMode(Phaser.BlendModes.ADD)

      this.roadLights.push({ side, depth, pole, lamp, glow })
    }

    for (let i = 0; i < 12; i++) {
      const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right'
      const line = this.add.rectangle(0, 0, 4, 30, 0xffb566, 0.08)
      line.setBlendMode(Phaser.BlendModes.ADD)

      this.speedStreaks.push({
        side,
        depth: Math.random(),
        line,
      })
    }

    this.playerShadow = this.add.ellipse(
      this.laneBottomXs[this.currentLaneIndex],
      this.playerBaseY + 63,
      96,
      30,
      0x000000,
      0.34,
    )

    this.player = this.createPlayerCar(this.laneBottomXs[this.currentLaneIndex], this.playerBaseY)

    this.add.text(18, 18, 'ANGER', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffd7c7',
      stroke: '#000000',
      strokeThickness: 4,
    })

    this.add.rectangle(104, 29, 184, 18, 0x000000, 0.68).setOrigin(0, 0.5)
    this.add.rectangle(104, 29, 180, 14, 0x442013, 0.9).setOrigin(0, 0.5)

    this.angerFill = this.add.rectangle(106, 29, 0, 10, 0xff6a2a, 1).setOrigin(0, 0.5)

    this.angerText = this.add.text(298, 18, '0%', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ff9a6a',
      stroke: '#000000',
      strokeThickness: 4,
    })

    this.scoreText = this.add.text(18, 52, 'SCORE: 0', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 5,
    })

    this.comboText = this.add.text(width / 2, 24, 'COMBO x1', {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#8df0ff',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5, 0)

    this.comboText.setAlpha(0.3)

    this.hornText = this.add.text(width - 18, 18, 'Z HONK', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffe7bc',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0)

    this.coffeeText = this.add.text(width - 18, 46, 'X COFFEE', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffe7bc',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0)

    this.add.text(width - 18, 74, '← → SWITCH', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffe7bc',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0)

    const bobPanelX = width - 112
    const bobPanelY = 136

    this.add.rectangle(bobPanelX, bobPanelY, 176, 126, 0x000000, 0.58)
    this.add.rectangle(bobPanelX, bobPanelY, 180, 130, 0xff6a2a, 0.18)

    this.bobPortrait = this.add.image(bobPanelX, bobPanelY - 10, 'angryBob')
    this.bobPortrait.setDisplaySize(156, 96)
    this.bobPortrait.setAlpha(0.96)
    this.bobPortraitBaseScaleX = this.bobPortrait.scaleX
    this.bobPortraitBaseScaleY = this.bobPortrait.scaleY

    this.bobMoodText = this.add.text(bobPanelX, bobPanelY + 52, 'BOB: LOCKED IN', {
      fontFamily: 'Arial Black',
      fontSize: '15px',
      color: '#ffe8c8',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.reactionBg = this.add.rectangle(bobPanelX, 214, 160, 40, 0x000000, 0)
    this.reactionText = this.add.text(bobPanelX, 214, '', {
      fontFamily: 'Arial Black',
      fontSize: '17px',
      color: '#ffe8c8',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.reactionText.setAlpha(0)

    this.heatOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0xff5a1f, 0)
    this.heatOverlay.setBlendMode(Phaser.BlendModes.ADD)

    this.speedOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0xffffff, 0)
    this.speedOverlay.setBlendMode(Phaser.BlendModes.SCREEN)

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keyZ = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.keyX = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X)

    this.showBobReaction("LET'S RIDE")
    this.updateBobMood()
    this.drawRoad()
  }

  update(time: number, delta: number) {
    if (this.gameEnded) return

    this.anger = Math.min(100, this.anger + delta * 0.003)
    this.roadSpeed = 0.36 + this.anger * 0.0024

    if (!this.heatedTriggered && this.anger >= 35) {
      this.heatedTriggered = true
      this.showBobReaction("NOW I'M HEATED")
    }

    if (!this.furiousTriggered && this.anger >= 70) {
      this.furiousTriggered = true
      this.showBobReaction('EVERYBODY MOVE!')
    }

    for (let i = 0; i < this.dashDepths.length; i++) {
      this.dashDepths[i] += this.roadSpeed * (0.5 + this.dashDepths[i] * 1.8) * (delta / 1000)

      if (this.dashDepths[i] > 1.06) {
        this.dashDepths[i] = 0
      }
    }

    this.drawRoad()

    for (const light of this.roadLights) {
      light.depth += this.roadSpeed * 0.95 * (0.55 + light.depth * 1.8) * (delta / 1000)
      if (light.depth > 1.05) light.depth = Phaser.Math.FloatBetween(0.02, 0.12)

      const p = this.project(light.depth)
      const poleX = this.roadEdgeX(light.side, light.depth, Phaser.Math.Linear(28, 100, p.eased))
      const poleHeight = Phaser.Math.Linear(22, 180, p.eased)
      const poleWidth = Phaser.Math.Linear(2, 8, p.eased)

      light.pole.x = poleX
      light.pole.y = p.y - poleHeight / 2
      light.pole.width = poleWidth
      light.pole.height = poleHeight

      light.lamp.x = poleX
      light.lamp.y = p.y - poleHeight + 8
      light.lamp.width = Phaser.Math.Linear(5, 18, p.eased)
      light.lamp.height = Phaser.Math.Linear(3, 8, p.eased)

      light.glow.x = poleX
      light.glow.y = p.y - poleHeight + 8
      light.glow.setScale(Phaser.Math.Linear(0.35, 1.8, p.eased), Phaser.Math.Linear(0.35, 1.2, p.eased))
      light.glow.alpha = Phaser.Math.Linear(0.05, 0.18, p.eased)
    }

    for (const streak of this.speedStreaks) {
      streak.depth += this.roadSpeed * 1.8 * (0.6 + streak.depth * 2.2) * (delta / 1000)
      if (streak.depth > 1.04) streak.depth = Phaser.Math.FloatBetween(0.02, 0.18)

      const p = this.project(streak.depth)
      streak.line.x = this.roadEdgeX(streak.side, streak.depth, Phaser.Math.Linear(60, 180, p.eased))
      streak.line.y = p.y
      streak.line.width = Phaser.Math.Linear(2, 8, p.eased)
      streak.line.height = Phaser.Math.Linear(16, 88, p.eased)
      streak.line.alpha = Phaser.Math.Linear(0.02, 0.14, p.eased) + this.anger * 0.0006
    }

    for (const enemy of this.enemyCars) {
      enemy.depth += enemy.speed * (0.48 + enemy.depth * 1.7) * (delta / 1000)

      if (enemy.depth > 1.08) {
        this.resetEnemyCar(enemy)
      }

      const p = this.project(enemy.depth)
      enemy.container.x = this.laneCenterX(enemy.laneIndex, enemy.depth)
      enemy.container.y = p.y
      enemy.container.setScale(p.scale * 0.82)
      enemy.container.setAlpha(Phaser.Math.Linear(0.55, 1, p.eased))
      enemy.container.setDepth(Math.floor(p.y))

      enemy.shadow.x = enemy.container.x
      enemy.shadow.y = enemy.container.y + Phaser.Math.Linear(6, 28, p.eased)
      enemy.shadow.setScale(Phaser.Math.Linear(0.2, 1.1, p.eased), Phaser.Math.Linear(0.18, 0.9, p.eased))
      enemy.shadow.alpha = Phaser.Math.Linear(0.06, 0.22, p.eased)
      enemy.shadow.setDepth(Math.floor(p.y) - 1)

      const dx = Math.abs(enemy.container.x - this.player.x)
      const dy = Math.abs(enemy.container.y - this.player.y)

      if (dx < 56 && dy < 92 && enemy.depth > 0.74) {
        this.endRun()
        return
      }

      const sameLane = enemy.laneIndex === this.currentLaneIndex
      const nearMissWindow = enemy.depth > 0.68 && enemy.depth < 0.76
      const sideMiss = dx > 60 && dx < 120 && dy < 90

      if (!sameLane && nearMissWindow && sideMiss && enemy.container.getData('nearMissed') !== true) {
        enemy.container.setData('nearMissed', true)
        this.score += 60 + this.combo * 10
        this.addCombo()
        this.showBobReaction('TOO CLOSE!')
        this.spawnScorePopup(enemy.container.x, enemy.container.y - 18, 'NEAR MISS', '#8df0ff')
      }

      if (enemy.depth < 0.35) {
        enemy.container.setData('nearMissed', false)
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i]
      projectile.depth -= projectile.speed * (delta / 1000)

      if (projectile.depth < 0.04) {
        projectile.container.destroy()
        this.projectiles.splice(i, 1)
        continue
      }

      const p = this.project(projectile.depth)
      projectile.container.x = this.laneCenterX(projectile.laneIndex, projectile.depth)
      projectile.container.y = p.y
      projectile.container.setScale(p.scale * 0.18)
      projectile.container.setDepth(Math.floor(p.y))

      let hit = false

      for (const enemy of this.enemyCars) {
        if (enemy.laneIndex !== projectile.laneIndex) continue

        const depthDiff = Math.abs(enemy.depth - projectile.depth)
        if (depthDiff < 0.055) {
          hit = true
          this.score += 180 + this.combo * 25
          this.anger = Math.min(100, this.anger + 7)
          this.addCombo()
          this.showBobReaction('TAKE THAT!')
          this.spawnSparkBurst(enemy.container.x, enemy.container.y + 10, 0x9c5a31)
          this.spawnScorePopup(enemy.container.x, enemy.container.y - 16, `+${180 + this.combo * 25}`, '#ffd6a3')
          this.resetEnemyCar(enemy, Phaser.Math.Between(220, 420))
          break
        }
      }

      if (hit) {
        projectile.container.destroy()
        this.projectiles.splice(i, 1)
      }
    }

    this.player.y = this.playerBaseY + Math.sin(time * 0.005) * 2
    this.playerShadow.scaleX = 1 + Math.sin(time * 0.005) * 0.02

    this.score += delta * 0.05
    const nextScore = Math.floor(this.score)
    if (nextScore !== this.displayedScore) {
      this.displayedScore = nextScore
      this.scoreText.setText(`SCORE: ${this.displayedScore}`)
    }

    this.angerFill.width = this.anger * 1.8
    this.angerText.setText(`${Math.floor(this.anger)}%`)
    this.heatOverlay.alpha = this.anger * 0.00185
    this.speedOverlay.alpha = this.anger * 0.00055

    this.updateBobMood()

    const bobPulse = 1 + this.anger * 0.0009 + Math.sin(time * 0.006) * 0.004
    this.bobPortrait.setScale(
      this.bobPortraitBaseScaleX * bobPulse,
      this.bobPortraitBaseScaleY * bobPulse,
    )

    if (this.comboTimer > 0) {
      this.comboTimer -= delta
    } else if (this.combo > 0) {
      this.combo = 0
      this.comboText.setText('COMBO x1')
      this.comboText.setAlpha(0.3)
    }

    if (this.reactionTimer > 0) {
      this.reactionTimer -= delta
    } else if (this.reactionBg.alpha > 0) {
      this.reactionBg.setAlpha(Math.max(0, this.reactionBg.alpha - 0.04))
      this.reactionText.setAlpha(Math.max(0, this.reactionText.alpha - 0.04))
    }

    if (this.hornCooldown > 0) {
      this.hornCooldown -= delta
      this.hornText.setAlpha(0.45)
    } else {
      this.hornText.setAlpha(1)
    }

    if (this.coffeeCooldown > 0) {
      this.coffeeCooldown -= delta
      this.coffeeText.setAlpha(0.45)
    } else {
      this.coffeeText.setAlpha(1)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
      this.moveToLane(this.currentLaneIndex - 1)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
      this.moveToLane(this.currentLaneIndex + 1)
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyZ)) {
      this.triggerHornBlast()
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyX)) {
      this.triggerCoffeeToss()
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
  scene: [BootScene, MenuScene, GameScene, GameOverScene],
}

new Phaser.Game(config)