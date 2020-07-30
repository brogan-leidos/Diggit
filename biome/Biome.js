export default class Biome {
  constructor() {    
    this.Temperature = 0; 
    this.MaxHardness = 0;
    
    this.GridBorderColor = "#ddd";
    this.GridBackgroundColor = "#eee";
    
    this.OilSpillsEnabled = false;
    this.PressurePointsEnabled = false;
    this.IceSheetsEnabled = false;
    this.LavaPlumesEnabled = false;
    
  }

  rollTemperature(temp) {
    if (temp == "cold") {
      this.Temperature = this.Temperature + Math.floor(Math.random() * 5);
    }
    else if (temp == "hot") {
      this.Temperature = this.Temperature + Math.floor(Math.random() * 20);
    }
    else {
      this.Temperature = this.Temperature + Math.floor(Math.random() * 10);
    }
  }
  
  getLargeObjects() { return; }
  getMedObjects() { return; }
  getSmallObjects() { return; }
}
