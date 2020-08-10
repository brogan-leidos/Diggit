export const travelTemplate = `

<div id="currentLocation">
Current Location: FILLER-LOCATION
</div>

<div id="availableLocations">
Available Locations: FILLER-AVAILABLE-LOCATIONS
</div>

`;

export function getMapTemplate(player, biomeManager) {
  var currentLocation = biomeManager.selectedBiome.Name;
  var availableLocations = "";
  for (var i=0; i < player.availableBiomes.length; i++) {
    var biome = player.availableBiomes[i];
    availableLocations += `<button id="Travel-${biome.Name}">${biome.Name}</button> 3 days away<br>`;
  }
  
  var retValue = travelTemplate.replace("FILLER-LOCATION", currentLocation);
  var retValue = retValue.replace("FILLER-AVAILABLE-LOCATIONS", availableLocations);
  
  return retValue;
}

export function assignMapEvents(player, biomeManager) {
  for (var i=0; i < player.availableBiomes.length; i++) {
    var biome = player.availableBiomes[i];
    document.getElementById(`Travel-${biome.Name}`).addEventListener('click', (e) => {            
        travelToBiome(e.target.id);
    });
  }
  
}
