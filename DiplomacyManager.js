import { Faction } from './Faction.js';
import { War } from './War.js';

// DiplomacyManager.js
export class DiplomacyManager {
    constructor() {
        this.alliances = new Map();
        this.wars = new Set();
        this.factions = new Map();
        this.allianceLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.allianceColors = ['blue', 'red', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'grey', 'cyan'];
        this.usedLetters = new Set();
        this.usedColors = new Set();
    }

    generateUniqueAllianceProperties() {
        let letter = null;
        let color = null;

        for (let i = 0; i < this.allianceLetters.length; i++) {
            if (!this.usedLetters.has(this.allianceLetters[i])) {
                letter = this.allianceLetters[i];
                this.usedLetters.add(letter);
                break;
            }
        }

        for (let i = 0; i < this.allianceColors.length; i++) {
            if (!this.usedColors.has(this.allianceColors[i])) {
                color = this.allianceColors[i];
                this.usedColors.add(color);
                break;
            }
        }

        console.log(`Generated alliance properties: letter=${letter}, color=${color}`);
        return { letter, color };
    }

    addAlliance(country1, country2) {
        if (!this.alliances.has(country1)) {
            this.alliances.set(country1, new Set());
        }
        this.alliances.get(country1).add(country2);

        if (!this.alliances.has(country2)) {
            this.alliances.set(country2, new Set());
        }
        this.alliances.get(country2).add(country1);

        const { letter, color } = this.generateUniqueAllianceProperties();
        country1.allianceLetter = letter;
        country1.allianceColor = color;
        country2.allianceLetter = letter;
        country2.allianceColor = color;

        console.log(`Assigned alliance properties to countries: country1=${country1.name}, country2=${country2.name}, letter=${letter}, color=${color}`);
    }

    removeAlliance(country1, country2) {
        if (this.alliances.has(country1)) {
            this.alliances.get(country1).delete(country2);
        }
        if (this.alliances.has(country2)) {
            this.alliances.get(country2).delete(country1);
        }
    }

    hasAlliance(country1, country2) {
        return this.alliances.has(country1) && this.alliances.get(country1).has(country2);
    }

    createFaction(name) {
        const faction = new Faction(name);
        this.factions.set(name, faction);
        return faction;
    }

    startWar(faction1, faction2) {
        const war = new War(faction1, faction2);
        this.wars.add(war);
    }

    isCountryAtWar(country) {
        for (const war of this.wars) {
            if (war.isCountryAtWar(country)) {
                return true;
            }
        }
        return false;
    }

    getEnemyFaction(country) {
        for (const war of this.wars) {
            const enemyFaction = war.getEnemyFaction(country);
            if (enemyFaction) {
                return enemyFaction;
            }
        }
        return null;
    }
}