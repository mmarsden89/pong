import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

  var config = {
      type: Phaser.AUTO,
      width: 1208,
      height: 680,
      // scale: {
      //   mode: Phaser.Scale.RESIZE,
      //   autoCenter: Phaser.Scale.CENTER_BOTH
      // },
      backgroundColor: '#543d3d',
      physics: {
        default: 'arcade'
      },
      scene: {
        preload: preloadGame,
        create: createGame,
        update: updateGame
      },
      roundPixels: true
  };

  var game = new Phaser.Game(config);

  var player, racket, cursor, ball, rect, circle

  let maxVel = 150
  var velocityX = 0
  var velocityY = 0
  var ballZ = 1
  let setHitY = .1
  let setHitZ = 1
  let distance = 0
  let scale = 1.25
  let direction = 2

  function preloadGame () {
    //function where images are loaded
    this.load.image('player','assets/player.png')
    this.load.image('ball','assets/ball.png')
    this.load.image('wall','assets/wall.png')
    this.load.image('grass','assets/grass.png')
    this.load.image('trunks','assets/trunk.png')
    this.load.image('water','assets/water.png')
    this.load.image('treetop','assets/treetop.png')
    this.load.image('court','assets/tempcourt.png')
    this.load.image('tiles', 'assets/grass.png');
    this.load.image('dirt', 'assets/dirt.png');
    this.load.spritesheet('dude', 'assets/playersprite.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('racket', 'assets/racket.png', { frameWidth: 64, frameHeight: 64 })
    this.load.tilemapTiledJSON('map', 'assets/newmap.json');
  }

  function createGame () {
  //function in which objects are created

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('grass', 'tiles');
    const platforms = map.createStaticLayer('Ground', tileset, 0, 0)
    const tileset2 = map.addTilesetImage('trunk', 'trunks')
    const trunkset = map.createStaticLayer('Trees2', tileset2)
    const treetiles = map.addTilesetImage('treetop', 'treetop')
    const waterset = map.addTilesetImage('water', 'water')
    const watertiles = map.createStaticLayer('Water', 'water')
    const dirtset = map.addTilesetImage('dirt', 'dirt')
    const dirttiles = map.createStaticLayer('Dirt', 'dirt')
    trunkset.setCollisionByExclusion(-1, true);
    watertiles.setCollisionByExclusion(-1, true);


    rect = this.add.rectangle(300, 400, 50, 5,  0xff0000)

    cursor = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      spacebar: Phaser.Input.Keyboard.KeyCodes.SPACE,
      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      reset: Phaser.Input.Keyboard.KeyCodes.R});

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
      frames: this.anims.generateFrameNumbers('dude', { start: 160, end: 156 }),
      frameRate: 16
    });
    this.anims.create({
      key: 'hitleft',
      frames: this.anims.generateFrameNumbers('dude', { start: 160, end: 156 }),
      frameRate: 16
    });
    this.anims.create({
      key: 'hitright',
      frames: this.anims.generateFrameNumbers('dude', { start: 160, end: 156 }),
      frameRate: 16
    });

    this.anims.create({
      key: 'spacebar2',
      frames: this.anims.generateFrameNumbers('racket', { start: 4, end: 0}),
      frameRate: 16
    })


    circle = this.add.circle(300, 400, 12, 0x396022, .3)

    ball = this.physics.add.sprite(400, 400, 'ball')

    ball.setCollideWorldBounds(true, 0, 0)
    ball.setVelocityY(velocityY);
    ball.setVelocityX(velocityX)
    ball.setScale(ballZ)
    ball.setBounce(0)

    player = this.physics.add.sprite(350, 300, 'dude');
    player.setSize(30, 35, 30, 15)
    player.setImmovable(true)
    racket = this.physics.add.sprite(335, 485, 'racket')
    racket.setSize(80, 74, 0, 0)
    player.setBounce(.5)

    const treetops = map.createStaticLayer('TreeTops', treetiles)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    this.physics.add.collider(ball, player, hitPlayer, null, this)
    this.physics.add.overlap(ball, racket, hitBall, null, this)
    this.physics.add.collider(player, trunkset)
    this.physics.add.collider(player, watertiles)
  }


  function updateGame () {
    setHitY < 1 ? rect.width = 0 : rect.width = 10 * (setHitY / 10)
    rect.x = player.body.x + 12
    rect.y = player.body.y + 64
    circle.x = player.body.x + 14.5
    circle.y = player.body.y + 45

    racket.body.x = player.body.x - 16
    racket.body.y = player.body.y - 9
    //
    // if (distance > 0 && distance < 50) {
    //   ball.setScale(scale + (setHitZ / 60))
    //   scale = scale + (setHitZ / 60)
    //   distance += setHitZ
    // } else if (distance > 49 && distance < 100) {
    //   ball.setScale(scale - (setHitZ / 60))
    //   scale = scale - (setHitZ / 60)
    //   distance += setHitZ
    // } else if (distance >= 100) {
    //   setHitZ = 1
    //   distance = 0
    //   scale = 1.25
    // }

    if (cursor.shift.isDown) {
      maxVel = 200
    } else {
      maxVel = 150
    }

    if (ball.body.velocity.y < 0) {
      let currentVeloc = ball.body.velocity.y
      ball.setVelocityY(currentVeloc + .1)
    } else if (ball.body.velocity.y > 0) {
      let currentVeloc = ball.body.velocity.y
      ball.setVelocityY(currentVeloc - .1)
    }

    if (ball.body.velocity.y === 0) {
      ball.setVelocityX(0)
    } else if(ball.body.velocity.x === 0) {
      ball.setVelocityY(0)
    }


    if (cursor.left.isDown) {
      player.anims.play('left', true);
      if (player.body.x > 16) {
        player.setVelocityX(-maxVel)
      } else {
        player.setVelocityX(5)
      }
    } else if (Phaser.Input.Keyboard.JustUp(cursor.left)) {
      player.anims.play('leftstand', true);
    }
    else if (cursor.right.isDown) {
      player.anims.play('right', true);
      if (player.body.x < 4786) {
      player.setVelocityX(maxVel);
    } else {
      player.setVelocityX(-5)
    }
      // racket.setFrame(0)
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.right)) {
      player.anims.stop(null, true);
    }
    else if (cursor.up.isDown) {
      player.setVelocityY(player.body.velocity.y > -maxVel ? player.body.velocity.y - 10 : -maxVel);
      player.setVelocityX(0);
      player.anims.play('up', true);
      racket.setFrame(0)
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.up)) {
      player.anims.stop(null, true);
    }
    else if (cursor.down.isDown) {
      player.setVelocityY(player.body.velocity.y < maxVel ? player.body.velocity.y + 10 : maxVel);
      player.setVelocityX(0);
      player.anims.play('down', true);
      racket.setFrame(0)
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.down)) {
      player.anims.stop(null, true);
    }
    else if (cursor.spacebar.isDown) {
      player.setFrame(161)
      racket.setFrame(5)
      if (setHitY < 60) {
        setHitY++
      }
      if (setHitZ < 6) {
        setHitZ++
      }
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.spacebar)) {
      player.anims.play('hitup', true)
      racket.anims.play('spacebar2', true)
    }
    else {
      setHitY = .1
      setHitZ = 1
      player.setVelocityY(0)
      player.setVelocityX(0)
  }

    if (cursor.left.isDown && cursor.up.isDown) {
      player.setVelocityY(-maxVel);
      player.setVelocityX(-maxVel);
      player.anims.play('left', true);
    }
    else if (cursor.left.isDown && cursor.down.isDown) {
      player.setVelocityY(maxVel);
      player.setVelocityX(-maxVel);
      player.anims.play('left', true);
    }
    else if (cursor.right.isDown && cursor.up.isDown) {
        player.setVelocityY(-maxVel);
        player.setVelocityX(maxVel);
        player.anims.play('right', true);
    }
    else if (cursor.right.isDown && cursor.down.isDown) {
      player.setVelocityY(maxVel);
      player.setVelocityX(maxVel);
      player.anims.play('right', true);
    }
  }

  function hitBall (ball, racket) {
    if (Phaser.Input.Keyboard.JustUp(cursor.spacebar)) {
      player.anims.play('hitup', true)
      racket.anims.play('spacebar2', true)
      velocityY = 100 * (-setHitY / 5)

      ball.setVelocityY(velocityY)

      if (ball.body.x < player.body.x) {
        velocityX = 3 * (ball.body.x - player.body.x)
        ball.setVelocityX(velocityX);
      } else {
        velocityX = 3 * (player.body.x - ball.body.x)
        ball.setVelocityX(-velocityX);
      }
      distance = 1
    }
  }

  function hitPlayer (ball, player) {
    ball.setVelocityY(0)
    ball.setVelocityX(0);
  }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
