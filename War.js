export class War {
    constructor() {
        this.belligerents = new Set();
    }

    addCountry(country) {
        this.belligerents.add(country);
        country.joinWar(this);
    }

    removeCountry(country) {
        this.belligerents.delete(country);
        country.leaveWar(this);
    }

    hasCountry(country) {
        return this.belligerents.has(country);
    }
}