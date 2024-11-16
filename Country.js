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
        this.topoJsonObject = null;
        this.hasHalvedStrength = false; // Track if military strength has been halved
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    setMilitaryStrength(militaryStrength) {
        this.militaryStrength = militaryStrength;
    }

    setColor(color) {
        this.color = color;
        if (this.topoJsonObject) {
            this.topoJsonObject.properties.Color = color;
        }
    }

    addVassal(vassal) {
        if (vassal.overlord) {
            vassal.overlord.removeVassal(vassal);
        }
        vassal.vassals.forEach(subVassal => {
            subVassal.overlord = this;
            subVassal.setColor(this.color);
            this.vassals.add(subVassal);
        });
        vassal.vassals.clear();
        vassal.overlord = this;
        vassal.isVassal = true;
        vassal.setColor(this.color);
        this.vassals.add(vassal);
    }

    setTopoJsonObject(topoJsonObject) {
        this.topoJsonObject = topoJsonObject;
    }

    removeVassal(vassal) {
        vassal.overlord = null;
        vassal.isVassal = false;
        vassal.setColor(vassal.getRandomColor());
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
            this.setColor(this.getRandomColor());
        }
    }

    setCountryCode(code) {
        this.countryCode = code;
    }

    setPopulation(population) {
        this.population = population;
        this.updateMilitaryStrength();
    }

    setWealth(wealth) {
        this.wealth = wealth;
        this.updateMilitaryStrength();
    }

    updateMilitaryStrength() {
        this.militaryStrength = this.population / 1000000 + this.wealth / 100;
    }

    printBorderingCountries() {
        console.log(`Bordering countries of ${this.name}:`);
        this.borderingCountries.forEach(country => console.log(country.name));
    }

    makeMove() {
        // console.log(`${this.name} is making a move.`);
        const neighbors = Array.from(this.borderingCountries);
        if (neighbors.length > 0) {
            const target = neighbors[Math.floor(Math.random() * neighbors.length)];
            if(!this.isVassal && target.militaryStrength < this.militaryStrength) {
                this.invade(target);
            }
        }
        this.wealth -= this.vassals.size; // Decrease wealth based on the number of vassals

        if (this.wealth <= 0) {
            this.goBankrupt();
        } else {
            // Increase wealth proportional to population
            this.wealth += this.population / 100000000;
        }

        // Increase military strength based on vassal status
        if (this.isVassal) {
            this.militaryStrength *= 1.005; // Increase by 0.5%
        } else {
            this.militaryStrength *= 1.02; // Increase by 2%
        }
    }

    goBankrupt() {
        // console.log(`${this.name} has gone bankrupt.`);
        this.vassals.forEach(vassal => this.removeVassal(vassal));
        this.vassals.clear();
        if (!this.hasHalvedStrength) {
            this.militaryStrength /= 2;
            this.hasHalvedStrength = true;
        }
    }

    invade(target) {
        console.log(`${this.name} is invading ${target.name}.`);
        this.militaryStrength += target.militaryStrength / 4;
        target.militaryStrength /= 2;
        this.wealth += target.wealth * 0.6;
        target.wealth *= 0.4;
        target.setOverlord(this);
        target.borderingCountries.forEach(country => {
            if (country !== this) {
                this.borderingCountries.add(country);
            }
        });
    }
}

export { Country };