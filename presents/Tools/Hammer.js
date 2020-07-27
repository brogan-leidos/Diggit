import Tool from './Tool.js'

export default class Hammer extends Tool {
  constructor() {
    super();
    this.Name = "Hammer";
    this.power = 2;
    this.durability = -1;
    this.damage = 20;
  } 
  
  // Return an array of surrounding spots and the damage done to them
  getMinableSpots(x, y) {
    return [[x, y, this.power],[x+1, y, this.power],[x-1, y, this.power],[x, y+1, this.power],[x, y-1, this.power],
            [x-1, y-1, this.power],[x+1, y+1, this.power],[x-1, y+1, this.power],[x+1, y-1, this.power]];
  }
 
}
