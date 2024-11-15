import { initializeMap, updateDots, resize, generateFlowerCoordinates, svg, path, updatePopulationDisplay, projection } from './map.js';
import { colorScale } from './utils.js';
import { loadData, countries, updatePopulations, populationDataMap, countryNameMapping, updateColours, printCountryBorders } from './data.js';
import { CountryManager } from './CountryManager.js';
import { Simulation } from './Simulation.js';

const countryManager = new CountryManager();

window.onresize = () => resize(svg, projection);

Promise.all([
    d3.json("countries_no_disputed.json"),
    d3.csv("countrydata.csv"),
    d3.csv("populations_interpolated_with_codes.csv"),
    d3.csv("energy.csv"),
    d3.csv("borders.csv")
]).then(([worldData, countryData, populationData, energyData, borderData]) => {
    loadData(worldData, countryData, populationData, energyData, 2022);
    countryManager.loadCountries(populationData, borderData);
    initializeMap(countries, countryManager);

    const simulation = new Simulation(countryManager, countries);
    simulation.runSimulation();
});
// Important to note: the countries object is from the countries.json file

// W. Sahara, Antarctica, N. Cyprus, Somaliland, Kosovo are not in the population data