import Phaser from 'phaser';
import React from 'react';
import Npc from './Npc'
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

  var player, racket, cursor, ball, circle, ballCollision, bomb

  let maxVel = 150
  let maxballvel = 1000
  var velocityX = 0
  var velocityY = 0
  let direction = ['hitdown', 132, 'racketdown']
  let npcDirect = Math.floor(Math.random() * 4)

  function preloadGame () {
    //function where images are loaded
    this.load.image('ball','assets/ball.png')
    this.load.image('wall','assets/wall.png')
    this.load.image('grass','assets/grass.png')
    this.load.image('trunks','assets/trunk.png')
    this.load.image('water','assets/water.png')
    this.load.image('treetop','assets/treetop.png')
    this.load.image('court','assets/tempcourt.png')
    this.load.image('house','assets/house.png')
    this.load.image('tiles', 'assets/grass.png');
    this.load.image('dirt', 'assets/dirt.png');
    this.load.image('bridge', 'assets/bridges.png');
    this.load.image('arena', 'assets/castlewalls.png');
    this.load.spritesheet('npc','assets/pc.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('dude', 'assets/playersprite.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('racket', 'assets/racket2.png', { frameWidth: 64, frameHeight: 64 })
    this.load.tilemapTiledJSON('map', 'assets/newmap.json');
  }

  function createGame () {
  //function in which objects are created
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('grass', 'tiles');
    const platforms = map.createDynamicLayer('Ground', tileset, 0, 0)
    const tileset2 = map.addTilesetImage('trunk', 'trunks')
    const trunkset = map.createDynamicLayer('Trees2', tileset2)
    const treetiles = map.addTilesetImage('treetop', 'treetop')
    const waterset = map.addTilesetImage('water', 'water')
    const watertiles = map.createDynamicLayer('Water', 'water')
    const dirtset = map.addTilesetImage('dirt', 'dirt')
    const dirttiles = map.createDynamicLayer('Dirt', 'dirt')
    const houseset = map.addTilesetImage('house', 'house')
    const housetiles = map.createDynamicLayer('House', 'house')
    const houseset2 = map.addTilesetImage('house', 'house')
    const housetiles2 = map.createDynamicLayer('House2', 'house')
    const houseset3 = map.addTilesetImage('house', 'house')
    const housetiles3 = map.createDynamicLayer('House3', 'house')
    const grass2 = map.addTilesetImage('grass', 'tiles')
    const grasstiles2 = map.createDynamicLayer('Grass2', 'grass')
    const bridge = map.addTilesetImage('bridges', 'bridge')
    const bridgetile = map.createDynamicLayer('Bridge', 'bridges')
    const arena = map.addTilesetImage('castlewalls', 'arena')
    const tennisarena = map.createDynamicLayer('TennisArena', 'castlewalls')
    trunkset.setCollisionByExclusion(-1, true);
    watertiles.setCollisionByExclusion(-1, true);
    housetiles.setCollisionByExclusion(-1, true);
    housetiles2.setCollisionByExclusion(-1, true);
    housetiles3.setCollisionByExclusion(-1, true);
    tennisarena.setCollisionByExclusion(-1, true);

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

    this.anims.create({
      key: 'racketup',
      frames: this.anims.generateFrameNumbers('racket', { start: 160, end: 156}),
      frameRate: 16
    })
    this.anims.create({
      key: 'racketdown',
      frames: this.anims.generateFrameNumbers('racket', { start: 186, end: 182}),
      frameRate: 16
    })
    this.anims.create({
      key: 'racketleft',
      frames: this.anims.generateFrameNumbers('racket', { start: 173, end: 169}),
      frameRate: 16
    })
    this.anims.create({
      key: 'racketright',
      frames: this.anims.generateFrameNumbers('racket', { start: 199, end: 195}),
      frameRate: 16
    })

    this.anims.create({
      key: 'npcleft',
      frames: this.anims.generateFrameNumbers('npc', { start: 117, end: 125 }),
      frameRate: 10
    });

    this.anims.create({
      key: 'npcright',
      frames: this.anims.generateFrameNumbers('npc', { start: 143, end: 151 }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'npcup',
      frames: this.anims.generateFrameNumbers('npc', { start: 105, end: 111 }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'npcdown',
      frames: this.anims.generateFrameNumbers('npc', { start: 131, end: 138 }),
      frameRate: 10,
    });



    circle = this.add.circle(300, 400, 12, 0x396022, .3)

    ball = this.physics.add.sprite(400, 300, 'ball')

    ball.setCollideWorldBounds(true, 0, 0)
    ball.setVelocityY(velocityY);
    ball.setVelocityX(velocityX)
    ball.setBounce(0)

    player = this.physics.add.sprite(300, 400, 'dude');
    player.setCollideWorldBounds(true, 0, 0)
    player.setSize(32, 32, 16, 16)
    player.setImmovable(true)
    player.setFrame(131)
    racket = this.physics.add.sprite(335, 485, 'racket')
    racket.setSize(80, 74, 0, 0)
    player.setBounce(0)

    // let bomb = this.add.sprite(game.config.width/2 , game.config.height/2, "npc")
    bomb = new Npc({
      scene: this,
      x: 350 ,
      y: 300,
      key: "npc",
      collisions: watertiles
    })
    // var hero = this.add.existing( new spriteStats(this, 100, 450, 'hero', 0) );
    // let bomb = this.add.existing( new Npc(this, 100, 450, 'npc'))
    bomb.setFrame(131)
    bomb.setSize(64, 64, 0, 0)

    const treetops = map.createDynamicLayer('TreeTops', treetiles)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    ballCollision = this.physics.add.group()
    ballCollision.add(housetiles)
    ballCollision.add(housetiles2)
    // ballCollision.setCollisionByExclusion(-1, true);

    this.physics.world.setBounds(0, 0, 4000, 2250)
    this.physics.add.collider(ball, player, hitPlayer, null, this)
    this.physics.add.overlap(ball, racket, hitBall, null, this)
    this.physics.add.collider(ball, ballCollision)
    this.physics.add.collider(ball, housetiles3)
    this.physics.add.collider(ball, watertiles)
    this.physics.add.collider(ball, tennisarena)
    this.physics.add.collider(player, trunkset)
    this.physics.add.collider(player, watertiles)
    this.physics.add.collider(player, housetiles)
    this.physics.add.collider(player, housetiles2)
    this.physics.add.collider(player, housetiles3)
    this.physics.add.collider(player, tennisarena)
    // this.physics.add.collider(bomb, player)
    this.physics.add.collider(bomb, trunkset)
    this.physics.add.collider(bomb, watertiles)
    this.physics.add.collider(bomb, housetiles)
    this.physics.add.collider(bomb, housetiles2)
    this.physics.add.collider(bomb, housetiles3)
  }


  function updateGame () {
    bomb.move(npcDirect)
    circle.x = player.body.x + 14.5
    circle.y = player.body.y + 45

    racket.body.x = player.body.x - 16
    racket.body.y = player.body.y - 16
    //

    if (cursor.shift.isDown) {
      maxVel = 200
    } else {
      maxVel = 150
    }

    if (cursor.left.isDown) {
      player.anims.play('left', true);
      direction = ['hitleft', 174, 'racketleft']
        player.setVelocityX(-maxVel)
        player.setVelocityY(0)
    } else if (Phaser.Input.Keyboard.JustUp(cursor.left)) {
      player.anims.play('leftstand', true);
    }
    else if (cursor.right.isDown) {
      player.anims.play('right', true);
      direction = ['hitright', 200, 'racketright']
      player.setVelocityX(maxVel);
      player.setVelocityY(0)
      // racket.setFrame(0)
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.right)) {
      player.anims.stop(null, true);
    }
    else if (cursor.up.isDown) {
      player.setVelocityY(-maxVel);
      player.setVelocityX(0);
      player.anims.play('up', true);
      racket.setFrame(0)
      direction = ['hitup', 161, 'racketup']
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.up)) {
      player.anims.stop(null, true);
    }
    else if (cursor.down.isDown) {
      player.setVelocityY(maxVel);
      player.setVelocityX(0);
      player.anims.play('down', true);
      racket.setFrame(0)
      direction = ['hitdown', 187, 'racketdown']
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.down)) {
      player.anims.stop(null, true);
      player.setFrame(131)
    }
    else if (cursor.reset.isDown) {
      reset()
    }
    else if (cursor.spacebar.isDown) {
      player.setVelocityX(0)
      player.setVelocityY(0)
      player.setFrame(direction[1])
      racket.setFrame(direction[1])
    }
    else if (Phaser.Input.Keyboard.JustUp(cursor.spacebar)) {
      player.anims.play(direction[0], true)
      racket.anims.play(direction[2], true)
    }
    else {
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

    if (direction[1] === 200) {
      velocityX = maxballvel
      velocityY = 0
    }
    else if (direction[1] === 174) {
      velocityX = -maxballvel
      velocityY = 0
    }
    else if (direction[1] === 187) {
      velocityY = maxballvel
      velocityX = 0
    }
    else if (direction[1] === 161){
      velocityY = -maxballvel
      velocityX = 0
    }
    if (Phaser.Input.Keyboard.JustUp(cursor.spacebar)) {
      player.anims.play(direction[0], true)
      racket.anims.play((direction[2]), true)
      ball.setVelocity(velocityX, velocityY)
    }
  }

  function reset () {
    ball.x = player.body.x + 16;
    ball.y = player.body.y - 10;
    ball.setVelocityX(0);
    ball.setVelocityY(0);
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
