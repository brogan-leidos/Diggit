import Loot from './Loot.js'

export default class Fossil_A extends Loot {
  constructor(rarity) {
    // Name, description, rarity, width, height, color, image
    super("Special Fossil A", "A very old fossil", rarity, -1, -1, "#03ecfc");
    this.Value = 1000;
    this.Price = 2000;
    
    // x = origin, . = empty space, anything else = part of the object
    this.Shape = [
    ["x","o","o","o"],
    ["o",".","o","."],
    [".",".","o","o"]];
  }
}
