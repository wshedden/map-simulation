import { initializeMap, updateDots, resize, generateFlowerCoordinates, svg, path, updatePopulationDisplay, projection } from './map.js';
import { colorScale } from './utils.js';
import { loadData, countries, updatePopulations, populationDataMap, countryNameMapping, updateColours, printCountryBorders } from './data.js';
import { CountryManager } from './CountryManager.js';
import { Simulation } from './Simulation.js';

const countryManager = new CountryManager();

window.onresize = () => resize(svg, projection);

Promise.all([
    d3.json("countries.json"),
    d3.csv("countrydata.csv"),
    d3.csv("populations_interpolated_with_codes.csv"),
    d3.csv("energy.csv")
]).then(([worldData, countryData, populationData, energyData]) => {
    loadData(worldData, countryData, populationData, energyData, 1970);
    countryManager.loadCountries(populationData);
    initializeMap(countries, countryManager);

    const simulation = new Simulation(countryManager, countries);
    simulation.runSimulation();
});