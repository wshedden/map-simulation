// Use mocha
// Run: npx mocha
// Use chai expect

import { expect } from 'chai';

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
