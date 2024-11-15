class Country {
    constructor(name) {
        this.name = name;
        this.ruler = null; // The ruler of this country
        this.vassals = new Set(); // Set of vassal countries
        this.overlord = null; // The overlord of this country
        this.isVassal = false; // Boolean indicating if this country is a vassal
        this.countryCode = null; // Country code
        this.population = 0; // Population
        this.militaryStrength = 0; // Military strength
        this.wealth = 0; // Wealth
    }

    setRuler(ruler) {
        this.ruler = ruler;
    }

    addVassal(vassal) {
        if (vassal.overlord) {
            vassal.overlord.removeVassal(vassal);
        }
        vassal.overlord = this;
        vassal.isVassal = true;
        this.vassals.add(vassal);
    }

    removeVassal(vassal) {
        vassal.overlord = null;
        vassal.isVassal = false;
        this.vassals.delete(vassal);
    }

    setOverlord(overlord) {
        if (this.overlord) {
            this.overlord.removeVassal(this);
        }
        overlord.addVassal(this);
    }

    removeOverlord() {
        if (this.overlord) {
            this.overlord.removeVassal(this);
            this.overlord = null;
            this.isVassal = false;
        }
    }

    setCountryCode(code) {
        this.countryCode = code;
    }

    setPopulation(population) {
        this.population = population;
    }

    setMilitaryStrength(strength) {
        this.militaryStrength = strength;
    }

    setWealth(wealth) {
        this.wealth = wealth;
    }
}

// Map to store all countries by their name
const countryMap = new Map();

// Example usage:
const countryA = new Country("CountryA");
const countryB = new Country("CountryB");
const countryC = new Country("CountryC");

countryA.setRuler("RulerA");
countryB.setRuler("RulerB");
countryC.setRuler("RulerC");

countryA.addVassal(countryB);
countryB.setOverlord(countryC); // This will automatically update the relationships

countryMap.set(countryA.name, countryA);
countryMap.set(countryB.name, countryB);
countryMap.set(countryC.name, countryC);