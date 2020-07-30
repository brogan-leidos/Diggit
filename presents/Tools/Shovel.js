import Tool from './Tool.js'

export default class Shovel extends Tool {
  constructor() {
    super();
    this.Name = "Shovel";
    this.Description = "Useful for lightly uncovering large areas";
    this.power = 1;
    this.MaxDurability = 20;
    this.durability = this.MaxDurability;
    this.damage = 5;
  } 
  
  // Return an array of surrounding spots and the damage done to them
  getMinableSpots(x, y) {
    return [[x, y, this.power],[x+1, y, this.power],[x, y+1, this.power],[x+1, y+1, this.power]];
  }
 
}
