import Object from './objects/Object.js'
import Biome from './Biome.js'

export default class Generic extends Biome {
  constructor() {
    super();
    
  }
  
  getSmallObjects() {
    var objects = [];
    objects.push(new Object("Ruby", "A sparkling red gem",                   .1, 1, 1, "#de283a", "biome/objects/images/ruby.png"));
    objects.push(new Object("Sapphire", "A sparkling blue gem",              .1, 1, 1, "#3063f0", "biome/objects/images/sapphire.png"));
    objects.push(new Object("Emerald", "A sparkling green gem",              .1, 1, 1, "#0ef083"));
    objects.push(new Object("Amythest", "A sparkling violet gem",            .1, 1, 1, "#9c56c4"));
    objects.push(new Object("Diamond", "A very precious gem",                .01, 1, 1, "#e3e3e3"));
    objects.push(new Object("Diamond", "A extremely rare, extremely precious gem", .005, 1, 1, "#d3d3d3"));    
    objects.push(new Object("Copper Node", "A small node of copper",         .4, 1, 1, "#d4ad22"));
    objects.push(new Object("Iron Node", "A small node of iron",             .3, 1, 1, "#949494"));
    objects.push(new Object("Gold Nugget", "A small gold nugget",            .2, 1, 1, "#ffea00"));
    objects.push(new Object("Green Moss", "A patch of common green moss",    .65, 1, 1, "#154518"));
    
    return objects;
  }
  
  getMediumObjects() {
    var objects = [];
    objects.push(new Object("Med Copper Node", "A sizable node of copper", .4, 2, 3, "#d4ad22"));
    objects.push(new Object("Med Iron Node", "A sizable node of iron", .3, 2, 3, "#949494"));
    objects.push(new Object("Large Gold Nugget", "A large gold nugget", .1, 2, 2, "#ffea00"));
    objects.push(new Object("Fossil", "A very old fossil", .3, 1, 2, "#61511e"));
    objects.push(new Object("Coal Chunk", "A chunk of coal", .6, 2, 2, "#57372e"));    
    
    return objects;
  }
  
  getLargeObjects() {
    var objects = [];
    objects.push(new Object("Large Copper Node", "A large node of copper", .4, 3, 4, "#d4ad22"));
    objects.push(new Object("Large Iron Node", "A large node of iron", .3, 3, 4, "#949494"));
    objects.push(new Object("Large Fossil", "A very large and very old fossil", .3, 2, 3, "#4f4423"));
    objects.push(new Object("Coal Vein", "A large vein of coal", .6, 3, 3, "#592b1d"));    
    
    return objects;
  }
}
