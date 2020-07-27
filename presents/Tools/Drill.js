import Tool from './Tool.js'

export default class Drill extends Tool {
  constructor() {
    super();
    this.Name = "Drill";
    this.power = 1;
    this.durability = 25;
    this.damage = 1;
  } 
  
  // Return an array of surrounding spots and the damage done to them
  getMinableSpots(x, y) {
    return [[x, y, this.power]];
  }
 
}
