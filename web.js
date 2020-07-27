import GameGrid from './engine/GameGrid.js'
import {generateGrid} from './engine/Generate-Grid.js'
import GameGridSettings from './engine/GameGridSettings.js'
import Inventory from './engine/Inventory.js'
import Generic from './biome/Generic.js'
import Tool from './presents/Tools/Tool.js'
import Pick from './presents/Tools/Pick.js'
import Hammer from './presents/Tools/Hammer.js'
import Drill from './presents/Tools/Drill.js'



var gameGrid = new GameGrid();
var selectedTool = new Tool();
var inventory = new Inventory();

var highlightedSpots = [];

export default () => {
    firstLaunch();

    document.getElementById('generateButton').addEventListener('click', () => {
        gameGrid = createGameGrid();
        refreshGrid();
    });
    
    document.getElementById('showInventoryButton').addEventListener('click', () => {
        showInventory();
    });
    
};

function firstLaunch() {
    inventory.availableTools.push(new Pick(), new Hammer(), new Drill());
    selectedTool = inventory.availableTools[0];
    refreshToolArea();
    refreshHealthBar(); 
}

function createGameGrid() {
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    var rarity = document.getElementById("rarity").value;
    
    gameGrid.settings = new GameGridSettings(width, height, rarity, new Generic());
    gameGrid = generateGrid(gameGrid);

    refreshHealthBar();
    refreshDebugArea();
    
    return gameGrid;
}

function refreshGrid() {    
    drawGridWithOverlay()       
    assignEventsToGrid()         
}

// Replaces gameSection with new HTML representing current gameGrid
function drawGridWithOverlay() {
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
    
    var gameSection = document.getElementById("gameSection");  
    
    gameSection.innerHTML = "";
    gameSection.insertAdjacentHTML('beforeend', htmlResult);
}

function assignEventsToGrid() {
    var dirtList = document.getElementsByClassName("dirt");
    for (var i=0; i < dirtList.length; i++){
        dirtList[i].addEventListener('click', (e) => {
            mineClickedSpot(e.target.id);
        });
        dirtList[i].addEventListener('mouseenter', (e) => {
            highlightValidSpaces(e.target.id);;
        });
    }
    
    var exposedList = document.getElementsByClassName("exposed");
    for (var i=0; i < exposedList.length; i++){
        exposedList[i].addEventListener('mouseenter', (e) => {
            updateInfoSection(e.target.id);
        });
    }
}

function highlightValidSpaces(spotId) {
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);
    
    var highlightMemory = [];    
    
    if (highlightedSpots.length != 0) {
        highlightMemory = highlightedSpots;
    }

    var potentialSpots = selectedTool.getMinableSpots(x,y);    
    highlightedSpots = potentialSpots.filter(a => a[0] < gameGrid.settings.width && a[0] >= 0 && a[1] < gameGrid.settings.height && a[1] >= 0);
    
    for (var i=0; i < highlightMemory.length; i++) {
        var spotToLight = document.getElementById(`${highlightMemory[i][0]},${highlightMemory[i][1]}`);
        spotToLight.style.borderColor = "#ddd";
    }
    
    for (var i=0; i < highlightedSpots.length; i++) {     
        var spotToLight = document.getElementById(`${highlightedSpots[i][0]},${highlightedSpots[i][1]}`);
        spotToLight.style.borderColor = 'red';
    }
  
}

function updateInfoSection(spotId) {
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);   
    var infoSection = document.getElementsByClassName("infoSection")[0];
    
    var object = gameGrid.lowerGrid[x][y];
    if (object != "0") {
        infoSection.innerHTML = object.Name + ": " + object.description;
    }
    else {
        infoSection.innerHTML = "Empty";
    }
}

function mineClickedSpot(spotId) {
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);
    
    var minableSpots = selectedTool.getMinableSpots(x,y);
    for (var i=0; i < minableSpots.length; i++) {
        var mineX = minableSpots[i][0];
        var mineY = minableSpots[i][1];
        var power = minableSpots[i][2];
        
        if (mineX >= gameGrid.settings.width || mineX < 0 || mineY >= gameGrid.settings.height || mineY < 0) {
            continue;
        }        
        gameGrid.upperGrid[mineX][mineY] -= power;
    }
    
    gameGrid.healthRemaining -= selectedTool.damage;
    refreshHealthBar();

    selectedTool.durability--;
    refreshDurabilityArea();

    if (selectedTool.durability == 0){
        breakCurrentTool();
    }

    refreshGrid();
}

function breakCurrentTool() {
    var area = document.getElementById("toolDurability");
    area.innerHTML = "";
    area.innerHTML = "Oh no, your " + selectedTool.Name + " broke!"
    
    inventory.availableTools = inventory.availableTools.filter(a => a.Name != selectedTool.Name);
    selectedTool = inventory.availableTools[0];
    refreshToolArea();
}

function refreshDurabilityArea() {    
    var area = document.getElementById("toolDurability");
    area.innerHTML = "";
    area.innerHTML = selectedTool.durability + " durability";   
}

// This is called after a change to the tools array is made, either with the addition or deletion of a tool
function refreshToolArea() {
    var area = document.getElementById("toolArea");
    var newHTML = ""
    for (var i=0; i < inventory.availableTools.length; i++) {
        newHTML += `<button id="selectTool-${i}">${inventory.availableTools[i].Name}</button>`;   
    }
    
    area.innerHTML = newHTML;
    for (var i=0; i < inventory.availableTools.length; i++) {
        var elementName = `selectTool-${i}`;
        document.getElementById(elementName).addEventListener('click', (e) => {
            var eventId = parseInt(e.target.id.split("-")[1]);
            selectedTool = inventory.availableTools[eventId];
            refreshDurabilityArea();
        });    
    }    
}

function refreshHealthBar() {
    var bar = document.getElementsByClassName("healthBar")[0];
    var percentRemaining = gameGrid.healthRemaining / gameGrid.maxHealth * 100;
    bar.style.width = `${percentRemaining}%`;
    bar.innerHTML = `${percentRemaining}%`;
    
    if (percentRemaining >= 60) { bar.style.backgroundColor = "green"; }
    if (percentRemaining < 60 && percentRemaining > 30) { bar.style.backgroundColor = "yellow"; }
    if (percentRemaining <= 30) { bar.style.backgroundColor = "red"; }
    
    if (gameGrid.healthRemaining <= 0) {
        harvestWall();        
    }
}

// collect the LOOT
function harvestWall() {
    // go through object list, check what has been fully uncovered and collect it
    var htmlAppend = ""
    for (var i=0; i < gameGrid.objects.length; i++) {
        var occupiedSpots = gameGrid.objects[i].getOccupiedSpots();
        var fullyUncovered = true;
        for (var spot=0; spot < occupiedSpots.length; spot++) {
            if (parseInt(gameGrid.upperGrid[occupiedSpots[spot][0]][occupiedSpots[spot][1]]) > 0) {
                fullyUncovered = false;
            }
        }
        if (fullyUncovered) {
            htmlAppend += "Fully uncovered:" + gameGrid.objects[i].Name + "!<br>";
            var asdf = inventory.inventory[gameGrid.objects[i].Name];
            if (inventory.inventory[gameGrid.objects[i].Name] !== undefined) {
                inventory.inventory[gameGrid.objects[i].Name]++;
            }
            else {
                inventory.inventory[gameGrid.objects[i].Name] = 1;
            }
        }        
    }
    document.getElementById("debugArea").innerHTML = htmlAppend;
}

function showInventory() {
    var area = document.getElementById("debugArea");
    var htmlAppend = "";
    var keys = Object.keys(inventory.inventory);
    for(var i=0; i < keys.length; i++) {
        htmlAppend += inventory.inventory[keys[i]] + "x " + keys[i] + "<br>";
    }
    area.innerHTML = htmlAppend;
}

function refreshDebugArea() {
    var area = document.getElementById("debugArea");
    var htmlAppend = "";
    for(var i=0; i < gameGrid.objects.length; i++) {
        htmlAppend += gameGrid.objects[i].Name + " | " + gameGrid.objects[i].origin + "<br>";
    }
    area.innerHTML = htmlAppend;
}
