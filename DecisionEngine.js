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
        } else {
            this.improveRelationsWithCountry();
        }
    }

    focusOnEconomy() {
        this.country.wealth += 20;
        if (this.country.name === 'Russia') {
            console.log(`Russia's new wealth: ${this.country.wealth}`);
        }
    }

    focusOnMilitary() {
        this.country.militaryStrength += 20;
        if (this.country.name === 'Russia') {
            console.log(`Russia's new military strength: ${this.country.militaryStrength}`);
        }
    }

    improveRelationsWithCountry() {
        const randomCountry = this.getRandomBorderingCountry();
        if (randomCountry) {
            this.country.diplomaticRelations[randomCountry.countryCode] = 
                (this.country.diplomaticRelations[randomCountry.countryCode] || 0) + 5;
            const newReputation = this.country.diplomaticRelations[randomCountry.countryCode];
            const theirReputation = randomCountry.diplomaticRelations[this.country.countryCode] || 0;
            if (this.country.name === 'Russia') {
                console.log(`Russia improved relations with ${randomCountry.name}. New reputation: ${newReputation}. Their reputation of Russia: ${theirReputation}`);
            }
        }
    }

    startWarWithCountry() {
        const weakestCountry = this.getWeakestBorderingCountry();
        if (weakestCountry) {
            const faction = this.diplomacyManager.createFaction(`${this.country.name}-Faction`);
            faction.addMember(this.country);
            this.diplomacyManager.startWar(faction, this.diplomacyManager.createFaction('Enemy-Faction'));
            if (this.country.name === 'Russia') {
                console.log(`Russia started a war with ${weakestCountry.name}`);
            }
        }
    }

    allyWithCountry() {
        const randomCountry = this.getRandomBorderingCountry();
        if (randomCountry) {
            const mutualReputation = this.country.diplomaticRelations.get(randomCountry.countryCode) >= 10 &&
                                     randomCountry.diplomaticRelations.get(this.country.countryCode) >= 10;
            if (mutualReputation) {
                this.country.addAlly(randomCountry);
                this.diplomacyManager.addAlliance(this.country, randomCountry);
                if (this.country.name === 'Russia') {
                    console.log(`Russia allied with ${randomCountry.name}. Mutual reputation: ${this.country.diplomaticRelations.get(randomCountry.countryCode)}`);
                }
            } else if (this.country.name === 'Russia') {
                console.log(`Russia cannot ally with ${randomCountry.name} due to low mutual reputation`);
            }
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