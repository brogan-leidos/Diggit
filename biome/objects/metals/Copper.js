import Loot from '../Loot.js'

export default class Copper extends Loot {
  constructor(rarity) {
    // Name, description, rarity, width, height, color, image
    super("Copper Node", "A small node of copper", rarity, 1, 1, "#ffcc66", "assets/items/ore/copper_ore.png");
    this.Value = 1000;
    this.Price = 2000;

  }
}
