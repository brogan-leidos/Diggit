export default class Inventory {
  constructor() {
    this.inventory = {};
    this.money = 0;
    this.availableTools = [];
    this.availableItems = [];
    this.availableBiomes = [];
  }
  
  addToInventory(object) {
    if (this.inventory[object.Name] === undefined) {
      this.inventory[object.Name] = new Array();      
    }
    this.inventory[object.Name].push(object);
  }
  
  removeFromInventory(object) {
    if (this.inventory[object.Name] === undefined){
      // Something very wrong has happened
    }
    var retItem = this.inventory[object.Name].pop();
    if (this.inventory[object.Name].length == 0) {
      this.inventory.delete(object.Name);
    }
    return retItem;
  }
}
