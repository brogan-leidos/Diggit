import Loot from './Loot.js'

export default class Ruby extends Loot {
  constructor(rarity) {
    super("Ruby", "A sparkling red gem", rarity, 1, 1, "#ff0066", "biome/objects/images/ruby.png");
    this.Value = 1000;
    this.Price = 2000;    
  }
}
