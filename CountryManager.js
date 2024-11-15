import { Country } from './Country.js';

export class CountryManager {
    constructor() {
        this.countryMap = new Map();
    }
    loadCountries(populationData) {
        /* name is Country/Territory, population is 2022, country_code is country_code */

        populationData.forEach(data => {
            const name = data["Country/Territory"];
            const population = Math.floor(data["2022"]);
            const countryCode = data["country_code"];
            const militaryStrength = Math.floor(population / 1000000);
            const wealth = Math.floor(population / 100000);

            console.log(`Loading country: ${name}`);
            console.log(`Population: ${population}`);
            console.log(`Country Code: ${countryCode}`);
            console.log(`Military Strength: ${militaryStrength}`);
            console.log(`Wealth: ${wealth}`);

            const country = new Country(name);
            country.setCountryCode(countryCode);
            country.setPopulation(population);
            country.setMilitaryStrength(militaryStrength);
            country.setWealth(wealth);

            this.countryMap.set(name, country);
            console.log(`Country ${name} loaded and added to countryMap.`);
        });
    }

    getCountry(name) {
        return this.countryMap.get(name);
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
        this.countryMap.forEach((country, name) => {
            console.log(`Name: ${name}, Code: ${country.countryCode}, Population: ${country.population}, Military Strength: ${country.militaryStrength}, Wealth: ${country.wealth}`);
        });
    }

    getCountryByCode(code) {
        // Print if not successful
        return Array.from(this.countryMap.values()).find(country => country.countryCode === code);
    }

    getCountryDetailsByCode(code) {
        const country = this.getCountryByCode(code);
        return {
            name: country.name,
            Code: country.countryCode,
            Population: country.population,
            MilitaryStrength: country.militaryStrength,
            Wealth: country.wealth
        };
    }
}