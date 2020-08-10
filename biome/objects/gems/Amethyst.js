import Loot from '../Loot.js'

export default class Amethyst extends Loot {
  constructor(rarity) {
    super("Amethyst", "A sparkling voilet gem", rarity, 1, 1, "#ff00ff");
    this.Value = 1000;
    this.Price = 2000;    
  }
}
