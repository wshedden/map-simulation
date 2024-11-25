import { distanceMatrix } from "./CountryManager.js";

class Country {
    static countryCodesArray = "AD,AE,AF,AG,AI,AL,AM,AN,AO,AQ,AR,AS,AT,AU,AW,AZ,BA,BB,BD,BE,BF,BG,BH,BI,BJ,BM,BN,BO,BR,BS,BT,BV,BW,BY,BZ,CA,CC,CD,CF,CG,CH,CI,CK,CL,CM,CN,CO,CR,CU,CV,CX,CY,CZ,DE,DJ,DK,DM,DO,DZ,EC,EE,EG,EH,ER,ES,ET,FI,FJ,FK,FM,FO,FR,GA,GB,GD,GE,GF,GG,GH,GI,GL,GM,GN,GP,GQ,GR,GS,GT,GU,GW,GY,GZ,HK,HM,HN,HR,HT,HU,ID,IE,IL,IM,IN,IO,IQ,IR,IS,IT,JE,JM,JO,JP,KE,KG,KH,KI,KM,KN,KP,KR,KW,KY,KZ,LA,LB,LC,LI,LK,LR,LS,LT,LU,LV,LY,MA,MC,MD,ME,MG,MH,MK,ML,MM,MN,MO,MP,MQ,MR,MS,MT,MU,MV,MW,MX,MY,MZ,NA,NC,NE,NF,NG,NI,NL,NO,NP,NR,NU,NZ,OM,PA,PE,PF,PG,PH,PK,PL,PM,PN,PR,PS,PT,PW,PY,QA,RE,RO,RS,RU,RW,SA,SB,SC,SD,SE,SG,SH,SI,SJ,SK,SL,SM,SN,SO,SR,ST,SV,SY,SZ,TC,TD,TF,TG,TH,TJ,TK,TL,TM,TN,TO,TR,TT,TV,TW,TZ,UA,UG,US,UY,UZ,VA,VC,VE,VG,VI,VN,VU,WF,WS,XK,YE,YT,ZA,ZM,ZW".split(',');
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
        this.overlordMilitaryStrength = 0;
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
        this.militaryStrength -= vassal.militaryStrength / 4;
        vassal.setColor(vassal.getRandomColor());
        this.vassals.delete(vassal);
    }

    setOverlord(overlord) {
        if (this.overlord) {
            this.overlord.removeVassal(this);
        }
        this.overlord = overlord;
        this.overlordMilitaryStrength = overlord.militaryStrength;
        overlord.addVassal(this);
    }

    removeOverlord() {
        if (this.overlord) {
            this.overlord.removeVassal(this);
            this.overlord = null;
            this.isVassal = false;
            this.overlordMilitaryStrength = 0;
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
        this.overlordMilitaryStrength = this.overlord ? this.overlord.militaryStrength : 0;
    }

    printBorderingCountries() {
        console.log(`Bordering countries of ${this.name}:`);
        this.borderingCountries.forEach(country => console.log(country.name));
    }

    makeMove(countryManager) {
        // console.log(`${this.name} is making a move.`);
        // Only invade with very low probability if you are not a vassal
    
        if (!this.isVassal && Math.random() < 0.001) {
            const neighbors = Array.from(this.borderingCountries);
            if (neighbors.length > 0) {
                const target = neighbors[Math.floor(Math.random() * neighbors.length)];
                if (!this.isVassal && target.militaryStrength + target.overlordMilitaryStrength < this.militaryStrength) {
                    this.invade(target);
                }
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
    
        // Check if overlord's military strength falls below 500
        if (this.militaryStrength < 500 && this.vassals.size > 0) {
            this.vassals.forEach(vassal => this.removeVassal(vassal));
            this.vassals.clear();
        }
    
        // Attempt to colonise with a low probability if you have a lot of money
        // if (Math.random() < 0.02 && this.wealth > 5000 && this.militaryStrength > 10000) {
        //     if(this.colonise(countryManager)) {
        //         // If successful
        //         ;
        //     }
        // }
    
        // Check for rare random eventsQ
        if (Math.random() < 0.00005) {
            this.naturalDisaster();
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
        this.wealth = 1000;
    }

    invade(target) {
        // console.log(`${this.name} is invading ${target.name}.`);
        this.militaryStrength += target.militaryStrength / 4;
        this.setPopulation(this.population + target.population * 0.1);
        target.population *= 0.9;
        target.militaryStrength /= 2;
        this.wealth += target.wealth * 0.6;
        target.wealth *= 0.4;
        target.setOverlord(this);
        // Check if distance to target is undefined (use utils.js getDistance which uses country codes)
        // this.getDistance(this.countryCode, target.countryCode) ? this.borderingCountries.add(target) : null;
        // Print distance to target
        // console.log(`Distance to ${target.name}s: ${this.getDistance(this.countryCode, target.countryCode)}`);

        target.borderingCountries.forEach(country => {
            if (country !== this) {
                this.borderingCountries.add(country);
            }
        });
    }

    // colonise(countryManager) {
    //     // console.log(`${this.name} is colonising.`);
    //     // Get a random code until one is weaker than this country
    //     // Get random country 
    //     let target = countryManager.getRandomCountry(t => t.militaryStrength < this.militaryStrength && t !== this);
    //     // If target is null, return
    //     if (!target) return;
    //     // Otherwise invade
    //     // console.log("Successful colonisation!");
    //     this.invade(target);
    //     this.wealth -= 400;
    // }

    naturalDisaster() {
        // console.log(`${this.name} has been hit by a natural disaster!`);
        // Random catastrophe level
        const catastropheLevel = Math.random() * 0.6;
        // Random population loss
        this.population *= 1 - catastropheLevel;
        // Random military strength loss
        this.militaryStrength *= 1 - catastropheLevel;
        // Random wealth loss
        this.wealth *= 1 - catastropheLevel;

        // Randomly lose a vassal
        if (this.vassals.size > 0) {
            const vassalsArray = Array.from(this.vassals);
            const randomVassal = vassalsArray[Math.floor(Math.random() * vassalsArray.length)];
            this.removeVassal(randomVassal);
        }

    }

    getDistance(target) {
        // Search for this country's code in the distance matrix
        const thisIndex = this.getCountryCodeIndex(this.countryCode);
        // Search for the target country's code in the distance matrix
        const targetIndex = this.getCountryCodeIndex(target.countryCode);
        // Get the distance from the matrix
        return distanceMatrix[thisIndex][targetIndex];

    }

    getCountryCodeIndex(countryCode) { // For use in the getDistance method
        const index = Country.countryCodesArray.indexOf(countryCode);
        if (index !== -1) {
            return index; // Return the index if found
        } else {
            console.log(`Country code ${countryCode} not found.`);
            throw new Error("Country code not found."); // Throw an error if not found
        }
    }
}

export { Country };