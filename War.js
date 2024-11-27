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
        const totalStrength = this.country1.militaryStrength + this.country2.militaryStrength;
        const winProbability = this.country1.militaryStrength / totalStrength;
        const winner = Math.random() < winProbability ? this.country1 : this.country2;
        const loser = winner === this.country1 ? this.country2 : this.country1;

        const allocatedStrength = Math.min(winner.militaryStrength, loser.militaryStrength);
        loser.militaryStrength -= Math.floor(allocatedStrength / 2);
        if (loser.militaryStrength < 0) loser.militaryStrength = 0;

        winner.militaryStrength -= Math.floor(allocatedStrength / 4);
        if (winner.militaryStrength < 0) winner.militaryStrength = 0;

        winner.warExhaustion += Math.floor(allocatedStrength / 5);
        loser.warExhaustion += Math.floor(allocatedStrength / 3);

        // Degrade reputation more severely
        winner.diplomaticRelations.forEach((value, key) => {
            winner.diplomaticRelations.set(key, value - 10);
        });
        loser.diplomaticRelations.forEach((value, key) => {
            loser.diplomaticRelations.set(key, value - 10);
        });

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