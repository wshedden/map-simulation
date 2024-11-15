import { Country } from './Country.js';

export class CountryManager {
    constructor() {
        this.countryMap = new Map();
    }
    loadCountries(populationData, borderData) {
        /* name is Country/Territory, population is 2022, country_code is country_code */

        populationData.forEach(data => {
            const name = data["Country/Territory"];
            const population = Math.floor(data["2022"]);
            const countryCode = data["country_code"];
            const militaryStrength = Math.floor(population / 1000000);
            const wealth = Math.floor(population / 100000);

            // console.log(`Loading country: ${name}`);
            // console.log(`Population: ${population}`);
            // console.log(`Country Code: ${countryCode}`);
            // console.log(`Military Strength: ${militaryStrength}`);
            // console.log(`Wealth: ${wealth}`);

            const country = new Country(name);
            country.setCountryCode(countryCode);
            country.setPopulation(population);
            country.setMilitaryStrength(militaryStrength);
            country.setWealth(wealth);

            this.countryMap.set(countryCode, country);
            // console.log(`Country ${name} loaded and added to countryMap.`);


        });

        this.updateBorderingCountries(borderData);
    }

    getCountryByName(name) {
        for (const country of this.countryMap.values()) {
            if (country.name === name) {
                return country;
            }
        }
        return null;
    }

    getAllCountries() {
        return Array.from(this.countryMap.values());
    }

    async loadCountryBorders(countryCode) {
        const data = await d3.csv("borders.csv");
        const borders = data.filter(row => row.country_code === countryCode);
        const borderCodes = borders.map(border => border.country_border_code);
        return borderCodes;
    }

    printCountries() {
        console.log("List of countries:");
        this.countryMap.forEach((country, code) => {
            console.log(`Name: ${country.name}, Code: ${code}, Population: ${country.population}, Military Strength: ${country.militaryStrength}, Wealth: ${country.wealth}`);
        });
    }

    getCountryByCode(code) {
        // Print code if not found
        if (!this.countryMap.has(code)) {
            console.log(`Country with code ${code} not found.`);
            return null;
        }
        return this.countryMap.get(code);
    }

    getCountryDetailsByCode(code) {
        const country = this.getCountryByCode(code);
        if (!country) {
            return {};
        }
        // If there isn't a code then return too
        return {
            name: country.name,
            Code: country.countryCode,
            Population: country.population,
            MilitaryStrength: country.militaryStrength,
            Wealth: country.wealth,
            Vassals: Array.from(country.vassals).map(vassal => vassal.name).join(", ") || "none",
            Overlord: country.overlord ? country.overlord.name : "none"
        };
    }

    setCountryPopulation(code, newPopulation) {
        const country = this.getCountryByCode(code);
        if (country) {
            country.setPopulation(newPopulation);
        }
    }

    getPopulation(code) {
        const country = this.getCountryByCode(code);
        if (country) {
            return country.population;
        }
        return 0;
    }

    getWorldPopulation() {  // Returns the total population of all countries
        let totalPopulation = 0;
        this.countryMap.forEach(country => {
            totalPopulation += country.population;
        });
        return totalPopulation;
    }

    updateBorderingCountries(borderData) {
        console.log("Starting to update bordering countries...");

        borderData.forEach(row => {
            const countryCode1 = row.country_code;
            const countryCode2 = row.country_border_code;

            console.log(`Processing row: ${countryCode1} - ${countryCode2}`);

            if (countryCode1 && countryCode2) {
                const country1 = this.getCountryByCode(countryCode1);
                const country2 = this.getCountryByCode(countryCode2);

                if (!country1) {
                    console.log(`Country with code ${countryCode1} not found.`);
                }
                if (!country2) {
                    console.log(`Country with code ${countryCode2} not found.`);
                }

                if (country1 && country2) {
                    if (!country1.borderingCountries) {
                        country1.borderingCountries = new Set();
                    }
                    if (!country2.borderingCountries) {
                        country2.borderingCountries = new Set();
                    }

                    country1.borderingCountries.add(country2);
                    country2.borderingCountries.add(country1);

                    console.log(`Added border: ${country1.name} <-> ${country2.name}`);
                }
            } else {
                console.log(`Invalid row: ${countryCode1} - ${countryCode2}`);
            }
        });

        console.log("Finished updating bordering countries.");
    }
}