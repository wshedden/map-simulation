import { formatPopulation } from './utils.js';
import { setCurrentYear, getCurrentYear } from './main.js';
import { populationDataMap, countryNameMapping, countries } from './data.js';

export let svg, path, projection;
let colorScale = d3.scaleSequential(d3.interpolateRgbBasis(["#fffffc", "#ffcccc", "#ff6666", "#ff0000", "#800080"]));


export function initializeMap() {
    let width = window.innerWidth * 0.8;
    let height = window.innerHeight * 0.8;

    svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    projection = d3.geoEqualEarth()
        .scale(200)
        .translate([width / 2, height / 2]);

    path = d3.geoPath().projection(projection);

    resize();

    svg.selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", d => colorScale(d.properties.Population))
        .each(function(d) {
            d3.select(this).append("title").text(`${d.properties.name} - Population: ${d.properties.Population}`);
        })
        .on("mouseover", function (event, d) {
            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function (event, d) {
            d3.select(this).style("fill", colorScale(d.properties.Population));
        });
}

export function resize() {
    let width = window.innerWidth * 0.8;
    let height = window.innerHeight * 0.8;

    svg.attr("width", width).attr("height", height);
    projection.translate([width / 2, height / 2]);
}

export function updateDots() {
    svg.selectAll("circle").remove();
    updatePopulations();

    countries.forEach(country => {
        const centroid = path.centroid(country);
        const population = parseInt(country.properties.Population) || 0;
        const scalingFactor = 0.00000001;
        const numDots = Math.max(1, Math.round(population * scalingFactor));

        const flowerCoordinates = generateFlowerCoordinates(centroid, numDots, 5, 15);

        flowerCoordinates.forEach(coord => {
            svg.append("circle")
                .attr("cx", coord[0])
                .attr("cy", coord[1])
                .attr("r", 2)
                .attr("fill", "darkred");
        });
    });
}

function generateFlowerCoordinates(center, numDots, innerRadius, outerRadius) {
    const coordinates = [];
    const numRings = 3;
    const radiusIncrement = (outerRadius - innerRadius) / (numRings - 1);

    for (let j = 0; j < numRings; j++) {
        const radius = innerRadius + j * radiusIncrement;
        const dotsInRing = Math.max(3, Math.round(numDots * (j + 1) / numRings));
        const angleIncrement = (2 * Math.PI) / dotsInRing;

        for (let i = 0; i < dotsInRing; i++) {
            const angle = i * angleIncrement;
            const x = center[0] + radius * Math.cos(angle);
            const y = center[1] + radius * Math.sin(angle);
            coordinates.push([x, y]);
        }
    }

    return coordinates;
}

function updatePopulations() {
    let totalWorldPopulation = 0;
    populationDataMap.forEach(data => {
        totalWorldPopulation += parseInt(data[`${getCurrentYear()}`]) || 0;
    });

    colorScale.domain([0, totalWorldPopulation / 10]);

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

    console.log(`Population data updated for year ${getCurrentYear()}`);
}