import Generic from './Generic.js';
import Forest from './Forest.js';

export default class BiomeManager {
  constructor() {
    this.Biomes = [new Generic(), new Forest()]
    this.selectedBiome = this.Biomes[0];
  }
}
