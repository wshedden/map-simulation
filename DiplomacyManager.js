import { War } from './War.js';

// DiplomacyManager.js
export class DiplomacyManager {
    constructor() {
        this.wars = new Set();
        this.alliances = new Map();
    }

    updateRelations(country1, country2, change) {
        if (this.areAtWar(country1, country2)) {
            console.log("Cannot improve relations while at war.");
            return;
        }

        if (!country1.diplomaticRelations.has(country2.countryCode)) {
            country1.diplomaticRelations.set(country2.countryCode, 0);
        }
        if (!country2.diplomaticRelations.has(country1.countryCode)) {
            country2.diplomaticRelations.set(country1.countryCode, 0);
        }
        country1.diplomaticRelations.set(country2.countryCode, country1.diplomaticRelations.get(country2.countryCode) + change);
        country2.diplomaticRelations.set(country1.countryCode, country2.diplomaticRelations.get(country1.countryCode) + change);
    }

    startWar(country1, country2) {
        if (country1.isVassal || country2.isVassal) {
            console.log("Vassal countries cannot start wars.");
            return;
        }

        if (this.areAtWar(country1, country2)) {
            // console.log(`${country1.name} and ${country2.name} are already at war.`);
            return;
        }

        const war = new War(country1, country2);
        this.wars.add(war);

        country1.joinWar(war);
        country2.joinWar(war);

        // console.log(`${country1.name} started a war with ${country2.name}`);
    }

    areAtWar(country1, country2) {
        for (const war of this.wars) {
            if (war.hasCountry(country1) && war.hasCountry(country2)) {
                return true;
            }
        }
        return false;
    }

    getAllWars() {
        return Array.from(this.wars);
    }
}