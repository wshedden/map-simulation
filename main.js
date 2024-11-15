import { initializeMap, updateDots, resize } from './map.js';
import { loadData } from './data.js';
import { setupSlider } from './slider.js';

let currentYear = 1970;

export function getCurrentYear() {
    return currentYear;
}

export function setCurrentYear(year) {
    currentYear = year;
    // updatePopulations();
    updateDots();
}

window.onresize = resize;

Promise.all([
    d3.json("countries.json"),
    d3.csv("countrydata.csv"),
    d3.csv("populations_interpolated_with_codes.csv"),
    d3.csv("energy.csv")
]).then(([worldData, countryData, populationData, energyData]) => {
    loadData(worldData, countryData, populationData, energyData, currentYear);
    initializeMap();
    updateDots();
    setupSlider(setCurrentYear, getCurrentYear);
});