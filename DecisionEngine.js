export class DecisionEngine {
    static makeDecision(country) {
        console.log(`Making decision for ${country.name}...`);
        
        if (country.aggressionLevel > 5) {
            const target = this.findWeakNeighbor(country);
            if (target) {
                console.log(`${country.name} decides to declare war on ${target.name} due to high aggression level.`);
                country.declareWar(target);
                return;
            }
        }

        if (country.wealth > 1000) {
            const ally = this.findPotentialAlly(country);
            if (ally) {
                console.log(`${country.name} decides to form an alliance with ${ally.name} due to high wealth.`);
                country.formAlliance(ally);
                return;
            }
        }

        if (country.diplomaticRelations.size < 3) {
            const tradePartner = this.findTradePartner(country);
            if (tradePartner) {
                console.log(`${country.name} decides to negotiate trade with ${tradePartner.name} to improve diplomatic relations.`);
                country.negotiateTrade(tradePartner);
                return;
            }
        }

        console.log(`${country.name} decides to do nothing this turn.`);
    }

    static findWeakNeighbor(country) {
        const weakNeighbors = Array.from(country.borderingCountries).filter(neighbor => neighbor.militaryStrength < country.militaryStrength);
        if (weakNeighbors.length > 0) {
            return weakNeighbors[Math.floor(Math.random() * weakNeighbors.length)];
        }
        return null;
    }

    static findPotentialAlly(country) {
        const potentialAllies = Array.from(country.borderingCountries).filter(neighbor => !country.allies.has(neighbor));
        if (potentialAllies.length > 0) {
            return potentialAllies[Math.floor(Math.random() * potentialAllies.length)];
        }
        return null;
    }

    static findTradePartner(country) {
        const potentialPartners = Array.from(country.borderingCountries).filter(neighbor => !country.diplomaticRelations.has(neighbor.countryCode));
        if (potentialPartners.length > 0) {
            return potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
        }
        return null;
    }
}