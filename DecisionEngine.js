// DecisionEngine.js
export class DecisionEngine {
    constructor(country, countryManager, diplomacyManager) {
        this.country = country;
        this.countryManager = countryManager;
        this.diplomacyManager = diplomacyManager;
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
        // Pick a random neighbour from the set
        if(this.country.borderingCountries.size === 0) {
            return;
        }
        const neighbours = Array.from(this.country.borderingCountries);
        const randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
+       randomNeighbour.addAlly(this.country);        
    }
}