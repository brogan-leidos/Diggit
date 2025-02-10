import GameGrid from './engine/GameGrid.js'
import {generateGrid} from './engine/Generate-Grid.js'
import GameGridSettings from './engine/GameGridSettings.js'
import Player from './engine/Player.js'
import { Tool, Pick, Hammer, Drill, Vaporizer, Shovel, Chisel } from './presents/Tools/index.js' 
import { Support, Pow_Potion, Pre_Potion } from './presents/items/index.js'
import BiomeManager from './biome/BiomeManager.js'
import { tintTextColor, tintBgColor, tintHex } from './utils/ColorUtil.js'
import { processIceSheet, damageIceSheets, processOil, updateHazardMemory } from './utils/HazardUtil.js'
import { getMapTemplate } from './templates/Travel.js' 

var gameGrid = new GameGrid();
var selectedTool = new Tool();
var player = new Player();
var biomeManager = new BiomeManager();

var highlightedSpots = []; // Spots to color given the current tool and position
var hazardMemory = []; // Optimizaion for processing hazards
var spotMemory = ""; // The last spot the mouse was on

var toolTipAlpha = 1;

export default () => {
    firstLaunch();

    document.getElementById('generateButton').addEventListener('click', () => {
        gameGrid = createGameGrid();
        refreshGrid();        
    });
    
    document.getElementById('showInventoryButton').addEventListener('click', () => {
        showInventory();
    });
    
    document.getElementById('showMapButton').addEventListener('click', () => {
        showMap();
    }); 
    
};

function firstLaunch() {
    player.availableTools.push(new Pick(), new Hammer(), new Drill(), new Vaporizer(), new Shovel(), new Chisel());
    player.availableItems.push(new Support(), new Pow_Potion(), new Pre_Potion());
    selectedTool = player.availableTools[0];
    
    player.availableBiomes = ["Generic", "Forest", "Ocean", "Desert", "Volcano", "Glacier"];
    
    refreshToolArea();
    refreshItemArea();
    refreshStatsArea();
    refreshHealthBar();
    refreshBiomeTab();
    
    document.getElementById("gameSection").addEventListener('wheel', (e) => {           
        selectedTool.rotateTool(Math.sign(e.deltaY));
        highlightValidSpaces(spotMemory);
    });

}

function createGameGrid() {
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    var rarity = document.getElementById("rarity").value + player.Luck + player.LuckMod;
    
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
        hazardMemory = processOil(gameGrid);
    }    
}

// Replaces gameSection with new HTML representing current gameGrid
function drawGridWithOverlay() {
    var htmlResult = "";
    
    htmlResult += "<table><tbody>";    
    for (var i=0; i < gameGrid.upperGrid.length; i++) {
        htmlResult += "<tr>";
        for (var j=0; j < gameGrid.upperGrid[i].length; j++) {                                  
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
    var bgColor = "#00000090";
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

function drawUpperSpot(x, y) {
    var image = "";
    var styles = "";
    var bgColor = "";
    var border = `border: 2px solid ${biomeManager.selectedBiome.GridBorderColor};`;
    var text = "";

    if (gameGrid.hazardGrid[x][y] == "3") { // Spilled oil draws over everything else
        border = `border: 2px dotted black`;
        bgColor = "#000";
    } else {
        bgColor = tintBgColor(biomeManager.selectedBiome.GridBackgroundColor, gameGrid.upperGrid[x][y]);
        var textColor = tintTextColor(bgColor);
        styles += `color: ${textColor};`;
        var shadowColor = textColor == "black" ? "white" : "black";
        styles += `text-shadow: 0px 0px 5px ${shadowColor};`;
        text = gameGrid.upperGrid[x][y].toString();
        // styles += `background-image: url(assets/dirt/dirt_${text}.png);`;
        // styles += `background-size: contain;`;
        // styles += `background-blend-mode: multiply;`;

        var dirtLevels = {
            1: "#b3ad9f",
            2: "#ad9463",
            3: "#837260",
            4: "#574f41"
        }

        styles += `background-color: ${dirtLevels[text]};`;
        styles += `z-index: ${text}`;

        styles += `transform: scale(1.0${text * 2 - 1});`;
        border = `border: 2px solid ${dirtLevels[text]};`
    }

    // styles += `background-color:${bgColor};`;
    styles += border;

    // Determine shadow directions based on neighboring cells
    var shadows = [];
    
    function getLayer(x, y) {
        return (gameGrid.upperGrid[x] && gameGrid.upperGrid[x][y]) !== undefined ? gameGrid.upperGrid[x][y] : -1;
    }

    var currentLayer = getLayer(x, y);

    if (getLayer(x, y - 1) > currentLayer) shadows.push("inset 6px 0px 8px -6px rgba(0, 0, 0, 0.3)"); // Left shadow
    if (getLayer(x, y + 1) > currentLayer) shadows.push("inset -6px 0px 8px -6px rgba(0, 0, 0, 0.3)"); // Right shadow
    if (getLayer(x - 1, y) > currentLayer) shadows.push("inset 0px 6px 8px -6px rgba(0, 0, 0, 0.3)"); // Top shadow
    if (getLayer(x + 1, y) > currentLayer) shadows.push("inset 0px -6px 8px -6px rgba(0, 0, 0, 0.3)"); // Bottom shadow

    if (shadows.length > 0) {
        styles += `box-shadow: ${shadows.join(", ")};`;
    }

    return `<td id="${x},${y}" class="dirt" style="${styles}"> ${text} </td>`;
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
// function highlightValidSpaces(spotId) {
//     spotMemory = spotId;
//     spotId = spotId.split(",");
//     var x = parseInt(spotId[0]);
//     var y = parseInt(spotId[1]);
    
//     var highlightMemory = [];    
    
//     if (highlightedSpots.length != 0) {
//         highlightMemory = highlightedSpots;        
//     }

//     var potentialSpots = selectedTool.getMinableSpots(x,y);    
//     highlightedSpots = potentialSpots.filter(a => a[0] < gameGrid.settings.width && a[0] >= 0 && a[1] < gameGrid.settings.height && a[1] >= 0);
    
//     for (var i=0; i < highlightMemory.length; i++) {
//         var spotToDim = document.getElementById(`${highlightMemory[i][0]},${highlightMemory[i][1]}`);
//         spotToDim.style.borderColor = highlightMemory[i][2];
//     }
    
//     for (var i=0; i < highlightedSpots.length; i++) {     
//         var spotToLight = document.getElementById(`${highlightedSpots[i][0]},${highlightedSpots[i][1]}`);
//         highlightedSpots[i][2] = spotToLight.style.borderColor;
//         spotToLight.style.borderColor = 'red';
//     }

//     highlightRevealvedObjects();
// }

function highlightValidSpaces(spotId) {
    spotMemory = spotId;
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);
    
    var highlightMemory = [];    

    if (highlightedSpots.length != 0) {
        highlightMemory = highlightedSpots;        
    }

    var potentialSpots = selectedTool.getMinableSpots(x, y);    
    highlightedSpots = potentialSpots.filter(a => 
        a[0] < gameGrid.settings.width && a[0] >= 0 && 
        a[1] < gameGrid.settings.height && a[1] >= 0
    );

    // Remove tint from previously highlighted spaces
    for (var i = 0; i < highlightMemory.length; i++) {
        var spotToDim = document.getElementById(`${highlightMemory[i][0]},${highlightMemory[i][1]}`);
        if (spotToDim) {
            spotToDim.classList.remove("tint-tool");
        }
    }

    // Apply tint to new highlighted spaces
    for (var i = 0; i < highlightedSpots.length; i++) {     
        var spotToLight = document.getElementById(`${highlightedSpots[i][0]},${highlightedSpots[i][1]}`);
        if (spotToLight) {
            spotToLight.classList.add("tint-tool");
            spotToLight.style.position = "relative"; // Ensure the ::after works
        }
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
                // document.getElementById(`${spots[j][0]},${spots[j][1]}`).style.borderColor = "#36c95e";
                document.getElementById(`${spots[j][0]},${spots[j][1]}`).style.position = "relative";
                document.getElementById(`${spots[j][0]},${spots[j][1]}`).classList.add("tint");
            }
        }
    }
}

// Destroy the appropriate dirt layer, lower tool durability, damage the wall, and reveal objects as necessary
function mineClickedSpot(spotId) {
    if(!checkIfStillStanding()) {
        return;
    }
    var crit = checkIfCrit();
    if (crit) {
       player.buffStats(20,20,0);
       displayInInfoSection("CRITICAL HIT!");
    }
    
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);
    
    createRipple(x, y);

    if (gameGrid.settings.biome.IceSheetsEnabled) {
        hazardMemory = []; // TODO: This might make ice incompatable with oil -- but we will see
    }
    
    var minableSpots = selectedTool.getMinableSpots(x,y);
    for (var i=0; i < minableSpots.length; i++) {
        processMinableSpot(minableSpots[i])        
    }
    
    if (gameGrid.settings.biome.IceSheetsEnabled) {
        damageIceSheets(hazardMemory, gameGrid);
    }
    
    gameGrid.healthRemaining -= Math.max(selectedTool.damage - (player.Precision + player.PrecisionMod) * 2, 0);
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
    
    if (crit) {
        player.debuffStats(20,20,0);
    }
    
    processPlayerBuffs();
    refreshGrid();
}

function createRipple(x, y) {
    
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
        gameGrid.healthRemaining -= Math.floor((Math.max(selectedTool.damage - (player.Precision + player.PrecisionMod), 0)) / 2);            
    }
    
    if (gameGrid.settings.biome.IceSheetsEnabled) {
        hazardMemory = hazardMemory.concat(processIceSheet(mineX, mineY, gameGrid.upperGrid[mineX][mineY], spotMemory, gameGrid, selectedTool));
    }
        
    gameGrid.upperGrid[mineX][mineY] -= power + player.Power + player.PowerMod;
    
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

function refreshDurabilityArea() {    
    var area = document.getElementById("toolDurability");
    area.innerHTML = "";
    if (selectedTool.durability < 0) {
        return;
    }
    area.innerHTML = selectedTool.durability + " durability";   
}

// Updates info bar to give info on what the mouse is over
function updateInfoSection(spotId) {
    spotId = spotId.split(",");
    var x = parseInt(spotId[0]);
    var y = parseInt(spotId[1]);   
    var infoSection = document.getElementsByClassName("infoSection")[0];
    
    var object = gameGrid.lowerGrid[x][y];
    if (gameGrid.settings.biome.OilSpillsEnabled && gameGrid.hazardGrid[x][y] == "3") { // Spilled oil coveres everything
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

function refreshStatsArea() {
    var area = document.getElementById("statsArea");
    var newHTML = ""
    newHTML += `Power: ${player.Power} + ${player.PowerMod}<br>`
    newHTML += `Precision: ${player.Precision} + ${player.PrecisionMod}<br>`
    newHTML += `Luck: ${player.Luck} + ${player.LuckMod}<br>`
    
    area.innerHTML = newHTML;        
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
        player.availableItems[eventId].behavior(gameGrid, player);
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

function harvestWall() {
    var htmlAppend = ""
    for (var i=0; i < gameGrid.objects.length; i++) {
        if (checkIfObjectIsRevealed(gameGrid.objects[i])) {
            htmlAppend += "Fully uncovered:" + gameGrid.objects[i].Name + "!<br>";
            if (gameGrid.objects[i].Breakdown.length != 0) {
                breakdownObject(gameGrid.objects[i]);                
            }
            else {
                player.addToInventory(gameGrid.objects[i]);
            }
        }        
    }
    document.getElementById("debugArea").innerHTML = htmlAppend;    
}

function breakdownObject(object) {
    for (var j=0; j < object.Breakdown.length; j++) {
        var numToAdd = object.Breakdown[j][1];
        for (var k=0; k < numToAdd; k++) {
            player.addToInventory(object.Breakdown[j][0]);
        }
    }
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
                var biomeName = e.target.id.split("-")[1];
                switchBiome(biomeName);  
            });
        }
    }        
}

function switchBiome(biomeName) {
    var newBiome = biomeManager.Biomes.filter(a => a.Name == biomeName)[0];
    biomeManager.selectedBiome = newBiome;
    document.getElementById("gameSection").style.background = `url(${newBiome.ImagePath})`;
    document.getElementById("gameSection").style.backgroundRepeat = `no-repeat`;
    document.getElementById("gameSection").style.backgroundSize = `contain`;
    refreshBiomeTab();
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
        
        document.getElementById(`Sell-${key}`).addEventListener('mouseover', (e) => {            
            var item = player.inventory.get(key)[0];
            displayInInfoSection(`Should sell for around ${item.Value}`);
        });
    }
}

function refreshDebugArea() {
    var area = document.getElementById("debugArea");
    var htmlAppend = "";
    for(var i=0; i < gameGrid.objects.length; i++) {
        htmlAppend += gameGrid.objects[i].Name + " | " + gameGrid.objects[i].origin + "<br>";
    }
    hazardMemory = updateHazardMemory(-1, gameGrid);
    for(var i=0; i < hazardMemory.length; i++) {
        htmlAppend += `Hazard | ${hazardMemory[i]} <br>`;
    }
    area.innerHTML = htmlAppend;
}

function processPlayerBuffs() {
    if (player.BuffTimer > 0) {
        player.BuffTimer--;
        return;
    }
    else {
        player.normalizeStats();
    }    
}

function checkIfCrit() {
    var roll = Math.floor(Math.random() * 100);
    if (roll <= 5 + (player.Luck + player.LuckMod)*5) {
        displayCritToolTip();
        return true;
    }
    return false;
}

function displayCritToolTip() {
    var exists = document.getElementById("toolTip");
    if (exists) {
        exists.remove();
    }
    
    var spot = document.getElementById(spotMemory);
    
    var x = spot.offsetLeft;
    var y = spot.offsetTop;
    
    document.body.insertAdjacentHTML('beforeend', `<div id="toolTip">CRIT</div>`);
    var tip = document.getElementById("toolTip");    
    tip.style.top = `${y + 80}px`;
    tip.style.left = `${x + 220}px`;
    
    toolTipAlpha = 1;
    setTimeout(fadeAwayToolTip, 100);
}

function fadeAwayToolTip() {
   var tip = document.getElementById("toolTip");    
    if (toolTipAlpha <= 0) {
        tip.remove();
        return;
    }
    toolTipAlpha -= .1;

    tip.style.color = `rgba(0, 200, 0, ${toolTipAlpha})`;
    setTimeout(fadeAwayToolTip, 100);
}

function showMap() { 
    var section = document.getElementById("gameSection");    
    section.innerHTML = getMapTemplate(player, biomeManager);
    assignMapEvents();
}

function assignMapEvents() {
  for (var i=0; i < player.availableBiomes.length; i++) {
    var biome = player.availableBiomes[i];
    document.getElementById(`Travel-${biome}`).addEventListener('click', (e) => {            
        travelToBiome(e.target.id);
    });
  }
  
}

function travelToBiome(biome) {
    // Decrement travel time and eat fooooooooood
    switchBiome(biome.split("-")[1]);
}
