import Loot from './Loot.js'

export default class Emerald extends Loot {
  constructor(rarity) {
    super("Emerald", "A sparkling green gem", rarity, 1, 1, "#66ff66");
    this.Value = 1000;
    this.Price = 2000;    
  }
}
