import { Faction } from './Faction.js';
import { War } from './War.js';

// DiplomacyManager.js
export class DiplomacyManager {
    constructor() {
        this.wars = new Set();
        this.alliances = new Map();
        this.factions = new Map();
    }

    updateRelations(country1, country2, change) {
        if (!country1.diplomaticRelations.has(country2.countryCode)) {
            country1.diplomaticRelations.set(country2.countryCode, 0);
        }
        if (!country2.diplomaticRelations.has(country1.countryCode)) {
            country2.diplomaticRelations.set(country1.countryCode, 0);
        }
        country1.diplomaticRelations.set(country2.countryCode, country1.diplomaticRelations.get(country2.countryCode) + change);
        country2.diplomaticRelations.set(country1.countryCode, country2.diplomaticRelations.get(country1.countryCode) + change);

        // Form factions if mutual relations are good
        const mutualRelations = country1.diplomaticRelations.get(country2.countryCode) + country2.diplomaticRelations.get(country1.countryCode);
        if (mutualRelations > 50) {
            this.joinFaction(country1, country2);
        }
    }

    startWar(country1, country2) {
        if (this.areInSameFaction(country1, country2)) {
            console.log(`${country1.name} and ${country2.name} are in the same faction and cannot go to war.`);
            return;
        }

        const faction1 = this.getOrCreateFaction(country1);
        const faction2 = this.getOrCreateFaction(country2);

        faction1.addMember(country1, this);
        faction2.addMember(country2, this);

        const war = new War(faction1, faction2);
        this.wars.add(war);

        country1.joinWar(war);
        country2.joinWar(war);

        console.log(`${country1.name} started a war with ${country2.name}`);
    }

    joinFaction(country1, country2) {
        if (this.areAtWar(country1, country2)) {
            console.log(`${country1.name} and ${country2.name} are at war and cannot join the same faction.`);
            return;
        }

        const faction1 = this.getOrCreateFaction(country1);
        const faction2 = this.getOrCreateFaction(country2);

        if (faction1 !== faction2) {
            console.log(`${country1.name} and ${country2.name} are in different factions and cannot join the same faction.`);
            return;
        }

        faction1.addMember(country2);
        console.log(`${country2.name} joined the faction ${faction1.name} led by ${country1.name}`);
    }

    getOrCreateFaction(country) {
        let faction = this.factions.get(country.countryCode);
        if (!faction) {
            faction = new Faction(this.generateRandomFactionName());
            this.factions.set(country.countryCode, faction);
        }
        return faction;
    }

    generateRandomFactionName() {
        const adjectives = ["Mighty", "Brave", "Noble", "Fierce", "Valiant"];
        const nouns = ["Alliance", "Federation", "Union", "Confederation", "Coalition"];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adjective} ${noun}`;
    }

    areAtWar(country1, country2) {
        for (const war of this.wars) {
            if (war.hasCountry(country1) && war.hasCountry(country2)) {
                return true;
            }
        }
        return false;
    }

    areInSameFaction(country1, country2) {
        for (const faction of this.factions.values()) {
            if (faction.hasMember(country1) && faction.hasMember(country2)) {
                return true;
            }
        }
        return false;
    }

    getAllFactions() {
        return Array.from(this.factions.values());
    }
}