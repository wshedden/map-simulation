import { Country } from './Country.js';
export let distanceMatrix;

export class CountryManager {
    constructor() {
        this.countryMap = new Map();
    }

    loadCountries(populationData, borderData, distanceData) {
        /* name is Country/Territory, population is 2022, country_code is country_code */

        populationData.forEach(data => {
            const name = data["Country/Territory"];
            const population = Math.floor(data["2022"]);
            const countryCode = data["country_code"];
            const militaryStrength = Math.floor(population / 1000000);
            const wealth = Math.floor(population / 100000);
            const country = new Country(name);
            country.setCountryCode(countryCode);
            country.setPopulation(population);
            country.setMilitaryStrength(militaryStrength);
            country.setWealth(wealth);

            this.countryMap.set(countryCode, country);
        });

        distanceMatrix = distanceData;

        this.updateBorderingCountries(borderData);

        // Initialize alliances
        const us = this.getCountryByCode("US");
        const canada = this.getCountryByCode("CA");
        if (us && canada) {
            us.addAlly(canada);
        }
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

    getRandomCountry(predicate) {
        // Go through maximum 5 times getting a random country and if it doesn't satisfy the predicate then return null
        for (let i = 0; i < 5; i++) {
            const randomCountry = this.getRandomCountryHelper();
            if (predicate(randomCountry)) {
                return randomCountry;
            }
        }
        return null;
    }

    getRandomCountryHelper() {
        const randomIndex = Math.floor(Math.random() * this.countryMap.size);
        const randomCountry = Array.from(this.countryMap.values())[randomIndex];
        return randomCountry;
    }

    getCountryByCode(code) {
        return this.countryMap.get(code);
    }

    getCountryDetailsByCode(code) {
        const country = this.getCountryByCode(code);
        if (!country) {
            return {};
        }
        return country.getDetails();
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
                }
            }
        });

        console.log("Finished updating bordering countries.");
    }

    getDistance(countryCode1, countryCode2) { // Use distance matrix
        console.log(this.distanceMatrix);
    }
}