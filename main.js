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
    const statsContent = document.getElementById('stats-content');
    statsContent.innerHTML = `
        <strong>${country.name}</strong><br>
        Country Code: ${country.countryCode}<br>
        Population: ${country.population}<br>
        Military Strength: ${country.militaryStrength}<br>
        Wealth: ${country.wealth}<br>
        Military Spending: ${country.militarySpending}<br>
        Economic Growth: ${country.economicGrowth}<br>
        Population Growth: ${country.populationGrowth}<br>
        International Ties: ${country.internationalTies}<br>
        Technological Advancement: ${country.technologicalAdvancement}<br>
        Cultural Development: ${country.culturalDevelopment}<br>
        Environmental Sustainability: ${country.environmentalSustainability}<br>
        Healthcare Improvement: ${country.healthcareImprovement}<br>
        Education Enhancement: ${country.educationEnhancement}<br>
        Infrastructure Development: ${country.infrastructureDevelopment}<br>
        Aggression Level: ${country.aggressionLevel}<br>
        Economic Stability: ${country.economicStability}<br>
        Military Readiness: ${country.militaryReadiness}<br>
        Diplomatic Relations: ${country.diplomaticRelations}<br>
        Bordering Countries: ${Array.from(country.borderingCountries).map(c => c.name).join(', ')}
    `;
}

// Add event listener for country clicks
document.addEventListener('click', (event) => {
    const countryCode = event.target.getAttribute('data-code');
    if (countryCode) {
        const country = countryManager.getCountryByCode(countryCode);
        if (country) {
            updateCountryStats(country);
        }
    }
});