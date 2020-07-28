export default class Loot {
  constructor(name="default", description="default discription", rarity=0, height=0, width=0, color="#fff", imagepath="") {
    this.Id = "";
    this.Name = name;
    this.description = description;
    this.rarity = rarity;
    
    this.origin = [-1,-1];
    this.height = height;
    this.width = width;
    
    this.Color = color;
    this.FullyRevealed = false;
    this.ImagePath = imagepath;
    
    this.Shape = []; // Used when conventional shapes wont work, w/h should both be -1 when this is used
  }
  
  getDimensions() {
    return [this.height, this.width];
  }
  
  
  getOccupiedSpots() {
    if (this.height < 0 || this.width < 0) {
      return this.getSpotsByShape();
    }
    var ret = [];
    for (var x=0; x < this.width; x++) {      
      for (var y=0; y < this.height; y++) {
        ret.push([this.origin[0]+x, this.origin[1]+y]);
      }
    }
    return ret;
  }
  
  getSpotsByShape() {
    // Find the origin first
    var localOrigin = [];
    for (var i=0; i < this.Shape.length; i++) {
      var findOrigin = this.Shape[i].indexOf("x");
      if (findOrigin != -1){
        localOrigin = [i, findOrigin];
      }                           
    }
    
    var localSpots = [];    
    for (var i=0; i < this.Shape.length; i++) {
      for (var j=0; j < this.Shape[i].length; j++) {
        if (this.Shape[i][j] != ".") {
          localSpots.push([i - localOrigin[0] + this.origin[0], 
                           j - localOrigin[1] + this.origin[1]]);
        }
      }
    } 
    
    return localSpots;            
  }
}
