import Item from './Item.js'

export default class Support extends Item {
  constructor() {
    super();
    this.Name = "Support";
    this.Description = "Adds health to the wall";
    this.power = 20;
  } 
  
  behavior(gameGrid) {
    gameGrid.healthRemaining += this.power;
  }  
 
}
