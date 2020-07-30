import GameGrid from './engine/GameGrid.js'
import {generateGrid} from './engine/Generate-Grid.js'
import GameGridSettings from './engine/GameGridSettings.js'
import Player from './engine/Player.js'
import { Tool, Pick, Hammer, Drill, Vaporizer, Shovel } from './presents/Tools/index.js' 
import Support from './presents/items/Support.js'
import BiomeManager from './biome/BiomeManager.js'


var gameGrid = new GameGrid();
var selectedTool = new Tool();
var player = new Player();
var biomeManager = new BiomeManager();

var highlightedSpots = [];
var hazardMemory = [];

export default () => {
    firstLaunch();

    document.getElementById('generateButton').addEventListener('click', () => {
        gameGrid = createGameGrid();
        refreshGrid();
        refreshBiomeTab();

    });
    
    document.getElementById('showInventoryButton').addEventListener('click', () => {
        showInventory();
    });
    
};

function firstLaunch() {
    player.availableTools.push(new Pick(), new Hammer(), new Drill(), new Vaporizer(), new Shovel());
    player.availableItems.push(new Support());
    selectedTool = player.availableTools[0];
    
    player.availableBiomes = ["Generic", "Forest", "Ocean", "Desert", "Volcano"];
    
    refreshToolArea();
    refreshItemArea();
    refreshHealthBar(); 
}

function createGameGrid() {
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    var rarity = document.getElementById("rarity").value + player.Luck;
    
    gameGrid.settings = new GameGridSettings(width, height, rarity, biomeManager.selectedBiome);
    gameGrid = generateGrid(gameGrid);

    refreshHealthBar();
    refreshDebugArea();
    
    return gameGrid;
}

function refreshGrid() {
    processEvents();
    drawGridWithOverlay(); 
    assignEventsToGrid();
    highlightRevealvedObjects();
    refreshHealthBar();
}

// Processes things like timers and expanding spaces
function processEvents() {
    if (gameGrid.settings.biome.OilSpillsEnabled) {
        processOil();
    }
    
}

function processOil() {
//     if (hazardMemory.length == 0) {
    updateHazardMemory("3");            
    
    for (var i=0; i < hazardMemory.length; i++) {
        var seekX = hazardMemory[i][0];
        var seekY = hazardMemory[i][1];
        if (gameGrid.upperGrid[seekX][seekY] <= 0) {
            //Expand
            gameGrid.hazardGrid[seekX+1][seekY] = "3";
            gameGrid.hazardGrid[seekX-1][seekY] = "3";
            gameGrid.hazardGrid[seekX][seekY+1] = "3";
            gameGrid.hazardGrid[seekX][seekY-1] = "3";
        }
    }        
}

function updateHazardMemory(searchValue= -1) {
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

// Replaces gameSection with new HTML representing current gameGrid
function drawGridWithOverlay() {
    var htmlResult = "";
    
    htmlResult += "<table><tbody>";    
    for (var i=0; i < gameGrid.upperGrid.length; i++) {
        htmlResult += "<tr>";
        for (var j=0; j < gameGrid.upperGrid[i].length; j++) {
            var styles = ""
            var bgColor = "";
            var image = "";                
            var border = `border: 2px solid ${biomeManager.selectedBiome.GridBorderColor};`                                   
            if (gameGrid.upperGrid[i][j] <= 0) { // in areas without dirt covereing them //#363940 -- old bg color                                   
                htmlResult += drawLowerSpot(i,j);
            }            
            else {
                htmlResult += drawUpperSpot(i,j);
            }
        }
        htmlResult += "</tr>";
    }    
    htmlResult += "</tbody></table>";
    
    var gameSection = document.getElementById("gameSection");  
    
    gameSection.innerHTML = "";
    gameSection.insertAdjacentHTML('beforeend', htmlResult);
}

function drawLowerSpot(x,y) {
    var styles = "";
    var bgColor = "";
    var image = "";                
    var border = `border: 2px solid ${biomeManager.selectedBiome.GridBorderColor};`;
    
    if (gameGrid.hazardGrid[x][y] == "3") { // Spilled oil draws over everything else
        border = `border: 2px dotted black`;
        bgColor = "#000";
    } 
    else if (gameGrid.hazardGrid[x][y] == "1") { // 1 is a pressure point
        border = `border: 2px dotted black`;
        bgColor = "#404752";                
    }  
    else if (gameGrid.lowerGrid[x][y] != "0") { // If the spot is not empty
        bgColor = gameGrid.lowerGrid[x][y].Color;
        image = gameGrid.lowerGrid[x][y].ImagePath;                                                        
    }
    styles += `background-color:${bgColor};`;
    if (image != "") {
        styles += `background:url(${image}); background-repeat:no-repeat; background-size:contain;`
    }
    styles += border;
    
    return `<td id="${x},${y}" class="exposed" style="${styles}"></td>`;
}

function drawUpperSpot(x,y) {
    var image = "";
    var styles = "";
    var bgColor = "";
    var border = `border: 2px solid ${biomeManager.selectedBiome.GridBorderColor};`;
    
    if (gameGrid.hazardGrid[x][y] == "3") { // Spilled oil draws over everything else
        border = `border: 2px dotted black`;
        bgColor = "#000";
    }
    else {   
        bgColor = tintBgColor(biomeManager.selectedBiome.GridBackgroundColor, gameGrid.upperGrid[x][y]);        
        var textColor = tintTextColor(bgColor);
        styles += `color: ${textColor};`;
        var shadowColor = textColor == "black" ? "white" : "black";
        styles += `text-shadow: 0px 0px 5px ${shadowColor};`;
        var text = gameGrid.upperGrid[x][y].toString();
    }
    
    styles += `background-color:${bgColor};`;
    styles += border;
        
    return `<td id="${x},${y}" class="dirt" style="${styles}"> ${text} </td>`;
}

function tintTextColor(bgColor) {
    var colorAvg = Math.floor((parseInt("0x" + bgColor.substr(1,2)) + parseInt("0x" + bgColor.substr(3,2)) + parseInt("0x" + bgColor.substr(5,2))) / 3);
    if (colorAvg <= 125) {
        return "white";
    }
    else {
        return "black";
    }
}

function tintBgColor(bgColor, gridValue) {
    if (bgColor.length == 4) {
        bgColor = `#${bgColor[1]}${bgColor[1]}${bgColor[2]}${bgColor[2]}${bgColor[3]}${bgColor[3]}`;
    }
    var gridColorTint = gridValue * 20;
    var red = tintHex(parseInt("0x" + bgColor.substr(1,2)), gridColorTint);
    var green = tintHex(parseInt("0x" + bgColor.substr(3,2)), gridColorTint);
    var blue =  tintHex(parseInt("0x" + bgColor.substr(5,2)), gridColorTint);
    
    return `#${red}${green}${blue}`;
}

function tintHex(hex, tintAmount) {
    hex = Math.max(hex - tintAmount, 0);
    var hexString = hex.toString(16);
    if (hexString.length == 1){
        hexString = "0" + hexString[0];   
    }
    return hexString;
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

// Highlights spaces that the current tool can mine
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
        var spotToDim = document.getElementById(`${highlightMemory[i][0]},${highlightMemory[i][1]}`);
        spotToDim.style.borderColor = highlightMemory[i][2];
    }
    
    for (var i=0; i < highlightedSpots.length; i++) {     
        var spotToLight = document.getElementById(`${highlightedSpots[i][0]},${highlightedSpots[i][1]}`);
        highlightedSpots[i][2] = spotToLight.style.borderColor;
        spotToLight.style.borderColor = 'red';
    }

    highlightRevealvedObjects();
}

// Adds a green border to objects that are fully revealed
function highlightRevealvedObjects() {
    for (var i=0; i < gameGrid.objects.length; i++) {
        var object = gameGrid.objects[i];  
        if (object.FullyRevealed) {
            var spots = object.getOccupiedSpots();
            for (var j=0; j < spots.length; j++) {
                document.getElementById(`${spots[j][0]},${spots[j][1]}`).style.borderColor = "#36c95e";
            }
        }
    }
}

// Updates info bar to give info on what the mouse is over
function updateInfoSection(spotId) {
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);   
    var infoSection = document.getElementsByClassName("infoSection")[0];
    
    var object = gameGrid.lowerGrid[x][y];
    if (gameGrid.settings.biome.OilSpillsEnabled && gameGrid.hazardGrid[x][y] == "2") {
        infoSection.innerHTML = `Oil: Obscures the ground beneath it.`;
    }
    else if (object != "0") {
        infoSection.innerHTML = object.Name + ": " + object.description;
    }
    else if (gameGrid.settings.biome.PressurePointsEnabled && gameGrid.hazardGrid[x][y] == "1") {
        infoSection.innerHTML = `Pressure Point: Hitting this will damage the wall further.`;
    }
    else {
        infoSection.innerHTML = "Empty";
    }
}

function displayInInfoSection(message) {
    var infoSection = document.getElementsByClassName("infoSection")[0];
    infoSection.innerHTML = message;
}

// Destroy the appropriate dirt layer, lower tool durability, damage the wall, and reveal objects as necessary
function mineClickedSpot(spotId) {
    if(!checkIfStillStanding()) {
        return;
    }
    
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);
    
    var minableSpots = selectedTool.getMinableSpots(x,y);
    for (var i=0; i < minableSpots.length; i++) {
        processMinableSpot(minableSpots[i])        
    }
    
    gameGrid.healthRemaining -= selectedTool.damage - player.Precision * 2;
    selectedTool.durability--;
    refreshDurabilityArea();

    if (selectedTool.durability == 0){
        breakCurrentTool();
    }

    for (var i=0; i < gameGrid.objects.length; i++) {
        if (checkIfObjectIsRevealed(gameGrid.objects[i])) {
            gameGrid.objects[i].FullyRevealed = true;
        }            
    }
    
    refreshGrid();
}

// Checks spot validity, and lowers the toughness of the spot and does any extra things needed for hazards
function processMinableSpot(spot) {
    var mineX = spot[0];
    var mineY = spot[1];
    var power = spot[2];

    if (mineX >= gameGrid.settings.width || mineX < 0 || mineY >= gameGrid.settings.height || mineY < 0) {
        return;
    }

    if (gameGrid.settings.biome.PressurePointsEnabled && gameGrid.upperGrid[mineX][mineY] <= 0 && gameGrid.hazardGrid[mineX][mineY] == "1") {            
        gameGrid.healthRemaining -= Math.floor((selectedTool.damage - player.Precision) / 2);            
    }
        
    gameGrid.upperGrid[mineX][mineY] -= power + player.Power;
    
    if (gameGrid.settings.biome.OilSpillsEnabled && gameGrid.upperGrid[mineX][mineY] <= 0 && gameGrid.hazardGrid[mineX][mineY] == "2") {            
        gameGrid.hazardGrid[mineX][mineY] = "3"; // 2 is inert oil, 3 is spilled oil that will expand           
    }
}

function checkIfStillStanding() {
    return gameGrid.healthRemaining > 0;   
}

function breakCurrentTool() {
    var area = document.getElementById("toolDurability");
    area.innerHTML = "Oh no, your " + selectedTool.Name + " broke!"
    
    player.availableTools = player.availableTools.filter(a => a.Name != selectedTool.Name);
    selectedTool = player.availableTools[0];
    refreshToolArea();
}

function refreshDurabilityArea() {    
    var area = document.getElementById("toolDurability");
    area.innerHTML = "";
    if (selectedTool.durability < 0) {
        return;
    }
    area.innerHTML = selectedTool.durability + " durability";   
}

// This is called after a change to the tools array is made, either with the addition or deletion of a tool
function refreshToolArea() {
    var area = document.getElementById("toolArea");
    var newHTML = ""
    for (var i=0; i < player.availableTools.length; i++) {
        newHTML += `<button id="selectTool-${i}">${player.availableTools[i].Name}</button>`;   
    }
    
    area.innerHTML = newHTML;
    for (var i=0; i < player.availableTools.length; i++) {
        var elementName = `selectTool-${i}`;
        document.getElementById(elementName).addEventListener('click', (e) => {
            var eventId = parseInt(e.target.id.split("-")[1]);
            selectedTool = player.availableTools[eventId];
            refreshDurabilityArea();
        });    
    }    
}

// This is called after the addition or use of an item
function refreshItemArea() {
    var area = document.getElementById("itemArea");
    var newHTML = ""
    for (var i=0; i < player.availableItems.length; i++) {
        newHTML += `<button id="selectItem-${i}">${player.availableItems[i].Name}</button>`;   
    }
    
    area.innerHTML = newHTML;
    for (var i=0; i < player.availableItems.length; i++) {
        assignEventsToItem(`selectItem-${i}`);        
    }    
}

function assignEventsToItem(elementName) {
    document.getElementById(elementName).addEventListener('click', (e) => {
        var eventId = parseInt(e.target.id.split("-")[1]);
        player.availableItems[eventId].behavior(gameGrid);
        player.availableItems[eventId].NumberRemaining--;
        if (player.availableItems[eventId].NumberRemaining == 0) {
            player.availableItems = player.availableItems.filter(a => a.NumberRemaining > 0);
            refreshItemArea();                
        }
        refreshGrid();
    });

    document.getElementById(elementName).addEventListener('mouseover', (e) => {
        var eventId = parseInt(e.target.id.split("-")[1]);
        displayInInfoSection(`${player.availableItems[eventId].Description}`);
    });
}

function refreshHealthBar() {
    var bar = document.getElementsByClassName("healthBar")[0];
    var percentRemaining = Math.floor(gameGrid.healthRemaining / gameGrid.maxHealth * 100);
    bar.style.width = `${percentRemaining}%`;
    bar.innerHTML = `${percentRemaining}%`;
    
    var red = 0;
    var green = 200;
    
    //each 1% is 5.1 to red
    red += Math.min((100 - percentRemaining) * 5.1, 255);
    if (percentRemaining <= 50) {
        green -= Math.max((50 - percentRemaining) * 4, 0);
    }
    
    bar.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
    
    if (gameGrid.healthRemaining <= 0) {
        bar.style.width = "0%";
        harvestWall();        
    }
}

// NOTE: Likely temporary as we debug
function refreshBiomeTab() {
    var biomeSelect = document.getElementById("biomeSelect");
    var htmlAppend = "";

    for (var i=0; i < player.availableBiomes.length; i++) {
        var biome = player.availableBiomes[i];
        if (biome != biomeManager.selectedBiome.Name) {
            htmlAppend += `<button id="Biome-${biome}">${biome}</button>`;        
        }
    }
    biomeSelect.innerHTML = htmlAppend;
    
    for (var i=0; i < player.availableBiomes.length; i++) {
        if (player.availableBiomes[i] != biomeManager.selectedBiome.Name) {
            document.getElementById(`Biome-${player.availableBiomes[i]}`).addEventListener('click', (e) => {
                // TODO put all this in its own function            
                var biomeName = e.target.id.split("-")[1];
                var newBiome = biomeManager.Biomes.filter(a => a.Name == biomeName)[0];
                biomeManager.selectedBiome = newBiome;
                document.getElementById("gameSection").style.background = `url(${newBiome.ImagePath})`;
                document.getElementById("gameSection").style.backgroundRepeat = `no-repeat`;
                document.getElementById("gameSection").style.backgroundSize = `contain`;
                refreshBiomeTab();
            });
        }
    }
    
    
}

// collect the LOOT
function harvestWall() {
    var htmlAppend = ""
    for (var i=0; i < gameGrid.objects.length; i++) {
        if (checkIfObjectIsRevealed(gameGrid.objects[i])) {
            htmlAppend += "Fully uncovered:" + gameGrid.objects[i].Name + "!<br>";
            player.addToInventory(gameGrid.objects[i]);
        }        
    }
    document.getElementById("debugArea").innerHTML = htmlAppend;
}

function checkIfObjectIsRevealed(object) {
    var occupiedSpots = object.getOccupiedSpots();
    var fullyUncovered = true;
    for (var spot=0; spot < occupiedSpots.length; spot++) {
        if (parseInt(gameGrid.upperGrid[occupiedSpots[spot][0]][occupiedSpots[spot][1]]) > 0) {
            fullyUncovered = false;
        }
    }
    return fullyUncovered;
}

function showInventory() {
    var area = document.getElementById("gameSection");
    var htmlAppend = "";
    for(let key of player.inventory.keys()) {
        htmlAppend += `<button id="Sell-${key}">Sell</button> ${player.inventory.get(key).length}x ${key} <br>`;
    }
    
    area.innerHTML = htmlAppend;
    area.style.background = "";
    area.style.backgroundColor = "#e3e2d1";
    assignEventsToInventory();            
}

function assignEventsToInventory() {
    for(let key of player.inventory.keys()) {
        document.getElementById(`Sell-${key}`).addEventListener('click', (e) => {
            var itemName = key;
            var soldItem = player.removeFromInventory(itemName);
            player.money += soldItem.Value;
            showInventory()
        });    
    }
}

function refreshDebugArea() {
    var area = document.getElementById("debugArea");
    var htmlAppend = "";
    for(var i=0; i < gameGrid.objects.length; i++) {
        htmlAppend += gameGrid.objects[i].Name + " | " + gameGrid.objects[i].origin + "<br>";
    }
    updateHazardMemory();
    for(var i=0; i < hazardMemory.length; i++) {
        htmlAppend += `Hazard | ${hazardMemory[i]} <br>`;
    }
    area.innerHTML = htmlAppend;
}
