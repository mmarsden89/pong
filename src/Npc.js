import Phaser from 'phaser';


class Npc extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.collisions);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.scene.add.existing(this);
    // this.body.setImmovable(true)
    this.config = config
    this.x = config.x
    this.y = config.y
    this.setInteractive();
    this.on('pointerdown',this.move,this);
    this.scene.physics.add.collider(this, config.collisions, function(){
      console.log('hello')
    }, null, this)
  }

  create() {

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('npc', { start: 117, end: 125 }),
      frameRate: 10
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('npc', { start: 143, end: 151 }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('npc', { start: 105, end: 111 }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('npc', { start: 131, end: 138 }),
      frameRate: 10,
    });
  }

  move(direction) {
    if (direction === 1) {
      this.body.setVelocityX(25)
      this.anims.play('npcright', true)
    } else if (direction === 2) {
      this.body.setVelocityX(-25)
      this.anims.play('npcleft', true)
    } else if (direction === 3) {
      this.body.setVelocityY(-25)
      this.anims.play('npcup', true)
    } else {
      this.body.setVelocityY(25)
      this.anims.play('npcdown', true)
    }
  }
}


export default Npc
