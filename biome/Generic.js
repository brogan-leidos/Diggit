import Biome from './Biome.js'
import { Loot, Sapphire, Diamond, Ruby, Emerald, Amethyst, Fossil_A, Copper_Large, Copper_Medium, Copper } from './objects/index.js';

export default class Generic extends Biome {
  constructor() {
    super();
    this.Name = "Generic";
    this.Temperature = 50;
    this.MaxHardness = 3;
    
  }
  
  getSmallObjects() {
    var objects = [];
    objects.push(new Ruby(.05));
    objects.push(new Sapphire(.05));
    objects.push(new Emerald(.05));
    objects.push(new Amethyst(.05));
    objects.push(new Diamond(.01));
    objects.push(new Loot("Black Diamond", "An extremely rare, extremely precious gem", .005, 1, 1, "#d3d3d3"));    
    objects.push(new Loot("Copper Node", "A small node of copper",         .4, 1, 1, "#d4ad22"));
    objects.push(new Loot("Iron Node", "A small node of iron",             .3, 1, 1, "#949494"));
    objects.push(new Loot("Gold Nugget", "A small gold nugget",            .2, 1, 1, "#ffea00"));
    objects.push(new Loot("Green Moss", "A patch of common green moss",    .65, 1, 1, "#154518"));
    
    return objects;
  }
  
  getMediumObjects() {
    var objects = [];
    objects.push(new Loot("Med Copper Node", "A sizable node of copper", .4, 2, 3, "#d4ad22"));
    objects.push(new Loot("Med Iron Node", "A sizable node of iron", .3, 2, 3, "#949494"));
    objects.push(new Loot("Large Gold Nugget", "A large gold nugget", .1, 2, 2, "#ffea00"));
    objects.push(new Loot("Fossil", "A very old fossil", .3, 1, 2, "#61511e"));
    objects.push(new Loot("Coal Chunk", "A chunk of coal", .6, 2, 2, "#57372e"));    
    
    return objects;
  }
  
  getLargeObjects() {
    var objects = [];
    objects.push(new Loot("Large Copper Node", "A large node of copper", .4, 3, 4, "#d4ad22"));
    objects.push(new Loot("Large Iron Node", "A large node of iron", .3, 3, 4, "#949494"));
    objects.push(new Loot("Large Fossil", "A very large and very old fossil", .3, 2, 3, "#4f4423"));
    objects.push(new Loot("Coal Vein", "A large vein of coal", .6, 3, 3, "#592b1d"));
    objects.push(new Fossil_A());
    
    return objects;
  }
}
