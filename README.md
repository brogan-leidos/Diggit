# Digget

IN PROGRESS:
 - Cost for digging: Currently trying to make the time investment the cost, make spamming hammer not very productive unless you're straight power or something
 - Adding a shop (Buy new items, repair items(?), Upgrade existing items
 - Adding new biomes
   -> ~~Desert (Pressure points)~~ *high temp, low hardness, med rarity*
   -> Volcano (armored portions, take half damage) *high temp, high hardness, high rarity -- good space for power players*
   -> Forest (high vegatation, vegtables baby, trees?) *med temp, low hardness, low rarity -- accessable to all*
   -> ~~Lakeside/Ocean (oil can spill, clouding visibility)~~ *Lower temp, low hardness, higher rarity overall*
   -> ~~Frozen area (Ice sheets that crack as one unit)~~ *low temp, low hardness, need to combo with ice sheets to do well, good rarity -- good space for dex players*
   
TODO: (prioritized from highest to lowest)
 - Add a shop or something where you can spend your loot
 - Revamp inventory to use like... a material system or something? Idk, crafting and building whatever
 - World map to travel between biomes
 - Make tool rotation a purchasable ability
 
 - Generate pressure points using noise (hurt the wall more when hit)
 - Update the soil building algorithm to use noise instead of random assignment

 - Replace solid colors with images
 - Add rotation to parts with unique shapes
   -- After that add sprite sheets for objects and add a function to return a sprite section relative to the origin
   -- with transparency!
 - Upgrade revealed highlight to track edges
 - Think/Add some more tools
   -> "line" bombs
 
 - Add debug things as "Features" :)
   -> Show number of treasures/kinds of treasures
   -> Current durability of a space

BUGS:
 - Pressure point border colors get overwritten sometimes
 - Vaporizer straight up acts like a crazy guy when used
 - Not a bug, but need to change hitting system to account for future pressure points



Link to the application:
https://brogan-leidos.github.io/Grid-Test/
