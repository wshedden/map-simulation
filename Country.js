class Country {
    constructor(name) {
        this.name = name;
        this.ruler = null;
        this.vassals = new Set();
        this.overlord = null;
        this.isVassal = false;
        this.countryCode = null;
        this.population = 0;
        this.militaryStrength = 0;
        this.wealth = 0;
        this.borderingCountries = new Set();
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    setColor(color) {
        this.color = color;
    }

    addVassal(vassal) {
        if (vassal.overlord) {
            vassal.overlord.removeVassal(vassal);
        }
        vassal.overlord = this;
        vassal.isVassal = true;
        vassal.setColor(this.color); // Set vassal's color to overlord's color
        this.vassals.add(vassal);
    }

    removeVassal(vassal) {
        vassal.overlord = null;
        vassal.isVassal = false;
        vassal.setColor(vassal.getRandomColor()); // Reset vassal's color to a random color
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
            this.setColor(this.getRandomColor()); // Reset color to a random color
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

export { Country};