// Add this HTML below the slider element in your HTML file
// <div id="slider-value"></div>

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
}

// Call resize initially to set up the map
resize();

// Attach the resize function to the window resize event
window.onresize = resize;

// Variable to store the current year
let currentYear = 2022;

// Variables to store data
let countries, populationDataMap, countryNameMapping;

// Function to update population data based on the current year
function updatePopulations() {
    countries.forEach(country => {
        let countryName = country.properties.name;
        if (countryNameMapping[countryName]) {
            countryName = countryNameMapping[countryName];
        }
        if (populationDataMap.has(countryName)) {
            country.properties.Population = populationDataMap.get(countryName)[`${currentYear} Population`];
        }
    });
}

// Function to update dots based on the current year
function updateDots() {
    // Remove existing dots
    svg.selectAll("circle").remove();

    // Update population data for the current year
    updatePopulations();

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

    // Initialize noUiSlider
    const slider = document.getElementById('slider');
    noUiSlider.create(slider, {
        start: [2022],
        step: 1,
        range: {
            'min': [1970],
            'max': [2022]
        },
        format: {
            to: value => Math.round(value),
            from: value => Math.round(value)
        },
        // Limit the accepted values to specific years
        pips: {
            mode: 'values',
            values: [1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022],
            density: 10
        }
    });

    // Override the default behavior to limit to specific years
    slider.noUiSlider.on('slide', function (values, handle) {
        const allowedYears = [1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022];
        const closest = allowedYears.reduce((prev, curr) => Math.abs(curr - values[handle]) < Math.abs(prev - values[handle]) ? curr : prev);
        slider.noUiSlider.set(closest);
    });

    // Update currentYear and call updateDots on slider change
    slider.noUiSlider.on('update', function (values, handle) {
        currentYear = values[handle];
        d3.select("#slider-value").text(`Year: ${currentYear}`);
        updateDots();
    });

    // Initial call to update dots
    updateDots();
});

// export
module.exports = {
    resize,
    updatePopulations,
    updateDots
};