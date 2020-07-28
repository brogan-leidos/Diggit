import Tool from './Tool.js'

export default class Vaporizer extends Tool {
  constructor() {
    super();
    this.Name = "Vaporizer";
    this.power = 1;
    this.durability = 1;
    this.damage = 40;
  } 
  
  // Return an array of surrounding spots and the damage done to them
  getMinableSpots(x, y) {
    var retArray = [];
    retArray.push([x,y,this.power]);
    for (var i=1; i < 15; i++) {
      for (var j=1; j < 15; j++) {
        retArray.push([x+i, y+j, this.power]);
        retArray.push([x+i, y-j, this.power]);
        retArray.push([x-i, y+j, this.power]);
        retArray.push([x-i, y-j, this.power]);
        retArray.push([x+i, y, this.power]);
        retArray.push([x-i, y, this.power]);
        retArray.push([x, y+j, this.power]);
        retArray.push([x, y-j, this.power]);
      }
    }
    return retArray;
  }
 
}
