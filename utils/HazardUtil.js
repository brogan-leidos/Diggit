var gameGrid = null;
var hazardMemory = []

export function processOil(gameGrid) {
//  EXPAND current revealed oil tiles
    var hazardMemory = updateHazardMemory("3", gameGrid);            
    
    for (var i=0; i < hazardMemory.length; i++) {
        var seekX = hazardMemory[i][0];
        var seekY = hazardMemory[i][1];

        gameGrid.hazardGrid[Math.min(seekX+1, gameGrid.upperGrid.length - 1)][seekY] = "3";
        gameGrid.hazardGrid[Math.max(seekX-1, 0)][seekY] = "3";
        gameGrid.hazardGrid[seekX][Math.min(seekY+1, gameGrid.upperGrid[0].length - 1)] = "3";
        gameGrid.hazardGrid[seekX][Math.max(seekY-1, 0)] = "3";
        
    }
    
    return hazardMemory;
}

export function updateHazardMemory(searchValue= -1, gameGrid) {
    hazardMemory = [];
    for (var x=0; x < gameGrid.hazardGrid.length; x++) {
        for (var y=0; y < gameGrid.hazardGrid[x].length; y++) {
            if (gameGrid.hazardGrid[x][y] != 0 && searchValue == -1) {
                hazardMemory.push([x,y]);
            }
            else if (gameGrid.hazardGrid[x][y] == searchValue) {
                hazardMemory.push([x,y]);
            }            
        }
    }
}


export function processIceSheet(mineX, mineY, sheetValue, spotMemory, incomingGrid, selectedTool) {
    gameGrid = incomingGrid;
    var spotId = spotMemory.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);
    
    var exploredSpots = [];
    
    var originalSpots = selectedTool.getMinableSpots(x,y);
    originalSpots = originalSpots.map(a => [a[0], a[1]]);
    
    return exploreSheet(mineX, mineY, sheetValue, originalSpots);
}

// Loop de loop de loop de loop
export function exploreSheet(mineX, mineY, sheetValue, alreadyExplored) {
    if (gameGrid.upperGrid[mineX][mineY] != sheetValue) {
        return -1;
    }

    var beingExplored = [];
    if (!checkIfSpotExistsInArray([mineX, mineY], alreadyExplored)) {
        beingExplored = [[mineX, mineY]];
    }
    
    alreadyExplored.push([mineX, mineY]);

    var expectedAdjacent = [
        [Math.min(mineX + 1, gameGrid.upperGrid.length - 1), mineY]   
        ,[Math.max(mineX - 1, 0), mineY]
        ,[mineX, Math.min(mineY + 1, gameGrid.upperGrid[0].length - 1)]
        ,[mineX, Math.max(mineY - 1, 0)]
    ];

    for (var i=0; i < 4; i++) {
        if (!checkIfSpotExistsInArray(expectedAdjacent[i], alreadyExplored)) {
            var exploreResult = exploreSheet(expectedAdjacent[i][0], expectedAdjacent[i][1], sheetValue, alreadyExplored); 
            if (exploreResult != -1) {
                beingExplored = beingExplored.concat(exploreResult); 
            }
        }
    }
    
    return beingExplored;    
}
         
export function checkIfSpotExistsInArray(spot, array) {
    for (var i=0; i < array.length; i++) {
        if (spot.toString() == array[i].toString()) {
            return true;
        }        
    }
    return false;
}

export function damageIceSheets(hazardMemory, gameGrid) {
    hazardMemory.filter((item, index) => hazardMemory.indexOf(item) === index); // Remove duplicates
    for (var i=0; i < hazardMemory.length; i++) {
        gameGrid.upperGrid[hazardMemory[i][0]][hazardMemory[i][1]]--;
    }
}
