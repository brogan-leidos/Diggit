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

  getCellLayer(x, y) {
    return (gameGrid.upperGrid[x] && gameGrid.upperGrid[x][y]) !== undefined ? gameGrid.upperGrid[x][y] : -1;
}
}
