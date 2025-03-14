import Tool from './Tool.js'

export default class Chisel extends Tool {
  constructor() {
    super();
    this.Name = "Chisel";
    this.Description = "Good for lightly scraping away small areas";
    this.power = 1;
    this.MaxDurability = 99;
    this.durability = this.MaxDurability;
    this.damage = 3;
    this.Angle = 0;
  } 
  
  // Return an array of surrounding spots and the damage done to them
  getMinableSpots(x, y) {
    var angles = [
      [[x, y, this.power],[x+1, y, this.power]],
      [[x, y, this.power],[x, y+1, this.power]],
      [[x, y, this.power],[x-1, y, this.power]],
      [[x, y, this.power],[x, y-1, this.power]]
                 ];
    return angles[this.Angle];
  }
  
  rotateTool(sign) {    
    this.Angle = sign == 1 ? this.Angle + 1 : this.Angle - 1;
    this.Angle = this.Angle == 4 ? 0 : this.Angle;
    this.Angle = this.Angle == -1 ? 3 : this.Angle;
    
  }
 
}
