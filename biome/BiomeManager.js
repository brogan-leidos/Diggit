import Generic from './Generic.js'
import Forest from './Forest.js'
import Ocean from './Ocean.js'
import Desert from './Desert.js'
import Volcano from './Volcano.js'
import Glacier from './Glacier.js'

export default class BiomeManager {
  constructor() {
    this.Biomes = [new Generic(), new Forest(), new Ocean(), new Desert(), new Volcano(), new Glacier()];
    this.selectedBiome = this.Biomes[0];
  }
}
