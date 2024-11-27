// War.js
export class War {
    constructor(country1, country2) {
        if (!country1 || !country2) {
            throw new Error("Both countries must be defined to start a war.");
        }

        this.country1 = country1;
        this.country2 = country2;
        this.isActive = true;
    }

    hasCountry(country) {
        return this.country1 === country || this.country2 === country;
    }

    endWar() {
        this.isActive = false;
        this.country1.leaveWar(this);
        this.country2.leaveWar(this);
    }

    resolveBattle() {
        const getEffectiveStrength = (country) => {
            let effectiveStrength = country.militaryStrength;
            if (country.overlord) {
                effectiveStrength += country.overlord.militaryStrength;
            }
            return effectiveStrength;
        };

        const totalStrength = getEffectiveStrength(this.country1) + getEffectiveStrength(this.country2);
        const winProbability = getEffectiveStrength(this.country1) / totalStrength;
        const winner = Math.random() < winProbability ? this.country1 : this.country2;
        const loser = winner === this.country1 ? this.country2 : this.country1;

        const allocatedStrength = Math.min(winner.militaryStrength, loser.militaryStrength);
        loser.militaryStrength -= Math.floor(allocatedStrength / 5); // Increased impact on military strength
        if (loser.militaryStrength < 0) loser.militaryStrength = 0;

        winner.militaryStrength -= Math.floor(allocatedStrength / 10); // Increased impact on military strength
        if (winner.militaryStrength < 0) winner.militaryStrength = 0;

        winner.warExhaustion += Math.floor(allocatedStrength / 25); // Increased impact on war exhaustion
        loser.warExhaustion += Math.floor(allocatedStrength / 15); // Increased impact on war exhaustion

        console.log(`Battle resolved: Winner - ${winner.name}, Loser - ${loser.name}`);
        console.log(`Winner's military strength: ${winner.militaryStrength}, War exhaustion: ${winner.warExhaustion}`);
        console.log(`Loser's military strength: ${loser.militaryStrength}, War exhaustion: ${loser.warExhaustion}`);

        if (loser.warExhaustion >= 100 || loser.militaryStrength === 0) {
            loser.setOverlord(winner);
            this.endWar();
        }

        return winner;
    }
}