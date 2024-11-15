import { updateMap } from './map.js';
import { colorScale } from './utils.js';
import { topoJsonNameToCode } from './data.js';
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
        // Make a random country 

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
        const canada = this.countryManager.getCountryByCode("CA");
        const usa = this.countryManager.getCountryByCode("US");
        const uk = this.countryManager.getCountryByCode("GB");
        usa.addVassal(canada);
        uk.addVassal(usa);

        // Go through all countries and try to print the code, so we go through countries list and turn it into codes using the data
        this.countries.forEach(country => {
            const countryCode = topoJsonNameToCode(country.properties.name, this.countryManager);
            // If it doesnt exist, print the name
            if (!countryCode) {
                console.log(`Country: ${country.properties.name} not found in country manager.`);
                return;
            }
            // If it does exist, print the code
            // console.log(`Country: ${country.properties.name}, Code: ${countryCode}`);
        }
        );

        // Update the map to reflect the color changes
        updateMap(this.countries);
        // Opens the countries.json file then gets rid of data from w. sahara, kosovo, and n. cyprus, antarctica, somaliland then saves it to countries_no_disputed.json
    }
}

