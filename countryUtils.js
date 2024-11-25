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