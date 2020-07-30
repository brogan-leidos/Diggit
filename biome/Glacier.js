import Biome from './Biome.js'
import { Loot, Sapphire, Fossil_A } from './objects/index.js';

export default class Glacier extends Biome {
  constructor() {
    super();
    this.Name = "Glacier";
    this.Temperature = 5;
    this.MaxHardness = 2;
    this.ImagePath = "./biome/biomeimages/glacier.jpg";
    
    this.GridBackgroundColor = "#90f7fc";
    this.GridBorderColor = "#729ea1"
    
    this.IceSheetsEnabled = true;
    
    this.Temperature = this.Temperature + Math.floor(Math.random() * 10)
  }
  
  getSmallObjects() {
    var objects = [];
    objects.push(new Loot("Ruby", "A sparkling red gem",                   .05, 1, 1, "#de283a", "biome/objects/images/ruby.png"));
    objects.push(new Sapphire(.05));
    objects.push(new Loot("Emerald", "A sparkling green gem",              .05, 1, 1, "#0ef083"));
    objects.push(new Loot("Amythest", "A sparkling violet gem",            .05, 1, 1, "#9c56c4"));
    objects.push(new Loot("Diamond", "A very precious gem",                .01, 1, 1, "#e3e3e3"));
    objects.push(new Loot("Black Diamond", "An extremely rare, extremely precious gem", .001, 1, 1, "#d3d3d3"));    
    objects.push(new Loot("Copper Node", "A small node of copper",         .3, 1, 1, "#d4ad22"));
    objects.push(new Loot("Iron Node", "A small node of iron",             .2, 1, 1, "#949494"));
    
    return objects;
  }
  
  getMediumObjects() {
    var objects = [];
    objects.push(new Loot("Med Copper Node", "A sizable node of copper", .4, 2, 3, "#d4ad22"));
    objects.push(new Loot("Med Iron Node", "A sizable node of iron", .3, 2, 3, "#949494"));
    objects.push(new Loot("Large Gold Nugget", "A large gold nugget", .1, 2, 2, "#ffea00"));
    objects.push(new Loot("Fossil", "A very old fossil", .3, 1, 2, "#61511e"));
    objects.push(new Loot("Coal Chunk", "A chunk of coal", .6, 2, 2, "#57372e"));
    objects.push(new Loot("Big Pearl", "A large pearl from a large clam",    .45, 2, 2, "#154518"));
    
    
    return objects;
  }
  
  getLargeObjects() {
    var objects = [];
    objects.push(new Loot("Large Copper Node", "A large node of copper", .4, 3, 4, "#d4ad22"));
    objects.push(new Loot("Large Iron Node", "A large node of iron", .3, 3, 4, "#949494"));
    objects.push(new Loot("Coal Vein", "A large vein of coal", .6, 3, 3, "#592b1d"));
    
    return objects;
  }
}
