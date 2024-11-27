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
            this.diplomacyManager.updateRelations(this.country, randomCountry, 5);
            const newRelation = this.country.diplomaticRelations.get(randomCountry.countryCode);
            const theirRelation = randomCountry.diplomaticRelations.get(this.country.countryCode);
            if (this.country.name === 'Russia') {
                // console.log(`Russia improved relations with ${randomCountry.name}. New relation: ${newRelation}. Their relation of Russia: ${theirRelation}`);
            }
        }
    }

    startWar() {
        const targetCountry = this.getWeakestBorderingCountry();
        if (targetCountry) {
            const war = new War();
            war.addCountry(this.country);
            war.addCountry(targetCountry);
            console.log(`${this.country.name} started a war with ${targetCountry.name}`);
        }
    }

    allyWithCountry() {
        const randomCountry = this.getRandomBorderingCountry();
        if (randomCountry) {
            const mutualReputation = this.country.diplomaticRelations.get(randomCountry.countryCode) === 100 &&
                                     randomCountry.diplomaticRelations.get(this.country.countryCode) === 100;
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