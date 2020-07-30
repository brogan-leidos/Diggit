# Grid TEst

IN PROGRESS:
 - Make it "cost" something to dig, prevent the player from spamming hammer and collecting loot
 - Adding a shop (Buy new items, repair items(?), Upgrade existing items
 - Adding new biomes
   -> ~~Desert (Pressure points)~~ *high temp, low hardness, med rarity*
   -> Volcano (lava plumes that fill the site) *high temp, high hardness, high rarity*
   -> Forest (high vegatation, vegtables baby) *med temp, low hardness, low rarity*
   -> ~~Lakeside/Ocean (oil can spill, clouding visibility)~~ *Lower temp, low hardness, higher rarity overall*
   -> ~~Frozen area (Ice sheets that crack as one unit)~~ *low temp, low hardness, need to combo with ice sheets to do well, good rarity*
   
TODO: (prioritized from highest to lowest)
 - Add stats (STR: more tool power, DEX: less wall damage, LUCK: higher rarity)
 - Add a shop or something where you can spend your loot
 - Revamp inventory to use like... a material system or something? Idk, crafting and building whatever
 - World map to travel between biomes
 
 - Generate pressure points using noise (hurt the wall more when hit)
 - Update the soil building algorithm to use noise instead of random assignment
 - Change how soil layer works, something like an armor value when the durability is higher, or armored patches that are easier to mine with certain tools

 - Replace solid colors with images
 - Add rotation to parts with unique shapes
   -- After that add sprite sheets for objects and add a function to return a sprite section relative to the origin
   -- with transparency!
 - Upgrade revealed highlight to track edges
 - Think/Add some more tools
   -> A tool that lets you mine in an X (foil to the pick)
   -> "line" bombs
   -> A shovel
 
 - Add debug things as "Features" :)
   -> Show number of treasures/kinds of treasures
   -> Current durability of a space
   -> Mouse wheel to change tools?

BUGS:
 - Pressure point border colors get overwritten sometimes
 - Not a bug, but need to change hitting system to account for future pressure points



Link to the application:
https://brogan-leidos.github.io/Grid-Test/

https://www.mtggoldfish.com/deck/3244407
