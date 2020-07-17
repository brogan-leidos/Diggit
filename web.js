import GameGrid from './engine/GameGrid.js'
import {generateGrid} from './engine/Generate-Grid.js'
import GameGridSettings from './engine/GameGridSettings.js'
import Generic from './biome/Generic.js'


var gameGrid = new GameGrid();

export default () => {
    document.getElementById('generateButton').addEventListener('click', () => {
        gameGrid = createGameGrid();
        refreshGrid();
    });
    
};

function createGameGrid() {
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    var rarity = document.getElementById("rarity").value;
    
    gameGrid.settings = new GameGridSettings(width, height, rarity, new Generic());
    gameGrid = generateGrid(gameGrid);
    
    return gameGrid;
}

function refreshGrid() {
    var gameSection = document.getElementById("gameSection");
    gameSection.innerHTML = "";
    
    // Display upper grid and then lower grid
    // Generate a table based on the given grids
    
    var htmlResult = "";
    
    htmlResult += "<table><tbody>";    
    for (var i=0; i < gameGrid.upperGrid.length; i++) {
        htmlResult += "<tr>";
        for (var j=0; j < gameGrid.upperGrid[i].length; j++) {
            if (gameGrid.upperGrid[i][j] <= 0) {
                var bgColor = gameGrid.lowerGrid[i][j] == "0" ? "#363940" : gameGrid.lowerGrid[i][j].Color;
                htmlResult += `<td id="${i},${j}" class="exposed" style="background-color:${bgColor}"></td>`
            }
            else {
                htmlResult += `<td id="${i},${j}" class="dirt">${gameGrid.upperGrid[i][j].toString()}</td>`
            }
        }
        htmlResult += "</tr>";
    }    
    htmlResult += "</tbody></table>";
    
    gameSection.innerHTML = "";
    gameSection.insertAdjacentHTML('beforeend', htmlResult);
    
    var dirtList = document.getElementsByClassName("dirt");
    for (var i=0; i < dirtList.length; i++){
        dirtList[i].addEventListener('click', (e) => {
            clickSpot(e.target.id);
        });
    }
    
    var exposedList = document.getElementsByClassName("exposed");
    for (var i=0; i < exposedList.length; i++){
        exposedList[i].addEventListener('mouseenter', (e) => {
            updateInfoSection(e.target.id);
        });
    }
    
    return htmlResult;
}

function updateInfoSection(spotId) {
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);   
    var infoSection = document.getElementsByClassName("infoSection")[0];
    
    var object = gameGrid.lowerGrid[x][y];
    if (object != "0") {
        infoSection.innerHTML = object.Name;
    }
    else {
        infoSection.innerHTML = "Empty";
    }
}

function clickSpot(spotId) {
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);
    // Get current tool
    
    // Mine the space
    gameGrid.upperGrid[x][y]--;
    refreshGrid();
}
