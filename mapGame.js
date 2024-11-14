// Set initial width and height based on the window size
let width = window.innerWidth * 0.8; // Adjust width to fit within the container
let height = window.innerHeight * 0.8; // Adjust height to fit within the container

// Create the SVG element with a border
const svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the projection and path generator
const projection = d3.geoEqualEarth()
    .scale(200)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Define a resize function
function resize() {
    // Update width and height based on window size
    width = window.innerWidth * 0.8;
    height = window.innerHeight * 0.8;

    // Resize the SVG
    svg.attr("width", width).attr("height", height);

    // Update the projection to match the new dimensions
    projection.translate([width / 2, height / 2]);

    // Redraw countries to fit new dimensions
    svg.selectAll("path")
        .attr("d", path);
}

// Call resize initially to set up the map
resize();

// Attach the resize function to the window resize event
window.onresize = resize;

// Variable to store the current year
let currentYear = 2022;

// Add a slider to control the year
const slider = d3.select("#slider")
    .on("input", function() {
        currentYear = +this.value;
        d3.select("#slider-value").text(`Year: ${currentYear}`);
        updateDots();
        updateTable();
    });

// Variables to store data
let countries, populationDataMap, countryNameMapping;

// Function to update dots based on the current year
function updateDots() {
    // Remove existing dots
    svg.selectAll("circle").remove();

    // Update population data for the current year
    countries.forEach(country => {
        let countryName = country.properties.name;
        if (countryNameMapping[countryName]) {
            countryName = countryNameMapping[countryName];
        }
        if (populationDataMap.has(countryName)) {
            country.properties.Population = populationDataMap.get(countryName)[`${currentYear} Population`];
        }
    });

    // Add dots to each country
    countries.forEach(country => {
        const bounds = path.bounds(country);
        const [x0, y0] = bounds[0];
        const [x1, y1] = bounds[1];

        // Parse population as a number and define a scaling factor
        const population = parseInt(country.properties.Population) || 0;
        const scalingFactor = 0.00000005; // Adjust this factor as needed
        const numDots = Math.max(1, Math.round(population * scalingFactor)); // Ensure at least 1 dot

        for (let i = 0; i < numDots; i++) {
            let x, y;
            do {
                x = x0 + Math.random() * (x1 - x0);
                y = y0 + Math.random() * (y1 - y0);
            } while (!d3.geoContains(country, projection.invert([x, y])));

            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 2)
                .attr("fill", "red");
        }
    });
}

// Function to update the table based on the current year
function updateTable() {
    rows.selectAll("td")
        .data(d => [
            d.properties.name, d.properties.Energy_type, d.properties.Year, d.properties.Energy_consumption,
            d.properties.Energy_production, d.properties.GDP, d.properties.Population,
            d.properties.Energy_intensity_per_capita, d.properties.Energy_intensity_by_GDP
        ])
        .text(d => d);
}

// Load and display world map data and energy data
Promise.all([
    d3.json("countries.json"),
    d3.csv("countrydata.csv"),
    d3.csv("populations.csv"),
    d3.csv("energy.csv")
]).then(([worldData, countryData, populationData, energyData]) => {
    countries = topojson.feature(worldData, worldData.objects.countries).features;

    // Create maps of data by country name
    populationDataMap = new Map(populationData.map(d => [d["Country/Territory"], d]));

    // Create a mapping of country names to resolve discrepancies
    countryNameMapping = {
        "United States of America": "United States",
        "Dem. Rep. Congo": "DR Congo",
        "Dominican Rep.": "Dominican Republic",
        "Falkland Is.": "Falkland Islands",
        "Fr. S. Antarctic Lands": "French Southern and Antarctic Lands",
        "Côte d'Ivoire": "Ivory Coast",
        "Central African Rep.": "Central African Republic",
        "Congo": "Republic of the Congo",
        "Eq. Guinea": "Equatorial Guinea",
        "eSwatini": "Eswatini",
        "Solomon Is.": "Solomon Islands",
        "Czechia": "Czech Republic",
        "Bosnia and Herz.": "Bosnia and Herzegovina",
        "Macedonia": "North Macedonia",
        "S. Sudan": "South Sudan",
        // Add more mappings as needed
    };

    // Merge all data with country data
    countries.forEach(country => {
        let countryName = country.properties.name;
        if (countryNameMapping[countryName]) {
            countryName = countryNameMapping[countryName];
        }
        if (populationDataMap.has(countryName)) {
            country.properties.Population = populationDataMap.get(countryName)[`${currentYear} Population`];
        }
    });

    // Create popup graphic table for all the values that's scrollable
    // Create a table to display country information
    const tableContainer = d3.select("#table-container");
    const table = tableContainer.append("table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    // Define table columns
    const columns = [
        "Country", "Energy_type", "Year", "Energy_consumption",
        "Energy_production", "GDP", "Population",
        "Energy_intensity_per_capita", "Energy_intensity_by_GDP"
    ];

    // Append table header
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(d => d);

    // Append table rows
    const rows = tbody.selectAll("tr")
        .data(countries)
        .enter()
        .append("tr");

    // Append table cells
    rows.selectAll("td")
        .data(d => [
            d.properties.name, d.properties.Energy_type, d.properties.Year, d.properties.Energy_consumption,
            d.properties.Energy_production, d.properties.GDP, d.properties.Population,
            d.properties.Energy_intensity_per_capita, d.properties.Energy_intensity_by_GDP
        ])
        .enter()
        .append("td")
        .text(d => d);

    svg.selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", () => `hsl(${Math.random() * 360}, 70%, 70%)`)
        .each(function(d) {
            d3.select(this).append("title").text(`${d.properties.name} - Population: ${d.properties.Population}`);
        })
        .on("mouseover", function (event, d) {
            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function () {
            d3.select(this).style("fill", () => `hsl(${Math.random() * 360}, 70%, 70%)`);
        });

    // Initial call to update dots and table
    updateDots();
    updateTable();
});