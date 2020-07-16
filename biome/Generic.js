import Object from './objects/Object.js'

export default class Generic extends Biome {
  constructor() {
    super();
    
  }
  
  getSmallObjects() {
    var objects = [];
    objects.push(new Object("Ruby", "A sparkling red gem",           .1, 1, 1));
    objects.push(new Object("Sapphire", "A sparkling blue gem",      .1, 1, 1));
    objects.push(new Object("Emerald", "A sparkling green gem",      .1, 1, 1));
    objects.push(new Object("Diamond", "A very precious gem",        .01, 1, 1));
    objects.push(new Object("Copper Node", "A small node of copper", .4, 1, 1));
    objects.push(new Object("Iron Node", "A small node of iron",     .3, 1, 1));
    objects.push(new Object("Gold Nugget", "A small gold nugget",    .2, 1, 1));
    
    return objects;
  }
  
  getMediumObjects() {
    var objects = [];
    objects.push(new Object("Med Copper Node", "A sizable node of copper", .4, 2, 3));
    objects.push(new Object("Med Iron Node", "A sizable node of iron", .3, 2, 3));
    objects.push(new Object("Large Gold Nugget", "A large gold nugget", .1, 2, 2));    
    
    return objects;
  }
  
  getLargeObjects() {
    var objects = [];
    objects.push(new Object("Large Copper Node", "A large node of copper", .4, 3, 4));
    objects.push(new Object("Large Iron Node", "A large node of iron", .3, 3, 4));
    
    return objects;
  }
}
