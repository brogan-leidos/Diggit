import Tool from './Tool.js'

export default class Pick extends Tool {
  constructor() {
    super();
    this.Name = "Pick";
    this.power = 1;
    this.durability = -1;
    this.damage = 4;
  } 
  
  // Return an array of surrounding spots and the damage done to them
  getMinableSpots(x, y) {
    return [[x, y, this.power+1],[x+1, y, this.power],[x-1, y, this.power],[x, y+1, this.power],[x, y-1, this.power]];
  }
 
}
