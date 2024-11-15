import { updateMap } from './map.js';
import { colorScale } from './utils.js';
import { updateColours } from './data.js';
import { svg } from './map.js';

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
                // const countryData = this.countryManager.getCountry(countryName);
                country.properties.Population = this.countryManager.getPopulation(country.properties.Code);
                // console.log(`Country: ${countryName}, Population: ${country.properties.Population}`);
            }
        });

        updateMap(this.countries);
        // updateColours(svg, this.countries, colorScale);
    }

    runTimestep() {
        console.log(`Running simulation for day ${this.numDays}`);
        
        // 
    }

    runSimulation() {
        // Logic to run the entire simulation
        // This could involve running multiple timesteps, updating the display, etc.
        this.initialiseSimulation();
        this.updateCountries();
        this.interval = setInterval(() => {
            this.numDays++;
            this.runTimestep();
            this.updateCountries();
        }, 1000); // Increment every second
    }

    stopSimulation() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    initialiseSimulation() {
        // Logic to set up the simulation
        // This could involve setting up initial conditions, etc.
        // Make canada a vassal of the US
        const canada = this.countryManager.getCountry("CA");
        const usa = this.countryManager.getCountry("US");
        const uk = this.countryManager.getCountry("GB");
        usa.addVassal(canada);
        uk.addVassal(usa);

    }


}

