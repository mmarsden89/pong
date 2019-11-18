import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, 'atlas', 'player');
      this.scene = config.scene
  }
  preload() {
    this.load.spritesheet('dude', 'assets/playersprite.png', { frameWidth: 64, frameHeight: 64 })
  }

  create() {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 117, end: 125 }),
      frameRate: 10
    });

    this.anims.create({
      key: 'leftstand',
      frames: this.anims.generateFrameNumbers('dude', { start: 13, end: 14 }),
      frameRate: .2,
      repeat: -1
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 143, end: 151 }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('dude', { start: 105, end: 111 }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('dude', { start: 131, end: 138 }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'hitup',
      frames: this.anims.generateFrameNumbers('dude', { start: 160, end: 156 }),
      frameRate: 16
    });
    this.anims.create({
      key: 'hitdown',
      frames: this.anims.generateFrameNumbers('dude', { start: 186, end: 182 }),
      frameRate: 16
    });
    this.anims.create({
      key: 'hitleft',
      frames: this.anims.generateFrameNumbers('dude', { start: 173, end: 169 }),
      frameRate: 16
    });
    this.anims.create({
      key: 'hitright',
      frames: this.anims.generateFrameNumbers('dude', { start: 199, end: 195 }),
      frameRate: 16
    });
  }

  update() {
    
  }
}
