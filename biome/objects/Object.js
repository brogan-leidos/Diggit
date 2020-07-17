export default class Object {
  constructor(name="default", description="default discription", rarity=0, height=0, width=0, color="#fff") {
    this.Id = "";
    this.Name = name;
    this.description = description;
    this.rarity = rarity;
    this.height = height;
    this.width = width;
    this.Color = color;
  }
  
  getDimensions() {
    return [this.height, this.width];
  }
}
