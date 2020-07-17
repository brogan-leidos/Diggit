import GameGrid from './engine/GameGrid.js'
import {GenerateGrid} from './engine/Generate-Grid.js'
import GameGridSettings from './engine/GameGridSettings.js'
import Generic from './biome/Generic.js'


var gameGrid = new GameGrid();

export default () => {
    document.getElementById('generateButton').addEventListener('click', () => {
        gameGrid = createGameGrid();
        refreshGrid(gameGrid);
    });
    
};

function createGameGrid() {
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    var rarity = document.getElementById("rarity").value;
    
    gameGrid = GenerateGrid(gameGrid);
    gameGrid.settings = new GameGridSEttings(width, height, rarity, new Generic());
    
    return gameGrid;
}

function refreshGrid(grid) {
    var gameSection = document.getElementById("gameSection");
    gameSection.innerHTML = "";
    
    // Display upper grid and then lower grid
    // Generate a table based on the given grids
    
    var htmlResult = "";
    
    for (var i=0; i < gameGrid.upperGrid.length; i++) {
        hmtlResult += "<tr>";
        for (var j=0; j < gameGrid.upperGrid[i].length; j++) {
                htmlResult += "<td>" + gameGrid.upperGrid[i].toString() + "</td>"
        }
    }
    
    htmlResult += "Divider time";
    
    
    for (var i=0; i < gameGrid.lowerGrid.length; i++) {
        hmtlResult += "<tr>";
        for (var j=0; j < gameGrid.lowerGrid[i].length; j++) {
                htmlResult += "<td>" + gameGrid.lowerGrid[i].toString() + "</td>"
        }
    }
    
    gameSection.innerHTML = "";
    gameSection.insertAdjacentHTML('beforeend', htmlResult);
    return htmlResult;
}
