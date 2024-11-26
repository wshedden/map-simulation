// countryUtils.js
export function updateCountryProperty(country, countryManager, property, value) {
    if (!country || !countryManager) {
        console.error("Invalid country or countryManager");
        return;
    }

    if (country.hasOwnProperty(property)) {
        country[property] = value;
        console.log(`Updated ${property} for ${country.name} to ${value}`);
    } else {
        console.error(`Property ${property} does not exist on country ${country.name}`);
    }
}

class CountryDecision {
    static makeMove(country, increaseWealth) {
        country.wealth -= country.vassals.size; // Decrease wealth based on the number of vassals

        if (country.wealth <= 0) {
            country.goBankrupt();
        } else {
            // Increase wealth proportional to population
            country.wealth += country.population / 100;
        }

        // Increase military strength based on vassal status
        if (country.isVassal) {
            country.militaryStrength *= 1.005; // Increase by 0.5%
        } else {
            country.militaryStrength *= 1.02; // Increase by 2%
        }

        // Check if overlord's military strength falls below 500
        if (country.militaryStrength < 500 && country.vassals.size > 0) {
            country.vassals.forEach(vassal => country.removeVassal(vassal));
            country.vassals.clear();
        }

        // Check for rare random events
        if (Math.random() < 0.00005) {
            country.naturalDisaster();
        }

        // Binary choice to increase wealth or military strength
        if (increaseWealth) {
            country.wealth += 100; // Increase wealth
        } else {
            country.militaryStrength += 100; // Increase military strength
        }
    }
}

export { CountryDecision };