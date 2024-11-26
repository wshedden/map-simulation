// DecisionEngine.js
export class DecisionEngine {
    constructor(country, countryManager, diplomacyManager) {
        this.country = country;
        this.countryManager = countryManager;
        this.diplomacyManager = null;
    }

    makeDecision() {
        // Example decision logic
        if (this.country.wealth > 1000) {
            this.increaseMilitaryStrength();
        } else {
            this.increaseWealth();
        }

        this.handleDiplomacy();
    }

    increaseMilitaryStrength() {
        this.country.militaryStrength += 100;
        console.log(`${this.country.name} increased military strength to ${this.country.militaryStrength}`);
    }

    increaseWealth() {
        this.country.wealth += 100;
        console.log(`${this.country.name} increased wealth to ${this.country.wealth}`);
    }

    handleDiplomacy() {
        // Find random neighbour
        const neighbours = this.country.borderingCountries;
        // Set the ally of this country to the US 
        const us = this.countryManager.getCountryByCode("US");
        this.country.addAlly(us);
        // Update the map
    }
}