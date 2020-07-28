export default class Biome {
  constructor() {    
    this.Temperature = 0; 
    this.MaxHardness = 0;
    
    this.GridBorderColor = "#ddd";
    this.GridBackgroundColor = "#eee";
    
    this.PressurePointsEnabled = false;
    this.IceSheetsEnabled = false;
    this.LavaPlumesEnabled = false;
    
  }

  getLargeObjects() { return; }
  getMedObjects() { return; }
  getSmallObjects() { return; }
}
