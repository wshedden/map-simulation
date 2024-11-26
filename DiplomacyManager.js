// DiplomacyManager.js
class DiplomacyManager {
    constructor() {
        this.countries = new Map(); // e.g., {"US": countryObject}
    }

    addCountry(country) {
        this.countries.set(country.countryCode, country);
    }

    formAlliance(countryCode1, countryCode2) {
        const country1 = this.countries.get(countryCode1);
        const country2 = this.countries.get(countryCode2);
        if (country1 && country2) {
            country1.formAlliance(country2);
        }
    }

    // Other methods...
}

export { DiplomacyManager };