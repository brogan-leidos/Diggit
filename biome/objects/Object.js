export default class Object {
  constructor(name="default", description="default discription", rarity=0, height=0, width=0, color="#fff") {
    this.Id = "";
    this.Name = name;
    this.description = description;
    this.rarity = rarity;
    
    this.origin = [-1,-1];
    this.height = height;
    this.width = width;
    
    this.Color = color;
    
  }
  
  getDimensions() {
    return [this.height, this.width];
  }
  
  
  getOccupiedSpots() {
    var ret = [];
    for (var x=0; x < this.width; x++) {      
      for (var y=0; y < this.height; y++) {
        ret.push([this.origin[0]+x, this.origin[1]+y]);
      }
    }
    return ret;
  }
}
