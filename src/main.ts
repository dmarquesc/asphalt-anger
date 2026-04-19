import * as Phaser from 'phaser'
import './style.css'

type EnemyKind = 'traffic' | 'texting' | 'turning' | 'switchlane'
type UpgradeKey = 'engine' | 'tires' | 'armor' | 'magnet'
type DistrictId =
  | 'residential'
  | 'downtown'
  | 'industrial'
  | 'highway'
  | 'shopping'
  | 'entertainment'

type DistrictDef = {
  id: DistrictId
  name: string
  skyTopColor: number
  skyBottomColor: number
  sunOuterColor: number
  sunInnerColor: number
  skylineColor: number
  roadColor: number
  shoulderColor: number
  edgeColor: number
  dividerColor: number
  accentColor: number
  lightStrength: number
  signDensity: number
  pedestrianChance: number
  speedBias: number
  aggressionBias: number
}

type MissionDef = {
  id: string
  title: string
  destination: string
  distance: number
  timeLimit: number
  trafficCars: number
  scrapCount: number
  rewardBonus: number
  specialKinds: EnemyKind[]
  route: DistrictId[]
  description: string
}

type CampaignProfile = {
  cash: number
  scrap: number
  engine: number
  tires: number
  armor: number
  magnet: number
  unlockedMission: number
}

type MissionReward = {
  missionId: string
  missionName: string
  score: number
  scrap: number
  cash: number
}

type EnemyCar = {
  container: Phaser.GameObjects.Container
  shadow: Phaser.GameObjects.Ellipse
  laneIndex: number
  depth: number
  speed: number
  kind: EnemyKind
  switchCooldown: number
  warningShown: boolean
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

type RoadSign = {
  side: 'left' | 'right'
  depth: number
  enabled: boolean
  container: Phaser.GameObjects.Container
}

type ScrapPickup = {
  container: Phaser.GameObjects.Container
  laneIndex: number
  depth: number
  value: number
  spin: number
}

type SmokeCloud = {
  id: number
  container: Phaser.GameObjects.Container
  laneIndex: number
  depth: number
  life: number
}

type Pedestrian = {
  container: Phaser.GameObjects.Container
  depth: number
  xNorm: number
  direction: 1 | -1
  crossSpeed: number
  warned: boolean
}

type WeatherMode = 'clear' | 'rain' | 'storm' | 'fog'

type BossRivalState = 'inactive' | 'warning' | 'active' | 'defeated'

type SetPieceKind = 'bus' | 'construction' | 'roadblock' | 'delivery' | 'concert'

type SetPieceHazard = {
  container: Phaser.GameObjects.Container
  shadow: Phaser.GameObjects.Ellipse
  laneIndex: number
  depth: number
  speed: number
  label: string
  kind: SetPieceKind
  active: boolean
  passed: boolean
}


type AmbientStar = {
  dot: Phaser.GameObjects.Arc
  twinkle: number
  drift: number
}

type SkylineTwinkle = {
  light: Phaser.GameObjects.Rectangle
  twinkle: number
  baseAlpha: number
}

type NeonBillboard = {
  container: Phaser.GameObjects.Container
  glow: Phaser.GameObjects.Ellipse
  panel: Phaser.GameObjects.Rectangle
  text: Phaser.GameObjects.Text
  side: 'left' | 'right'
  depth: number
  label: string
  tint: number
}

const MAX_UPGRADE_LEVEL = 3
const PROFILE_KEY = 'asphalt-anger-profile-v7'
const BEST_SCORE_KEY = 'asphalt-anger-best-v7'

const DISTRICTS: Record<DistrictId, DistrictDef> = {
  residential: {
    id: 'residential',
    name: 'RESIDENTIAL',
    skyTopColor: 0x31445d,
    skyBottomColor: 0xf0a27a,
    sunOuterColor: 0xff8a45,
    sunInnerColor: 0xffd38a,
    skylineColor: 0x3d4752,
    roadColor: 0x25252b,
    shoulderColor: 0x4e463e,
    edgeColor: 0xffd6a0,
    dividerColor: 0xffffff,
    accentColor: 0xffcb8e,
    lightStrength: 0.12,
    signDensity: 0.82,
    pedestrianChance: 0.72,
    speedBias: -0.02,
    aggressionBias: 0.94,
  },
  downtown: {
    id: 'downtown',
    name: 'DOWNTOWN',
    skyTopColor: 0x112447,
    skyBottomColor: 0xff7d48,
    sunOuterColor: 0xff6f2d,
    sunInnerColor: 0xffd27b,
    skylineColor: 0x171a24,
    roadColor: 0x22242c,
    shoulderColor: 0x41263c,
    edgeColor: 0xffd3a0,
    dividerColor: 0xffffff,
    accentColor: 0x8df0ff,
    lightStrength: 0.24,
    signDensity: 0.68,
    pedestrianChance: 0.58,
    speedBias: 0.02,
    aggressionBias: 1.08,
  },
  industrial: {
    id: 'industrial',
    name: 'INDUSTRIAL',
    skyTopColor: 0x3a3538,
    skyBottomColor: 0xd18b4a,
    sunOuterColor: 0xff8740,
    sunInnerColor: 0xffcd82,
    skylineColor: 0x342f31,
    roadColor: 0x2c2b28,
    shoulderColor: 0x5d4632,
    edgeColor: 0xffc882,
    dividerColor: 0xf7f1e2,
    accentColor: 0xffb566,
    lightStrength: 0.18,
    signDensity: 0.36,
    pedestrianChance: 0.1,
    speedBias: 0,
    aggressionBias: 1.02,
  },
  highway: {
    id: 'highway',
    name: 'HIGHWAY',
    skyTopColor: 0x17315a,
    skyBottomColor: 0x8bb9ff,
    sunOuterColor: 0x74b8ff,
    sunInnerColor: 0xe2f3ff,
    skylineColor: 0x25384d,
    roadColor: 0x20252a,
    shoulderColor: 0x334453,
    edgeColor: 0xd8f1ff,
    dividerColor: 0xffffff,
    accentColor: 0xbbe5ff,
    lightStrength: 0.08,
    signDensity: 0.16,
    pedestrianChance: 0,
    speedBias: 0.12,
    aggressionBias: 1.14,
  },
  shopping: {
    id: 'shopping',
    name: 'SHOPPING STRIP',
    skyTopColor: 0x3b2750,
    skyBottomColor: 0xf0a36b,
    sunOuterColor: 0xff9348,
    sunInnerColor: 0xffd690,
    skylineColor: 0x352836,
    roadColor: 0x29242a,
    shoulderColor: 0x654942,
    edgeColor: 0xffd6a4,
    dividerColor: 0xffffff,
    accentColor: 0xffd18a,
    lightStrength: 0.22,
    signDensity: 0.86,
    pedestrianChance: 0.54,
    speedBias: 0.01,
    aggressionBias: 1.06,
  },
  entertainment: {
    id: 'entertainment',
    name: 'ENTERTAINMENT DISTRICT',
    skyTopColor: 0x140e30,
    skyBottomColor: 0xff5b8b,
    sunOuterColor: 0xff4d9d,
    sunInnerColor: 0xffc4df,
    skylineColor: 0x1d1635,
    roadColor: 0x241b2d,
    shoulderColor: 0x512446,
    edgeColor: 0xffc0dd,
    dividerColor: 0xffffff,
    accentColor: 0x93ffd3,
    lightStrength: 0.3,
    signDensity: 0.48,
    pedestrianChance: 0.36,
    speedBias: 0.08,
    aggressionBias: 1.18,
  },
}

const MISSIONS: MissionDef[] = [
  {
    id: 'work',
    title: 'Drive to Work',
    destination: 'OFFICE',
    distance: 3.2,
    timeLimit: 75,
    trafficCars: 3,
    scrapCount: 5,
    rewardBonus: 40,
    specialKinds: ['texting'],
    route: ['residential', 'downtown'],
    description: 'Clock in on time and dodge the morning mess.',
  },
  {
    id: 'store',
    title: 'Grocery Run',
    destination: 'STORE',
    distance: 4.8,
    timeLimit: 82,
    trafficCars: 4,
    scrapCount: 6,
    rewardBonus: 55,
    specialKinds: ['texting', 'turning'],
    route: ['residential', 'shopping'],
    description: 'Strip mall traffic with more clutter and scrap.',
  },
  {
    id: 'post',
    title: 'Post Office Rush',
    destination: 'POST OFFICE',
    distance: 5.3,
    timeLimit: 80,
    trafficCars: 4,
    scrapCount: 6,
    rewardBonus: 72,
    specialKinds: ['switchlane', 'turning'],
    route: ['downtown', 'shopping', 'industrial'],
    description: 'Tighter clock and rougher district transitions.',
  },
  {
    id: 'tire',
    title: 'Tire Shop Emergency',
    destination: 'TIRE SHOP',
    distance: 6.1,
    timeLimit: 84,
    trafficCars: 5,
    scrapCount: 7,
    rewardBonus: 92,
    specialKinds: ['texting', 'switchlane', 'turning'],
    route: ['downtown', 'industrial'],
    description: 'Tow truck territory with denser hazards.',
  },
  {
    id: 'concert',
    title: 'Concert Panic',
    destination: 'CONCERT',
    distance: 7.4,
    timeLimit: 88,
    trafficCars: 6,
    scrapCount: 8,
    rewardBonus: 125,
    specialKinds: ['texting', 'turning', 'switchlane', 'switchlane'],
    route: ['highway', 'downtown', 'entertainment'],
    description: 'Big speed, bright lights, worst drivers.',
  },
]

function hexColor(value: number) {
  return `#${value.toString(16).padStart(6, '0')}`
}

function defaultProfile(): CampaignProfile {
  return {
    cash: 0,
    scrap: 0,
    engine: 0,
    tires: 0,
    armor: 0,
    magnet: 0,
    unlockedMission: 0,
  }
}

function loadProfile(): CampaignProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return defaultProfile()
    const parsed = JSON.parse(raw) as Partial<CampaignProfile>

    return {
      cash: Number(parsed.cash ?? 0),
      scrap: Number(parsed.scrap ?? 0),
      engine: Number(parsed.engine ?? 0),
      tires: Number(parsed.tires ?? 0),
      armor: Number(parsed.armor ?? 0),
      magnet: Number(parsed.magnet ?? 0),
      unlockedMission: Number(parsed.unlockedMission ?? 0),
    }
  } catch {
    return defaultProfile()
  }
}

function saveProfile(profile: CampaignProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

function loadBestScore() {
  return Number(localStorage.getItem(BEST_SCORE_KEY) ?? '0')
}

function saveBestScore(score: number) {
  localStorage.setItem(BEST_SCORE_KEY, String(score))
}

function getMissionById(id?: string) {
  return MISSIONS.find((mission) => mission.id === id) ?? MISSIONS[0]
}

function getUpgradeLabel(key: UpgradeKey) {
  if (key === 'engine') return 'ENGINE'
  if (key === 'tires') return 'TIRES'
  if (key === 'armor') return 'ARMOR'
  return 'SCRAP MAGNET'
}

function getUpgradeDescription(key: UpgradeKey) {
  if (key === 'engine') return 'Boosts speed ceiling and mission travel pace'
  if (key === 'tires') return 'Cuts lane change time and improves control'
  if (key === 'armor') return 'Adds hull so the tow truck can take hits'
  return 'Pulls scrap in from farther away'
}

function getUpgradeCost(key: UpgradeKey, level: number) {
  if (level >= MAX_UPGRADE_LEVEL) return null

  if (key === 'engine') {
    return [
      { cash: 80, scrap: 3 },
      { cash: 150, scrap: 6 },
      { cash: 260, scrap: 10 },
    ][level]
  }

  if (key === 'tires') {
    return [
      { cash: 70, scrap: 2 },
      { cash: 135, scrap: 5 },
      { cash: 230, scrap: 8 },
    ][level]
  }

  if (key === 'armor') {
    return [
      { cash: 90, scrap: 4 },
      { cash: 170, scrap: 7 },
      { cash: 290, scrap: 11 },
    ][level]
  }

  return [
    { cash: 60, scrap: 2 },
    { cash: 120, scrap: 4 },
    { cash: 210, scrap: 7 },
  ][level]
}

function enemyDisplayName(kind: EnemyKind) {
  if (kind === 'texting') return 'TEXTING THOMAS'
  if (kind === 'turning') return 'TURNING TINA'
  if (kind === 'switchlane') return 'SWITCH LANE JANE'
  return 'TRAFFIC'
}

function enemyColors(kind: EnemyKind) {
  if (kind === 'texting') return { body: 0x4a7dff, roof: 0x8fb0ff }
  if (kind === 'turning') return { body: 0xff9b2f, roof: 0xffcf7b }
  if (kind === 'switchlane') return { body: 0xd9343a, roof: 0xff858f }
  return { body: 0x2ecf79, roof: 0x8cffc0 }
}

function setPieceStyleForDistrict(districtId: DistrictId) {
  if (districtId === 'residential') return { kind: 'bus' as SetPieceKind, label: 'SCHOOL BUS', color: 0xf4c542 }
  if (districtId === 'industrial') return { kind: 'construction' as SetPieceKind, label: 'WORK ZONE', color: 0xff8a3d }
  if (districtId === 'highway') return { kind: 'roadblock' as SetPieceKind, label: 'ROADBLOCK', color: 0xa7c7ff }
  if (districtId === 'shopping') return { kind: 'delivery' as SetPieceKind, label: 'DELIVERY VAN', color: 0xd5a07b }
  if (districtId === 'entertainment') return { kind: 'concert' as SetPieceKind, label: 'STAGE TRUCK', color: 0xff76c8 }
  return { kind: 'delivery' as SetPieceKind, label: 'TAXI JAM', color: 0xffd86e }
}

function createActionButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  onPress: () => void,
  fill = 0xff7a2f,
  textColor = '#fff3df',
) {
  const bg = scene.add.rectangle(x, y, width, height, fill, 0.92)
  bg.setStrokeStyle(3, 0x000000, 0.45)
  bg.setInteractive({ useHandCursor: true })

  const text = scene.add.text(x, y, label, {
    fontFamily: 'Arial Black',
    fontSize: '18px',
    color: textColor,
    stroke: '#000000',
    strokeThickness: 5,
    align: 'center',
  }).setOrigin(0.5)

  const pulseIn = () => {
    bg.setScale(0.98)
    text.setScale(0.98)
  }

  const pulseOut = () => {
    bg.setScale(1)
    text.setScale(1)
  }

  bg.on('pointerdown', () => {
    pulseIn()
    onPress()
  })
  bg.on('pointerup', pulseOut)
  bg.on('pointerout', pulseOut)
  bg.on('pointerover', () => {
    bg.setFillStyle(fill, 1)
  })

  return { bg, text }
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
    const profile = loadProfile()

    this.cameras.main.setBackgroundColor('#07070d')

    const bg = this.add.graphics()
    bg.fillStyle(0x080913, 1)
    bg.fillRect(0, 0, width, height)

    const sunsetOuter = this.add.circle(width * 0.5, 200, 180, 0xff6f2d, 0.12)
    sunsetOuter.setBlendMode(Phaser.BlendModes.ADD)

    const sunsetInner = this.add.circle(width * 0.5, 200, 102, 0xffc97b, 0.16)
    sunsetInner.setBlendMode(Phaser.BlendModes.ADD)

    for (let i = 0; i < 18; i++) {
      const bw = Phaser.Math.Between(28, 78)
      const bh = Phaser.Math.Between(120, 320)
      const x = i * 45 + Phaser.Math.Between(-8, 8)
      const y = 340 - bh / 2

      this.add.rectangle(x, y, bw, bh, 0x11131a, 0.96)

      const lights = Phaser.Math.Between(2, 6)
      for (let j = 0; j < lights; j++) {
        this.add.rectangle(
          x - bw / 4 + Phaser.Math.Between(0, Math.max(8, Math.floor(bw / 2))),
          y - bh / 3 + j * 20,
          5,
          10,
          0xffc76c,
          0.25,
        )
      }
    }

    this.add.text(width / 2, 78, 'ASPHALT ANGER', {
      fontFamily: 'Arial Black',
      fontSize: '54px',
      color: '#ff5a1f',
      stroke: '#000000',
      strokeThickness: 10,
    }).setOrigin(0.5)

    this.add.text(width / 2, 128, 'Mission flow polish + mobile-ready prototype', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.add.text(
      width / 2,
      166,
      `Cash: $${profile.cash}   Scrap: ${profile.scrap}   Unlocked: ${profile.unlockedMission + 1}/${MISSIONS.length}`,
      {
        fontFamily: 'Arial Black',
        fontSize: '16px',
        color: '#ffd7b0',
        stroke: '#000000',
        strokeThickness: 4,
      },
    ).setOrigin(0.5)

    this.add.rectangle(width / 2, 394, 330, 214, 0x000000, 0.5)
    this.add.rectangle(width / 2, 394, 334, 218, 0xff6a2a, 0.16)

    const bobPortrait = this.add.image(width / 2, 372, 'angryBob')
    bobPortrait.setDisplaySize(288, 176)

    this.add.text(width / 2, 468, 'ANGRY BOB', {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    const infoBox = this.add.rectangle(width / 2, 704, 610, 255, 0x0f1015, 0.9)
    infoBox.setStrokeStyle(3, 0xff8a3d, 0.28)

    this.add.text(width / 2, 606, 'THIS BUILD', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffcb8e',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.add.text(
      width / 2,
      726,
      [
        '• Mission briefing scene before each run',
        '• Clickable post-mission buttons so no freeze feeling',
        '• Portrait mobile controls',
        '• District system and garage upgrades',
        '• Street lights, stop signs, smoke weapon',
        '• Neon skyline, billboards, haze, road reflections',
      ].join('\n'),
      {
        fontFamily: 'Arial Black',
        fontSize: '18px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      },
    ).setOrigin(0.5)

    createActionButton(this, width / 2, height - 116, 320, 54, 'OPEN CITY MAP', () => {
      this.scene.start('MapScene')
    })

    createActionButton(this, width / 2, height - 56, 220, 44, 'GARAGE', () => {
      this.scene.start('GarageScene')
    }, 0x2d6fd6, '#eff8ff')

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('MapScene')
    })

    this.input.keyboard?.once('keydown-G', () => {
      this.scene.start('GarageScene')
    })
  }
}

class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene')
  }

  create() {
    const { width, height } = this.scale
    const profile = loadProfile()

    this.cameras.main.setBackgroundColor('#091016')
    this.add.rectangle(width / 2, height / 2, width, height, 0x091016, 1)

    this.add.text(width / 2, 54, 'DESTINATION MAP', {
      fontFamily: 'Arial Black',
      fontSize: '40px',
      color: '#8df0ff',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5)

    this.add.text(width / 2, 96, 'Choose the next route', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    MISSIONS.forEach((mission, index) => {
      const y = 180 + index * 185
      const unlocked = index <= profile.unlockedMission

      const panel = this.add.rectangle(width / 2, y, 620, 150, unlocked ? 0x10161d : 0x171015, 0.92)
      panel.setStrokeStyle(3, unlocked ? 0x4dc9ff : 0x703343, 0.35)

      this.add.text(width / 2, y - 48, `${index + 1}. ${mission.title.toUpperCase()}`, {
        fontFamily: 'Arial Black',
        fontSize: '24px',
        color: unlocked ? '#8df0ff' : '#b17484',
        stroke: '#000000',
        strokeThickness: 5,
      }).setOrigin(0.5)

      this.add.text(width / 2, y - 14, mission.description, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: unlocked ? '#ffe0be' : '#9a7a84',
      }).setOrigin(0.5)

      this.add.text(
        width / 2,
        y + 18,
        mission.route.map((districtId) => DISTRICTS[districtId].name).join(' → '),
        {
          fontFamily: 'Arial Black',
          fontSize: '14px',
          color: unlocked ? '#ffd7b0' : '#7f7078',
          stroke: '#000000',
          strokeThickness: 4,
        },
      ).setOrigin(0.5)

      this.add.text(
        width / 2,
        y + 48,
        unlocked
          ? `Dest: ${mission.destination}   ${mission.distance.toFixed(1)} mi   Time: ${mission.timeLimit}s`
          : 'LOCKED',
        {
          fontFamily: 'Arial Black',
          fontSize: '16px',
          color: unlocked ? '#ffffff' : '#8d7d83',
          stroke: '#000000',
          strokeThickness: 4,
        },
      ).setOrigin(0.5)

      if (unlocked) {
        panel.setInteractive({ useHandCursor: true })
        panel.on('pointerdown', () => {
          this.scene.start('BriefingScene', { missionId: mission.id })
        })
      }
    })

    createActionButton(this, width / 2, height - 84, 250, 48, 'GARAGE', () => {
      this.scene.start('GarageScene')
    }, 0x2d6fd6, '#eff8ff')

    createActionButton(this, width / 2, height - 30, 250, 42, 'MENU', () => {
      this.scene.start('MenuScene')
    }, 0x3b3f48, '#ffffff')

    this.input.keyboard?.on('keydown-ONE', () => this.tryStartMission(0))
    this.input.keyboard?.on('keydown-TWO', () => this.tryStartMission(1))
    this.input.keyboard?.on('keydown-THREE', () => this.tryStartMission(2))
    this.input.keyboard?.on('keydown-FOUR', () => this.tryStartMission(3))
    this.input.keyboard?.on('keydown-FIVE', () => this.tryStartMission(4))
    this.input.keyboard?.once('keydown-G', () => this.scene.start('GarageScene'))
    this.input.keyboard?.once('keydown-M', () => this.scene.start('MenuScene'))
  }

  private tryStartMission(index: number) {
    const profile = loadProfile()
    if (index > profile.unlockedMission) return
    this.scene.start('BriefingScene', { missionId: MISSIONS[index].id })
  }
}

class BriefingScene extends Phaser.Scene {
  constructor() {
    super('BriefingScene')
  }

  create(data?: { missionId?: string }) {
    const { width, height } = this.scale
    const mission = getMissionById(data?.missionId)
    const profile = loadProfile()

    this.cameras.main.setBackgroundColor('#06080d')
    this.add.rectangle(width / 2, height / 2, width, height, 0x06080d, 1)

    this.add.circle(width / 2, 188, 160, 0xff7a2f, 0.08).setBlendMode(Phaser.BlendModes.ADD)
    this.add.circle(width / 2, 188, 92, 0xffd08b, 0.12).setBlendMode(Phaser.BlendModes.ADD)

    this.add.text(width / 2, 56, 'MISSION BRIEFING', {
      fontFamily: 'Arial Black',
      fontSize: '38px',
      color: '#ffcb8e',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5)

    this.add.text(width / 2, 116, mission.title.toUpperCase(), {
      fontFamily: 'Arial Black',
      fontSize: '30px',
      color: '#8df0ff',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5)

    this.add.text(width / 2, 158, mission.description, {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
    }).setOrigin(0.5)

    const panel = this.add.rectangle(width / 2, 432, 620, 430, 0x0f1319, 0.92)
    panel.setStrokeStyle(3, 0xff8a3d, 0.3)

    this.add.text(width / 2, 252, `DESTINATION: ${mission.destination}`, {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.add.text(width / 2, 286, `DISTANCE: ${mission.distance.toFixed(1)} MI`, {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffe082',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.add.text(width / 2, 320, `TIME LIMIT: ${mission.timeLimit} SEC`, {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#8df0ff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.add.text(width / 2, 354, `ROUTE: ${mission.route.map((districtId) => DISTRICTS[districtId].name).join(' → ')}`, {
      fontFamily: 'Arial Black',
      fontSize: '15px',
      color: '#ffd7b0',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
    }).setOrigin(0.5)

    this.add.text(width / 2, 402, 'YOUR RIG', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffcb8e',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    const engineBonus = `${Math.round(profile.engine * 6)}%`
    const laneMs = Math.max(80, 136 - profile.tires * 18)
    const hull = 1 + profile.armor
    const magnetRange = 72 + profile.magnet * 22

    this.add.text(
      width / 2,
      506,
      [
        'Vehicle: OLD TOW TRUCK',
        `Engine bonus: ${engineBonus}`,
        `Lane change: ${laneMs} ms`,
        `Hull: ${hull}`,
        `Magnet range: ${magnetRange}`,
      ].join('\n'),
      {
        fontFamily: 'Arial Black',
        fontSize: '18px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      },
    ).setOrigin(0.5)

    this.add.text(width / 2, 642, 'CONTROLS', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffcb8e',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.add.text(
      width / 2,
      738,
      [
        'Desktop: ← → move lanes, ↑ ↓ pace, Z honk, X smoke',
        'Mobile: left/right thumb buttons, swipe up/down, smoke button',
        'Tip: take a second, set your hands, then launch the mission',
      ].join('\n'),
      {
        fontFamily: 'Arial Black',
        fontSize: '15px',
        color: '#ffe0be',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      },
    ).setOrigin(0.5)

    createActionButton(this, width / 2, height - 118, 330, 56, 'START MISSION', () => {
      this.scene.start('GameScene', { missionId: mission.id })
    })

    createActionButton(this, width / 2, height - 56, 240, 44, 'BACK TO MAP', () => {
      this.scene.start('MapScene')
    }, 0x3b3f48, '#ffffff')

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('GameScene', { missionId: mission.id })
    })
    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('GameScene', { missionId: mission.id })
    })
    this.input.keyboard?.once('keydown-ESC', () => {
      this.scene.start('MapScene')
    })
  }
}

class GarageScene extends Phaser.Scene {
  private profile!: CampaignProfile
  private statusText!: Phaser.GameObjects.Text
  private cashText!: Phaser.GameObjects.Text
  private scrapText!: Phaser.GameObjects.Text
  private bestText!: Phaser.GameObjects.Text
  private rewardText!: Phaser.GameObjects.Text
  private statText!: Phaser.GameObjects.Text
  private levelTexts: Partial<Record<UpgradeKey, Phaser.GameObjects.Text>> = {}
  private costTexts: Partial<Record<UpgradeKey, Phaser.GameObjects.Text>> = {}
  private pendingReward: MissionReward | null = null

  constructor() {
    super('GarageScene')
  }

  create(data?: { rewards?: MissionReward }) {
    const { width, height } = this.scale
    this.profile = loadProfile()
    this.pendingReward = data?.rewards ?? null

    if (this.pendingReward) {
      this.profile.cash += this.pendingReward.cash
      this.profile.scrap += this.pendingReward.scrap
      const missionIndex = MISSIONS.findIndex((mission) => mission.id === this.pendingReward?.missionId)
      if (missionIndex >= 0) {
        this.profile.unlockedMission = Math.max(
          this.profile.unlockedMission,
          Math.min(MISSIONS.length - 1, missionIndex + 1),
        )
      }
      saveProfile(this.profile)
    }

    this.cameras.main.setBackgroundColor('#090909')
    this.add.rectangle(width / 2, height / 2, width, height, 0x090909, 1)

    const glow = this.add.circle(width / 2, 120, 180, 0xff7a2f, 0.08)
    glow.setBlendMode(Phaser.BlendModes.ADD)

    this.add.text(width / 2, 46, "BOB'S GARAGE", {
      fontFamily: 'Arial Black',
      fontSize: '42px',
      color: '#ff8f45',
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5)

    this.rewardText = this.add.text(width / 2, 92, '', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#8dffb1',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.cashText = this.add.text(32, 130, '', {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#ffe082',
      stroke: '#000000',
      strokeThickness: 5,
    })

    this.scrapText = this.add.text(32, 166, '', {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#ffd7a3',
      stroke: '#000000',
      strokeThickness: 5,
    })

    this.bestText = this.add.text(width - 32, 130, '', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#b7ffd1',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(1, 0)

    this.statText = this.add.text(width - 32, 162, '', {
      fontFamily: 'Arial Black',
      fontSize: '14px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'right',
    }).setOrigin(1, 0)

    const upgrades: UpgradeKey[] = ['engine', 'tires', 'armor', 'magnet']
    const positions = [
      { x: width / 2, y: 330 },
      { x: width / 2, y: 520 },
      { x: width / 2, y: 710 },
      { x: width / 2, y: 900 },
    ]

    upgrades.forEach((key, index) => {
      const pos = positions[index]
      const panel = this.add.rectangle(pos.x, pos.y, 620, 150, 0x101116, 0.92)
      panel.setStrokeStyle(3, 0xff8a3d, 0.35)
      panel.setInteractive({ useHandCursor: true })
      panel.on('pointerdown', () => this.buyUpgrade(key))

      this.add.text(pos.x, pos.y - 46, getUpgradeLabel(key), {
        fontFamily: 'Arial Black',
        fontSize: '24px',
        color: '#ffcb8e',
        stroke: '#000000',
        strokeThickness: 5,
      }).setOrigin(0.5)

      this.add.text(pos.x, pos.y - 12, getUpgradeDescription(key), {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
      }).setOrigin(0.5)

      const levelText = this.add.text(pos.x, pos.y + 18, '', {
        fontFamily: 'Arial Black',
        fontSize: '18px',
        color: '#ffe8bc',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5)

      const costText = this.add.text(pos.x, pos.y + 48, '', {
        fontFamily: 'Arial Black',
        fontSize: '16px',
        color: '#8df0ff',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5)

      this.levelTexts[key] = levelText
      this.costTexts[key] = costText
    })

    this.add.text(width / 2, height - 140, 'OLD TOW TRUCK   →   RUSTY SEDAN [LOCKED]   →   WORK VAN [LOCKED]', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffe8bc',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.statusText = this.add.text(width / 2, height - 104, 'BUILD YOUR TOW TRUCK', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffe082',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    createActionButton(this, width / 2, height - 54, 320, 52, 'START NEXT ROUTE', () => {
      this.scene.start('MapScene')
    })

    createActionButton(this, width - 110, height - 104, 170, 40, 'MENU', () => {
      this.scene.start('MenuScene')
    }, 0x3b3f48, '#ffffff')

    createActionButton(this, 110, height - 104, 170, 40, 'MAP', () => {
      this.scene.start('MapScene')
    }, 0x2d6fd6, '#eff8ff')

    this.input.keyboard?.on('keydown-ONE', () => this.buyUpgrade('engine'))
    this.input.keyboard?.on('keydown-TWO', () => this.buyUpgrade('tires'))
    this.input.keyboard?.on('keydown-THREE', () => this.buyUpgrade('armor'))
    this.input.keyboard?.on('keydown-FOUR', () => this.buyUpgrade('magnet'))
    this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('MapScene'))
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('MapScene'))
    this.input.keyboard?.once('keydown-M', () => this.scene.start('MenuScene'))

    this.refreshUI()
  }

  private buyUpgrade(key: UpgradeKey) {
    const level = this.profile[key]
    const cost = getUpgradeCost(key, level)

    if (!cost) {
      this.statusText.setText(`${getUpgradeLabel(key)} IS MAXED`)
      return
    }

    if (this.profile.cash < cost.cash || this.profile.scrap < cost.scrap) {
      this.statusText.setText(`NOT ENOUGH CASH OR SCRAP FOR ${getUpgradeLabel(key)}`)
      return
    }

    this.profile.cash -= cost.cash
    this.profile.scrap -= cost.scrap
    this.profile[key] += 1
    saveProfile(this.profile)

    this.statusText.setText(`${getUpgradeLabel(key)} UPGRADED TO LEVEL ${this.profile[key]}`)
    this.refreshUI()
  }

  private refreshUI() {
    if (this.pendingReward) {
      this.rewardText.setText(`MISSION PAYOUT: +$${this.pendingReward.cash}   +${this.pendingReward.scrap} SCRAP`)
    } else {
      this.rewardText.setText('TUNE THE RIG BEFORE THE NEXT RUN')
      this.rewardText.setColor('#ffe0be')
    }

    this.cashText.setText(`CASH: $${this.profile.cash}`)
    this.scrapText.setText(`SCRAP: ${this.profile.scrap}`)
    this.bestText.setText(`BEST SCORE: ${loadBestScore()}`)

    const hull = 1 + this.profile.armor
    const laneMs = Math.max(80, 136 - this.profile.tires * 18)
    const magnetRange = 72 + this.profile.magnet * 22
    const engineBonus = `${Math.round(this.profile.engine * 6)}%`

    this.statText.setText(
      `Tow Truck Stats\nEngine Bonus: ${engineBonus}\nLane Change: ${laneMs} ms\nHull: ${hull}\nMagnet Range: ${magnetRange}\nUnlocked Destinations: ${this.profile.unlockedMission + 1}/${MISSIONS.length}`,
    )

    ;(['engine', 'tires', 'armor', 'magnet'] as UpgradeKey[]).forEach((key) => {
      const levelText = this.levelTexts[key]
      const costText = this.costTexts[key]
      if (!levelText || !costText) return

      const level = this.profile[key]
      const cost = getUpgradeCost(key, level)

      levelText.setText(`LEVEL ${level}/${MAX_UPGRADE_LEVEL}`)

      if (!cost) {
        costText.setText('MAXED OUT')
        costText.setColor('#8dffb1')
      } else {
        costText.setText(`BUY: $${cost.cash} + ${cost.scrap} SCRAP`)
        costText.setColor('#8df0ff')
      }
    })
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene')
  }

  create(data: { score?: number; best?: number; reason?: string; missionId?: string; missionName?: string; scrap?: number }) {
    const { width, height } = this.scale
    const score = Math.floor(data.score ?? 0)
    const best = Math.floor(data.best ?? 0)
    const reason = data.reason ?? 'WRECKED'
    const missionName = data.missionName ?? 'MISSION FAILED'
    const scrap = Math.floor(data.scrap ?? 0)
    const missionId = data.missionId ?? MISSIONS[0].id

    this.cameras.main.setBackgroundColor('#050505')
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.72)

    this.add.text(width / 2, height / 2 - 172, reason, {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#ff5a1f',
      stroke: '#000000',
      strokeThickness: 10,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 - 120, missionName, {
      fontFamily: 'Arial Black',
      fontSize: '20px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 - 26, `SCORE: ${score}`, {
      fontFamily: 'Arial Black',
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 + 18, `SCRAP: ${scrap}`, {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#ffd7a3',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2 + 58, `BEST: ${best}`, {
      fontFamily: 'Arial Black',
      fontSize: '22px',
      color: '#b7ffd1',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    createActionButton(this, width / 2, height / 2 + 150, 330, 54, 'RETRY MISSION', () => {
      this.scene.start('GameScene', { missionId })
    })

    createActionButton(this, width / 2, height / 2 + 214, 260, 46, 'BACK TO MAP', () => {
      this.scene.start('MapScene')
    }, 0x2d6fd6, '#eff8ff')

    createActionButton(this, width / 2, height / 2 + 270, 220, 42, 'GARAGE', () => {
      this.scene.start('GarageScene')
    }, 0x3b3f48, '#ffffff')

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('GameScene', { missionId })
    })
    this.input.keyboard?.once('keydown-M', () => {
      this.scene.start('MapScene')
    })
    this.input.keyboard?.once('keydown-G', () => {
      this.scene.start('GarageScene')
    })
  }
}

class GameScene extends Phaser.Scene {
  private mission!: MissionDef
  private profile!: CampaignProfile
  private districtRoute: DistrictDef[] = []
  private currentDistrictIndex = 0
  private currentDistrict!: DistrictDef

  private skyTopRect!: Phaser.GameObjects.Rectangle
  private skyBottomRect!: Phaser.GameObjects.Rectangle
  private sunOuter!: Phaser.GameObjects.Arc
  private sunInner!: Phaser.GameObjects.Arc
  private skylineBuildings: Phaser.GameObjects.Rectangle[] = []

  private roadGraphics!: Phaser.GameObjects.Graphics
  private angerFlameGraphics!: Phaser.GameObjects.Graphics

  private player!: Phaser.GameObjects.Container
  private playerShadow!: Phaser.GameObjects.Ellipse

  private enemyCars: EnemyCar[] = []
  private roadLights: RoadLight[] = []
  private speedStreaks: SpeedStreak[] = []
  private roadSigns: RoadSign[] = []
  private scrapPickups: ScrapPickup[] = []
  private smokeClouds: SmokeCloud[] = []

  private pedestrian!: Pedestrian
  private smokeCloudId = 0
  private exhaustTimer = 0
  private pedestrianRespawnTimer = 2.5

  private anger = 0
  private angerFill!: Phaser.GameObjects.Rectangle
  private angerText!: Phaser.GameObjects.Text

  private score = 0
  private displayedScore = 0
  private scoreText!: Phaser.GameObjects.Text

  private scrapCount = 0
  private scrapText!: Phaser.GameObjects.Text

  private combo = 0
  private comboTimer = 0
  private comboText!: Phaser.GameObjects.Text

  private speedStep = 0
  private speedText!: Phaser.GameObjects.Text

  private distanceRemaining = 0
  private missionTimer = 0

  private distanceText!: Phaser.GameObjects.Text
  private timerText!: Phaser.GameObjects.Text
  private districtText!: Phaser.GameObjects.Text
  private routeText!: Phaser.GameObjects.Text
  private hullText!: Phaser.GameObjects.Text

  private hull = 1
  private hullMax = 1

  private hornText!: Phaser.GameObjects.Text
  private smokeText!: Phaser.GameObjects.Text
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

  private enemyWarningBg!: Phaser.GameObjects.Rectangle
  private enemyWarningText!: Phaser.GameObjects.Text
  private enemyWarningTimer = 0

  private districtBannerBg!: Phaser.GameObjects.Rectangle
  private districtBannerText!: Phaser.GameObjects.Text

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keyZ!: Phaser.Input.Keyboard.Key
  private keyX!: Phaser.Input.Keyboard.Key
  private keyC!: Phaser.Input.Keyboard.Key

  private rushReadyText!: Phaser.GameObjects.Text
  private rushMeterFill!: Phaser.GameObjects.Rectangle
  private rushActive = false
  private rushTimer = 0
  private rushCooldown = 0

  private launchLocked = true
  private launchOverlayBg!: Phaser.GameObjects.Rectangle
  private launchOverlayText!: Phaser.GameObjects.Text
  private launchOverlaySubText!: Phaser.GameObjects.Text

  private weatherMode: WeatherMode = 'clear'
  private weatherTintOverlay!: Phaser.GameObjects.Rectangle
  private rainDrops: Phaser.GameObjects.Rectangle[] = []
  private weatherFlashTimer = 0

  private roadFxGraphics!: Phaser.GameObjects.Graphics
  private horizonHaze!: Phaser.GameObjects.Ellipse
  private cinematicGlowOverlay!: Phaser.GameObjects.Rectangle
  private vignetteOverlay!: Phaser.GameObjects.Rectangle
  private stars: AmbientStar[] = []
  private skylineTwinkles: SkylineTwinkle[] = []
  private billboards: NeonBillboard[] = []

  private trafficWaveTimer = 10
  private trafficWaveCount = 0

  private rivalBoss?: EnemyCar
  private rivalBossState: BossRivalState = 'inactive'
  private rivalBossName = 'MAD DOG MARCUS'
  private rivalBossHull = 0
  private rivalBossMaxHull = 0
  private rivalBossTriggered = false
  private rivalBossBarBg!: Phaser.GameObjects.Rectangle
  private rivalBossBarFill!: Phaser.GameObjects.Rectangle
  private rivalBossText!: Phaser.GameObjects.Text

  private setPieceHazards: SetPieceHazard[] = []
  private setPieceTriggeredCount = 0

  private dashDepths: number[] = []

  private roadSpeed = 0.36
  private currentLaneIndex = 1
  private isChangingLanes = false
  private hornCooldown = 0
  private smokeCooldown = 0
  private gameEnded = false
  private laneChangeDuration = 130
  private scrapMagnetRadius = 72

  private centerX = 0
  private horizonY = 0
  private bottomY = 0
  private roadTopHalfWidth = 0
  private roadBottomHalfWidth = 0
  private playerBaseY = 0
  private laneBottomXs: number[] = []

  private isTouchDevice = false
  private touchStartX = 0
  private touchStartY = 0

  private mobileThumbRadius = 56
  private mobileLeftButtonX = 0
  private mobileLeftButtonY = 0
  private mobileRightButtonX = 0
  private mobileRightButtonY = 0

  private abilityButtonX = 0
  private abilityButtonY = 0
  private abilityButtonRadius = 52

  private mobileRushButtonX = 0
  private mobileRushButtonY = 0
  private mobileRushButtonRadius = 46

  private mobileRotateBg?: Phaser.GameObjects.Rectangle
  private mobileRotateText?: Phaser.GameObjects.Text

  private mobileAbilityButtonBg?: Phaser.GameObjects.Ellipse
  private mobileAbilityButtonRing?: Phaser.GameObjects.Ellipse
  private mobileAbilityButtonText?: Phaser.GameObjects.Text

  private mobileRushButtonBg?: Phaser.GameObjects.Ellipse
  private mobileRushButtonRing?: Phaser.GameObjects.Ellipse
  private mobileRushButtonText?: Phaser.GameObjects.Text

  private mobileLeftButtonBg?: Phaser.GameObjects.Ellipse
  private mobileRightButtonBg?: Phaser.GameObjects.Ellipse
  private mobileLeftButtonText?: Phaser.GameObjects.Text
  private mobileRightButtonText?: Phaser.GameObjects.Text

  private mobileSpeedHint?: Phaser.GameObjects.Text

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

  private speedFactor() {
    const engineBonus = this.profile.engine * 0.06
    const rushBonus = this.rushActive ? 0.48 : 0
    return Phaser.Math.Clamp(
      1 + this.speedStep * 0.14 + engineBonus + this.currentDistrict.speedBias + rushBonus,
      0.72,
      2.18,
    )
  }

  private speedLabel() {
    switch (this.speedStep) {
      case -2:
        return 'PACE: CRAWL'
      case -1:
        return 'PACE: EASY'
      case 0:
        return 'PACE: CRUISE'
      case 1:
        return 'PACE: PUSH'
      case 2:
        return 'PACE: FAST'
      case 3:
        return 'PACE: MAD MAX'
      default:
        return 'PACE: CRUISE'
    }
  }

  private isSmallMobileScreen() {
    const minSide = Math.min(window.innerWidth, window.innerHeight)
    const maxSide = Math.max(window.innerWidth, window.innerHeight)
    return minSide <= 600 || maxSide <= 950
  }

  private isMobileLandscapeViewport() {
    return this.isTouchDevice && this.isSmallMobileScreen() && window.innerWidth > window.innerHeight
  }

  private isPointerInCircle(x: number, y: number, cx: number, cy: number, radius: number) {
    const dx = x - cx
    const dy = y - cy
    return dx * dx + dy * dy <= radius * radius
  }

  private updateMobileControlLayout() {
    if (!this.isTouchDevice) return

    const { width, height } = this.scale
    const blocked = this.isMobileLandscapeViewport()

    this.mobileLeftButtonX = width * 0.2
    this.mobileLeftButtonY = height - 110
    this.mobileRightButtonX = width * 0.8
    this.mobileRightButtonY = height - 110

    this.mobileRushButtonX = width / 2
    this.mobileRushButtonY = height - 322

    this.abilityButtonX = width / 2
    this.abilityButtonY = height - 228

    if (this.mobileLeftButtonBg) {
      this.mobileLeftButtonBg.setPosition(this.mobileLeftButtonX, this.mobileLeftButtonY)
      this.mobileLeftButtonBg.setVisible(!blocked)
    }

    if (this.mobileRightButtonBg) {
      this.mobileRightButtonBg.setPosition(this.mobileRightButtonX, this.mobileRightButtonY)
      this.mobileRightButtonBg.setVisible(!blocked)
    }

    if (this.mobileLeftButtonText) {
      this.mobileLeftButtonText.setPosition(this.mobileLeftButtonX, this.mobileLeftButtonY)
      this.mobileLeftButtonText.setVisible(!blocked)
    }

    if (this.mobileRightButtonText) {
      this.mobileRightButtonText.setPosition(this.mobileRightButtonX, this.mobileRightButtonY)
      this.mobileRightButtonText.setVisible(!blocked)
    }

    if (this.mobileRushButtonBg) {
      this.mobileRushButtonBg.setPosition(this.mobileRushButtonX, this.mobileRushButtonY)
      this.mobileRushButtonBg.setVisible(!blocked)
    }

    if (this.mobileRushButtonRing) {
      this.mobileRushButtonRing.setPosition(this.mobileRushButtonX, this.mobileRushButtonY)
      this.mobileRushButtonRing.setVisible(!blocked)
    }

    if (this.mobileRushButtonText) {
      this.mobileRushButtonText.setPosition(this.mobileRushButtonX, this.mobileRushButtonY)
      this.mobileRushButtonText.setVisible(!blocked)
    }

    if (this.mobileAbilityButtonBg) {
      this.mobileAbilityButtonBg.setPosition(this.abilityButtonX, this.abilityButtonY)
      this.mobileAbilityButtonBg.setVisible(!blocked)
    }

    if (this.mobileAbilityButtonRing) {
      this.mobileAbilityButtonRing.setPosition(this.abilityButtonX, this.abilityButtonY)
      this.mobileAbilityButtonRing.setVisible(!blocked)
    }

    if (this.mobileAbilityButtonText) {
      this.mobileAbilityButtonText.setPosition(this.abilityButtonX, this.abilityButtonY)
      this.mobileAbilityButtonText.setVisible(!blocked)
    }

    if (this.mobileSpeedHint) {
      this.mobileSpeedHint.setPosition(width / 2, height - 392)
      this.mobileSpeedHint.setVisible(!blocked)
    }

    if (this.mobileRotateBg) {
      this.mobileRotateBg.setPosition(width / 2, height / 2)
      this.mobileRotateBg.width = width
      this.mobileRotateBg.height = height
      this.mobileRotateBg.setVisible(blocked)
    }

    if (this.mobileRotateText) {
      this.mobileRotateText.setPosition(width / 2, height / 2)
      this.mobileRotateText.setVisible(blocked)
    }
  }


  private getNightIntensity() {
    if (this.currentDistrict.id === 'entertainment') return 1
    if (this.currentDistrict.id === 'downtown') return 0.9
    if (this.currentDistrict.id === 'highway') return 0.72
    if (this.currentDistrict.id === 'industrial') return 0.56
    if (this.currentDistrict.id === 'shopping') return 0.5
    return 0.3
  }

  private randomBillboardLabel() {
    const labels = ['LOCK IN', 'RUSH', "BOB'S", '24/7', 'BURN', 'CITY', 'NITRO', 'ANGER']
    return labels[Phaser.Math.Between(0, labels.length - 1)]
  }

  private createNeonBillboard(label: string, tint: number) {
    const container = this.add.container(0, 0)

    const glow = this.add.ellipse(0, 0, 164, 96, tint, 0.14)
    glow.setBlendMode(Phaser.BlendModes.ADD)

    const pole = this.add.rectangle(0, 64, 8, 88, 0x2b2f38, 0.98)
    const frame = this.add.rectangle(0, 0, 122, 66, 0x07090d, 0.96)
    frame.setStrokeStyle(3, tint, 0.8)

    const panel = this.add.rectangle(0, 0, 112, 56, tint, 0.16)
    const stripe = this.add.rectangle(0, 18, 92, 4, 0xffffff, 0.12)
    const footer = this.add.rectangle(0, 28, 74, 4, tint, 0.46)

    const text = this.add.text(0, -4, label, {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#fff4d8',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    container.add([glow, pole, frame, panel, stripe, footer, text])

    return {
      container,
      glow,
      panel,
      text,
      side: Phaser.Math.Between(0, 1) === 0 ? 'left' : 'right',
      depth: Phaser.Math.FloatBetween(0.06, 0.24),
      label,
      tint,
    } satisfies NeonBillboard
  }

  private resetBillboard(billboard: NeonBillboard) {
    billboard.side = Phaser.Math.Between(0, 1) === 0 ? 'left' : 'right'
    billboard.depth = Phaser.Math.FloatBetween(0.06, 0.22)
    billboard.label = this.randomBillboardLabel()
    billboard.tint = this.currentDistrict.accentColor
    billboard.text.setText(billboard.label)
    billboard.panel.setFillStyle(billboard.tint, 0.16)
    billboard.glow.setFillStyle(billboard.tint, 0.14 + this.currentDistrict.lightStrength * 0.16)
  }

  private updateShowcaseGraphics(time: number, delta: number) {
    const { width } = this.scale
    const night = this.getNightIntensity()

    for (const star of this.stars) {
      star.dot.x += star.drift * (delta / 1000)
      if (star.dot.x < -8) star.dot.x = width + 8
      if (star.dot.x > width + 8) star.dot.x = -8

      const twinkle = 0.62 + Math.sin(time * 0.0018 + star.twinkle) * 0.38
      star.dot.alpha = (0.04 + night * 0.32) * twinkle
    }

    for (const windowLight of this.skylineTwinkles) {
      const pulse = 0.6 + Math.sin(time * 0.003 + windowLight.twinkle) * 0.4
      windowLight.light.alpha = windowLight.baseAlpha * pulse * (0.4 + night * 0.9)
    }

    for (const billboard of this.billboards) {
      billboard.depth += this.roadSpeed * 0.48 * (0.56 + billboard.depth * 1.24) * (delta / 1000)
      if (billboard.depth > 1.05) this.resetBillboard(billboard)

      const p = this.project(billboard.depth)
      billboard.container.x = this.roadEdgeX(
        billboard.side,
        billboard.depth,
        Phaser.Math.Linear(96, 212, p.eased),
      )
      billboard.container.y = p.y - Phaser.Math.Linear(84, 208, p.eased)
      billboard.container.setScale(Phaser.Math.Linear(0.22, 1.2, p.eased))
      billboard.container.setAlpha(Phaser.Math.Linear(0.18, 1, p.eased))
      billboard.container.setDepth(Math.floor(p.y) + 2)

      billboard.panel.setFillStyle(billboard.tint, 0.12 + night * 0.08)
      billboard.glow.setFillStyle(billboard.tint, 0.08 + night * 0.16 + (this.rushActive ? 0.05 : 0))
      billboard.glow.alpha = 0.08 + night * 0.14 + (this.rushActive ? 0.06 : 0)
    }

    this.horizonHaze.alpha = 0.06 + night * 0.14 + (this.weatherMode === 'fog' ? 0.1 : 0)
    this.sunOuter.setScale(1 + Math.sin(time * 0.0009) * 0.018)
    this.sunInner.setScale(1 + Math.sin(time * 0.0012 + 0.8) * 0.022)

    this.cinematicGlowOverlay.alpha = Math.min(
      0.24,
      0.03 + night * 0.03 + this.anger * 0.001 + (this.rushActive ? 0.08 : 0),
    )

    this.vignetteOverlay.alpha = 0.05 + night * 0.04 + (this.weatherMode === 'storm' ? 0.03 : 0)
  }

  private refreshWeatherMode() {
    if (this.currentDistrict.id === 'highway' || this.currentDistrict.id === 'downtown') {
      this.weatherMode = 'rain'
    } else if (this.currentDistrict.id === 'entertainment') {
      this.weatherMode = 'storm'
    } else if (this.currentDistrict.id === 'industrial') {
      this.weatherMode = 'fog'
    } else {
      this.weatherMode = 'clear'
    }

    if (!this.weatherTintOverlay) return

    if (this.weatherMode === 'clear') {
      this.weatherTintOverlay.setFillStyle(0x9fc6ff, 0)
    } else if (this.weatherMode === 'fog') {
      this.weatherTintOverlay.setFillStyle(0xe3ebf5, 0.08)
    } else if (this.weatherMode === 'storm') {
      this.weatherTintOverlay.setFillStyle(0x8ca9da, 0.08)
    } else {
      this.weatherTintOverlay.setFillStyle(0x89b7ff, 0.04)
    }
  }

  private startLaunchSequence() {
    const { width, height } = this.scale

    this.launchLocked = true

    this.launchOverlayBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.24)
    this.launchOverlayBg.setDepth(9800)

    this.launchOverlayText = this.add.text(width / 2, height * 0.44, '3', {
      fontFamily: 'Arial Black',
      fontSize: '118px',
      color: '#ffe8bc',
      stroke: '#000000',
      strokeThickness: 12,
    }).setOrigin(0.5)
    this.launchOverlayText.setDepth(9801)

    this.launchOverlaySubText = this.add.text(width / 2, height * 0.53, 'CHECK MIRRORS', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#8df0ff',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5)
    this.launchOverlaySubText.setDepth(9801)

    const steps = [
      { delay: 0, label: '3', sub: 'CHECK MIRRORS' },
      { delay: 700, label: '2', sub: 'GRIP THE WHEEL' },
      { delay: 1400, label: '1', sub: 'HOLD THE LINE' },
      { delay: 2100, label: 'GO!', sub: `DESTINATION ${this.mission.destination}` },
    ]

    steps.forEach((step) => {
      this.time.delayedCall(step.delay, () => {
        this.launchOverlayText.setText(step.label)
        this.launchOverlaySubText.setText(step.sub)
        this.launchOverlayText.setScale(1.25)
        this.launchOverlaySubText.setScale(1.08)

        this.tweens.add({
          targets: [this.launchOverlayText, this.launchOverlaySubText],
          scale: 1,
          duration: 170,
          ease: 'Back.Out',
        })
      })
    })

    this.time.delayedCall(2900, () => {
      this.launchLocked = false

      this.tweens.add({
        targets: [this.launchOverlayBg, this.launchOverlayText, this.launchOverlaySubText],
        alpha: 0,
        duration: 260,
        ease: 'Quad.Out',
        onComplete: () => {
          this.launchOverlayBg.destroy()
          this.launchOverlayText.destroy()
          this.launchOverlaySubText.destroy()
        },
      })
    })
  }

  private triggerTrafficWave() {
    this.trafficWaveCount += 1

    const spawnCount = Math.min(3, 1 + Math.floor(this.trafficWaveCount / 2))
    const pool: EnemyKind[] = ['traffic', 'traffic', 'texting']
    if (this.trafficWaveCount >= 2) pool.push('turning')
    if (this.trafficWaveCount >= 4) pool.push('switchlane')

    for (let i = 0; i < spawnCount; i++) {
      if (this.enemyCars.length >= 14) break
      const kind = pool[Phaser.Math.Between(0, pool.length - 1)]
      this.createEnemy(kind, 0.03 + i * 0.05)
    }

    this.trafficWaveTimer = Math.max(6.5, 12 - this.trafficWaveCount * 0.42 + Phaser.Math.FloatBetween(-0.4, 1.2))
    this.showEnemyWarning(`WAVE ${this.trafficWaveCount} INCOMING`)
    this.spawnScorePopup(this.scale.width / 2, 214, `WAVE ${this.trafficWaveCount}`, '#ffcb8e')
  }

  private createSetPieceContainer(kind: SetPieceKind, label: string, color: number) {
    const hazard = this.add.container(0, 0)

    const glow = this.add.rectangle(0, 0, 108, 150, color, 0.14)
    glow.setBlendMode(Phaser.BlendModes.ADD)

    const body = this.add.rectangle(0, 0, 88, 132, color, 1)
    body.setStrokeStyle(4, 0x000000)

    const roof = this.add.rectangle(0, -24, 54, 26, 0xf2f2f2, 0.9)
    roof.setStrokeStyle(2, 0x000000)

    const stripe = this.add.rectangle(0, 8, 72, 10, 0x1a1a1a, 0.2)

    const wheelFL = this.add.rectangle(-34, -24, 10, 22, 0x111111)
    const wheelFR = this.add.rectangle(34, -24, 10, 22, 0x111111)
    const wheelRL = this.add.rectangle(-34, 28, 10, 22, 0x111111)
    const wheelRR = this.add.rectangle(34, 28, 10, 22, 0x111111)

    const panel = this.add.rectangle(0, 44, 74, 20, 0x000000, 0.45)
    const text = this.add.text(0, 44, label, {
      fontFamily: 'Arial Black',
      fontSize: '11px',
      color: '#fff6df',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5)

    hazard.add([glow, body, roof, stripe, wheelFL, wheelFR, wheelRL, wheelRR, panel, text])

    if (kind === 'construction') {
      const coneL = this.add.triangle(-22, -48, 0, 18, 10, -8, 20, 18, 0xfff1c8, 1)
      coneL.setStrokeStyle(2, 0x000000)
      const coneR = this.add.triangle(22, -48, 0, 18, 10, -8, 20, 18, 0xfff1c8, 1)
      coneR.setStrokeStyle(2, 0x000000)
      hazard.add([coneL, coneR])
    } else if (kind === 'roadblock') {
      const bar = this.add.rectangle(0, -46, 78, 12, 0xeef5ff, 0.95)
      bar.setStrokeStyle(2, 0x000000)
      hazard.add(bar)
    } else if (kind === 'concert') {
      const lightL = this.add.circle(-22, -46, 8, 0xff9ae0, 0.95)
      const lightR = this.add.circle(22, -46, 8, 0x93ffd3, 0.95)
      lightL.setBlendMode(Phaser.BlendModes.ADD)
      lightR.setBlendMode(Phaser.BlendModes.ADD)
      hazard.add([lightL, lightR])
    }

    return hazard
  }

  private spawnSetPieceForCurrentDistrict() {
    const style = setPieceStyleForDistrict(this.currentDistrict.id)
    const laneIndex = Phaser.Math.Between(0, 2)
    const container = this.createSetPieceContainer(style.kind, style.label, style.color)
    const shadow = this.add.ellipse(0, 0, 70, 20, 0x000000, 0.24)

    const hazard: SetPieceHazard = {
      container,
      shadow,
      laneIndex,
      depth: 0.06,
      speed: Phaser.Math.FloatBetween(0.23, 0.3),
      label: style.label,
      kind: style.kind,
      active: true,
      passed: false,
    }

    this.setPieceHazards.push(hazard)
    this.showEnemyWarning(style.label)
    this.spawnScorePopup(this.scale.width / 2, 214, style.label, '#ffddb0')
  }

  private maybeTriggerSetPiece(progress: number) {
    const thresholds = [0.32, 0.68]
    if (this.setPieceTriggeredCount >= thresholds.length) return

    const nextThreshold = thresholds[this.setPieceTriggeredCount]
    if (progress >= nextThreshold) {
      this.setPieceTriggeredCount += 1
      this.spawnSetPieceForCurrentDistrict()
    }
  }

  private spawnRivalBoss() {
    if (this.rivalBossTriggered) return

    this.rivalBossTriggered = true
    this.rivalBossState = 'warning'
    this.rivalBossName =
      this.mission.id === 'concert'
        ? 'VIPER VINCE'
        : this.mission.id === 'tire'
          ? 'SHADY SHAWN'
          : 'MAD DOG MARCUS'

    this.time.delayedCall(900, () => {
      const container = this.createEnemyCar('switchlane')
      const badge = this.add.text(0, -86, this.rivalBossName, {
        fontFamily: 'Arial Black',
        fontSize: '12px',
        color: '#ffd7b0',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5)
      const badgeBg = this.add.rectangle(0, -86, badge.width + 18, 18, 0x000000, 0.44)
      container.add([badgeBg, badge])

      const shadow = this.add.ellipse(0, 0, 62, 18, 0x000000, 0.26)
      const boss: EnemyCar = {
        container,
        shadow,
        laneIndex: Phaser.Math.Between(0, 2),
        depth: 0.08,
        speed: 0.3,
        kind: 'switchlane',
        switchCooldown: 0.6,
        warningShown: true,
      }

      boss.container.setData('nearMissed', false)
      boss.container.setData('lastSmokeCloudId', -1)

      this.rivalBoss = boss
      this.rivalBossState = 'active'
      this.rivalBossMaxHull = 5
      this.rivalBossHull = this.rivalBossMaxHull
      this.showEnemyWarning(`${this.rivalBossName} IS ON YOU`)
      this.showBobReaction('RIVAL INCOMING!')
      this.rivalBossBarBg.setAlpha(0.7)
      this.rivalBossText.setAlpha(1)
      this.rivalBossText.setText(this.rivalBossName)
    })
  }

  private damageRivalBoss(amount: number, x: number, y: number, label = 'HIT') {
    if (!this.rivalBoss || this.rivalBossState !== 'active') return

    this.rivalBossHull = Math.max(0, this.rivalBossHull - amount)
    this.spawnSparkBurst(x, y, 0xffe2a8)
    this.spawnScorePopup(x, y - 10, label, '#ffe8bc')
    this.score += 220 * amount + this.combo * 20
    this.addCombo()

    if (this.rivalBossHull <= 0) {
      this.rivalBossState = 'defeated'
      this.showBobReaction('RIVAL DROPPED!')
      this.showEnemyWarning(`${this.rivalBossName} WIPED OUT`)
      this.cameras.main.flash(140, 255, 230, 180)
      this.score += 900
      this.scrapCount += 3
      this.scrapText.setText(`SCRAP: ${this.scrapCount}`)

      this.tweens.add({
        targets: [this.rivalBoss.container, this.rivalBoss.shadow],
        alpha: 0,
        duration: 260,
        onComplete: () => {
          this.rivalBoss?.container.destroy()
          this.rivalBoss?.shadow.destroy()
          this.rivalBoss = undefined
        },
      })
    }
  }

  private updateRivalBoss(delta: number) {
    if (!this.rivalBoss || this.rivalBossState !== 'active') return

    const boss = this.rivalBoss
    boss.switchCooldown -= delta / 1000

    if (boss.switchCooldown <= 0) {
      boss.laneIndex = Phaser.Math.Clamp(
        this.currentLaneIndex + Phaser.Math.Between(-1, 1),
        0,
        2,
      )
      boss.switchCooldown = Phaser.Math.FloatBetween(0.35, 0.7)
    }

    boss.depth += boss.speed * this.speedFactor() * 1.18 * (0.52 + boss.depth * 1.8) * (delta / 1000)
    if (boss.depth > 0.96) boss.depth = 0.38

    const p = this.project(boss.depth)
    const targetX = this.laneCenterX(boss.laneIndex, boss.depth)

    boss.container.x = Phaser.Math.Linear(boss.container.x || targetX, targetX, 0.18)
    boss.container.y = p.y
    boss.container.setScale(p.scale * 0.95)
    boss.container.setAlpha(Phaser.Math.Linear(0.6, 1, p.eased))
    boss.container.setDepth(Math.floor(p.y) + 3)

    boss.shadow.x = boss.container.x
    boss.shadow.y = boss.container.y + Phaser.Math.Linear(8, 30, p.eased)
    boss.shadow.setScale(Phaser.Math.Linear(0.22, 1.15, p.eased), Phaser.Math.Linear(0.18, 0.94, p.eased))
    boss.shadow.alpha = Phaser.Math.Linear(0.08, 0.24, p.eased)
    boss.shadow.setDepth(Math.floor(p.y) + 2)
  }

  private triggerRageRush() {
    if (this.launchLocked || this.gameEnded) return
    if (this.rushActive || this.rushCooldown > 0) return
    if (this.anger < 65) return

    this.rushActive = true
    this.rushTimer = 3600
    this.rushCooldown = 12000
    this.anger = Math.max(0, this.anger - 52)

    this.showBobReaction('RAGE RUSH!')
    this.cameras.main.flash(120, 255, 210, 140)
    this.spawnSparkBurst(this.player.x, this.player.y - 10, 0xffefb8)
  }

  private adjustSpeedStep(amount: number) {
    const previous = this.speedStep
    this.speedStep = Phaser.Math.Clamp(this.speedStep + amount, -2, 3)

    if (this.speedStep === previous) return

    this.speedText.setText(this.speedLabel())

    if (amount > 0) {
      this.showBobReaction('PEDAL DOWN!')
    } else {
      this.showBobReaction('SLOW IT DOWN')
    }

    this.tweens.killTweensOf(this.speedText)
    this.speedText.setScale(1.12)
    this.tweens.add({
      targets: this.speedText,
      scale: 1,
      duration: 120,
      ease: 'Quad.Out',
    })
  }

  private createTowTruck(x: number, y: number) {
    const truck = this.add.container(x, y)

    const bodyGlow = this.add.rectangle(0, 0, 100, 160, 0xff8f3a, 0.14)
    bodyGlow.setBlendMode(Phaser.BlendModes.ADD)

    const underGlow = this.add.ellipse(0, 40, 88, 34, 0xff7a2f, 0.16)
    underGlow.setBlendMode(Phaser.BlendModes.ADD)

    const bed = this.add.rectangle(0, 12, 80, 120, 0x6d4d35)
    bed.setStrokeStyle(4, 0x000000)

    const sideStripe = this.add.rectangle(0, 30, 72, 10, 0xd9a25a, 0.95)

    const cabin = this.add.rectangle(0, -34, 66, 58, 0xbf7b2d)
    cabin.setStrokeStyle(4, 0x000000)

    const windshield = this.add.rectangle(0, -40, 36, 22, 0x99d8ff, 0.9)
    windshield.setStrokeStyle(2, 0x000000)

    const hood = this.add.rectangle(0, -10, 52, 18, 0x9a611e)
    hood.setStrokeStyle(2, 0x000000)

    const lightBar = this.add.rectangle(0, -58, 34, 8, 0xffc86b, 0.95)
    lightBar.setStrokeStyle(2, 0x000000)

    const lightGlow = this.add.rectangle(0, -58, 50, 18, 0xffb347, 0.12)
    lightGlow.setBlendMode(Phaser.BlendModes.ADD)

    const boomBase = this.add.rectangle(0, 46, 26, 26, 0x767d8b)
    boomBase.setStrokeStyle(3, 0x000000)

    const boomArm = this.add.rectangle(0, 72, 10, 42, 0x8b94a5)
    boomArm.setStrokeStyle(2, 0x000000)

    const towLine = this.add.rectangle(0, 96, 3, 22, 0xdddddd)
    const hook = this.add.circle(0, 109, 6, 0xdddddd)
    hook.setStrokeStyle(2, 0x000000)

    const wheelFL = this.add.rectangle(-34, -20, 10, 24, 0x111111)
    const wheelFR = this.add.rectangle(34, -20, 10, 24, 0x111111)
    const wheelRL = this.add.rectangle(-34, 42, 10, 26, 0x111111)
    const wheelRR = this.add.rectangle(34, 42, 10, 26, 0x111111)

    const headlightL = this.add.rectangle(-16, -61, 12, 8, 0xffefb8, 1)
    const headlightR = this.add.rectangle(16, -61, 12, 8, 0xffefb8, 1)

    const headlightGlowL = this.add.rectangle(-16, -68, 20, 18, 0xffd47b, 0.16)
    const headlightGlowR = this.add.rectangle(16, -68, 20, 18, 0xffd47b, 0.16)
    headlightGlowL.setBlendMode(Phaser.BlendModes.ADD)
    headlightGlowR.setBlendMode(Phaser.BlendModes.ADD)

    const rearLightsL = this.add.rectangle(-16, 67, 12, 8, 0xff4b34, 0.95)
    const rearLightsR = this.add.rectangle(16, 67, 12, 8, 0xff4b34, 0.95)

    truck.add([
      bodyGlow,
      underGlow,
      bed,
      sideStripe,
      cabin,
      windshield,
      hood,
      lightGlow,
      lightBar,
      boomBase,
      boomArm,
      towLine,
      hook,
      wheelFL,
      wheelFR,
      wheelRL,
      wheelRR,
      headlightL,
      headlightR,
      headlightGlowL,
      headlightGlowR,
      rearLightsL,
      rearLightsR,
    ])

    this.tweens.add({
      targets: [headlightGlowL, headlightGlowR, lightGlow],
      alpha: 0.05,
      yoyo: true,
      repeat: -1,
      duration: 260,
    })

    return truck
  }

  private createEnemyCar(kind: EnemyKind) {
    const colors = enemyColors(kind)
    const car = this.add.container(0, 0)

    const glowAlpha = kind === 'traffic' ? 0.1 : 0.18
    const glow = this.add.rectangle(0, 0, 84, 134, colors.body, glowAlpha)
    glow.setBlendMode(Phaser.BlendModes.ADD)

    const body = this.add.rectangle(0, 0, 72, 122, colors.body)
    body.setStrokeStyle(4, 0x000000)

    const roof = this.add.rectangle(0, -6, 44, 54, colors.roof)
    roof.setStrokeStyle(3, 0x000000)

    const rearGlass = this.add.rectangle(0, 14, 28, 18, 0x7db7de, 0.65)
    rearGlass.setStrokeStyle(2, 0x000000)

    const windshield = this.add.rectangle(0, -22, 30, 22, 0xb5e2ff, 0.8)
    windshield.setStrokeStyle(2, 0x000000)

    const wheelFL = this.add.rectangle(-31, -28, 10, 22, 0x111111)
    const wheelFR = this.add.rectangle(31, -28, 10, 22, 0x111111)
    const wheelRL = this.add.rectangle(-31, 28, 10, 22, 0x111111)
    const wheelRR = this.add.rectangle(31, 28, 10, 22, 0x111111)

    const taillightColor = kind === 'traffic' ? 0xff5555 : 0xff9c2f
    const taillightL = this.add.rectangle(-18, 55, 12, 7, taillightColor, 0.95)
    const taillightR = this.add.rectangle(18, 55, 12, 7, taillightColor, 0.95)

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

  private createRoadSign() {
    const sign = this.add.container(0, 0)

    const post = this.add.rectangle(0, 16, 4, 34, 0xb0b6c0)
    const face = this.add.circle(0, -6, 14, 0xc72626)
    face.setStrokeStyle(2, 0xffffff)

    const text = this.add.text(0, -6, 'STOP', {
      fontFamily: 'Arial Black',
      fontSize: '9px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5)

    sign.add([post, face, text])
    return sign
  }

  private createPedestrian() {
    const person = this.add.container(0, 0)

    const head = this.add.circle(0, -18, 8, 0xf1c7a5)
    const hair = this.add.circle(0, -21, 7, 0xbdbdbd)
    const body = this.add.rectangle(0, 2, 18, 30, 0x8e7ac8)
    body.setStrokeStyle(2, 0x000000)
    const armL = this.add.rectangle(-10, -1, 4, 18, 0xf1c7a5)
    const armR = this.add.rectangle(10, -1, 4, 18, 0xf1c7a5)
    const legL = this.add.rectangle(-4, 22, 4, 16, 0x3a3a3a)
    const legR = this.add.rectangle(4, 22, 4, 16, 0x3a3a3a)
    const purse = this.add.rectangle(10, 8, 8, 10, 0x654321)
    purse.setStrokeStyle(1, 0x000000)

    person.add([head, hair, body, armL, armR, legL, legR, purse])
    return person
  }

  private createScrapPickup(value: number) {
    const scrap = this.add.container(0, 0)

    const glow = this.add.circle(0, 0, 18, 0xffc76c, 0.12)
    glow.setBlendMode(Phaser.BlendModes.ADD)

    const core = this.add.circle(0, 0, 11, 0x9ea7b3)
    core.setStrokeStyle(2, 0x000000)

    const plateH = this.add.rectangle(0, 0, 20, 6, 0xd7dee6)
    plateH.setStrokeStyle(1, 0x000000)

    const plateV = this.add.rectangle(0, 0, 6, 20, 0xd7dee6)
    plateV.setStrokeStyle(1, 0x000000)

    const bolt = this.add.circle(0, 0, 3, 0x59626e)

    scrap.add([glow, core, plateH, plateV, bolt])

    return {
      container: scrap,
      laneIndex: Phaser.Math.Between(0, 2),
      depth: Phaser.Math.FloatBetween(0.04, 0.28),
      value,
      spin: Phaser.Math.FloatBetween(-2.2, 2.2),
    } satisfies ScrapPickup
  }

  private createSmokeCloud(laneIndex: number) {
    const cloud = this.add.container(0, 0)

    for (let i = 0; i < 6; i++) {
      const puff = this.add.circle(
        Phaser.Math.Between(-18, 18),
        Phaser.Math.Between(-10, 10),
        Phaser.Math.Between(8, 14),
        0xb8bcc4,
        0.28,
      )
      puff.setBlendMode(Phaser.BlendModes.ADD)
      cloud.add(puff)
    }

    return {
      id: ++this.smokeCloudId,
      container: cloud,
      laneIndex,
      depth: 0.64,
      life: 1.25,
    } satisfies SmokeCloud
  }

  private createEnemy(kind: EnemyKind, initialDepth: number) {
    const laneIndex = Phaser.Math.Between(0, 2)
    const container = this.createEnemyCar(kind)
    const shadow = this.add.ellipse(0, 0, 50, 16, 0x000000, 0.22)

    const enemy: EnemyCar = {
      container,
      shadow,
      laneIndex,
      depth: initialDepth,
      speed:
        kind === 'traffic'
          ? Phaser.Math.FloatBetween(0.19, 0.27)
          : Phaser.Math.FloatBetween(0.23, 0.34),
      kind,
      switchCooldown: Phaser.Math.FloatBetween(0.8, 1.8),
      warningShown: false,
    }

    enemy.container.x = this.laneCenterX(enemy.laneIndex, enemy.depth)
    enemy.container.y = this.project(enemy.depth).y
    enemy.shadow.x = enemy.container.x
    enemy.shadow.y = enemy.container.y + 18
    enemy.container.setData('nearMissed', false)
    enemy.container.setData('lastSmokeCloudId', -1)

    this.enemyCars.push(enemy)
  }

  private resetEnemyCar(enemy: EnemyCar, extraOffset = 0) {
    enemy.laneIndex = Phaser.Math.Between(0, 2)
    enemy.depth = Phaser.Math.FloatBetween(0.02, 0.16)
    enemy.speed =
      enemy.kind === 'traffic'
        ? Phaser.Math.FloatBetween(0.19, 0.27)
        : Phaser.Math.FloatBetween(0.23, 0.34)
    enemy.switchCooldown = Phaser.Math.FloatBetween(0.8, 1.8)
    enemy.warningShown = false
    enemy.container.x = this.laneCenterX(enemy.laneIndex, enemy.depth)
    enemy.container.y = this.project(enemy.depth).y - extraOffset
    enemy.shadow.x = enemy.container.x
    enemy.shadow.y = enemy.container.y + 18
    enemy.container.setData('nearMissed', false)
    enemy.container.setData('lastSmokeCloudId', -1)
  }

  private resetScrapPickup(pickup: ScrapPickup, extraOffset = 0) {
    pickup.laneIndex = Phaser.Math.Between(0, 2)
    pickup.depth = Phaser.Math.FloatBetween(0.04, 0.24)
    pickup.value = Phaser.Math.Between(1, 3)
    pickup.container.x = this.laneCenterX(pickup.laneIndex, pickup.depth)
    pickup.container.y = this.project(pickup.depth).y - extraOffset
  }

  private resetRoadSign(sign: RoadSign) {
    sign.side = Phaser.Math.Between(0, 1) === 0 ? 'left' : 'right'
    sign.depth = Phaser.Math.FloatBetween(0.02, 0.12)
    sign.enabled = Math.random() < this.currentDistrict.signDensity
    sign.container.setVisible(sign.enabled)
  }

  private spawnPedestrian() {
    this.pedestrian.depth = Phaser.Math.FloatBetween(0.16, 0.26)
    this.pedestrian.direction = Phaser.Math.Between(0, 1) === 0 ? 1 : -1
    this.pedestrian.xNorm = this.pedestrian.direction === 1 ? -0.18 : 1.18
    this.pedestrian.crossSpeed = Phaser.Math.FloatBetween(0.22, 0.36)
    this.pedestrian.warned = false
    this.pedestrian.container.setVisible(true)
    this.pedestrianRespawnTimer = Phaser.Math.FloatBetween(5.5, 9.5)
  }

  private moveEnemyToLane(enemy: EnemyCar, targetLane: number) {
    enemy.laneIndex = Phaser.Math.Clamp(targetLane, 0, 2)
  }

  private updateEnemyBehavior(enemy: EnemyCar, delta: number) {
    enemy.switchCooldown -= (delta / 1000) * this.currentDistrict.aggressionBias

    if (enemy.kind === 'traffic') return
    if (enemy.depth < 0.2 || enemy.depth > 0.82) return
    if (enemy.switchCooldown > 0) return

    if (enemy.kind === 'texting') {
      const options = [enemy.laneIndex]
      if (enemy.laneIndex > 0) options.push(enemy.laneIndex - 1)
      if (enemy.laneIndex < 2) options.push(enemy.laneIndex + 1)
      const target = options[Phaser.Math.Between(0, options.length - 1)]

      this.moveEnemyToLane(enemy, target)
      enemy.switchCooldown = Phaser.Math.FloatBetween(0.7, 1.4)

      if (!enemy.warningShown && enemy.depth > 0.42) {
        enemy.warningShown = true
        this.showEnemyWarning(enemyDisplayName(enemy.kind))
      }
      return
    }

    if (enemy.kind === 'turning') {
      this.moveEnemyToLane(enemy, Phaser.Math.Between(0, 2))
      enemy.switchCooldown = Phaser.Math.FloatBetween(0.9, 1.6)

      if (!enemy.warningShown && enemy.depth > 0.36) {
        enemy.warningShown = true
        this.showEnemyWarning(enemyDisplayName(enemy.kind))
      }
      return
    }

    if (enemy.kind === 'switchlane') {
      this.moveEnemyToLane(enemy, this.currentLaneIndex)
      enemy.switchCooldown = Phaser.Math.FloatBetween(0.7, 1.2)

      if (!enemy.warningShown && enemy.depth > 0.38) {
        enemy.warningShown = true
        this.showEnemyWarning(enemyDisplayName(enemy.kind))
      }
    }
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
      duration: this.laneChangeDuration,
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

    const pulse = this.add.ellipse(this.player.x, this.player.y - 92, 28, 18, 0xffcc7a, 0.9)
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
        const bonus = enemy.kind === 'traffic' ? 140 : 220
        this.score += bonus + this.combo * 20
        this.anger = Math.min(100, this.anger + 6)
        this.addCombo()
        this.spawnSparkBurst(enemy.container.x, enemy.container.y + 16, 0xffd27a)
        this.spawnScorePopup(enemy.container.x, enemy.container.y - 10, `+${bonus + this.combo * 20}`)
        this.resetEnemyCar(enemy, Phaser.Math.Between(180, 360))
      }
    }

    if (hitSomething) {
      this.cameras.main.shake(100, 0.0028)
    }
  }

  private triggerSmokeWeapon() {
    if (this.smokeCooldown > 0 || this.gameEnded) return

    this.smokeCooldown = 1000
    this.anger = Math.min(100, this.anger + 3)
    this.showBobReaction('SMOKE EM!')

    const cloud = this.createSmokeCloud(this.currentLaneIndex)
    const p = this.project(cloud.depth)
    cloud.container.x = this.laneCenterX(cloud.laneIndex, cloud.depth)
    cloud.container.y = p.y
    cloud.container.setScale(p.scale * 0.52)
    this.smokeClouds.push(cloud)

    this.spawnSparkBurst(this.player.x - 12, this.player.y + 52, 0xb8bcc4)
    this.spawnSparkBurst(this.player.x + 12, this.player.y + 52, 0xb8bcc4)
  }

  private spawnExhaustPuff() {
    const puff = this.add.circle(
      this.player.x + Phaser.Math.Between(-12, 12),
      this.player.y + 62 + Phaser.Math.Between(-4, 4),
      Phaser.Math.Between(6, 10),
      0xb8bcc4,
      0.22,
    )
    puff.setBlendMode(Phaser.BlendModes.ADD)

    this.tweens.add({
      targets: puff,
      y: puff.y + Phaser.Math.Between(18, 34),
      alpha: 0,
      scale: 1.8,
      duration: 420,
      ease: 'Quad.Out',
      onComplete: () => puff.destroy(),
    })
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
    this.reactionBg.y = 250
    this.reactionText.y = 250

    this.tweens.add({
      targets: [this.reactionBg, this.reactionText],
      y: 244,
      duration: 100,
      ease: 'Quad.Out',
    })
  }

  private showEnemyWarning(message: string) {
    this.enemyWarningText.setText(message)
    this.enemyWarningBg.width = Math.max(220, this.enemyWarningText.width + 32)
    this.enemyWarningBg.setAlpha(0.76)
    this.enemyWarningText.setAlpha(1)
    this.enemyWarningTimer = 1200
  }

  private showDistrictBanner(text: string) {
    this.districtBannerText.setText(text)
    this.districtBannerBg.width = Math.max(240, this.districtBannerText.width + 40)
    this.districtBannerBg.setAlpha(0.84)
    this.districtBannerText.setAlpha(1)

    this.time.delayedCall(1800, () => {
      this.tweens.add({
        targets: [this.districtBannerBg, this.districtBannerText],
        alpha: 0,
        duration: 320,
        ease: 'Quad.Out',
      })
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

  private drawAngerFlames(time: number) {
    this.angerFlameGraphics.clear()

    const intensity = Phaser.Math.Clamp(this.anger / 100, 0, 1)
    if (intensity < 0.12) return

    const baseX = 112
    const baseY = 18
    const flameCount = Math.ceil(2 + intensity * 5)

    for (let i = 0; i < flameCount; i++) {
      const x = baseX + i * 28
      const flicker = 0.9 + Math.sin(time * 0.012 + i * 0.9) * 0.18
      const height = Phaser.Math.Linear(8, 28, intensity) * flicker
      const width = Phaser.Math.Linear(6, 12, intensity)

      this.angerFlameGraphics.fillStyle(0xff5a1f, 0.12 + intensity * 0.18)
      this.angerFlameGraphics.fillTriangle(x, baseY + 12, x - width, baseY + 12, x, baseY - height)

      this.angerFlameGraphics.fillStyle(0xffc76c, 0.12 + intensity * 0.22)
      this.angerFlameGraphics.fillCircle(x, baseY - height + 6, 4 + intensity * 5)
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

  private updateHullText() {
    this.hullText.setText(`HULL: ${this.hull}/${this.hullMax}`)
  }

  private takeHit() {
    if (this.hull > 1) {
      this.hull -= 1
      this.updateHullText()
      this.anger = Math.min(100, this.anger + 12)
      this.showBobReaction('HOLD IT TOGETHER!')
      this.cameras.main.shake(140, 0.0038)
      this.cameras.main.flash(100, 255, 150, 90)
      return false
    }

    return true
  }

  private applyDistrictVisuals() {
    const district = this.currentDistrict

    this.skyTopRect.setFillStyle(district.skyTopColor, 1)
    this.skyBottomRect.setFillStyle(district.skyBottomColor, 1)
    this.sunOuter.setFillStyle(district.sunOuterColor, 0.12)
    this.sunInner.setFillStyle(district.sunInnerColor, 0.16)

    for (const building of this.skylineBuildings) {
      building.setFillStyle(district.skylineColor, 0.96)
    }

    this.refreshWeatherMode()

    this.horizonHaze.setFillStyle(district.accentColor, 0.08 + district.lightStrength * 0.22)
    this.cinematicGlowOverlay.setFillStyle(district.accentColor, 0.02)

    for (const billboard of this.billboards) {
      billboard.tint = district.accentColor
      billboard.panel.setFillStyle(district.accentColor, 0.16)
      billboard.glow.setFillStyle(district.accentColor, 0.12 + district.lightStrength * 0.18)
    }

    this.districtText.setText(`DISTRICT: ${district.name}`)
    this.districtText.setColor(hexColor(district.accentColor))
    this.routeText.setText(this.mission.route.map((districtId) => DISTRICTS[districtId].name).join(' → '))
  }

  private updateDistrictProgress() {
    const progress = 1 - this.distanceRemaining / this.mission.distance
    const nextIndex = Math.min(
      this.districtRoute.length - 1,
      Math.floor(progress * this.districtRoute.length),
    )

    if (nextIndex !== this.currentDistrictIndex) {
      this.currentDistrictIndex = nextIndex
      this.currentDistrict = this.districtRoute[this.currentDistrictIndex]
      this.applyDistrictVisuals()
      this.showDistrictBanner(this.currentDistrict.name)

      for (const sign of this.roadSigns) {
        this.resetRoadSign(sign)
      }
    }
  }

  private failMission(reason: string) {
    if (this.gameEnded) return

    this.gameEnded = true

    if (reason === 'WRECKED') {
      this.showBobReaction('NOOO!')
      this.cameras.main.shake(180, 0.006)
      this.cameras.main.flash(180, 255, 120, 60)
      this.spawnSparkBurst(this.player.x, this.player.y - 10, 0xff7a2f)
      this.spawnSparkBurst(this.player.x, this.player.y + 24, 0xffc86b)
    } else {
      this.showBobReaction("I'M DONE!")
      this.cameras.main.shake(120, 0.003)
      this.cameras.main.flash(140, 255, 180, 80)
    }

    const finalScore = Math.floor(this.score)
    const best = Math.max(finalScore, loadBestScore())
    saveBestScore(best)

    this.time.delayedCall(420, () => {
      this.scene.start('GameOverScene', {
        score: finalScore,
        best,
        reason,
        missionId: this.mission.id,
        missionName: this.mission.title,
        scrap: this.scrapCount,
      })
    })
  }

  private completeMission() {
    if (this.gameEnded) return

    this.gameEnded = true
    this.showBobReaction('MADE IT!')
    this.cameras.main.flash(180, 110, 255, 160)

    const finalScore = Math.floor(this.score + this.scrapCount * 24 + this.missionTimer * 6)
    const cashReward =
      this.mission.rewardBonus +
      this.scrapCount * 12 +
      Math.floor(this.missionTimer) * 2 +
      Math.floor(finalScore * 0.05)

    const best = Math.max(finalScore, loadBestScore())
    saveBestScore(best)

    const rewards: MissionReward = {
      missionId: this.mission.id,
      missionName: this.mission.title,
      score: finalScore,
      scrap: this.scrapCount,
      cash: cashReward,
    }

    this.time.delayedCall(380, () => {
      this.scene.start('GarageScene', { rewards })
    })
  }

  private drawRoad() {
    const g = this.roadGraphics
    const fx = this.roadFxGraphics
    const district = this.currentDistrict

    g.clear()
    fx.clear()

    const top = this.project(0)
    const bottom = this.project(1)

    g.fillStyle(district.shoulderColor, 0.82)
    g.beginPath()
    g.moveTo(top.left - 90, top.y)
    g.lineTo(top.right + 90, top.y)
    g.lineTo(bottom.right + 110, bottom.y)
    g.lineTo(bottom.left - 110, bottom.y)
    g.closePath()
    g.fillPath()

    g.fillStyle(district.roadColor, 1)
    g.beginPath()
    g.moveTo(top.left, top.y)
    g.lineTo(top.right, top.y)
    g.lineTo(bottom.right, bottom.y)
    g.lineTo(bottom.left, bottom.y)
    g.closePath()
    g.fillPath()

    g.lineStyle(8, district.edgeColor, 0.18)
    g.beginPath()
    g.moveTo(top.left - 10, top.y)
    g.lineTo(bottom.left - 10, bottom.y)
    g.strokePath()

    g.beginPath()
    g.moveTo(top.right + 10, top.y)
    g.lineTo(bottom.right + 10, bottom.y)
    g.strokePath()

    g.lineStyle(4, district.edgeColor, 0.55)
    g.beginPath()
    g.moveTo(top.left + 6, top.y)
    g.lineTo(bottom.left + 6, bottom.y)
    g.strokePath()

    g.beginPath()
    g.moveTo(top.right - 6, top.y)
    g.lineTo(bottom.right - 6, bottom.y)
    g.strokePath()

    fx.fillStyle(district.accentColor, 0.06 + this.currentDistrict.lightStrength * 0.08)
    fx.beginPath()
    fx.moveTo(this.centerX - 18, top.y)
    fx.lineTo(this.centerX + 18, top.y)
    fx.lineTo(this.centerX + 74, bottom.y)
    fx.lineTo(this.centerX - 74, bottom.y)
    fx.closePath()
    fx.fillPath()

    fx.lineStyle(10, district.accentColor, 0.08 + this.currentDistrict.lightStrength * 0.08)
    fx.beginPath()
    fx.moveTo(top.left - 18, top.y)
    fx.lineTo(bottom.left - 30, bottom.y)
    fx.strokePath()

    fx.beginPath()
    fx.moveTo(top.right + 18, top.y)
    fx.lineTo(bottom.right + 30, bottom.y)
    fx.strokePath()

    for (const divider of [1, 2]) {
      for (const dashDepth of this.dashDepths) {
        const d1 = dashDepth
        const d2 = Math.min(1, dashDepth + 0.08)

        const p1 = this.project(d1)
        const p2 = this.project(d2)

        const x1 = p1.left + ((p1.halfWidth * 2) / 3) * divider
        const x2 = p2.left + ((p2.halfWidth * 2) / 3) * divider

        g.lineStyle(
          Phaser.Math.Linear(1.5, 9, p1.eased),
          district.dividerColor,
          0.26 + p1.eased * 0.18,
        )
        g.beginPath()
        g.moveTo(x1, p1.y)
        g.lineTo(x2, p2.y)
        g.strokePath()
      }
    }

    for (const glossDepth of this.dashDepths.slice(0, 4)) {
      const d1 = glossDepth
      const d2 = Math.min(1, glossDepth + 0.035)
      const p1 = this.project(d1)
      const p2 = this.project(d2)
      const w1 = Phaser.Math.Linear(6, 44, p1.eased)
      const w2 = Phaser.Math.Linear(10, 72, p2.eased)

      fx.fillStyle(0xffffff, 0.018 + p1.eased * 0.045)
      fx.beginPath()
      fx.moveTo(this.centerX - w1, p1.y)
      fx.lineTo(this.centerX + w1, p1.y)
      fx.lineTo(this.centerX + w2, p2.y)
      fx.lineTo(this.centerX - w2, p2.y)
      fx.closePath()
      fx.fillPath()
    }

    for (const bandDepth of [0.18, 0.36, 0.58, 0.8]) {
      const p = this.project(bandDepth)
      fx.lineStyle(Phaser.Math.Linear(1, 5, p.eased), 0xffffff, 0.02 + p.eased * 0.03)
      fx.beginPath()
      fx.moveTo(p.left + 18, p.y)
      fx.lineTo(p.right - 18, p.y)
      fx.strokePath()
    }
  }

  private setupTouchControls(width: number, height: number) {
    const touchCapable =
      this.sys.game.device.input.touch ||
      ('ontouchstart' in window) ||
      navigator.maxTouchPoints > 0

    this.isTouchDevice = touchCapable && this.isSmallMobileScreen()

    if (!this.isTouchDevice) return

    this.mobileThumbRadius = Math.min(64, width * 0.12)
    this.mobileRushButtonRadius = Math.min(48, width * 0.092)
    this.abilityButtonRadius = Math.min(54, width * 0.1)

    this.mobileLeftButtonBg = this.add.ellipse(0, 0, this.mobileThumbRadius * 2, this.mobileThumbRadius * 2, 0xff8a3d, 0.3)
    this.mobileLeftButtonBg.setStrokeStyle(4, 0xffd7a0, 0.7)

    this.mobileRightButtonBg = this.add.ellipse(0, 0, this.mobileThumbRadius * 2, this.mobileThumbRadius * 2, 0xff8a3d, 0.3)
    this.mobileRightButtonBg.setStrokeStyle(4, 0xffd7a0, 0.7)

    this.mobileLeftButtonText = this.add.text(0, 0, '←', {
      fontFamily: 'Arial Black',
      fontSize: '34px',
      color: '#fff2d2',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.mobileRightButtonText = this.add.text(0, 0, '→', {
      fontFamily: 'Arial Black',
      fontSize: '34px',
      color: '#fff2d2',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.mobileRushButtonBg = this.add.ellipse(0, 0, this.mobileRushButtonRadius * 2, this.mobileRushButtonRadius * 2, 0xff5a1f, 0.28)
    this.mobileRushButtonBg.setStrokeStyle(4, 0xffd690, 0.74)

    this.mobileRushButtonRing = this.add.ellipse(0, 0, this.mobileRushButtonRadius * 2.28, this.mobileRushButtonRadius * 2.28, 0xffd690, 0.08)

    this.mobileRushButtonText = this.add.text(0, 0, 'RUSH', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#fff2d2',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.mobileAbilityButtonBg = this.add.ellipse(0, 0, this.abilityButtonRadius * 2, this.abilityButtonRadius * 2, 0x7d8b97, 0.34)
    this.mobileAbilityButtonBg.setStrokeStyle(4, 0xe5e8ee, 0.65)

    this.mobileAbilityButtonRing = this.add.ellipse(0, 0, this.abilityButtonRadius * 2.25, this.abilityButtonRadius * 2.25, 0xe5e8ee, 0.08)

    this.mobileAbilityButtonText = this.add.text(0, 0, 'SMK', {
      fontFamily: 'Arial Black',
      fontSize: '20px',
      color: '#fff2d2',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)

    this.mobileSpeedHint = this.add.text(0, 0, 'SWIPE ↑ FAST   SWIPE ↓ SLOW', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffd7b0',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.mobileRotateBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.88)
    this.mobileRotateBg.setDepth(10000)
    this.mobileRotateBg.setScrollFactor(0)

    this.mobileRotateText = this.add.text(width / 2, height / 2, 'ROTATE BACK TO PORTRAIT', {
      fontFamily: 'Arial Black',
      fontSize: '28px',
      color: '#ffe082',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center',
    }).setOrigin(0.5)
    this.mobileRotateText.setDepth(10001)
    this.mobileRotateText.setScrollFactor(0)

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.touchStartX = pointer.x
      this.touchStartY = pointer.y

      if (this.isMobileLandscapeViewport()) return

      if (this.isPointerInCircle(pointer.x, pointer.y, this.mobileLeftButtonX, this.mobileLeftButtonY, this.mobileThumbRadius)) {
        this.moveToLane(this.currentLaneIndex - 1)
        return
      }

      if (this.isPointerInCircle(pointer.x, pointer.y, this.mobileRightButtonX, this.mobileRightButtonY, this.mobileThumbRadius)) {
        this.moveToLane(this.currentLaneIndex + 1)
        return
      }

      if (this.isPointerInCircle(pointer.x, pointer.y, this.mobileRushButtonX, this.mobileRushButtonY, this.mobileRushButtonRadius)) {
        this.triggerRageRush()
        return
      }

      if (this.isPointerInCircle(pointer.x, pointer.y, this.abilityButtonX, this.abilityButtonY, this.abilityButtonRadius)) {
        this.triggerSmokeWeapon()
      }
    })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.gameEnded) return
      if (this.isMobileLandscapeViewport()) return

      if (
        this.isPointerInCircle(pointer.x, pointer.y, this.mobileLeftButtonX, this.mobileLeftButtonY, this.mobileThumbRadius) ||
        this.isPointerInCircle(pointer.x, pointer.y, this.mobileRightButtonX, this.mobileRightButtonY, this.mobileThumbRadius) ||
        this.isPointerInCircle(pointer.x, pointer.y, this.mobileRushButtonX, this.mobileRushButtonY, this.mobileRushButtonRadius) ||
        this.isPointerInCircle(pointer.x, pointer.y, this.abilityButtonX, this.abilityButtonY, this.abilityButtonRadius)
      ) {
        return
      }

      const dx = pointer.x - this.touchStartX
      const dy = pointer.y - this.touchStartY
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)

      if (absY > 48 && absY > absX) {
        if (dy < 0) this.adjustSpeedStep(1)
        else this.adjustSpeedStep(-1)
      }
    })

    this.updateMobileControlLayout()
  }

  create(data?: { missionId?: string }) {
    const { width, height } = this.scale

    this.mission = getMissionById(data?.missionId)
    this.profile = loadProfile()
    this.districtRoute = this.mission.route.map((districtId) => DISTRICTS[districtId])
    this.currentDistrictIndex = 0
    this.currentDistrict = this.districtRoute[0]

    this.distanceRemaining = this.mission.distance
    this.missionTimer = this.mission.timeLimit
    this.hullMax = 1 + this.profile.armor
    this.hull = this.hullMax
    this.laneChangeDuration = Math.max(78, 136 - this.profile.tires * 18)
    this.scrapMagnetRadius = 72 + this.profile.magnet * 22

    this.centerX = width / 2
    this.horizonY = 180
    this.bottomY = height + 60
    this.roadTopHalfWidth = 90
    this.roadBottomHalfWidth = 300
    this.playerBaseY = height - 300

    this.cameras.main.setBackgroundColor('#07070d')

    this.skyTopRect = this.add.rectangle(width / 2, height * 0.12, width, height * 0.24, this.currentDistrict.skyTopColor)
    this.skyBottomRect = this.add.rectangle(width / 2, height * 0.3, width, height * 0.38, this.currentDistrict.skyBottomColor)
    this.sunOuter = this.add.circle(this.centerX, 220, 180, this.currentDistrict.sunOuterColor, 0.12)
    this.sunOuter.setBlendMode(Phaser.BlendModes.ADD)
    this.sunInner = this.add.circle(this.centerX, 220, 102, this.currentDistrict.sunInnerColor, 0.16)
    this.sunInner.setBlendMode(Phaser.BlendModes.ADD)

    for (let i = 0; i < 28; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(18, width - 18),
        Phaser.Math.Between(26, 250),
        Phaser.Math.Between(1, 3),
        0xffffff,
        0.22,
      )
      star.setBlendMode(Phaser.BlendModes.ADD)
      this.stars.push({
        dot: star,
        twinkle: Phaser.Math.FloatBetween(0, Math.PI * 2),
        drift: Phaser.Math.FloatBetween(-3, 3),
      })
    }

    this.horizonHaze = this.add.ellipse(width / 2, this.horizonY + 46, width * 0.94, 190, this.currentDistrict.accentColor, 0.12)
    this.horizonHaze.setBlendMode(Phaser.BlendModes.ADD)

    for (let i = 0; i < 18; i++) {
      const bw = Phaser.Math.Between(28, 78)
      const bh = Phaser.Math.Between(120, 320)
      const x = i * 45 + Phaser.Math.Between(-8, 8)
      const y = 340 - bh / 2
      const building = this.add.rectangle(x, y, bw, bh, this.currentDistrict.skylineColor, 0.96)
      this.skylineBuildings.push(building)

      const lights = Phaser.Math.Between(2, 6)
      for (let j = 0; j < lights; j++) {
        this.add.rectangle(
          x - bw / 4 + Phaser.Math.Between(0, Math.max(8, Math.floor(bw / 2))),
          y - bh / 3 + j * 20,
          5,
          10,
          0xffc76c,
          0.25,
        )
      }
    }

    for (let i = 0; i < 42; i++) {
      const light = this.add.rectangle(
        Phaser.Math.Between(18, width - 18),
        Phaser.Math.Between(118, 334),
        Phaser.Math.Between(3, 7),
        Phaser.Math.Between(7, 14),
        0xffcf7b,
        0.2,
      )
      light.setBlendMode(Phaser.BlendModes.ADD)
      this.skylineTwinkles.push({
        light,
        twinkle: Phaser.Math.FloatBetween(0, Math.PI * 2),
        baseAlpha: Phaser.Math.FloatBetween(0.12, 0.28),
      })
    }

    for (let i = 0; i < 4; i++) {
      const billboard = this.createNeonBillboard(this.randomBillboardLabel(), this.currentDistrict.accentColor)
      billboard.side = i % 2 === 0 ? 'left' : 'right'
      billboard.depth = 0.08 + i * 0.16
      this.billboards.push(billboard)
    }

    this.roadGraphics = this.add.graphics()
    this.roadFxGraphics = this.add.graphics()
    this.angerFlameGraphics = this.add.graphics()
    this.angerFlameGraphics.setBlendMode(Phaser.BlendModes.ADD)

    for (let i = 0; i < 8; i++) {
      this.dashDepths.push(i * 0.14)
    }

    this.laneBottomXs = [
      this.laneCenterX(0, 0.98),
      this.laneCenterX(1, 0.98),
      this.laneCenterX(2, 0.98),
    ]

    for (let i = 0; i < this.mission.trafficCars; i++) {
      this.createEnemy('traffic', 0.04 + i * 0.09)
    }

    this.mission.specialKinds.forEach((kind, index) => {
      this.createEnemy(kind, 0.1 + index * 0.11)
    })

    for (let i = 0; i < this.mission.scrapCount; i++) {
      const pickup = this.createScrapPickup(Phaser.Math.Between(1, 3))
      pickup.container.x = this.laneCenterX(pickup.laneIndex, pickup.depth)
      pickup.container.y = this.project(pickup.depth).y
      this.scrapPickups.push(pickup)
    }

    for (let i = 0; i < 10; i++) {
      const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right'
      const depth = 0.05 + (i % 5) * 0.18

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
      this.speedStreaks.push({ side, depth: Math.random(), line })
    }

    for (let i = 0; i < 5; i++) {
      const sign: RoadSign = {
        side: i % 2 === 0 ? 'left' : 'right',
        depth: 0.04 + i * 0.18,
        enabled: true,
        container: this.createRoadSign(),
      }
      this.roadSigns.push(sign)
      this.resetRoadSign(sign)
    }

    this.pedestrian = {
      container: this.createPedestrian(),
      depth: 0.2,
      xNorm: -0.2,
      direction: 1,
      crossSpeed: 0.3,
      warned: false,
    }
    this.pedestrian.container.setVisible(false)

    this.playerShadow = this.add.ellipse(
      this.laneBottomXs[this.currentLaneIndex],
      this.playerBaseY + 90,
      120,
      40,
      0x000000,
      0.34,
    )
    this.playerShadow.setDepth(8999)

    this.player = this.createTowTruck(this.laneBottomXs[this.currentLaneIndex], this.playerBaseY)
    this.player.setDepth(9000)

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
      fontSize: '22px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 5,
    })

    this.scrapText = this.add.text(18, 84, 'SCRAP: 0', {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffd7a3',
      stroke: '#000000',
      strokeThickness: 4,
    })

    this.speedText = this.add.text(18, 112, this.speedLabel(), {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffe8bc',
      stroke: '#000000',
      strokeThickness: 4,
    })

    this.add.text(18, 138, 'RIG: OLD TOW TRUCK', {
      fontFamily: 'Arial Black',
      fontSize: '14px',
      color: '#ffcb8e',
      stroke: '#000000',
      strokeThickness: 4,
    })

    this.hullText = this.add.text(18, 164, '', {
      fontFamily: 'Arial Black',
      fontSize: '14px',
      color: '#b7ffd1',
      stroke: '#000000',
      strokeThickness: 4,
    })
    this.updateHullText()

    this.add.text(width / 2, 20, `MISSION: ${this.mission.title.toUpperCase()}`, {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffe8bc',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5, 0)

    this.distanceText = this.add.text(width / 2, 46, `${this.mission.destination}: ${this.distanceRemaining.toFixed(1)} MI`, {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#8df0ff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5, 0)

    this.timerText = this.add.text(width / 2, 70, `TIME: ${Math.ceil(this.missionTimer)}`, {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffe082',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5, 0)

    this.districtText = this.add.text(width / 2, 94, '', {
      fontFamily: 'Arial Black',
      fontSize: '15px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5, 0)

    this.routeText = this.add.text(width / 2, 116, '', {
      fontFamily: 'Arial Black',
      fontSize: '13px',
      color: '#ffe0be',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5, 0)

    this.comboText = this.add.text(width / 2, 144, 'COMBO x1', {
      fontFamily: 'Arial Black',
      fontSize: '20px',
      color: '#8df0ff',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5, 0)
    this.comboText.setAlpha(0.3)

    this.hornText = this.add.text(width - 18, 18, 'Z HONK', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffe7bc',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0)

    this.smokeText = this.add.text(width - 18, 44, 'X SMOKE', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#e5e8ee',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0)

    this.add.text(width - 18, 70, '↑ ↓ SPEED', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffe7bc',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0)

    const bobPanelX = width - 110
    const bobPanelY = 180

    this.add.rectangle(bobPanelX, bobPanelY, 180, 132, 0x000000, 0.58)
    this.add.rectangle(bobPanelX, bobPanelY, 184, 136, 0xff6a2a, 0.18)

    this.bobPortrait = this.add.image(bobPanelX, bobPanelY - 12, 'angryBob')
    this.bobPortrait.setDisplaySize(160, 98)
    this.bobPortrait.setAlpha(0.96)
    this.bobPortraitBaseScaleX = this.bobPortrait.scaleX
    this.bobPortraitBaseScaleY = this.bobPortrait.scaleY

    this.bobMoodText = this.add.text(bobPanelX, bobPanelY + 56, 'BOB: LOCKED IN', {
      fontFamily: 'Arial Black',
      fontSize: '14px',
      color: '#ffe8c8',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.reactionBg = this.add.rectangle(bobPanelX, 250, 160, 40, 0x000000, 0)
    this.reactionText = this.add.text(bobPanelX, 250, '', {
      fontFamily: 'Arial Black',
      fontSize: '15px',
      color: '#ffe8c8',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)
    this.reactionText.setAlpha(0)

    this.enemyWarningBg = this.add.rectangle(width / 2, 182, 250, 36, 0x4a0f0f, 0)
    this.enemyWarningText = this.add.text(width / 2, 182, '', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffd2b0',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)
    this.enemyWarningText.setAlpha(0)

    this.districtBannerBg = this.add.rectangle(width / 2, 270, 240, 44, 0x000000, 0)
    this.districtBannerBg.setDepth(9500)
    this.districtBannerText = this.add.text(width / 2, 270, '', {
      fontFamily: 'Arial Black',
      fontSize: '20px',
      color: '#ffe8bc',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5)
    this.districtBannerText.setDepth(9501)
    this.districtBannerText.setAlpha(0)

    this.heatOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0xff5a1f, 0)
    this.heatOverlay.setBlendMode(Phaser.BlendModes.ADD)

    this.speedOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0xffffff, 0)
    this.speedOverlay.setBlendMode(Phaser.BlendModes.SCREEN)

    this.weatherTintOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x9fc6ff, 0)
    this.weatherTintOverlay.setBlendMode(Phaser.BlendModes.SCREEN)

    this.cinematicGlowOverlay = this.add.rectangle(width / 2, height / 2, width, height, this.currentDistrict.accentColor, 0.02)
    this.cinematicGlowOverlay.setBlendMode(Phaser.BlendModes.ADD)

    this.vignetteOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.07)

    for (let i = 0; i < 56; i++) {
      const drop = this.add.rectangle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(-height, height),
        2,
        Phaser.Math.Between(20, 42),
        0xcfe8ff,
        0.16,
      )
      drop.setAngle(17)
      drop.setBlendMode(Phaser.BlendModes.SCREEN)
      drop.setVisible(false)
      this.rainDrops.push(drop)
    }

    this.add.rectangle(width - 146, 126, 116, 12, 0x000000, 0.62).setOrigin(0, 0.5)
    this.rushMeterFill = this.add.rectangle(width - 144, 126, 0, 8, 0xff9b3d, 1).setOrigin(0, 0.5)

    this.add.text(width - 18, 92, 'C RUSH', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffddb0',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0)

    this.rushReadyText = this.add.text(width - 18, 136, 'CHARGE 0%', {
      fontFamily: 'Arial Black',
      fontSize: '14px',
      color: '#ffe8bc',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(1, 0)

    this.rivalBossBarBg = this.add.rectangle(width / 2 - 140, 156, 280, 12, 0x000000, 0).setOrigin(0, 0.5)
    this.rivalBossBarFill = this.add.rectangle(width / 2 - 138, 156, 0, 8, 0xff9b7d, 1).setOrigin(0, 0.5)
    this.rivalBossBarFill.setAlpha(0)
    this.rivalBossText = this.add.text(width / 2, 136, '', {
      fontFamily: 'Arial Black',
      fontSize: '16px',
      color: '#ffd7b0',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)
    this.rivalBossText.setAlpha(0)

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keyZ = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.keyX = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    this.keyC = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.C)

    this.setupTouchControls(width, height)
    this.applyDistrictVisuals()
    this.showDistrictBanner(this.currentDistrict.name)
    this.showBobReaction("LET'S RIDE")
    this.updateBobMood()
    this.drawRoad()
    this.startLaunchSequence()
  }

  update(time: number, delta: number) {
    this.updateMobileControlLayout()

    if (this.isTouchDevice && this.mobileRotateBg?.visible) {
      return
    }

    if (this.gameEnded) return

    if (this.launchLocked) {
      if (this.mobileAbilityButtonRing) {
        const pulse = 1 + Math.sin(time * 0.008) * 0.04
        this.mobileAbilityButtonRing.setScale(pulse)
      }
      if (this.mobileRushButtonRing) {
        const pulse = 1 + Math.sin(time * 0.008 + 0.6) * 0.04
        this.mobileRushButtonRing.setScale(pulse)
      }
      this.updateShowcaseGraphics(time, delta)
      return
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      this.adjustSpeedStep(1)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
      this.adjustSpeedStep(-1)
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyC)) {
      this.triggerRageRush()
    }

    if (this.rushCooldown > 0) {
      this.rushCooldown = Math.max(0, this.rushCooldown - delta)
    }

    if (this.rushActive) {
      this.rushTimer -= delta
      if (this.rushTimer <= 0) {
        this.rushActive = false
        this.showBobReaction('RUSH OVER')
      }
    }

    this.trafficWaveTimer -= delta / 1000
    if (this.trafficWaveTimer <= 0) {
      this.triggerTrafficWave()
    }

    const missionProgress = 1 - this.distanceRemaining / this.mission.distance
    this.maybeTriggerSetPiece(missionProgress)

    if (!this.rivalBossTriggered && missionProgress >= 0.58) {
      this.spawnRivalBoss()
    }

    this.anger = Math.min(100, this.anger + delta * 0.003)
    this.roadSpeed = (0.36 + this.anger * 0.0024) * this.speedFactor()

    this.exhaustTimer -= delta / 1000
    if (this.exhaustTimer <= 0) {
      this.exhaustTimer = Math.max(0.1, 0.26 - Math.max(0, this.speedStep) * 0.03)
      this.spawnExhaustPuff()
    }

    this.missionTimer = Math.max(0, this.missionTimer - delta / 1000)
    this.timerText.setText(`TIME: ${Math.ceil(this.missionTimer)}`)

    const engineTravelBonus = 1 + this.profile.engine * 0.13
    const travelRate =
      (0.032 + Math.max(0, this.speedStep) * 0.018 + this.roadSpeed * 0.014) *
      engineTravelBonus

    this.distanceRemaining = Math.max(0, this.distanceRemaining - travelRate * (delta / 1000))
    this.distanceText.setText(`${this.mission.destination}: ${this.distanceRemaining.toFixed(1)} MI`)

    this.updateDistrictProgress()

    if (this.distanceRemaining <= 0) {
      this.completeMission()
      return
    }

    if (this.missionTimer <= 0) {
      this.failMission('LATE AGAIN')
      return
    }

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
      if (this.dashDepths[i] > 1.06) this.dashDepths[i] = 0
    }

    this.drawRoad()
    this.updateShowcaseGraphics(time, delta)

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
      light.lamp.alpha = Phaser.Math.Linear(0.2, 1, p.eased) * this.currentDistrict.lightStrength * 3

      light.glow.x = poleX
      light.glow.y = p.y - poleHeight + 8
      light.glow.setScale(Phaser.Math.Linear(0.35, 1.8, p.eased), Phaser.Math.Linear(0.35, 1.2, p.eased))
      light.glow.alpha = Phaser.Math.Linear(0.04, 0.18, p.eased) * this.currentDistrict.lightStrength * 4
    }

    for (const sign of this.roadSigns) {
      sign.depth += this.roadSpeed * 0.82 * (0.55 + sign.depth * 1.4) * (delta / 1000)
      if (sign.depth > 1.05) this.resetRoadSign(sign)

      if (!sign.enabled) {
        sign.container.setVisible(false)
        continue
      }

      const p = this.project(sign.depth)
      sign.container.x = this.roadEdgeX(sign.side, sign.depth, Phaser.Math.Linear(36, 130, p.eased))
      sign.container.y = p.y - Phaser.Math.Linear(20, 90, p.eased)
      sign.container.setScale(Phaser.Math.Linear(0.28, 1.24, p.eased))
      sign.container.setAlpha(Phaser.Math.Linear(0.35, 1, p.eased))
      sign.container.setVisible(true)
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
      streak.line.setFillStyle(this.currentDistrict.accentColor, streak.line.alpha)
    }

    const weatherBaseAlpha =
      this.weatherMode === 'fog'
        ? 0.09
        : this.weatherMode === 'storm'
          ? 0.08
          : this.weatherMode === 'rain'
            ? 0.04
            : 0

    const weatherColor =
      this.weatherMode === 'fog'
        ? 0xe3ebf5
        : this.weatherMode === 'storm'
          ? 0x8ca9da
          : 0x89b7ff

    this.weatherTintOverlay.setFillStyle(weatherColor, weatherBaseAlpha + (this.rushActive ? 0.05 : 0))

    const rainActive = this.weatherMode === 'rain' || this.weatherMode === 'storm'
    for (const drop of this.rainDrops) {
      if (!rainActive) {
        drop.setVisible(false)
        continue
      }

      drop.setVisible(true)
      drop.y += (980 + this.roadSpeed * 420 + Math.max(0, this.speedStep) * 80) * (delta / 1000)
      drop.x -= (180 + this.roadSpeed * 90) * (delta / 1000)
      drop.alpha = this.weatherMode === 'storm' ? 0.24 : 0.16

      if (drop.y > this.scale.height + 60 || drop.x < -40) {
        drop.x = Phaser.Math.Between(0, this.scale.width + 90)
        drop.y = Phaser.Math.Between(-this.scale.height, -20)
      }
    }

    if (this.weatherMode === 'storm') {
      this.weatherFlashTimer -= delta / 1000
      if (this.weatherFlashTimer <= 0) {
        this.weatherFlashTimer = Phaser.Math.FloatBetween(4.2, 7.4)
        this.cameras.main.flash(80, 200, 220, 255)
      }
    } else {
      this.weatherFlashTimer = 2.8
    }

    for (const pickup of this.scrapPickups) {
      pickup.depth += this.roadSpeed * 0.88 * (0.55 + pickup.depth * 1.6) * (delta / 1000)
      if (pickup.depth > 1.08) this.resetScrapPickup(pickup)

      const p = this.project(pickup.depth)
      pickup.container.x = this.laneCenterX(pickup.laneIndex, pickup.depth)
      pickup.container.y = p.y
      pickup.container.setScale(p.scale * 0.22)
      pickup.container.setRotation(pickup.container.rotation + pickup.spin * (delta / 1000))
      pickup.container.setAlpha(Phaser.Math.Linear(0.55, 1, p.eased))
      pickup.container.setDepth(Math.floor(p.y))

      const dx = Math.abs(pickup.container.x - this.player.x)
      const dy = Math.abs(pickup.container.y - this.player.y)

      if (dx < this.scrapMagnetRadius && dy < 84 && pickup.depth > 0.62) {
        this.scrapCount += pickup.value
        this.score += pickup.value * 20
        this.scrapText.setText(`SCRAP: ${this.scrapCount}`)
        this.spawnScorePopup(pickup.container.x, pickup.container.y - 10, `SCRAP +${pickup.value}`, '#ffd7a3')
        this.showBobReaction('SCRAP!')
        this.resetScrapPickup(pickup, Phaser.Math.Between(180, 340))
      }
    }

    if (!this.pedestrian.container.visible) {
      this.pedestrianRespawnTimer -= delta / 1000
      if (this.pedestrianRespawnTimer <= 0) {
        if (Math.random() < this.currentDistrict.pedestrianChance) {
          this.spawnPedestrian()
        } else {
          this.pedestrianRespawnTimer = Phaser.Math.FloatBetween(1.8, 3.2)
        }
      }
    } else {
      this.pedestrian.depth += this.roadSpeed * 0.76 * (0.55 + this.pedestrian.depth * 1.2) * (delta / 1000)
      this.pedestrian.xNorm += this.pedestrian.direction * this.pedestrian.crossSpeed * (delta / 1000)

      const pedProjection = this.project(this.pedestrian.depth)
      this.pedestrian.container.x = Phaser.Math.Linear(
        pedProjection.left - 30,
        pedProjection.right + 30,
        this.pedestrian.xNorm,
      )
      this.pedestrian.container.y = pedProjection.y
      this.pedestrian.container.setScale(pedProjection.scale * 0.24)
      this.pedestrian.container.setDepth(Math.floor(pedProjection.y))
      this.pedestrian.container.setAlpha(Phaser.Math.Linear(0.5, 1, pedProjection.eased))

      if (!this.pedestrian.warned && this.pedestrian.depth > 0.44) {
        this.pedestrian.warned = true
        this.showEnemyWarning('PEDESTRIAN CROSSING')
      }

      const pedDx = Math.abs(this.pedestrian.container.x - this.player.x)
      const pedDy = Math.abs(this.pedestrian.container.y - this.player.y)
      if (this.pedestrian.depth > 0.72 && pedDx < 54 && pedDy < 82) {
        this.failMission('PEDESTRIAN PANIC')
        return
      }

      if (this.pedestrian.depth > 1.08 || this.pedestrian.xNorm < -0.28 || this.pedestrian.xNorm > 1.28) {
        this.pedestrian.container.setVisible(false)
        this.pedestrianRespawnTimer = Phaser.Math.FloatBetween(4.5, 7.2)
      }
    }

    for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
      const cloud = this.smokeClouds[i]
      cloud.life -= delta / 1000
      cloud.depth += this.roadSpeed * 0.22 * (delta / 1000)

      if (cloud.life <= 0 || cloud.depth > 1.02) {
        cloud.container.destroy()
        this.smokeClouds.splice(i, 1)
        continue
      }

      const p = this.project(cloud.depth)
      cloud.container.x = this.laneCenterX(cloud.laneIndex, cloud.depth)
      cloud.container.y = p.y
      cloud.container.setScale(p.scale * (0.42 + (1.25 - cloud.life) * 0.16))
      cloud.container.setAlpha(Math.max(0, cloud.life * 0.42))
      cloud.container.setDepth(Math.floor(p.y))
    }

    for (let i = this.setPieceHazards.length - 1; i >= 0; i--) {
      const hazard = this.setPieceHazards[i]
      hazard.depth += hazard.speed * this.speedFactor() * (0.54 + hazard.depth * 1.65) * (delta / 1000)

      if (hazard.depth > 1.08) {
        hazard.container.destroy()
        hazard.shadow.destroy()
        this.setPieceHazards.splice(i, 1)
        continue
      }

      const p = this.project(hazard.depth)
      hazard.container.x = this.laneCenterX(hazard.laneIndex, hazard.depth)
      hazard.container.y = p.y
      hazard.container.setScale(p.scale * 0.86)
      hazard.container.setAlpha(Phaser.Math.Linear(0.58, 1, p.eased))
      hazard.container.setDepth(Math.floor(p.y) + 1)

      hazard.shadow.x = hazard.container.x
      hazard.shadow.y = hazard.container.y + Phaser.Math.Linear(6, 28, p.eased)
      hazard.shadow.setScale(Phaser.Math.Linear(0.2, 1.05, p.eased), Phaser.Math.Linear(0.18, 0.88, p.eased))
      hazard.shadow.alpha = Phaser.Math.Linear(0.06, 0.22, p.eased)
      hazard.shadow.setDepth(Math.floor(p.y))

      const dx = Math.abs(hazard.container.x - this.player.x)
      const dy = Math.abs(hazard.container.y - this.player.y)

      if (!hazard.passed && hazard.depth > 0.7 && dx > 68 && dx < 130 && dy < 96) {
        hazard.passed = true
        this.score += 120 + this.combo * 12
        this.addCombo()
        this.spawnScorePopup(hazard.container.x, hazard.container.y - 12, 'SLIPPED THROUGH', '#8df0ff')
      }

      if (dx < 64 && dy < 92 && hazard.depth > 0.76) {
        if (this.rushActive) {
          this.score += 280
          this.spawnSparkBurst(hazard.container.x, hazard.container.y, 0xffe8bc)
          this.spawnScorePopup(hazard.container.x, hazard.container.y - 12, 'PLOWED', '#ffe8bc')
          hazard.container.destroy()
          hazard.shadow.destroy()
          this.setPieceHazards.splice(i, 1)
          continue
        }

        const destroyed = this.takeHit()
        hazard.container.destroy()
        hazard.shadow.destroy()
        this.setPieceHazards.splice(i, 1)
        if (destroyed) {
          this.failMission('ROADBLOCKED')
          return
        }
      }
    }

    this.updateRivalBoss(delta)

    if (this.rivalBoss && this.rivalBossState === 'active') {
      const boss = this.rivalBoss
      const bossDx = Math.abs(boss.container.x - this.player.x)
      const bossDy = Math.abs(boss.container.y - this.player.y)

      if (bossDx < 62 && bossDy < 98 && boss.depth > 0.74) {
        if (this.rushActive) {
          this.damageRivalBoss(2, boss.container.x, boss.container.y, 'SLAM')
          boss.depth = 0.4
        } else {
          const destroyed = this.takeHit()
          boss.depth = 0.36
          this.showBobReaction('HE IS ON YOU!')
          if (destroyed) {
            this.failMission('RIVAL WRECK')
            return
          }
        }
      }

      for (const cloud of this.smokeClouds) {
        const lastCloudId = boss.container.getData('lastSmokeCloudId') as number
        if (
          boss.laneIndex === cloud.laneIndex &&
          Math.abs(boss.depth - cloud.depth) < 0.08 &&
          lastCloudId !== cloud.id
        ) {
          boss.container.setData('lastSmokeCloudId', cloud.id)
          this.damageRivalBoss(1, boss.container.x, boss.container.y, 'SMOKED')
          boss.depth = Math.max(0.22, boss.depth - 0.12)
          break
        }
      }

      if (!boss.container.getData('nearMissed')) {
        const sameLane = boss.laneIndex === this.currentLaneIndex
        const nearMissWindow = boss.depth > 0.68 && boss.depth < 0.76
        const sideMiss = bossDx > 64 && bossDx < 124 && bossDy < 92
        if (!sameLane && nearMissWindow && sideMiss) {
          boss.container.setData('nearMissed', true)
          this.damageRivalBoss(1, boss.container.x, boss.container.y, 'SHAKEN')
        }
      } else if (boss.depth < 0.35) {
        boss.container.setData('nearMissed', false)
      }
    }

    for (const enemy of this.enemyCars) {
      this.updateEnemyBehavior(enemy, delta)

      enemy.depth += enemy.speed * this.speedFactor() * this.currentDistrict.aggressionBias * (0.48 + enemy.depth * 1.7) * (delta / 1000)
      if (enemy.depth > 1.08) this.resetEnemyCar(enemy)

      const p = this.project(enemy.depth)
      const targetX = this.laneCenterX(enemy.laneIndex, enemy.depth)

      enemy.container.x = Phaser.Math.Linear(enemy.container.x, targetX, 0.12)
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

      if (dx < 58 && dy < 96 && enemy.depth > 0.74) {
        if (this.rushActive) {
          this.score += 260 + this.combo * 18
          this.addCombo(2)
          this.spawnSparkBurst(enemy.container.x, enemy.container.y, 0xffefb8)
          this.spawnScorePopup(enemy.container.x, enemy.container.y - 12, 'SHOVED', '#ffe8bc')
          this.resetEnemyCar(enemy, Phaser.Math.Between(200, 360))
        } else {
          const destroyed = this.takeHit()
          this.resetEnemyCar(enemy, Phaser.Math.Between(200, 360))
          if (destroyed) {
            this.failMission('WRECKED')
            return
          }
        }
      }

      for (const cloud of this.smokeClouds) {
        const lastCloudId = enemy.container.getData('lastSmokeCloudId') as number
        if (
          enemy.laneIndex === cloud.laneIndex &&
          Math.abs(enemy.depth - cloud.depth) < 0.075 &&
          lastCloudId !== cloud.id
        ) {
          enemy.container.setData('lastSmokeCloudId', cloud.id)
          const bonus = enemy.kind === 'traffic' ? 120 : 180
          this.score += bonus + this.combo * 15
          this.addCombo()
          this.spawnScorePopup(enemy.container.x, enemy.container.y - 12, 'SMOKED', '#dfe5ee')
          this.showBobReaction('GOT EM!')
          this.resetEnemyCar(enemy, Phaser.Math.Between(180, 360))
          break
        }
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

    this.player.y = this.playerBaseY + Math.sin(time * 0.005) * 2
    this.playerShadow.scaleX = 1 + Math.sin(time * 0.005) * 0.02

    this.score += delta * 0.05 * this.speedFactor() * (this.rushActive ? 1.75 : 1)
    const nextScore = Math.floor(this.score)
    if (nextScore !== this.displayedScore) {
      this.displayedScore = nextScore
      this.scoreText.setText(`SCORE: ${this.displayedScore}`)
    }

    this.angerFill.width = this.anger * 1.8
    this.angerText.setText(`${Math.floor(this.anger)}%`)
    this.heatOverlay.alpha = this.anger * 0.00185 + (this.rushActive ? 0.06 : 0)
    this.speedOverlay.alpha = this.anger * 0.00055 + Math.max(0, this.speedStep) * 0.03 + (this.rushActive ? 0.08 : 0)

    const rushCharge = Phaser.Math.Clamp(this.anger / 65, 0, 1)
    this.rushMeterFill.width = 112 * rushCharge

    if (this.rushActive) {
      this.rushReadyText.setText(`ACTIVE ${Math.ceil(this.rushTimer / 1000)}s`)
      this.rushReadyText.setColor('#fff0c8')
      this.rushMeterFill.setFillStyle(0xffefb8, 1)
    } else if (this.rushCooldown > 0) {
      this.rushReadyText.setText(`COOLDOWN ${Math.ceil(this.rushCooldown / 1000)}s`)
      this.rushReadyText.setColor('#d8dde8')
      this.rushMeterFill.setFillStyle(0x8e95a3, 1)
    } else if (this.anger >= 65) {
      this.rushReadyText.setText('RUSH READY')
      this.rushReadyText.setColor('#ffddb0')
      this.rushMeterFill.setFillStyle(0xff9b3d, 1)
    } else {
      this.rushReadyText.setText(`CHARGE ${Math.floor(rushCharge * 100)}%`)
      this.rushReadyText.setColor('#ffe8bc')
      this.rushMeterFill.setFillStyle(0xff9b3d, 1)
    }

    if (this.rivalBoss && this.rivalBossState === 'active') {
      this.rivalBossBarBg.setAlpha(0.7)
      this.rivalBossBarFill.setAlpha(1)
      this.rivalBossText.setAlpha(1)
      this.rivalBossBarFill.width = 276 * Phaser.Math.Clamp(this.rivalBossHull / this.rivalBossMaxHull, 0, 1)
    } else {
      this.rivalBossBarBg.setAlpha(Math.max(0, this.rivalBossBarBg.alpha - 0.04))
      this.rivalBossBarFill.setAlpha(Math.max(0, this.rivalBossBarFill.alpha - 0.04))
      this.rivalBossText.setAlpha(Math.max(0, this.rivalBossText.alpha - 0.04))
      if (this.rivalBossText.alpha <= 0.02) this.rivalBossText.setText('')
    }

    this.updateBobMood()
    this.drawAngerFlames(time)

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

    if (this.enemyWarningTimer > 0) {
      this.enemyWarningTimer -= delta
    } else if (this.enemyWarningBg.alpha > 0) {
      this.enemyWarningBg.setAlpha(Math.max(0, this.enemyWarningBg.alpha - 0.05))
      this.enemyWarningText.setAlpha(Math.max(0, this.enemyWarningText.alpha - 0.05))
    }

    if (this.hornCooldown > 0) {
      this.hornCooldown -= delta
      this.hornText.setAlpha(0.45)
    } else {
      this.hornText.setAlpha(1)
    }

    if (this.smokeCooldown > 0) {
      this.smokeCooldown -= delta
      this.smokeText.setAlpha(0.45)
      if (this.mobileAbilityButtonBg) this.mobileAbilityButtonBg.setAlpha(0.16)
      if (this.mobileAbilityButtonText) this.mobileAbilityButtonText.setAlpha(0.45)
    } else {
      this.smokeText.setAlpha(1)
      if (this.mobileAbilityButtonBg) this.mobileAbilityButtonBg.setAlpha(0.34)
      if (this.mobileAbilityButtonText) this.mobileAbilityButtonText.setAlpha(1)
    }

    if (this.mobileRushButtonBg) {
      if (this.rushActive) this.mobileRushButtonBg.setAlpha(0.36)
      else if (this.rushCooldown > 0) this.mobileRushButtonBg.setAlpha(0.16)
      else if (this.anger >= 65) this.mobileRushButtonBg.setAlpha(0.34)
      else this.mobileRushButtonBg.setAlpha(0.18)
    }

    if (this.mobileRushButtonText) {
      this.mobileRushButtonText.setAlpha(this.rushCooldown > 0 ? 0.42 : 1)
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
      this.triggerSmokeWeapon()
    }

    if (this.mobileAbilityButtonRing) {
      const pulse = 1 + Math.sin(time * 0.008) * 0.04
      this.mobileAbilityButtonRing.setScale(pulse)
    }

    if (this.mobileRushButtonRing) {
      const rushPulse = 1 + Math.sin(time * 0.008 + 0.8) * 0.05
      this.mobileRushButtonRing.setScale(rushPulse)
    }

    if (this.mobileLeftButtonBg && this.mobileRightButtonBg) {
      const thumbPulse = 1 + Math.sin(time * 0.006) * 0.025
      this.mobileLeftButtonBg.setScale(thumbPulse)
      this.mobileRightButtonBg.setScale(thumbPulse)
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  parent: 'app',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, MapScene, BriefingScene, GarageScene, GameOverScene, GameScene],
}

new Phaser.Game(config)






