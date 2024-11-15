import { Country } from './Country.js';

export class CountryManager {
    constructor() {
        this.countryMap = new Map();
    }

    printCountries() {
        console.log("List of countries:");
        this.countryMap.forEach((country, name) => {
            console.log(`Name: ${name}, Code: ${country.countryCode}, Population: ${country.population}, Military Strength: ${country.militaryStrength}, Wealth: ${country.wealth}`);
        });
    }

    loadCountries(populationData) {
        // The first column is the name, the last column is the two letter country code
        // The second to last column is the population
        // Generate military strength and wealth based on population

        populationData.forEach(data => {
            const name = data["Country/Territory"];
            const population = parseInt(data["2020"]) || 0;
            const countryCode = data["country_code"];
            const militaryStrength = Math.floor(population / 1000000);
            const wealth = Math.floor(population / 100000);

            const country = new Country(name);
            country.setCountryCode(countryCode);
            country.setPopulation(population);
            country.setMilitaryStrength(militaryStrength);
            country.setWealth(wealth);

            this.countryMap.set(name, country);
        });
        this.printCountries();
    }

    getCountry(name) {
        return this.countryMap.get(name);
    }

    getAllCountries() {
        return Array.from(this.countryMap.values());
    }

    
}