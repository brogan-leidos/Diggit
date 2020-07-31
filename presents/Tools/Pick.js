import Tool from './Tool.js'

export default class Pick extends Tool {
  constructor() {
    super();
    this.Name = "Pick";
    this.Description = "Digs a small portion of the wall, stronger in the center";
    this.power = 1;
    this.MaxDurability = -1;
    this.durability = this.MaxDurability;
    this.damage = 8;
  } 
    
  getMinableSpots(x, y) {
    var angles = [
      [[x, y, this.power+1],[x+1, y, this.power],[x-1, y, this.power],[x, y+1, this.power],[x, y-1, this.power]],
      [[x, y, this.power+1],[x+1, y+1, this.power],[x-1, y-1, this.power],[x-1, y+1, this.power],[x+1, y-1, this.power]]
                 ];
    return angles[this.Angle];
  }
  
  rotateTool(sign) {    
    this.Angle = sign == 1 ? this.Angle + 1 : this.Angle - 1;
    this.Angle = this.Angle == 2 ? 0 : this.Angle;
    this.Angle = this.Angle == -1 ? 1 : this.Angle;
    
  }
 
}
