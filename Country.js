class Country {
    static countryCodesArray = "AD,AE,AF,AG,AI,AL,AM,AN,AO,AQ,AR,AS,AT,AU,AW,AZ,BA,BB,BD,BE,BF,BG,BH,BI,BJ,BM,BN,BO,BR,BS,BT,BV,BW,BY,BZ,CA,CC,CD,CF,CG,CH,CI,CK,CL,CM,CN,CO,CR,CU,CV,CX,CY,CZ,DE,DJ,DK,DM,DO,DZ,EC,EE,EG,EH,ER,ES,ET,FI,FJ,FK,FM,FO,FR,GA,GB,GD,GE,GF,GG,GH,GI,GL,GM,GN,GP,GQ,GR,GS,GT,GU,GW,GY,GZ,HK,HM,HN,HR,HT,HU,ID,IE,IL,IM,IN,IO,IQ,IR,IS,IT,JE,JM,JO,JP,KE,KG,KH,KI,KM,KN,KP,KR,KW,KY,KZ,LA,LB,LC,LI,LK,LR,LS,LT,LU,LV,LY,MA,MC,MD,ME,MG,MH,MK,ML,MM,MN,MO,MP,MQ,MR,MS,MT,MU,MV,MW,MX,MY,MZ,NA,NC,NE,NF,NG,NI,NL,NO,NP,NR,NU,NZ,OM,PA,PE,PF,PG,PH,PK,PL,PM,PN,PR,PS,PT,PW,PY,QA,RE,RO,RS,RU,RW,SA,SB,SC,SD,SE,SG,SH,SI,SJ,SK,SL,SM,SN,SO,SR,ST,SV,SY,SZ,TC,TD,TF,TG,TH,TJ,TK,TL,TM,TN,TO,TR,TT,TV,TW,TZ,UA,UG,US,UY,UZ,VA,VC,VE,VG,VI,VN,VU,WF,WS,XK,YE,YT,ZA,ZM,ZW".split(',');

    constructor(name) {
        this.name = name;
        this.vassals = new Set();
        this.overlord = null;
        this.isVassal = false;
        this.countryCode = null;
        this.population = 0;
        this.militaryStrength = 0;
        this.wealth = 0;
        this.borderingCountries = new Set();
        this.allies = new Set(); // Add allies set
        this.color = this.getRandomColor();
        this.topoJsonObject = null;
        this.diplomaticRelations = new Map();
        this.decisionEngine = null;
        this.wars = new Set(); // Add wars set
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

    setDecisionEngine(decisionEngine) {
        this.decisionEngine = decisionEngine;
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
    }

    setWealth(wealth) {
        this.wealth = wealth;
    }

    printBorderingCountries() {
        console.log(`Bordering countries of ${this.name}:`);
        this.borderingCountries.forEach(country => console.log(country.name));
    }

    makeMove() {
        this.decisionEngine.makeDecision();
    }

    getCountryCodeIndex(countryCode) {
        const index = Country.countryCodesArray.indexOf(countryCode);
        if (index !== -1) {
            return index;
        } else {
            console.log(`Country code ${countryCode} not found.`);
            throw new Error("Country code not found.");
        }
    }

    getDetails() {
        return {
            name: this.name,
            Code: this.countryCode,
            Population: this.population,
            MilitaryStrength: formatTo3SF(this.militaryStrength),
            Wealth: formatTo3SF(this.wealth),
            Vassals: Array.from(this.vassals).map(vassal => vassal.name).join(", ") || "none",
            Overlord: this.overlord ? this.overlord.name : "none",
            BorderingCountries: Array.from(this.borderingCountries).map(country => country.name).join(", ") || "none",
            Allies: Array.from(this.allies).map(ally => ally.name).join(", ") || "none", // Include allies
            Relations: Array.from(this.diplomaticRelations.entries()).map(([code, relation]) => `${code}: ${relation}`).join(", ") || "none" // Include relations
        };
    }

    addAlly(ally) {
        if (ally) {
            this.allies.add(ally);
            ally.allies.add(this);
        }
    }

    removeAlly(ally) {
        this.allies.delete(ally);
        ally.allies.delete(this);
    }

    joinWar(war) {
        this.wars.add(war);
    }

    leaveWar(war) {
        this.wars.delete(war);
    }

    isAtWar() {
        return this.wars.size > 0;
    }
}

function formatTo3SF(number) {
    return Number(number.toPrecision(3));
}

export { Country };

/* These are the attributes it needs to make a decision
wealth
aggressionLevel
diplomaticRelations (set of pairs like "CN" : 4) where:
max is 10 (above 8 is allied)
min is -10 (below -8 is at war)
above 3 means there are trade relations
above 6 means good trade relations

*/