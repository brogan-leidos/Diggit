import GameGrid from './engine/GameGrid.js'
import GenerateGrid from './engine/Generate-Grid.js'
import GameGridSettings from './engine/GameGridSettings.js'
import Generic from './biome/Generic.js'


var gameGrid = new GameGrid();

export default () => {
    gameGrid = GenerateGrid(gameGrid);
    gameGrid.settings = new GameGridSettings(5, 5, .5, new Generic());
    
    
    
};

