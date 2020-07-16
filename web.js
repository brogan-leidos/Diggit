import GameGrid from './engine/GameGrid.js'
import GenerateGrid from './engine/Generate-Grid.js'

var gameGrid = new GameGrid();

export default () => {
    gameGrid = GenerateGrid(gameGrid);
    
};


function changeMobWeapon (mobTag, newValue) {
    var toHit = parseInt(newValue.split("ToHit:")[1].split("Weapon:")[0]);
    var weapon = newValue.split("Weapon:")[1];
    document.getElementById(mobTag + "-ToHit").value = toHit;
    document.getElementById(mobTag + "-Weapon").value = weapon;
}

function combineEnds(stringArray) {
    if (stringArray.length == 1) {
        return;
    }
    var combined = "";
    for (var i=1; i < stringArray.length; i++) {
        combined += stringArray[i];
    }
    return combined;
}

// Parse the weapon string, turn it into a weapon object we can send to the mob attack method
function parseWeapon(weapon, hitbonus) {
    // Create a weapon object out of the data. Sample data: 1d6 + 3 slashing
    var dSplitIndex = weapon.indexOf("d");
    if (dSplitIndex == -1) {
        // Something something error check   
    }
    var numAttacks = parseInt(weapon.substr(0, dSplitIndex).trim());
    var splitWeapon = weapon.substr(dSplitIndex + 1);
    
    splitWeapon = splitWeapon.split("+");
    var flipBit = 1;
    if (splitWeapon.length == 1) { // no result found for +, try -
        splitWeapon = splitWeapon[0].split("-");       
        if (splitWeapon.length == 1) {
            // Something something error check
        }
        flipBit = -1;
    }   
    var damageDie = parseInt(splitWeapon[0].trim());
    splitWeapon = combineEnds(splitWeapon);
    
    splitWeapon = splitWeapon.trim().split(" ");
    var bonusDmg = parseInt(splitWeapon[0].trim()) * flipBit;
    
    if (splitWeapon.length > 1) {
        var damageType = splitWeapon[1].trim();
    }
    
    return new Weapon("FILLER NAME", numAttacks, damageDie, damageType, hitbonus, bonusDmg);       
}

function toggleDetails(event, rollArray) {
    var mobTag = event.target.id.split("-")[0];
    var detailElement = document.getElementById(mobTag + "-Details");
    if (detailElement == null) {
        var detailAppend = `<div id=${mobTag}-Details>`;

        for (var i=0; i < rollArray.length; i++) {
            for (var j=0; j < rollArray[i].length; j++) {
                if (rollArray[i][j].attacker.MobName == mobTag) {
                    if (rollArray[i][j].hitRoll == "crit") {
                        detailAppend += `<span style="margin-left:15px; color:#b59800"> [${rollArray[i][j].hitRoll}] ⚔${rollArray[i][j].damageRoll} </span><br>`;
                    }
                    else {
                        detailAppend += `<span style="margin-left:15px"> [${rollArray[i][j].hitRoll}] ⚔${rollArray[i][j].damageRoll} </span><br>`;
                    }
                }
            }
        }   
        detailAppend += "</div>";
        var tag = mobTag + "-Result";

        document.getElementById(tag).insertAdjacentHTML('beforeend', detailAppend);
    }
    else {
        detailElement.remove();
    }
}

function launchAttack() {
    var mobArray = []; // 2d arrays: Block type, attacks of that block
    var rollArray = [];
    var numCrits = 0;
    var numBlocks = blockArray.length;    
    
    // Activate the info box
    document.getElementById("infoAreaDiv").style.display = "block";
    
    if (numBlocks == 0){
        infoArea.innerHTML = "There are no mobs available to attack with!";
        return;
    }
           
    // Go though each creature block, spawn a number of mobs with those stats
    for(var i=0;i < numBlocks;i++) {
        //Name, Icon, to hit, weapon, number
        if (!document.getElementById(blockArray[i].concat("-Enabled")).checked) {
            continue; // If the box is not checked, skip that mob block
        }        
        
        var name = document.getElementById(blockArray[i].concat("-Name")).value;
        var icon = document.getElementById(blockArray[i].concat("-Icon"));
        icon = icon.options[icon.selectedIndex].innerHTML;
        var tohit = document.getElementById(blockArray[i].concat("-ToHit")).value;
        var weapon = document.getElementById(blockArray[i].concat("-Weapon")).value;
        var number = document.getElementById(blockArray[i].concat("-Number")).value;        
        var advantage = document.getElementById(blockArray[i].concat("-Adv")).checked;
        var disadvantage = document.getElementById(blockArray[i].concat("-Dis")).checked * -1;
        
        weapon = parseWeapon(weapon, tohit);
        
        var vantage = advantage + disadvantage;
        
        mobArray[i] = new Array();
        for(var j=0; j < number; j++) {
            mobArray[i].push(new Mob(name, icon, weapon, vantage, blockArray[i]))
        }                
    }
    
    // Having spawned our army, let them all launch attacks. Record the attack if it lands
    var targetAc = document.getElementById('targetAc').value;
    
    // discovery is for when we dont know the target AC, it will step the attacks sequentially until we figure it out
    var discoveryModeFlag = false;
    if (targetAc <= 0) {
        discoveryModeFlag = true;
        var minAc = -1;
        var lowerCap = -1
    }
    
    for (var block=0; block < mobArray.length;block++) {
        rollArray[block] = new Array();
        for (var i=0; i < mobArray[block].length; i++) {
            var attackRoll = mobArray[block][i].makeAttack();
            if (attackRoll == "crit") {
                rollArray[block].push(mobArray[block][i].dealCrit());
                numCrits = numCrits + 1;
            }            
            else if (discoveryModeFlag) { // Discovery mode intercepts the natural flow of things here
                if (attackRoll <= lowerCap) {
                    continue;
                }
                if (attackRoll < minAc || minAc == -1) {
                    var response = confirm(attackRoll);
                    if (response) {
                        rollArray[block].push(mobArray[block][i].dealDamage());
                        minAc = attackRoll;
                    }
                    else {
                        if (attackRoll > lowerCap) {
                            lowerCap = attackRoll;
                        }
                    }
                }
                else {
                    rollArray[block].push(mobArray[block][i].dealDamage());
                }                
            }
            else if (attackRoll >= targetAc) {                
                rollArray[block].push(mobArray[block][i].dealDamage());
            } 
        }
    }
    
    // Take a sum of the attacks that landed. Boom, dead enemy, maybe.    
    var totalDamage = 0;
    var totalHits = 0;
    var infoAppend = "";
    
    // Go through each block, take a sum of damage and # of hits
    for (var block=0; block < rollArray.length; block++) {
        if (rollArray[block].length == 0) {
            continue; // This means no one in the block landed a hit. Beep Boop Sad Toot
        }
        totalHits += rollArray[block].length;
        var attacker = rollArray[block][0].attacker;
        var numOfBlockCrits = 0;
        var blockTotalDamage = 0;
        
        // Go through each unit in the block and tally up that damage
        for (var i=0; i < rollArray[block].length; i++) {
            totalDamage += rollArray[block][i].damageRoll;
            blockTotalDamage += rollArray[block][i].damageRoll;
            if (rollArray[block][i].crit) {
                numOfBlockCrits += 1;
            }

        }
        infoAppend += `<span class="mobHeader" id="${attacker.MobName}-Result">` + attacker.Icon + " " + attacker.Name + " : " + rollArray[block].length + " hits";
        if (numOfBlockCrits > 0) {
            infoAppend += " (🌟" + numOfBlockCrits.toString() + " crits)";
        }
        infoAppend += " : " + blockTotalDamage.toString() + " total " + rollArray[block][0].damageType + " damage";
        infoAppend += "</span><br>";
    }
    
    var header = totalHits.toString() + " attacks landed <br>";    
    if (numCrits > 0) {
        header += "  <b>" + numCrits + " crits! </b><br>";
    }
    header += totalDamage.toString().concat(" total damage delt<br>")
    header += "-=-=-=-=-=-=-=-=-=-=-=-=-=-<br>"
    infoAppend = header + infoAppend;
    infoArea.innerHTML = infoAppend;
    
    // After adding info to the box, add listeners for all of the headers so we can expand their details
    for (var block=0; block < numBlocks; block++) {
        var mobTag = blockArray[block];
        var id = `${mobTag}-Result`;
        document.getElementById(id).addEventListener('click', (event) => {
            toggleDetails(event, rollArray);
        }); 
    }        
}
