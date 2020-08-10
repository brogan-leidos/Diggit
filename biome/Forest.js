import Biome from './Biome.js'
import { Loot, Sapphire, Diamond, Fossil_A, Copper_Large, Copper_Medium } from './objects/index.js';

export default class Forest extends Biome {
  constructor() {
    super();
    this.Name = "Forest";
    this.Temperature = 30;
    this.MaxTempVariance = 5;
    this.MaxHardness = 2;
    this.ImagePath = "./biome/biomeimages/forest.jpg";
    
    this.GridBackgroundColor = "#236e45";
    this.GridBorderColor = "#567564"
    
  }    

  getSmallObjects() {
    var objects = [];
    objects.push(new Loot("Ruby", "A sparkling red gem",                   .05, 1, 1, "#de283a", "biome/objects/images/ruby.png"));
    objects.push(new Sapphire(.05));
    objects.push(new Loot("Emerald", "A sparkling green gem",              .05, 1, 1, "#0ef083"));
    objects.push(new Loot("Amythest", "A sparkling violet gem",            .05, 1, 1, "#9c56c4"));
    objects.push(new Diamond(.01));
    objects.push(new Loot("Black Diamond", "An extremely rare, extremely precious gem", .001, 1, 1, "#d3d3d3"));    
    objects.push(new Loot("Copper Node", "A small node of copper",         .3, 1, 1, "#d4ad22"));
    objects.push(new Loot("Iron Node", "A small node of iron",             .2, 1, 1, "#949494"));
    objects.push(new Loot("Gold Nugget", "A small gold nugget",            .07, 1, 1, "#ffea00"));
    objects.push(new Loot("Green Moss", "A patch of common green moss",    .65, 1, 1, "#154518"));
    objects.push(new Loot("Carrot", "An orange carrot",                    .5, 2, 1, "#e6b010"));
    objects.push(new Loot("Potato", "A dirty potato",                      .5, 1, 1, "#948866"));
    objects.push(new Loot("Acorns", "A squirrel's future lunch",           .8, 1, 1, "#5e513e"));

    
    return objects;
  }
  
  getMediumObjects() {
    var objects = [];
    objects.push(new Copper_Medium(.3));
    objects.push(new Loot("Med Iron Node", "A sizable node of iron", .3, 2, 3, "#949494"));
    objects.push(new Loot("Large Gold Nugget", "A large gold nugget", .1, 2, 2, "#ffea00"));
    objects.push(new Loot("Fossil", "A very old fossil", .3, 1, 2, "#61511e"));
    objects.push(new Loot("Coal Chunk", "A chunk of coal", .6, 2, 2, "#57372e"));    
    
    return objects;
  }
  
  getLargeObjects() {
    var objects = [];
    objects.push(new Copper_Large(.3));
    objects.push(new Loot("Large Iron Node", "A large node of iron", .3, 3, 4, "#949494"));
    objects.push(new Loot("Coal Vein", "A large vein of coal", .6, 3, 3, "#592b1d"));
    
    return objects;
  }
}
