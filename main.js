import { initializeMap, updateDots, resize, generateFlowerCoordinates, svg, path, updatePopulationDisplay, projection } from './map.js';
import { loadData, countries, topoJsonNameToCode } from './data.js';
import { CountryManager } from './CountryManager.js';
import { Simulation } from './Simulation.js';

const countryManager = new CountryManager();

window.onresize = () => resize(svg, projection);

Promise.all([
    d3.json("countries_no_disputed.json"),
    d3.csv("countrydata.csv"),
    d3.csv("populations_interpolated_with_codes.csv"),
    d3.csv("energy.csv"),
    d3.csv("borders.csv"),
    d3.csv("distance-matrix.csv")
]).then(([worldData, countryData, populationData, energyData, borderData, distanceData]) => {
    loadData(worldData, countryData, populationData, energyData, 2022);
    countryManager.loadCountries(populationData, borderData, distanceData);
    initializeMap(countries, countryManager);

    const simulation = new Simulation(countryManager, countries);
    simulation.runSimulation();
});
// Important to note: the countries object is from the countries.json file

// W. Sahara, Antarctica, N. Cyprus, Somaliland, Kosovo are not in the population data

function updateCountryStats(country) {
    const countryDetails = country.getDetails();
    const statsContent = document.getElementById('stats-content');
    statsContent.innerHTML = `
        <strong>${countryDetails.name}</strong><br>
        Country Code: ${countryDetails.Code}<br>
        Population: ${countryDetails.Population}<br>
        Military Strength: ${countryDetails.MilitaryStrength}<br>
        Wealth: ${countryDetails.Wealth}<br>
        Vassals: ${countryDetails.Vassals}<br>
        Overlord: ${countryDetails.Overlord}<br>
        Bordering Countries: ${countryDetails.BorderingCountries}<br>
        Military Spending: ${countryDetails.MilitarySpending}<br>
        Economic Growth: ${countryDetails.EconomicGrowth}<br>
        Population Growth: ${countryDetails.PopulationGrowth}<br>
        International Ties: ${countryDetails.InternationalTies}<br>
        Technological Advancement: ${countryDetails.TechnologicalAdvancement}<br>
        Cultural Development: ${countryDetails.CulturalDevelopment}<br>
        Environmental Sustainability: ${countryDetails.EnvironmentalSustainability}<br>
        Healthcare Improvement: ${countryDetails.HealthcareImprovement}<br>
        Education Enhancement: ${countryDetails.EducationEnhancement}<br>
        Infrastructure Development: ${countryDetails.InfrastructureDevelopment}<br>
    `;
}

// Add event listener for country clicks
document.addEventListener('mouseover', (event) => {
    const countryCode = event.target.getAttribute('data-code');
    if (countryCode) {
        const country = countryManager.getCountryByCode(countryCode);
        if (country) {
            updateCountryStats(country);
        }
    }
});