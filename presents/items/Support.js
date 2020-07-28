import Item from './Item.js'

export default class Support extends Item {
  constructor() {
    super();
    this.Name = "Support";
    this.power = 20;
  } 
  
  behavior(gameGrid) {
    gameGrid.remainingHealth += this.power;
  }  
 
}
