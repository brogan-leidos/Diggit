export default class Item {
    
    constructor () {
      this.Name = "Default item name";
      this.Description = "Default item description";
      this.Power = 0;
      this.Damage = 0;
      this.NumberRemaining = 0;
    }
    
    behavior(gameGrid) {
      return;
    }
              
}
