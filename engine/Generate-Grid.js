/* SETTINGS OBJECT:
    Has: Rarity, width, height, biome

*/
import Loot from '../biome/objects/Loot.js'


// Generates 2 layers of the grid
// Layer 1: the underlying loot layer, this is where the objects go
// Layer 2: The overlaying dirt layer. This determines how hard it is to dig down
export function generateGrid(gameGrid) {
  var settings = gameGrid.settings;
  // Determine how many items to spawn (Determined by the richness of the vein)
  var density = calculateDensity(settings);
  
  // Determine what kinds of objects to spawn (also determined by rarity)
  var objectList = assignTypesToDensity(settings, density);
  gameGrid.objects = objectList;
  
  // Spawn those bad boys
  gameGrid.lowerGrid = placeObjects(settings, objectList);
  
  // Generate a dirt layer to cover everything
  gameGrid.upperGrid = generateUpperGrid(settings);   
  
  // Health will vary with biomes
  settings.biome.rollTemperature();
  gameGrid.maxHealth = settings.biome.Temperature * 2;
  gameGrid.healthRemaining = gameGrid.maxHealth;
  
  gameGrid.hazardGrid =  initializeGrid(settings.width, settings.height);
  if (settings.biome.PressurePointsEnabled) {
    gameGrid.hazardGrid = generatePressurePoints(gameGrid.hazardGrid, gameGrid.lowerGrid, settings);
  }
  
  return gameGrid;
}

function initializeGrid(width, height, value="0") {
  var grid = [];
  for (var x = 0; x < width; x++) {
    grid[x] = new Array();
    for (var y = 0; y < height; y++) {
       grid[x][y] = value;
    }
  }
  
  return grid;
}

function generateUpperGrid(settings) {
   var grid = initializeGrid(settings.width, settings.height, 1);
    
   for (var i=0; i < settings.biome.MaxHardness; i++) {
       for (var x=0; x < grid.length; x++) {
           for (var y=0; y < grid[x].length; y++) {
               if (Math.random() > .5) {
                   grid[x][y]++;
               }
           }       
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

// Density is [Large, Med, Small]
function assignTypesToDensity(settings, density) {
    // Fetch biome list at some later date
    var objectList = [];
    
    var spawnList = settings.biome.getLargeObjects();
    for (var i=0; i < density[0]; i++) {      
        objectList.push(spawnObjectFromList(spawnList, settings));
    }

    var spawnList = settings.biome.getMediumObjects();
    for (var i=0; i < density[1]; i++) {      
        objectList.push(spawnObjectFromList(spawnList, settings));
    }

    var spawnList = settings.biome.getSmallObjects();
    for (var i=0; i < density[2]; i++) {      
        objectList.push(spawnObjectFromList(spawnList, settings));
    }
    
    return objectList;
}

function spawnObjectFromList(spawnList, settings) {
    while(true) {
        var dropNum = Math.random() - settings.rarity;
        var genList = spawnList.filter(a => a.rarity >= dropNum);
        if (genList.length > 0) {
            break;
        }
    }
    var pickFromGen = Math.floor(Math.random() * genList.length) 

    return Object.create(genList[pickFromGen]);  
}

function placeObjects(settings, objectList) {
    var grid = initializeGrid(settings.width, settings.height);
    for (var i=0; i < objectList.length; i++){
        var continueLoop = 0;
        while (continueLoop < 1000) {
            // Pick a random spot to slap this thing down
            var x = Math.floor(Math.random() * settings.width);
            var y = Math.floor(Math.random() * settings.height);        
            if(checkSpotValidity(grid, x, y, objectList[i])) {
                grid = placeObject(grid, objectList[i]);
                break;
            }
            continueLoop += 1;
        }        
    }
    return grid;
}

function checkSpotValidity(grid, xOrigin, yOrigin, object) {
    // TODO: Allow for rotation
    object.origin = [xOrigin, yOrigin];
    var width = grid.length;
    var height = grid[0].length;
    var potentialSpots = object.getOccupiedSpots();
    
    for (var i=0; i < potentialSpots.length; i++) {
        var potentialX = potentialSpots[i][0];
        var potentialY = potentialSpots[i][1];
        
        if (potentialX < 0 || potentialX >= width || potentialY < 0 || potentialY >= height) {
            return false;
        }
        
        if (grid[potentialX][potentialY] != 0) {
            return false;
        }
    }
    
    return true;
}

function placeObject(grid, object) {
    var spotsToFill = object.getOccupiedSpots();

    for (var i=0; i < spotsToFill.length; i++) {
        grid[spotsToFill[i][0]][spotsToFill[i][1]] = object;
    }
    
    return grid;
}

// At most, 30% of the board will be points (value 1)
function generatePressurePoints(hazardGrid, lowerGrid, settings) {
    var numPointsToPlace = Math.floor(lowerGrid.length * lowerGrid[0].length / 3);
    for (var i=0; i < numPointsToPlace; i++) {
        var x = Math.floor(Math.random() * settings.width);
        var y = Math.floor(Math.random() * settings.height);
        if (lowerGrid[x][y] == "0") {
            hazardGrid[x][y] = "1";
        }
    }
    return hazardGrid;
   
}
