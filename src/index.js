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

  var pc, player, cursor, cursor2, ball, scoreTextPlayer, scoreTextPc
  var scorePlayer = 0
  var scorePc = 0

  var velocityX = 100
  var velocityY = Phaser.Math.Between(-100, 100)

  function preloadGame () {
    //function where images are loaded
    this.load.image('player','assets/player.png');
    this.load.image('pc','assets/pc.png');
    this.load.image('ball','assets/ball.png');
  }

  function createGame () {
  //function in which objects are created

    cursor = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D});

    cursor2 = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.UP,
      down:Phaser.Input.Keyboard.KeyCodes.DOWN,
      left:Phaser.Input.Keyboard.KeyCodes.LEFT,
      right:Phaser.Input.Keyboard.KeyCodes.RIGHT});

    player = this.physics.add.sprite(400, 600, 'player');
    player.angle += 90
    player.setCollideWorldBounds(true);

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
    if(cursor.left.isDown) {
      player.setVelocityX(-150);
    }
    else if(cursor.right.isDown) {
      player.setVelocityX(150);
    }
    else {
      player.setVelocityX(0);
    }

    if(cursor2.left.isDown) {
     pc.setVelocityX(-150);
    }
    else if(cursor2.right.isDown) {
     pc.setVelocityX(150);
    }
   else {
     pc.setVelocityX(0);
    }
    if (Math.round(ball.y) >= 590) {
      scorePc += 1;
      scoreTextPc.setText('Score: ' + scorePc);
      reset();
    }

    if (Math.round(ball.y) <= 5) {
      scorePlayer += 1;
      scoreTextPlayer.setText('Score: ' + scorePlayer);
      reset();
    }
  }

  function hitPlayer (ball, player) {
    velocityY = velocityY + 50;
    velocityY = velocityY * -1;

    ball.setVelocityX(velocityY);

    if (velocityX < 0) {
      velocityX = velocityX * -1
      ball.setVelocityX(velocityX);
    }
    player.setVelocityY(-1);
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
