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
            if (Math.random() < 0.5) {
                this.startWar();
            } else {
                this.colonize();
            }
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
            // console.log(`${this.country.name} started a war with ${targetCountry.name}`);
        }
    }

    colonize() {
        const targetCountry = this.getWeakestOverseasCountry();
        if (targetCountry) {
            this.diplomacyManager.startWar(this.country, targetCountry);
            this.country.wealth -= 100; // More expensive than a normal war
            // console.log(`${this.country.name} started a colonization war with ${targetCountry.name}`);
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

    getWeakestOverseasCountry() {
        const allCountries = Array.from(this.countryManager.countryMap.values());
        const overseasCountries = allCountries.filter(c => !this.country.borderingCountries.has(c));
        if (overseasCountries.length === 0) {
            return null;
        }
        return overseasCountries.reduce((weakest, current) => 
            current.militaryStrength < weakest.militaryStrength ? current : weakest
        );
    }
}