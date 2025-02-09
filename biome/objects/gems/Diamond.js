import Loot from '../Loot.js'

export default class Diamond extends Loot {
  constructor(rarity) {
    super("Diamond", "A rare and precious gem", rarity, 1, 1, "#3063f0", "assets/items/gems/diamond.png");
    this.Value = 5000;
    this.Price = 10000;    
  }
}
