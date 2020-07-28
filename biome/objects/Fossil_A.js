import Object from './Object.js'

export default class Fossil_A extends Object {
  constructor() {
    // Name, description, rarity, width, height, color, image
    super("Special Fossil", "A very old fossil", .3, -1, -1, "#3063f0");
    this.Value = 1000;
    this.Price = 2000;
    
    // x = origin, . = empty space, anything else = part of the object
    this.Shape = [
    ["x","o","o","o"]
    ["o",".","o","."]
    [".",".","o","o"]];
  }
}
