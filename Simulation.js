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
        }, 30); // Increment every 2 seconds
    }

    stopSimulation() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    initialiseSimulation() {

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

    invade(target) {
        console.log(`${this.name} is invading ${target.name}.`);
        // Determine the probability of the weaker opponent winning
        const winProbability = 0.3; // 30% chance the weaker opponent wins

        if (Math.random() < winProbability) {
            // Weaker opponent wins
            console.log(`${target.name} successfully defended against ${this.name}.`);
            // Reduce the invader's military strength
            this.militaryStrength -= Math.floor(target.militaryStrength / 2);
            if (this.militaryStrength < 0) this.militaryStrength = 0;
        } else {
            // Invader wins
            // Add target's military strength to this country's military strength
            this.militaryStrength += target.militaryStrength;
            // Set target's military strength to zero
            target.militaryStrength = 0;
            // Target is now a vassal of this country
            target.setOverlord(this);
            // Add target's bordering countries to this country's bordering countries
            target.borderingCountries.forEach(country => {
                if (country !== this) { // Avoid adding itself as a bordering country
                    this.borderingCountries.add(country);
                }
            });
        }
    }
}
