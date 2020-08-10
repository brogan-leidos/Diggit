const inventoryTemplate = `
<div id="equipSlots">
Currently Equip: <select id="equipSelect"></select>
</div>
<div id="availableLocations">
Available Locations: FILLER-AVAILABLE-LOCATIONS
</div>
`;

export function getInventoryTemplate() {
  var area = document.getElementById("gameSection");
  var htmlAppend = inventoryTemplate;
  for(let key of player.inventory.keys()) {
      htmlAppend += `<button id="Sell-${key}">Sell</button> ${player.inventory.get(key).length}x ${key} <br>`;
  }

  area.innerHTML = htmlAppend;
  area.style.background = "";
  area.style.backgroundColor = "#e3e2d1";
}


