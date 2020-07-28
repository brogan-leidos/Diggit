import Tool from './Tool.js'

export default class Support extends Tool {
  constructor() {
    super();
    this.Name = "Support";
    this.power = 20;
  } 
  
  behavior(gameGrid) {
    gameGrid.remainingHealth += this.power;
  }  
 
}
