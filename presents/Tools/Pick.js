import Tool from '../Tool.js'

export default class Pick extends Tool {
  constructor() {
    super();
    this.Name = "Pick";
    this.power = 1;
    this.durability = -1;
    
    // Return an array of surrounding spots and the damage done to them
    mineSpot(spot) {
      return;
    }
    
    
  }
  
}
