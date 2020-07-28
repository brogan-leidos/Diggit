import Generic from './Generic.js'
import Forest from './Forest.js'
import Ocean from './Ocean.js'

export default class BiomeManager {
  constructor() {
    this.Biomes = [new Generic(), new Forest(), new Ocean()];
    this.selectedBiome = this.Biomes[0];
  }
}
