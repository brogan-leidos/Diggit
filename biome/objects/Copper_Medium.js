import Loot from './Loot.js'

export default class Copper_Medium extends Loot {
  constructor(rarity) {
    // Name, description, rarity, width, height, color, image
    super("Med Copper Node", "A sizable vein of copper", rarity, 2, 2, "#ffcc66");
    this.Value = 1000;
    this.Price = 2000;
    this.Breakdown = [["Copper", 50]];
    
  }
}
