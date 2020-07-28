import Object from './Object.js'

export default class Sapphire extends Object {
  constructor() {
    super("Sapphire", "A sparkling blue gem", .1, 1, 1, "#3063f0", "biome/objects/images/sapphire.png");
    this.Value = 1000;
    this.Price = 2000;    
  }
}
