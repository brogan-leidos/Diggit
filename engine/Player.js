export default class Player {
  constructor() {
    this.inventory = new Map(); // Style: ObjectName: Array<Object>
    this.money = 0;
    this.availableTools = [];
    this.availableItems = [];
    this.availableBiomes = [];
    
    this.Power = 0;
    this.Precision = 0;
    this.Luck = 50;
    
    this.PowerMod = 0;
    this.PrecisionMod = 0;
    this.LuckMod = 0;
    
    this.BuffTimer = 0;
  }
  
  addToInventory(object) {
    if (this.inventory.has(object.Name) == false) {
      this.inventory.set(object.Name, new Array());      
    }
    this.inventory.get(object.Name).push(object);
  }
  
  removeFromInventory(objectName) {
    if (this.inventory.has(objectName) == false){
      // Something very wrong has happened, please god someone save us
    }
    var retItem = this.inventory.get(objectName).pop();
    if (this.inventory.get(objectName).length == 0) {
      this.inventory.delete(objectName);
    }
    return retItem;
  }
  
  buffStats(pow=0, pre=0, luck=0) {
    this.PowerMod += pow;
    this.PrecisionMod += pre;
    this.LuckMod += luck;
  }
  
  debuffStats(pow=0, pre=0, luck=0) {
    this.PowerMod -= pow;
    this.PrecisionMod -= pre;
    this.LuckMod -= luck;
  }
  
  normalizeStats() {
    this.PowerMod = 0;
    this.PrecisionMod = 0;
    this.LuckMod = 0;
  }
}
