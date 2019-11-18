import Phaser from 'phaser';

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
      index
    },
    roundPixels: true
};

var game = new Phaser.Game(config);
