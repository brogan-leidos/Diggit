import GameGrid from './engine/GameGrid.js'
import {generateGrid} from './engine/Generate-Grid.js'
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
    
    gameGrid.settings = new GameGridSettings(width, height, rarity, new Generic());
    gameGrid = generateGrid(gameGrid);
    
    return gameGrid;
}

function refreshGrid(grid) {
    var gameSection = document.getElementById("gameSection");
    gameSection.innerHTML = "";
    
    // Display upper grid and then lower grid
    // Generate a table based on the given grids
    
    var htmlResult = "";
    
    htmlResult += "<table><tbody>";    
    for (var i=0; i < gameGrid.upperGrid.length; i++) {
        htmlResult += "<tr>";
        for (var j=0; j < gameGrid.upperGrid[i].length; j++) {
                htmlResult += "<td>" + gameGrid.upperGrid[i][j].toString() + "</td>"
        }
        htmlResult += "</tr>";
    }    
    htmlResult += "</tbody></table>";

    htmlResult += "Divider time";
    
    htmlResult += "<table><tbody>";
    for (var i=0; i < gameGrid.lowerGrid.length; i++) {
        htmlResult += "<tr>";
        for (var j=0; j < gameGrid.lowerGrid[i].length; j++) {
                htmlResult += "<td>" + gameGrid.lowerGrid[i][j].Name.toString() + "</td>"
        }
        htmlResult += "</tr>";        
    }
    htmlResult += "</tbody></table>";

    
    
    gameSection.innerHTML = "";
    gameSection.insertAdjacentHTML('beforeend', htmlResult);
    return htmlResult;
}
