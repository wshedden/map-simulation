import { populationDataMap, countryNameMapping, countries } from './data.js';
import { resize, updateDots, handleMouseOver, handleMouseOut } from './utils.js';

export let svg, path, projection;

export function initializeMap(countries, countryManager) {
    let width = window.innerWidth * 0.8;
    let height = window.innerHeight * 0.8;

    svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    projection = d3.geoEqualEarth()
        .scale(200)
        .translate([width / 2, height / 2]);

    path = d3.geoPath().projection(projection);

    resize(svg, projection);

    countries.forEach(country => {
        let countryName = country.properties.name;
        if (countryNameMapping[countryName]) {
            countryName = countryNameMapping[countryName];
        }
        if (populationDataMap.has(countryName)) {
            country.properties.Population = populationDataMap.get(countryName)[`2022`];
            country.properties.Code = populationDataMap.get(countryName)["country_code"];
        }
        // Use the two-digit country code for countryManager
        const countryCode = country.properties.Code;
        // If theres no code don't do this
        if (!countryCode) return;
        // console.log(`Country: ${country.properties.name}, Code: ${countryCode}`);
        if (countryManager.getCountryByCode(countryCode)) {
            country.properties.Color = countryManager.getCountryByCode(countryCode).color;
        }
    });

    svg.selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", d => d.properties.Color)
        .attr("data-code", d => d.properties.Code)
        .on("mouseover", function(event, d) {
            handleMouseOver(event, d, countryManager);
        })
        .on("mouseout", function(event, d) {
            handleMouseOut(event, d, countryManager);
        });
}

function generateFlowerCoordinates(center, numDots, innerRadius, outerRadius) {
    const coordinates = [];
    const numRings = 5;
    const radiusIncrement = (outerRadius - innerRadius) / (numRings - 1);

    let remainingDots = numDots;
    for (let j = 0; j < numRings; j++) {
        const radius = innerRadius + j * radiusIncrement;
        const maxDotsInRing = Math.max(3, Math.round((numDots * (j + 1)) / numRings));
        const dotsInRing = Math.min(remainingDots, maxDotsInRing);
        const angleIncrement = (2 * Math.PI) / dotsInRing;

        for (let i = 0; i < dotsInRing; i++) {
            const angle = i * angleIncrement;
            const x = center[0] + radius * Math.cos(angle);
            const y = center[1] + radius * Math.sin(angle);
            coordinates.push([x, y]);
        }

        remainingDots -= dotsInRing;
        if (remainingDots <= 0) break;
    }

    return coordinates;
}

export function updatePopulationDisplay() {
    let totalWorldPopulation = countryManager.getWorldPopulation();

    colorScale.domain([0, totalWorldPopulation / 2]);

    countries.forEach(country => {
        let countryName = country.properties.name;
        if (countryNameMapping[countryName]) {
            countryName = countryNameMapping[countryName];
        }
        if (populationDataMap.has(countryName)) {
            country.properties.Population = populationDataMap.get(countryName)[`${getCurrentYear()}`];
            country.properties.Code = populationDataMap.get(countryName)["country_code"];
        }
    });

    let title = d => `${d.properties.name}, ${d.properties.Code}, Population: ${formatPopulation(d.properties.Population)}`;

    svg.selectAll("path")
        .data(countries)
        .attr("fill", d => colorScale(d.properties.Population))
        .select("title")
        .text(title);

    // console.log(`Population data updated for year ${getCurrentYear()}`);
}

export function updateMap(countries) {
    svg.selectAll("path")
        .data(countries)
        .attr("fill", d => d.properties.Color)
        .select("title")
        .text(d => `${d.properties.name} - Population: ${d.properties.Population}`);
}

export { resize, updateDots, generateFlowerCoordinates };
