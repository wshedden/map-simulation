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
            const simCountry = countryManager.getCountryByCode(country.properties.Code);
            if (simCountry) {
                simCountry.setTopoJsonObject(country);
            }
        }
        const countryCode = country.properties.Code;
        if (!countryCode) return;
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

    // Add alliance symbol only for allies
    countries.forEach(country => {
        const simCountry = countryManager.getCountryByCode(country.properties.Code);
        if (simCountry && simCountry.allies.size > 0) {
            const centroid = path.centroid(country);
            svg.append("g")
                .attr("class", "alliance-symbol")
                .attr("transform", `translate(${centroid[0]}, ${centroid[1]})`)
                .append("circle")
                .attr("r", 10)
                .attr("fill", "blue");

            svg.append("g")
                .attr("class", "alliance-symbol")
                .attr("transform", `translate(${centroid[0]}, ${centroid[1]})`)
                .append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .text("A");
        }
    });
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
}

export function updateMap(countries) {
    svg.selectAll("path")
        .data(countries)
        .attr("fill", d => d.properties.Color)
        .select("title")
        .text(d => `${d.properties.name} - Population: ${d.properties.Population}`);
}

export function refreshMap(countries, countryManager) {
    // Remove existing alliance symbols
    svg.selectAll(".alliance-symbol").remove();

    // Add alliance symbol only for allies
    countries.forEach(country => {
        const simCountry = countryManager.getCountryByCode(country.properties.Code);
        if (simCountry && simCountry.allies.size > 0) {
            const centroid = path.centroid(country);
            svg.append("g")
                .attr("class", "alliance-symbol")
                .attr("transform", `translate(${centroid[0]}, ${centroid[1]})`)
                .append("circle")
                .attr("r", 10)
                .attr("fill", "blue");

            svg.append("g")
                .attr("class", "alliance-symbol")
                .attr("transform", `translate(${centroid[0]}, ${centroid[1]})`)
                .append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .text("A");
        }
    });
}

export { resize, updateDots };
