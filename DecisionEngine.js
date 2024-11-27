import { Faction } from './Faction.js';
import { War } from './War.js';

export class DecisionEngine {
    constructor(country, countryManager, diplomacyManager) {
        this.country = country;
        this.countryManager = countryManager;
        this.diplomacyManager = diplomacyManager;
    }

    makeDecision() {
        if (this.country.wealth < 500) {
            this.focusOnEconomy();
        } else if (this.country.militaryStrength < 200) {
            this.focusOnMilitary();
        } else if (!this.country.isAtWar()) {
            this.startWar();
        } else {
            this.improveRelationsWithCountry();
        }
    }

    focusOnEconomy() {
        this.country.wealth += 20;
    }

    focusOnMilitary() {
        this.country.militaryStrength += 20;
    }

    improveRelationsWithCountry() {
        const randomCountry = this.getRandomBorderingCountry();
        if (randomCountry) {
            this.diplomacyManager.updateRelations(this.country, randomCountry, 5);
        }
    }

    startWar() {
        const targetCountry = this.getWeakestBorderingCountry();
        if (targetCountry) {
            this.diplomacyManager.startWar(this.country, targetCountry);
            console.log(`${this.country.name} started a war with ${targetCountry.name}`);
        }
    }

    getRandomBorderingCountry() {
        const neighbours = Array.from(this.country.borderingCountries);
        if (neighbours.length === 0) {
            return null;
        }
        return neighbours[Math.floor(Math.random() * neighbours.length)];
    }

    getWeakestBorderingCountry() {
        const neighbours = Array.from(this.country.borderingCountries);
        if (neighbours.length === 0) {
            return null;
        }
        return neighbours.reduce((weakest, current) => 
            current.militaryStrength < weakest.militaryStrength ? current : weakest
        );
    }
}