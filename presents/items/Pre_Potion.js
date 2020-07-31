import Item from './Item.js'

export default class Pre_Potion extends Item {
    
    constructor () {
      this.Name = "Potion of Precision";
      this.Description = "Gives you insight into the walls structure, allowing you to deal almost no damage for your next few swings!";
      this.Power = 0;
      this.Damage = 0;
      this.NumberRemaining = 1;
    }
    
    behavior(gameGrid, player) {
      player.buffStats(0, 20, 0);
      player.BuffTimer = 3;
    }
              
}
