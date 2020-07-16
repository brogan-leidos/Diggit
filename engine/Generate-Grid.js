
// Generates 2 layers of the grid
// Layer 1: the underlying loot layer, this is where the objects go
// Layer 2: The overlaying dirt layer. This determines how hard it is to dig down
export function generateGrid(settings) {
    
  // Initialize the grid
  var lowerGrid = initializeGrid(settings.width, settings.height);
  
  // Determine how many items to spawn (Determined by the richness of the vein)
  var density = calculateDensity(settings.rarity, settings.temp);
  
  // Determine what kinds of objects to spawn (also determined by rarity)
  var objectList = assignTypesToDensity(settings, density);
  
  // Spawn those bad boys
  
  // Generate a dirt layer to cover everything
  
  
  
  return;
}

function initializeGrid(width, height) {
  var grid = [];
  for (var x = 0; x < width; x++) {
    grid[x] = new Array();
    for (var y = 0; y < height; y++) {
       grid[x][y] = '0';
    }
  }
  
  return grid;
}

// Rarity should be a number between 0 (there is nothing) to 1 (Doesnt get better than this)
function calculateDensity(settings) {
  //Math.floor(Math.random() * 10 + 1) will give us an int between 1 and 10
  var numLarge = 0;
  var numMed = 0;
  var numSmall = 0;
  
  
  // Calculate total number of objects
  var minItems = settings.rarity * 10;   
  var maxItems = settings.height * settings.width / 10;
  var remainingItems = Math.floor(Math.random() * (maxItems-minItems) + minItems);
  
  // Determine the size of each item. Could be large (10%), med (35%), or small (the rest)
  for (var i=0; i < remainingItems; i++) {
    var roll = Math.floor(Math.random() * 100 + 1);
    if (roll <= 10) {
      numLarge++;
    }
    else if (roll <= 45) {
      numMed++;
    }
    else {
      numSmall++;
    }
  }
  
  
  return [numLarge, numMed, numSmall];
}

function spawnObjectFromList(spawnList) {
   for (var i=0; i < spawnList.length; i++) {
      if (Math.random() <= spawnList[i].rarity){
        return spawnList[i];
      }
   }
}

// Density is [Large, Med, Small]
function assignTypesToDensity(settings, density) {
    // Fetch biome list at some later date
    var objectList = [];
    
    var spawnList = settings.biome.getLargeObjects();
    for (var i=0; i < density[0]; i++) {      
        objectList.push(spawnObjectFromList(spawnList));
    }

    var spawnList = settings.biome.getMediumObjects();
    for (var i=0; i < density[1]; i++) {      
        objectList.push(spawnObjectFromList(spawnList));
    }

    var spawnList = settings.biome.getSmallObjects();
    for (var i=0; i < density[2]; i++) {      
        objectList.push(spawnObjectFromList(spawnList));
    }
    
    return objectList;
}
