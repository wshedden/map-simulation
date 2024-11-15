export let countries, countryNameMapping, populationDataMap;


export function loadData(worldData, countryData, populationData, energyData, currentYear) {
    countries = topojson.feature(worldData, worldData.objects.countries).features;

    populationDataMap = new Map(populationData.map(d => [d["Country/Territory"], d]));

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

    countries.forEach(country => {
        let countryName = country.properties.name;
        if (countryNameMapping[countryName]) {
            countryName = countryNameMapping[countryName];
        }
        if (populationDataMap.has(countryName)) {
            country.properties.Population = populationDataMap.get(countryName)[`${currentYear}`];
        }
    });
}

export function updatePopulations(countries, populationDataMap, countryNameMapping, currentYear) {
    countries.forEach(country => {
        let countryName = country.properties.name;
        if (countryNameMapping[countryName]) {
            countryName = countryNameMapping[countryName];
        }
        if (populationDataMap.has(countryName)) {
            country.properties.Population = populationDataMap.get(countryName)[`${currentYear}`];
        }
    });
}

export function updateColours(svg, countries, colorScale) {
    svg.selectAll("path")
        .data(countries)
        .attr("fill", d => colorScale(d.properties.Population))
        .select("title")
        .text(d => `${d.properties.name} - Population: ${d.properties.Population}`);
}

// Function to print out the countries a country borders
export function printCountryBorders(countryCode) {
    d3.csv("borders.csv").then(data => {
        const borders = data.filter(row => row.country_code === countryCode);
        borders.forEach(border => {
            console.log(`Country: ${border.country_name}, Borders: ${border.country_border_name} (${border.country_border_code})`);
        });
    });
}