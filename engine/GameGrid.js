export default class GameGrid {
  constructor() {
    this.lowerGrid = [];
    this.hazardGrid = [];
    this.upperGrid = [];
    this.objects = [];
    this.healthRemaining = 0;
    this.maxHealth = 0;
    this.settings = null;
  }
}
