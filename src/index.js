import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

  var config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: '#543d3d',
      physics: {
        default: 'arcade'
      },
      scene: {
        preload: preloadGame,
        create: createGame,
        update: updateGame
      }
  };

  var game = new Phaser.Game(config);

  var pc, player, racket, cursor, ball, wall, scoreTextPlayer, scoreTextPc, rect, circle, court, divider
  var scorePlayer = 0
  var scorePc = 0

  let maxVel = 200
  let maxBallVel = 600
  var velocityX = 0
  var velocityY = 0
  var ballZ = 1
  let setHitY = .1
  let setHitZ = 1
  let distance = 0
  let scale = 1.25
  let detected = false

  function preloadGame () {
    //function where images are loaded
    this.load.image('player','assets/player.png')
    this.load.image('pc','assets/pc.png')
    this.load.image('ball','assets/ball.png')
    this.load.image('wall','assets/wall.png')
    this.load.image('divider','assets/divider.png')
    this.load.image('court','assets/tempcourt.png')
    this.load.spritesheet('dude', 'assets/playersprite.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('racket', 'assets/racket.png', { frameWidth: 64, frameHeight: 64 })
  }

  function createGame () {
  //function in which objects are created
    court = this.add.image(400, 300, 'court');
    court.displayWidth = 800
    court.displayHeight = 600
    // divider = this.add.image(405,280, 'divider')
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
      key: 'spacebar',
      frames: this.anims.generateFrameNumbers('dude', { start: 160, end: 156 }),
      frameRate: 16
    });

    this.anims.create({
      key: 'spacebar2',
      frames: this.anims.generateFrameNumbers('racket', { start: 4, end: 0}),
      frameRate: 16
    })

    divider = this.physics.add.sprite(405, 285, 'divider')
    divider.setImmovable(true)

    circle = this.add.circle(300, 400, 12, 0x396022)

    ball = this.physics.add.sprite(400, 400, 'ball')

    ball.setCollideWorldBounds(true, 0, 0)
    ball.setVelocityY(velocityY);
    ball.setVelocityX(velocityX)
    ball.setScale(ballZ)
    ball.setBounce(0)

    wall = this.physics.add.sprite(400, 20, 'wall')
    player = this.physics.add.sprite(350, 500, 'dude');
    player.setSize(30, 35, 30, 15)
    player.setImmovable(true)
    racket = this.physics.add.sprite(335, 485, 'racket')
    racket.setSize(80, 74, 0, 0)
    player.setCollideWorldBounds(true);
    player.setBounce(.5)

    this.physics.add.collider(ball, player, hitPlayer, null, this)
    this.physics.add.collider(ball, racket, hitBall, null, this)
    this.physics.add.collider(ball, wall, hitWall, null, this)
    this.physics.add.collider(divider, player, hitDivider, null, this)
    this.physics.add.overlap(divider, ball, ballDivider, detectedTrue, this)

    scoreTextPc = this.add.text(16, 16, 'score: 0', { fontSize: '16px', fill: '#F00' });
    scoreTextPlayer = this.add.text(700, 16, 'score: 0', { fontSize: '16px', fill: '#00F' });
  }

  function updateGame () {
    //repeated events at certain time intervals
    // console.log(circle)
    setHitY < 1 ? rect.width = 0 : rect.width = 10 * (setHitY / 10)
    rect.x = player.body.x + 12
    rect.y = player.body.y + 64
    circle.x = player.body.x + 14.5
    circle.y = player.body.y + 45

    racket.body.x = player.body.x - 15
    racket.body.y = player.body.y - 15
    // console.log(ball.body.scale)

    // if (scale < 1.5 && ball.body.y < 300 && ball.body.velocity.y < 0) {
    //   console.log(ball.body.y)
    //   ball.setVelocityX(0)
    //   ball.setVelocityY(0)
    // }

    if (distance > 0 && distance < 50) {
      ball.setScale(scale + (setHitZ / 60))
      scale = scale + (setHitZ / 60)
      distance += setHitZ
    } else if (distance > 49 && distance < 100) {
      ball.setScale(scale - (setHitZ / 60))
      scale = scale - (setHitZ / 60)
      distance += setHitZ
    } else if (distance >= 100) {
      setHitZ = 1
      distance = 0
      scale = 1.25
    }

    if (cursor.shift.isDown) {
      maxVel = 325
    } else {
      maxVel = 200
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
      player.setVelocityX(player.body.velocity.x > -maxVel ? player.body.velocity.x - 10 : -maxVel);
      player.setVelocityY(0);
      player.anims.play('left', true);
      racket.setFrame(0)
    } else if (Phaser.Input.Keyboard.JustUp(cursor.left)) {
      player.anims.stop(null, true);
      player.setFrame(104)
    }
    else if (cursor.right.isDown) {
      player.setVelocityX(player.body.velocity.x < maxVel ? player.body.velocity.x + 10 : maxVel);
      player.setVelocityY(0);
      player.anims.play('right', true);
      racket.setFrame(0)
    } else if (Phaser.Input.Keyboard.JustUp(cursor.right)) {
      player.anims.stop(null, true);
      player.setFrame(104)
    }
    else if (cursor.up.isDown) {
      player.setVelocityY(player.body.velocity.y > -maxVel ? player.body.velocity.y - 10 : -maxVel);
      player.setVelocityX(0);
      player.anims.play('up', true);
      racket.setFrame(0)
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.up)) {
      player.anims.stop(null, true);
      player.setFrame(104)
    }
    else if (cursor.down.isDown) {
      player.setVelocityY(player.body.velocity.y < maxVel ? player.body.velocity.y + 10 : maxVel);
      player.setVelocityX(0);
      player.anims.play('down', true);
      racket.setFrame(0)
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.down)) {
      player.anims.stop(null, true);
      player.setFrame(104)
    }
    else if (cursor.one.isDown) {
      flipChar()
    }
    else if (cursor.reset.isDown) {
      reset()
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
      player.anims.play('spacebar', true)
      racket.anims.play('spacebar2', true)
    }
    else {
      setHitY = .1
      setHitZ = 1
      if (player.body.velocity.x > 0) {
      player.setVelocityX(player.body.velocity.x - 2);
    } else if (player.body.velocity.x < 0) {
      player.setVelocityX(player.body.velocity.x + 2);
    }
    else {
      player.setVelocityX(0)
    }
    if (player.body.velocity.y > 0) {
      player.setVelocityY(player.body.velocity.y - 2);
    }
    else if (player.body.velocity.y < 0) {
      player.setVelocityY(player.body.velocity.y + 2);
    }
    else {
      player.setVelocityY(0)
    }
    if (player.body.velocity.y > 0 && player.body.velocity.x > 0) {
      player.setVelocityY(player.body.velocity.y - 2);
      player.setVelocityX(player.body.velocity.x - 2);
    }
    else if (player.body.velocity.y < 0 && player.body.velocity.x > 0) {
      player.setVelocityY(player.body.velocity.y + 2);
      player.setVelocityX(player.body.velocity.x - 2);
    }
    else if (player.body.velocity.y < 0 && player.body.velocity.x < 0) {
      player.setVelocityY(player.body.velocity.y + 2);
      player.setVelocityX(player.body.velocity.x + 2);
    }
    else if (player.body.velocity.y > 0 && player.body.velocity.x < 0) {
      player.setVelocityY(player.body.velocity.y - 2);
      player.setVelocityX(player.body.velocity.x + 2);
      // player.anims.stop(null, true);
    }
    else {
      player.setVelocityY(0)
    }
  }

    if (cursor.left.isDown && cursor.up.isDown) {
      if (player.body.y > 280) {
        player.setVelocityY(-maxVel);
        player.setVelocityX(-maxVel);
        player.anims.play('left', true);
      }
    }
    else if (cursor.left.isDown && cursor.down.isDown) {
      player.setVelocityY(maxVel);
      player.setVelocityX(-maxVel);
      player.anims.play('left', true);
    }
    else if (cursor.right.isDown && cursor.up.isDown) {
      if (player.body.y > 280) {
        player.setVelocityY(-maxVel);
        player.setVelocityX(maxVel);
        player.anims.play('right', true);
      }
    }
    else if (cursor.right.isDown && cursor.down.isDown) {
      player.setVelocityY(maxVel);
      player.setVelocityX(maxVel);
      player.anims.play('right', true);
    }

    if (Math.round(ball.y) >= 596) {
      scorePc += 1;
      scoreTextPc.setText('Score: ' + scorePc);
      // reset();
    }

    if (Math.round(ball.y) <= 4) {
      scorePlayer += 1;
      scoreTextPlayer.setText('Score: ' + scorePlayer);
      // reset();
    }
  }

  function hitBall (ball, racket) {
    if (Phaser.Input.Keyboard.JustUp(cursor.spacebar)) {
      // console.log(Math.round(ball.body.x), Math.round(player.body.x))
      player.anims.play('spacebar', true)
      racket.anims.play('spacebar2', true)
      velocityY = 100 * (-setHitY / 10)

      ball.setVelocityY(velocityY)

      if (ball.body.x < player.body.x) {
        velocityX = 5 * (ball.body.x - player.body.x)
        ball.setVelocityX(velocityX);
      } else {
        velocityX = 5 * (player.body.x - ball.body.x)
        ball.setVelocityX(-velocityX);
      }
      distance = 1
      detected = true
    }
  }

  function hitPlayer (ball, player) {
    ball.setVelocityY(0)
    ball.setVelocityX(0);
  }

  function hitWall (ball, wall) {
    ball.setVelocityY(ball.body.velocity.y * -1)
    wall.setVelocityY(0)
    detected = true
  }

  function hitDivider (divider, player) {
    player.setVelocityX(0)
    player.setVelocityY(0)
  }

  function ballDivider (divider, ball) {
    console.log(scale)
    if (scale < 1.4) {
      ball.setVelocityX(Math.round(ball.body.velocity.x))
      ball.setVelocityY(Math.round(ball.body.velocity.y * -.8))
      detected = false
    }
  }

  function detectedTrue () {
    if (detected) {
      return true
    } else {
      return false
    }
  }

  function flipChar () {
    if (player.flipX === false) {
      racket.flipX = true
      player.flipX = true
    } else {
      racket.flipX = false
      player.flipX = false
    }
  }

  function reset () {
    ball.x = 400;
    ball.y = 400;
    ball.setVelocityX(0);
    ball.setVelocityY(0);
  }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
