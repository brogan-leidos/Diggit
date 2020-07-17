import GameGrid from './engine/GameGrid.js'
import GenerateGrid from './engine/Generate-Grid.js'
import GameGridSettings from './engine/GameGridSettings.js'
import Generic from './biome/Generic.js'


var gameGrid = new GameGrid();

export default () => {
    document.getElementById('generateButton').addEventListener('click', () => {
        createGrid();
    });
    
};

function createGrid() {
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    var rarity = document.getElementById("rarity").value;
    
    gameGrid = GenerateGrid(gameGrid);
    gameGrid.settings = new GameGridSEttings(width, height, rarity, new Generic());
}
