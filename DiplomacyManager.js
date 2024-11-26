// DiplomacyManager.js
export class DiplomacyManager {
    constructor() {
        this.alliances = new Map();
        this.wars = new Map(); // Wars have string key and belligerent set value
    }

    addAlliance(country1, country2) {
        if (!this.alliances.has(country1)) {
            this.alliances.set(country1, new Set());
        }
        this.alliances.get(country1).add(country2);
    }

    removeAlliance(country1, country2) {
        if (this.alliances.has(country1)) {
            this.alliances.get(country1).delete(country2);
        }
    }

    hasAlliance(country1, country2) {
        return this.alliances.has(country1) && this.alliances.get(country1).has(country2);
    }

}