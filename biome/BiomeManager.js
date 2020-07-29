import Generic from './Generic.js'
import Forest from './Forest.js'
import Ocean from './Ocean.js'
import Desert from './Desert.js'
import Volcano from './Volcano.js'

export default class BiomeManager {
  constructor() {
    this.Biomes = [new Generic(), new Forest(), new Ocean(), new Desert(), new Volcano()];
    this.selectedBiome = this.Biomes[0];
  }
}
