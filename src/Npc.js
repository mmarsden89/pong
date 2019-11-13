import Phaser from 'phaser';


class Npc extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "npc");
      }

    
}


export default Npc
