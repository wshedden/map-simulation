import { refreshMap, updateMap } from './map.js';
import { colorScale } from './utils.js';

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
            // Perform any necessary updates for each country
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
        refreshMap(this.countries, this.countryManager);
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
        if (this.numDays % 20 === 0) {
            console.log(`Day ${this.numDays}`);
        }
    }

    runSimulation() {
        this.initialiseSimulation();
        this.updateCountries();
        this.updateRankingTable();
        this.interval = setInterval(() => {
            this.numDays++;
            this.runTimestep();
            this.updateCountries();
        }, 100); // Increment every second
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
            country.makeMove();
        });
        this.updateCountries();
    }

    invade(target) {
        const winProbability = 0.3; // 30% chance the weaker opponent wins

        if (Math.random() < winProbability) {
            console.log(`${target.name} successfully defended against ${this.name}.`);
            this.militaryStrength -= Math.floor(target.militaryStrength / 2);
            if (this.militaryStrength < 0) this.militaryStrength = 0;
        } else {
            this.militaryStrength += target.militaryStrength;
            target.militaryStrength = 0;
            target.setOverlord(this);
            target.borderingCountries.forEach(country => {
                if (country !== this) {
                    this.borderingCountries.add(country);
                }
            });
        }
    }

    updateRankingTable() {
        const countries = this.countryManager.getAllCountries();
        countries.sort((a, b) => b.wealth - a.wealth);
    
        const tbody = d3.select("#ranking-table tbody");
        const rows = tbody.selectAll("tr").data(countries, d => d.countryCode);
    
        const rowsEnter = rows.enter().append("tr");
        rowsEnter.append("td").attr("class", "rank");
        rowsEnter.append("td").attr("class", "country");
        rowsEnter.append("td").attr("class", "wealth");
        rowsEnter.append("td").attr("class", "military-strength");
        rowsEnter.append("td").attr("class", "population");
        rowsEnter.append("td").attr("class", "vassals");
        rowsEnter.append("td").attr("class", "land-area");
        rowsEnter.append("td").attr("class", "ally-symbol");
    
        const rowsUpdate = rowsEnter.merge(rows);
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
        rowsUpdate.select(".ally-symbol").html(d => {
            const us = this.countryManager.getCountryByCode("US");
            const canada = this.countryManager.getCountryByCode("CA");
            if ((d.countryCode === "US" && us.allies.has(canada)) || (d.countryCode === "CA" && canada.allies.has(us))) {
                return '<span class="ally-symbol">🤝</span>';
            }
            return '';
        });
    
        rows.exit().remove();
    }
}
