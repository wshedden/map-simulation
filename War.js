export class War {
    constructor(faction1, faction2) {
        if (!faction1 || !faction2) {
            throw new Error("Both factions must be defined to start a war.");
        }

        this.faction1 = faction1;
        this.faction2 = faction2;
        this.belligerents = new Set([...faction1.members, ...faction2.members]);
        this.isActive = true;
    }

    addCountry(country) {
        this.belligerents.add(country);
        country.joinWar(this);
    }

    removeCountry(country) {
        if (this.belligerents.has(country)) {
            this.belligerents.delete(country);
            country.leaveWar(this);
        }
    }

    hasCountry(country) {
        return this.belligerents.has(country);
    }

    getEnemyFaction(country) {
        if (this.faction1.hasMember(country)) {
            return this.faction2;
        } else if (this.faction2.hasMember(country)) {
            return this.faction1;
        }
        return null;
    }

    endWar() {
        this.isActive = false;
        this.belligerents.forEach(country => country.leaveWar(this));
        this.belligerents.clear();
    }

    resolveBattle(country1, country2) {
        const totalStrength = country1.militaryStrength + country2.militaryStrength;
        const winProbability = country1.militaryStrength / totalStrength;
        const winner = Math.random() < winProbability ? country1 : country2;
        const loser = winner === country1 ? country2 : country1;

        const allocatedStrength = Math.min(winner.militaryStrength, loser.militaryStrength);
        loser.militaryStrength -= Math.floor(allocatedStrength / 2);
        if (loser.militaryStrength < 0) loser.militaryStrength = 0;

        winner.warExhaustion += Math.floor(allocatedStrength / 20);
        loser.warExhaustion += Math.floor(allocatedStrength / 10);

        console.log(`Battle resolved: Winner - ${winner.name}, Loser - ${loser.name}`);
        console.log(`Winner's military strength: ${winner.militaryStrength}, War exhaustion: ${winner.warExhaustion}`);
        console.log(`Loser's military strength: ${loser.militaryStrength}, War exhaustion: ${loser.warExhaustion}`);

        if (loser.warExhaustion >= 100) {
            this.removeCountry(loser);
            loser.setOverlord(winner);
        }

        if (this.belligerents.size === 1) {
            this.endWar();
        }

        return winner;
    }
}