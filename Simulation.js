import { updateMap } from './map.js';
import { colorScale } from './utils.js';

export class Simulation {
    constructor(countryManager, countries) {
        this.countryManager = countryManager;
        this.countries = countries;
        this.numDays = 0;
        this.interval = null;
    }

    getNumDays() {
        return this.numDays;
    }

    setNumDays(days) {
        this.numDays = days;
        this.updateCountries();
    }

    updateCountries() {
        const countries = this.countryManager.getAllCountries();
        countries.forEach(country => {
            // Update country properties based on the number of days
            // For example, update population, military strength, wealth, etc.
        });

        this.updatePopulationDisplay();
    }

    updatePopulationDisplay() {
        let totalWorldPopulation = 0;
        this.countryManager.countryMap.forEach(data => {
            totalWorldPopulation += parseInt(data.population) || 0;
        });

        colorScale.domain([0, totalWorldPopulation / 10]);

        this.countries.forEach(country => {
            let countryName = country.properties.name;
            if (this.countryManager.countryMap.has(countryName)) {
                const countryData = this.countryManager.getCountry(countryName);
                country.properties.Population = countryData.population;
                country.properties.Code = countryData.countryCode;
            }
        });

        updateMap(this.countries);
    }

    runTimestep() {
        // Logic to run a single timestep in the simulation
        // This could involve updating country relationships, handling invasions, etc.
    }

    runSimulation() {
        // Logic to run the entire simulation
        // This could involve running multiple timesteps, updating the display, etc.
        this.countryManager.printCountries();
        this.updateCountries();
        this.interval = setInterval(() => {
            this.numDays++;
            this.runTimestep();
            this.updateCountries();
        }, 500); // Increment every half a second
    }

    stopSimulation() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}