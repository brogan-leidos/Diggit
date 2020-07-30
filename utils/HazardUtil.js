export function processIceSheet(mineX, mineY, sheetValue) {
    var spotId = spotMemory;
    spotId = spotMemory.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);
    
    var exploredSpots = [];
    
    var originalSpots = selectedTool.getMinableSpots(x,y);
    originalSpots = originalSpots.map(a => [a[0], a[1]]);
    
    hazardMemory = hazardMemory.concat(exploreSheet(mineX, mineY, sheetValue, originalSpots));      
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

export function damageIceSheets() {
    hazardMemory.filter((item, index) => hazardMemory.indexOf(item) === index); // Remove duplicates
    for (var i=0; i < hazardMemory.length; i++) {
        gameGrid.upperGrid[hazardMemory[i][0]][hazardMemory[i][1]]--;
    }
}
