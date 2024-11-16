import { updateMap } from './map.js';
import { colorScale } from './utils.js';
import { topoJsonNameToCode, checkMissingCountriesFromBorderCSV } from './data.js';
import { svg } from './map.js';

export class Simulation {
    constructor(countryManager, countries) {
        this.countryManager = countryManager; 
        this.countries = countries; // This is countries in svg order
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
                country.properties.Population = this.countryManager.getPopulation(country.properties.Code);
                // Assign a random color to each country
                country.properties.Color = this.getRandomColor();
            }
        });

        updateMap(this.countries);
        // updateColours(svg, this.countries, colorScale);
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    runTimestep() {
        this.processTurn();
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
        }, 100); // Increment every 2 seconds
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
        const canada = this.countryManager.getCountryByCode("CA");
        const usa = this.countryManager.getCountryByCode("US");
        const uk = this.countryManager.getCountryByCode("GB");
        usa.addVassal(canada);
        uk.addVassal(usa);

        // // For all countries print their bordering countries
        // this.countryManager.countryMap.forEach(country => {
        //     country.printBorderingCountries();
        // });

        // Update the map to reflect the color changes
        updateMap(this.countries);
        

    }

    processTurn() {
        const countries = this.countryManager.getAllCountries();
        countries.forEach(country => {
            country.makeMove();
        });
        this.updateCountries();
    }
}

