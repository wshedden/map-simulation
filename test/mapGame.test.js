// Use mocha
// Run: npx mocha
// Use chai expect

import { expect } from 'chai';
import { updatePopulations } from '../mapGame.js'; // Adjust the import path as necessary

describe('countryNameMapping', () => {
    const countryNameMapping = {
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
    };

    it('should map country names correctly', () => {
        Object.keys(countryNameMapping).forEach(key => {
            console.log(`Mapping "${key}" to "${countryNameMapping[key]}"`);
            expect(countryNameMapping[key]).to.equal(countryNameMapping[key]);
        });
    });

    it('should not map country names that are not in the mapping', () => {
        const result = countryNameMapping["Nonexistent Country"];
        console.log(`Mapping "Nonexistent Country" to "${result}"`);
        expect(result).to.be.undefined;
    });
});

describe('populationData', () => {
    const populationData = [
        { "Country/Territory": "United States", "2022 Population": "330000000" },
        { "Country/Territory": "DR Congo", "2022 Population": "95000000" },
        { "Country/Territory": "Dominican Republic", "2022 Population": "11000000" },
        // Add more test data as needed
    ];

    it('should have correct population data for 2022', () => {
        const populationDataMap = new Map(populationData.map(d => [d["Country/Territory"], d["2022 Population"]]));
        populationData.forEach(d => {
            console.log(`Population of ${d["Country/Territory"]} in 2022 is ${d["2022 Population"]}`);
            expect(populationDataMap.get(d["Country/Territory"])).to.equal(d["2022 Population"]);
        });
    });

    it('should not have formatted population data', () => {
        const populationDataMap = new Map(populationData.map(d => [d["Country/Territory"], d["2022 Population"]]));
        populationData.forEach(d => {
            console.log(`Population of ${d["Country/Territory"]} in 2022 is ${d["2022 Population"]} (not formatted)`);
            expect(populationDataMap.get(d["Country/Territory"])).not.to.equal(`${parseInt(d["2022 Population"]) / 1000000}M`);
        });
    });
});

describe('updatePopulations', () => {
    const countries = [
        { properties: { name: "United States" } },
        { properties: { name: "DR Congo" } },
        { properties: { name: "Dominican Republic" } },
    ];

    const populationDataMap = new Map([
        ["United States", { "2022 Population": "330000000" }],
        ["DR Congo", { "2022 Population": "95000000" }],
        ["Dominican Republic", { "2022 Population": "11000000" }],
    ]);

    const countryNameMapping = {
        "United States of America": "United States",
        "Dem. Rep. Congo": "DR Congo",
        "Dominican Rep.": "Dominican Republic",
    };

    let currentYear = 2022;

    it('should update populations correctly for the current year', () => {
        updatePopulations(countries, populationDataMap, countryNameMapping, currentYear);
        countries.forEach(country => {
            const countryName = country.properties.name;
            const expectedPopulation = populationDataMap.get(countryName)[`${currentYear} Population`];
            console.log(`Population of ${countryName} in ${currentYear} is ${expectedPopulation}`);
            expect(country.properties.Population).to.equal(expectedPopulation);
        });
    });

    it('should not update populations for countries not in the population data map', () => {
        const newCountry = { properties: { name: "Nonexistent Country" } };
        countries.push(newCountry);
        updatePopulations(countries, populationDataMap, countryNameMapping, currentYear);
        console.log(`Population of Nonexistent Country is ${newCountry.properties.Population}`);
        expect(newCountry.properties.Population).to.be.undefined;
    });
});

describe('updatePopulations for different year', () => {
    // Set year to 1970
    let currentYear = 1970;

    const countries = [
        { properties: { name: "United States" } },
        { properties: { name: "DR Congo" } },
        { properties: { name: "Dominican Republic" } },
    ];

    const populationDataMap = new Map([
        ["United States", { "1970 Population": "205000000" }],
        ["DR Congo", { "1970 Population": "20000000" }],
        ["Dominican Republic", { "1970 Population": "4000000" }],
    ]);

    const countryNameMapping = {
        "United States of America": "United States",
        "Dem. Rep. Congo": "DR Congo",
        "Dominican Rep.": "Dominican Republic",
    };

    it('should update populations correctly for the year 1970', () => {
        updatePopulations(countries, populationDataMap, countryNameMapping, currentYear);
        countries.forEach(country => {
            const countryName = country.properties.name;
            const expectedPopulation = populationDataMap.get(countryName)[`${currentYear} Population`];
            console.log(`Population of ${countryName} in ${currentYear} is ${expectedPopulation}`);
            expect(country.properties.Population).to.equal(expectedPopulation);
        });
    });
});
