import Item from './Item.js'

export default class Pow_Potion extends Item {
    
    constructor () {
      this.Name = "Potion of Power";
      this.Description = "Maximizes the power of your next few swings!";
      this.Power = 0;
      this.Damage = 0;
      this.NumberRemaining = 1;
    }
    
    behavior(gameGrid, player) {
      player.buffStats(20, 0, 0);
      player.BuffTimer = 3;
    }
              
}
