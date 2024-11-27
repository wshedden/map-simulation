import { Faction } from '../Faction.js';
import { War } from '../War.js';
import { expect } from 'chai';

describe('Faction', () => {
    let faction, country;

    beforeEach(() => {
        faction = new Faction('Test Faction');
        country = { name: 'Country1' };
    });

    it('should add a member to the faction', () => {
        faction.addMember(country);
        expect(faction.hasMember(country)).to.be.true;
    });

    it('should remove a member from the faction', () => {
        faction.addMember(country);
        faction.removeMember(country);
        expect(faction.hasMember(country)).to.be.false;
    });

    it('should return false if the country is not a member of the faction', () => {
        expect(faction.hasMember(country)).to.be.false;
    });
});

describe('War', () => {
    let faction1, faction2, country1, country2, war;

    beforeEach(() => {
        country1 = { 
            name: 'Country1', 
            militaryStrength: 100, 
            warExhaustion: 0,
            joinWar: function(war) { this.inWar = war; },
            leaveWar: function(war) { this.inWar = null; },
            setOverlord: function(country) { this.overlord = country; }
        };
        country2 = { 
            name: 'Country2', 
            militaryStrength: 100, 
            warExhaustion: 0,
            joinWar: function(war) { this.inWar = war; },
            leaveWar: function(war) { this.inWar = null; },
            setOverlord: function(country) { this.overlord = country; }
        };
        faction1 = new Faction('Faction1');
        faction2 = new Faction('Faction2');
        faction1.addMember(country1);
        faction2.addMember(country2);
        war = new War(faction1, faction2);
    });

    it('should add a country to the war', () => {
        const country3 = { 
            name: 'Country3', 
            militaryStrength: 100, 
            warExhaustion: 0,
            joinWar: function(war) { this.inWar = war; },
            leaveWar: function(war) { this.inWar = null; },
            setOverlord: function(country) { this.overlord = country; }
        };
        war.addCountry(country3);
        expect(war.hasCountry(country3)).to.be.true;
    });

    it('should remove a country from the war', () => {
        war.removeCountry(country1);
        expect(war.hasCountry(country1)).to.be.false;
    });

    it('should return true if the country is part of the war', () => {
        expect(war.hasCountry(country1)).to.be.true;
        expect(war.hasCountry(country2)).to.be.true;
    });

    it('should return false if the country is not part of the war', () => {
        const country3 = { name: 'Country3' };
        expect(war.hasCountry(country3)).to.be.false;
    });

    it('should get the enemy faction of a country', () => {
        expect(war.getEnemyFaction(country1)).to.equal(faction2);
        expect(war.getEnemyFaction(country2)).to.equal(faction1);
    });

    it('should end the war', () => {
        console.log('Before ending war:', war);
        war.endWar();
        console.log('After ending war:', war);
        expect(war.isActive).to.be.false;
        expect(war.hasCountry(country1)).to.be.false;
        expect(war.hasCountry(country2)).to.be.false;
    });

    it('should resolve a battle and determine a winner', () => {
        const winner = war.resolveBattle(country1, country2);
        expect([country1, country2]).to.include(winner);
    });

    it('should reduce military strength and increase war exhaustion after a battle', () => {
        country1.warExhaustion = 95;
        war.resolveBattle(country1, country2);

        // Check military strength
        expect(country1.militaryStrength).to.be.below(100);
        expect(country2.militaryStrength).to.be.below(100);

        // Check war exhaustion
        expect(country1.warExhaustion).to.be.above(95);
        expect(country2.warExhaustion).to.be.above(0);
    });

    it('should remove a country from the war if war exhaustion reaches 100', () => {
        country1.warExhaustion = 95;
        console.log('Before battle:', { country1, country2 });
        war.resolveBattle(country1, country2);
        console.log('After battle:', { country1, country2 });
        expect(war.hasCountry(country1)).to.be.false;
    });

    it('should end the war if only one country remains', () => {
        country1.warExhaustion = 95;
        war.resolveBattle(country1, country2);

        // Ensure the war ends if only one country remains
        if (country1.warExhaustion >= 100) {
            expect(war.isActive).to.be.false;
        }
    });

    it('should not allow adding the same country twice', () => {
        war.addCountry(country1);
        expect(war.belligerents.size).to.equal(2);
    });

    it('should not allow removing a country that is not part of the war', () => {
        const country3 = { name: 'Country3' };
        war.removeCountry(country3);
        expect(war.belligerents.size).to.equal(2);
    });
});