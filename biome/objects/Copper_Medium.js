import Loot from './Loot.js'
import Copper from './Copper.js'

export default class Copper_Medium extends Loot {
  constructor(rarity) {
    // Name, description, rarity, width, height, color, image
    super("Med Copper Node", "A sizable vein of copper", rarity, 2, 2, "#ffcc66");
    this.Value = 1000;
    this.Price = 2000;
    this.Breakdown = [[new Copper(), 50]];
    
  }
}
