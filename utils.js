export const colorScale = d3.scaleSequential(d3.interpolateRgbBasis([
    "#ffffff", //
    "#ff0000", // Red for low population
    "#ffff00", // Yellow for low-mid population
    "#00ff00", // Green for mid population
    "#00ffff", // Cyan for mid-high population
    "#0000ff", // Blue for high population
    "#800080"  // Purple for the highest population
]));
export function formatPopulation(population) {
    if (population >= 1e9) {
        return `${(population / 1e9).toFixed(2)}B`;
    } else if (population >= 1e6) {
        return `${(population / 1e6).toFixed(2)}M`;
    } else if (population >= 1e3) {
        return `${(population / 1e3).toFixed(2)}K`;
    } else {
        return population;
    }
}

export function resize(svg, projection) {
    let width = window.innerWidth * 0.8;
    let height = window.innerHeight * 0.8;

    svg.attr("width", width).attr("height", height);
    projection.translate([width / 2, height / 2]);
}

export function updateDots(svg, countries, path, generateFlowerCoordinates) {
    svg.selectAll("circle").remove();
    // updatePopulations();

    countries.forEach(country => {
        const centroid = path.centroid(country);
        const population = parseInt(country.properties.Population) || 0;
        const scalingFactor = 1 / 10000000; // Adjusted scaling factor to reduce the number of dots
        const numDots = Math.round(population * scalingFactor); // Minimum number of dots is now 0

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

export function handleMouseOver(event, d, countryManager) {
    const countryCode = d.properties.Code;
    const countryDetails = countryManager.getCountryDetailsByCode(countryCode);
    if (!countryDetails || !countryDetails.Population) {
        return;
    }

    d3.select(this).style("fill", "orange");

    const getValueOrNone = (value) => value !== undefined && value !== null ? value : "none";
    const borderingCountries = countryDetails.borderingCountries
        ? Array.from(countryDetails.borderingCountries).map(country => country.name).join(", ")
        : "none";

    // console.log(countryDetails.borderingCountries);
    

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .style("pointer-events", "none");

    tooltip.html(`
        <strong>${getValueOrNone(countryDetails.name)}</strong><br>
        Country Code: ${getValueOrNone(countryDetails.Code)}<br>
        Population: ${getValueOrNone(formatPopulation(countryDetails.Population))}<br>
        Military Strength: ${getValueOrNone(countryDetails.MilitaryStrength)}<br>
        Wealth: ${getValueOrNone(countryDetails.Wealth)}<br>
        Vassals: ${getValueOrNone(countryDetails.Vassals)}<br>
        Overlord: ${getValueOrNone(countryDetails.Overlord)}<br>
        Bordering Countries: ${countryDetails.borderingCountries}
    `)
    .style("left", `${event.pageX + 10}px`)
    .style("top", `${event.pageY + 10}px`);
}

export function handleMouseOut(event, d, countryManager) {
    const countryCode = d.properties.Code;
    const countryDetails = countryManager.getCountryDetailsByCode(countryCode);

    if (!countryDetails.Population) {
        return;
    }

    d3.select(this).style("fill", colorScale(countryDetails.Population));
    d3.select(".tooltip").remove();
}

export function parseDistanceMatrix(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsedData = Papa.parse(fileContent, { header: true });
    const data = parsedData.data;

    const distanceMatrix = {};

    data.forEach(row => {
        const fromCode = row[''];
        distanceMatrix[fromCode] = {};

        Object.keys(row).forEach(toCode => {
            if (toCode !== '') {
                distanceMatrix[fromCode][toCode] = parseFloat(row[toCode]);
            }
        });
    });

    return distanceMatrix;
}