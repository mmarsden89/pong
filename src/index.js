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

  var pc, player, racket, cursor, cursor2, ball, scoreTextPlayer, scoreTextPc
  var scorePlayer = 0
  var scorePc = 0

  let maxVel = 200
  let maxBallVel = 300
  var velocityX = 100
  var velocityY = Phaser.Math.Between(-100, 100)
  let setHit = 1

  function preloadGame () {
    //function where images are loaded
    this.load.image('player','assets/player.png');
    this.load.image('pc','assets/pc.png');
    this.load.image('ball','assets/ball.png');
    this.load.spritesheet('dude', 'assets/playersprite.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('racket', 'assets/racket.png', { frameWidth: 64, frameHeight: 64 });
  }

  function createGame () {
  //function in which objects are created

    cursor = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      spacebar: Phaser.Input.Keyboard.KeyCodes.SPACE});

    cursor2 = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.UP,
      down:Phaser.Input.Keyboard.KeyCodes.DOWN,
      left:Phaser.Input.Keyboard.KeyCodes.LEFT,
      right:Phaser.Input.Keyboard.KeyCodes.RIGHT});

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
      frames: this.anims.generateFrameNumbers('dude', { start: 156, end: 161 }),
      frameRate: 12
    });

    this.anims.create({
      key: 'spacebar2',
      frames: this.anims.generateFrameNumbers('racket', { start: 0, end: 5}),
      frameRate: 12,
    })

    player = this.physics.add.sprite(100, 450, 'dude');
    racket = this.physics.add.sprite(100, 450, 'racket')
    player.setCollideWorldBounds(true);
    player.setBounce(0)

    pc = this.physics.add.sprite(400, 0, 'pc');
    pc.angle += 90
    pc.setCollideWorldBounds(true);

    ball = this.physics.add.sprite(400, 200, 'ball');

    ball.setCollideWorldBounds(true);
    ball.setBounce(1);

    ball.setVelocityY(velocityY);
    ball.setVelocityX(velocityX);

    this.physics.add.collider(ball, player, hitPlayer, null, this);
    this.physics.add.collider(ball, pc, hitPc, null, this);

    scoreTextPc = this.add.text(16, 16, 'score: 0', { fontSize: '16px', fill: '#F00' });
    scoreTextPlayer = this.add.text(700, 16, 'score: 0', { fontSize: '16px', fill: '#00F' });
  }

  function updateGame () {
  //repeated events at certain time intervals
  // console.log(Math.round(ball.body.velocity.y))

    racket.body.x = player.body.x
    racket.body.y = player.body.y

    if (cursor.shift.isDown) {
      maxVel = 325
    } else {
      maxVel = 200
    }
    if (cursor.left.isDown) {
      player.setVelocityX(player.body.velocity.x > -maxVel ? player.body.velocity.x - 10 : -maxVel);
      player.setVelocityY(0);
      player.anims.play('left', true);
      racket.setFrame(0)
    }
    else if (cursor.right.isDown) {
      player.setVelocityX(player.body.velocity.x < maxVel ? player.body.velocity.x + 10 : maxVel);
      player.setVelocityY(0);
      player.anims.play('right', true);
      racket.setFrame(0)
    }
    else if (cursor.up.isDown) {
      player.setVelocityY(player.body.velocity.y > -maxVel ? player.body.velocity.y - 10 : -maxVel);
      player.setVelocityX(0);
      player.anims.play('up', true);
      racket.setFrame(0)
    }
    else if (cursor.down.isDown) {
      player.setVelocityY(player.body.velocity.y < maxVel ? player.body.velocity.y + 10 : maxVel);
      player.setVelocityX(0);
      player.anims.play('down', true);
      racket.setFrame(0)
    }
    else if (cursor.spacebar.isDown) {
      setHit < 5 ? setHit++ : setHit = 1
      player.anims.play('spacebar', true)
      racket.anims.play('spacebar2', true)
    }
    else {
      setHit = 1
      if (player.body.velocity.x > 0) {
      player.setVelocityX(player.body.velocity.x - 2);
      player.anims.stop(null, true);
      racket.anims.stop(null, true);
    } else if (player.body.velocity.x < 0) {
      player.setVelocityX(player.body.velocity.x + 2);
      player.anims.stop(null, true);
      racket.anims.stop(null, true);
    } else {
      player.setVelocityX(0)
      player.anims.stop(null, true);
      racket.anims.stop(null, true);
      racket.setFrame(0)
      player.setFrame(104)
    }
      if (player.body.velocity.y > 0) {
      player.setVelocityY(player.body.velocity.y - 2);
      player.anims.stop(null, true);
      racket.anims.stop(null, true);
    } else if (player.body.velocity.y < 0) {
      player.setVelocityY(player.body.velocity.y + 2);
      player.anims.stop(null, true);
      racket.anims.stop(null, true);
    } else {
      player.setVelocityY(0)
      player.anims.stop(null, true);
      racket.anims.stop(null, true);
      racket.setFrame(0)
      player.setFrame(104)
    }
      if (player.body.velocity.y > 0 && player.body.velocity.x > 0) {
      player.setVelocityY(player.body.velocity.y - 2);
      player.setVelocityX(player.body.velocity.x - 2);
      player.anims.stop(null, true);
    } else if (player.body.velocity.y < 0 && player.body.velocity.x > 0) {
      player.setVelocityY(player.body.velocity.y + 2);
      player.setVelocityX(player.body.velocity.x - 2);
      player.anims.stop(null, true);
    }
      else if (player.body.velocity.y < 0 && player.body.velocity.x < 0) {
      player.setVelocityY(player.body.velocity.y + 2);
      player.setVelocityX(player.body.velocity.x + 2);
      player.anims.stop(null, true);
    }
      else if (player.body.velocity.y > 0 && player.body.velocity.x < 0) {
      player.setVelocityY(player.body.velocity.y - 2);
      player.setVelocityX(player.body.velocity.x + 2);
      player.anims.stop(null, true);
    }
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

    if (cursor2.left.isDown) {
      pc.setVelocityX(-maxVel);
    }
    else if (cursor2.right.isDown) {
      pc.setVelocityX(maxVel);
    }
    else {
      pc.setVelocityX(0);
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

  function hitPlayer (ball, player) {
    if (cursor.spacebar.isDown) {
      velocityY < maxBallVel ? velocityY = velocityY + 50 : velocityY = 100
      velocityY = velocityY * -setHit

      ball.setVelocityY(velocityY);

    if (velocityX < 0) {
      velocityX = velocityX * player.body.velocityX
      ball.setVelocityX(velocityX);
    }
    player.setVelocityY(0);
  } else {
    ball.setVelocityY(-5)
    ball.setVelocityX(0);
  }
  }

  function hitPc (ball, pc) {
    velocityY = velocityY - 50;
    velocityY = velocityY * -1;
    ball.setVelocityY(velocityY);

    if(velocityX < 0) {
      velocityX = velocityX * -1
      ball.setVelocityX(velocityX);
    }
    pc.setVelocityY(1);
  }

  function reset () {
    velocityX = 100
    velocityY = Phaser.Math.Between(-100, 100)
    ball.x = 400;
    ball.y = 200;
    player.x = 400;
    player.y = 600;
    pc.x = 400;
    pc.y = 0;
    ball.setVelocityX(velocityX);
    ball.setVelocityY(velocityY);
  }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
