export class War {
    constructor(faction1, faction2) {
        this.faction1 = faction1;
        this.faction2 = faction2;
    }

    isCountryAtWar(country) {
        return this.faction1.hasMember(country) || this.faction2.hasMember(country);
    }

    getEnemyFaction(country) {
        if (this.faction1.hasMember(country)) {
            return this.faction2;
        } else if (this.faction2.hasMember(country)) {
            return this.faction1;
        }
        return null;
    }
}