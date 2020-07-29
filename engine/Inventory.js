export default class Inventory {
  constructor() {
    this.inventory = new Map(); // Style: ObjectName: Array<Object>
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
  
  removeFromInventory(objectName) {
    if (this.inventory[objectName] === undefined){
      // Something very wrong has happened
    }
    var retItem = this.inventory[objectName].pop();
    if (this.inventory[objectName].length == 0) {
      this.inventory.delete(objectName);
    }
    return retItem;
  }
}
