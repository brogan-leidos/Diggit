import Loot from '../Loot.js'
import Copper from './Copper.js'

export default class Copper_Large extends Loot {
  constructor(rarity) {
    // Name, description, rarity, width, height, color, image
    super("Large Copper Node", "A large vein of copper", rarity, -1, -1, "#ffcc66");
    this.Value = 1000;
    this.Price = 2000;
    this.Breakdown = [[new Copper(), 100]];
    
    // x = origin, . = empty space, anything else = part of the object
    this.Shape = [
    [".","x","o"],
    ["o","o","o"],
    [".","o","o"],
    ["o","o","."]];
  }
}
