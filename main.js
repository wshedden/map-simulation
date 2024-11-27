import { initializeMap, resize, svg, projection } from './map.js';
import { loadData, countries } from './data.js';
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
        <p>Name: ${country.name}</p>
        <p>Population: ${country.population}</p>
        <p>Military Strength: ${country.militaryStrength}</p>
        <p>Wealth: ${country.wealth}</p>
    `;

    const borderingCountries = Array.from(country.borderingCountries).map(borderCountry => {
        const relation = country.diplomaticRelations.get(borderCountry.countryCode) || 0;
        return `<p>${borderCountry.name}: ${relation}</p>`;
    }).join('');

    statsContent.innerHTML += `
        <h3>Bordering Countries Relations</h3>
        ${borderingCountries}
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