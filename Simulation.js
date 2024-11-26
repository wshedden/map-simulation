import { updateMap } from './map.js';
import { colorScale } from './utils.js';
import { topoJsonNameToCode, checkMissingCountriesFromBorderCSV } from './data.js';
import { svg } from './map.js';
import { updateCountryProperty } from './countryUtils.js';

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
        // If day is multiple of 20 say so
        if (this.numDays % 20 === 0) {
            console.log(`Day ${this.numDays}`);
        }
    }

    runSimulation() {
        // Logic to run the entire simulation
        // This could involve running multiple timesteps, updating the display, etc.
        this.initialiseSimulation();
        this.updateCountries();
        this.updateRankingTable();
        this.interval = setInterval(() => {
            this.numDays++;
            this.runTimestep();
            this.updateCountries();
        }, 500); // Increment every 0.5 seconds
    }

    stopSimulation() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    initialiseSimulation() {
        updateMap(this.countries);
    }

    processTurn() {
        const countries = this.countryManager.getAllCountries();
        countries.forEach(country => {
            country.makeMove(this.countryManager);
        });
        this.updateCountries();
    }

    invade(target) {
        // console.log(`${this.name} is invading ${target.name}.`);
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

    updateRankingTable() {
        const countries = this.countryManager.getAllCountries();
        // Sort by rank (wealth)
        countries.sort((a, b) => b.wealth - a.wealth);
    
        const tbody = d3.select("#ranking-table tbody");
    
        // Bind the sorted data
        const rows = tbody.selectAll("tr")
            .data(countries, d => d.countryCode);
    
        // Enter new rows
        const rowsEnter = rows.enter().append("tr");
    
        rowsEnter.append("td").attr("class", "rank");
        rowsEnter.append("td").attr("class", "country");
        rowsEnter.append("td").attr("class", "wealth");
        rowsEnter.append("td").attr("class", "military-strength");
        rowsEnter.append("td").attr("class", "population");
        rowsEnter.append("td").attr("class", "vassals");
        rowsEnter.append("td").attr("class", "land-area");
    
        // Update existing rows
        const rowsUpdate = rowsEnter.merge(rows);
    
        // Reorder and style rows
        rowsUpdate.order()
            .transition()
            .duration(500)
            .style("background-color", (d, i) => i % 2 === 0 ? "#f9f9f9" : "#fff");
    
        rowsUpdate.select(".rank").text((d, i) => i + 1);
        rowsUpdate.select(".country").text(d => d.name);
        rowsUpdate.select(".wealth").text(d => d.wealth.toLocaleString());
        rowsUpdate.select(".military-strength").text(d => d.militaryStrength.toLocaleString());
        rowsUpdate.select(".population").text(d => d.population.toLocaleString());
        rowsUpdate.select(".vassals").text(d => Array.isArray(d.vassals) ? d.vassals.map(v => v.name).join(", ") : "");
        rowsUpdate.select(".land-area").text("N/A");
    
        // Remove old rows
        rows.exit().remove();
    }
    
}
