import Tool from './Tool.js'

export default class Drill extends Tool {
  constructor() {
    super();
    this.Name = "Drill";
    this.Description = "Lightly burrows through a small point in the wall";
    this.power = 1;
    this.MaxDurability = 99;
    this.durability = this.MaxDurability;
    this.damage = 2;
  } 
  
  // Return an array of surrounding spots and the damage done to them
  getMinableSpots(x, y) {
    return [[x, y, this.power]];
  }
 
}
