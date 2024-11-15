// export { updatePopulations, currentYear, countries, populationDataMap, countryNameMapping, updateDots, resize, svg, path, projection };

// // Set initial width and height based on the window size
// let width = window.innerWidth * 0.8; // Adjust width to fit within the container
// let height = window.innerHeight * 0.8; // Adjust height to fit within the container

// // Create the SVG element with a border
// const svg = d3.select("#map").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// // Define the projection and path generator
// const projection = d3.geoEqualEarth()
//     .scale(200)
//     .translate([width / 2, height / 2]);

// const path = d3.geoPath().projection(projection);

// // Define a resize function
// function resize() {
//     // Update width and height based on window size
//     width = window.innerWidth * 0.8;
//     height = window.innerHeight * 0.8;

//     // Resize the SVG
//     svg.attr("width", width).attr("height", height);

//     // Update the projection to match the new dimensions
//     projection.translate([width / 2, height / 2]);

//     // Redraw countries to fit new dimensions
// }

// // Call resize initially to set up the map
// resize();

// // Attach the resize function to the window resize event
// window.onresize = resize;

// // Variable to store the current year
// let currentYear = 1970;

// // Variables to store data
// let countries, countryNameMapping;

// // Make populationDataMap global
// let populationDataMap;

// // Define a color scale based on population
// let colorScale = d3.scaleSequential(d3.interpolateRgbBasis(["#fffffc", "#ffcccc", "#ff6666", "#ff0000", "#800080"]));
// // Function to update population data based on the current year
// function updatePopulations() {
//     // Calculate total world population for the current year
//     let totalWorldPopulation = 0;
//     populationDataMap.forEach(data => {
//         totalWorldPopulation += parseInt(data[`${currentYear}`]) || 0;
//     });

//     // Update the color scale domain based on the total world population
//     colorScale.domain([0, totalWorldPopulation/10]);

//     // Update population data for each country
//     countries.forEach(country => {
//         let countryName = country.properties.name;
//         if (countryNameMapping[countryName]) {
//             countryName = countryNameMapping[countryName];
//         }
//         if (populationDataMap.has(countryName)) {
//             country.properties.Population = populationDataMap.get(countryName)[`${currentYear}`];
//             country.properties.Code = populationDataMap.get(countryName)["country_code"];
//         }
//     });

//     // Tooltip format: "United Kingdom, GB, Population: 67.89M"
//     let title = d => `${d.properties.name}, ${d.properties.Code}, Population: ${formatPopulation(d.properties.Population)}`;

//     // Update the map with new population data
//     svg.selectAll("path")
//         .data(countries)
//         .attr("fill", d => colorScale(d.properties.Population))
//         .select("title")
//         .text(title);

//     console.log(`Population data updated for year ${currentYear}`);
// }

// // Function to update dots based on the current year
// function updateDots() {
//     // Remove existing dots
//     svg.selectAll("circle").remove();

//     // Update population data for the current year
//     updatePopulations();

//     // Add flower-like dots to each country
//     countries.forEach(country => {
//         const centroid = path.centroid(country);

//         // Parse population as a number and define a scaling factor
//         const population = parseInt(country.properties.Population) || 0;
//         const scalingFactor = 0.00000001; // Adjust this factor as needed
//         const numDots = Math.max(1, Math.round(population * scalingFactor)); // Ensure at least 1 dot

//         // Generate flower coordinates with a lower inner radius
//         const flowerCoordinates = generateFlowerCoordinates(centroid, numDots, 5, 15); // Lower inner radius and wider outer radius

//         flowerCoordinates.forEach(coord => {
//             svg.append("circle")
//                 .attr("cx", coord[0])
//                 .attr("cy", coord[1])
//                 .attr("r", 2)
//                 .attr("fill", "darkred"); // Increase the redness
//         });
//     });
// }

// // Function to generate flower formation coordinates
// function generateFlowerCoordinates(center, numDots, innerRadius, outerRadius) {
//     const coordinates = [];
//     const numRings = 3; // Number of rings
//     const radiusIncrement = (outerRadius - innerRadius) / (numRings - 1);

//     for (let j = 0; j < numRings; j++) {
//         const radius = innerRadius + j * radiusIncrement;
//         const dotsInRing = Math.max(3, Math.round(numDots * (j + 1) / numRings)); // More dots in outer rings
//         const angleIncrement = (2 * Math.PI) / dotsInRing;

//         for (let i = 0; i < dotsInRing; i++) {
//             const angle = i * angleIncrement;
//             const x = center[0] + radius * Math.cos(angle);
//             const y = center[1] + radius * Math.sin(angle);
//             coordinates.push([x, y]);
//         }
//     }

//     return coordinates;
// }

// // Load and display world map data and energy data
// Promise.all([
//     d3.json("countries.json"),
//     d3.csv("countrydata.csv"),
//     d3.csv("populations_interpolated_with_codes.csv"),
//     d3.csv("energy.csv")
// ]).then(([worldData, countryData, populationData, energyData]) => {
//     countries = topojson.feature(worldData, worldData.objects.countries).features;

//     // Create maps of data by country name
//     populationDataMap = new Map(populationData.map(d => [d["Country/Territory"], d]));

//     // Create a mapping of country names to resolve discrepancies
//     countryNameMapping = {
//         "United States of America": "United States",
//         "Dem. Rep. Congo": "DR Congo",
//         "Dominican Rep.": "Dominican Republic",
//         "Falkland Is.": "Falkland Islands",
//         "Fr. S. Antarctic Lands": "French Southern and Antarctic Lands",
//         "Côte d'Ivoire": "Ivory Coast",
//         "Central African Rep.": "Central African Republic",
//         "Congo": "Republic of the Congo",
//         "Eq. Guinea": "Equatorial Guinea",
//         "eSwatini": "Eswatini",
//         "Solomon Is.": "Solomon Islands",
//         "Czechia": "Czech Republic",
//         "Bosnia and Herz.": "Bosnia and Herzegovina",
//         "Macedonia": "North Macedonia",
//         "S. Sudan": "South Sudan",
//         // Add more mappings as needed
//     };

//     // Merge all data with country data
//     countries.forEach(country => {
//         let countryName = country.properties.name;
//         if (countryNameMapping[countryName]) {
//             countryName = countryNameMapping[countryName];
//         }
//         if (populationDataMap.has(countryName)) {
//             country.properties.Population = populationDataMap.get(countryName)[`${currentYear}`];
//         }
//     });

//     svg.selectAll("path")
//         .data(countries)
//         .enter().append("path")
//         .attr("class", "country")
//         .attr("d", path)
//         .attr("fill", d => colorScale(d.properties.Population))
//         .each(function(d) {
//             d3.select(this).append("title").text(`${d.properties.name} - Population: ${d.properties.Population}`);
//         })
//         .on("mouseover", function (event, d) {
//             d3.select(this).style("fill", "orange");
//         })
//         .on("mouseout", function (event, d) {
//             d3.select(this).style("fill", colorScale(d.properties.Population));
//         });

//     // Initialize noUiSlider
//     const slider = document.getElementById('slider');
//     noUiSlider.create(slider, {
//         start: [1970],
//         step: 1,
//         range: {
//             'min': [1970],
//             'max': [2022]
//         },
//         format: {
//             to: value => Math.round(value),
//             from: value => Math.round(value)
//         },
//     });

//     // Update currentYear and call updateDots on slider change
//     slider.noUiSlider.on('update', function (values, handle) {
//         currentYear = values[handle];
//         d3.select("#slider-value").text(`Year: ${currentYear}`);
//         updateDots();
//     });

//     // Initial call to update dots
//     updateDots();

//     // Start auto-scrolling the slider
//     autoScrollSlider();
// });

// // Function to automatically scroll the slider
// function autoScrollSlider() {
//     let year = 1970;
//     const interval = setInterval(() => {
//         if (year > 2022) {
//             year = 1970; // Loop back to 1970
//         }
//         slider.noUiSlider.set(year);
//         year++;
//     }, 500); // Faster interval
// }

// // Function to format the population number from float to int with 2 decimal places like 1.23M or 4.56B or 71.89K
// function formatPopulation(population) {
//     if (population >= 1e9) {
//         return `${(population / 1e9).toFixed(2)}B`;
//     } else if (population >= 1e6) {
//         return `${(population / 1e6).toFixed(2)}M`;
//     } else if (population >= 1e3) {
//         return `${(population / 1e3).toFixed(2)}K`;
//     } else {
//         return population;
//     }
// }
