import { Country } from './country.js';

export class CountryManager {
    constructor() {
        this.countryMap = new Map();
    }

    loadCountries(countryData) {
        countryData.forEach(data => {
            const country = new Country(data.name);
            country.setCountryCode(data.country_code);
            country.setPopulation(data.population);
            country.setMilitaryStrength(data.military_strength);
            country.setWealth(data.wealth);
            this.countryMap.set(data.name, country);
        });
    }

    getCountry(name) {
        return this.countryMap.get(name);
    }

    getAllCountries() {
        return Array.from(this.countryMap.values());
    }

    printCountries() {
        console.log("List of countries:");
        this.countryMap.forEach((country, name) => {
            console.log(`Name: ${name}, Code: ${country.countryCode}, Population: ${country.population}, Military Strength: ${country.militaryStrength}, Wealth: ${country.wealth}`);
        });
    }
}