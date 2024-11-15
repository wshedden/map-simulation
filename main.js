import { initializeMap, updateDots, resize, generateFlowerCoordinates, svg, path, updatePopulationDisplay} from './map.js';
import { colorScale } from './utils.js';
import { loadData , countries, updatePopulations, populationDataMap, countryNameMapping, updateColours, printCountryBorders} from './data.js';
import { setupSlider } from './slider.js';

let currentYear = 1970;
export function getCurrentYear() {
    return currentYear;
}

export function setCurrentYear(year) {
    currentYear = year;
    updatePopulations(countries, populationDataMap, countryNameMapping, currentYear);
    updateDots(svg, countries, path, generateFlowerCoordinates);
    updateColours(svg, countries, colorScale)
}

window.onresize = () => resize(svg, projection);

Promise.all([
    d3.json("countries.json"),
    d3.csv("countrydata.csv"),
    d3.csv("populations_interpolated_with_codes.csv"),
    d3.csv("energy.csv")
]).then(([worldData, countryData, populationData, energyData]) => {
    loadData(worldData, countryData, populationData, energyData, currentYear);
    initializeMap();
    updatePopulationDisplay();
    updateDots(svg, countries, path, generateFlowerCoordinates);
    setupSlider(setCurrentYear, getCurrentYear);
    printCountryBorders("US");
});