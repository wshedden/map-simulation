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

        // New focus properties
        this.militarySpending = 0;
        this.economicGrowth = 0;
        this.populationGrowth = 0;
        this.internationalTies = 0;
        this.technologicalAdvancement = 0;
        this.culturalDevelopment = 0;
        this.environmentalSustainability = 0;
        this.healthcareImprovement = 0;
        this.educationEnhancement = 0;
        this.infrastructureDevelopment = 0;

        // New wargame-specific properties
        this.aggressionLevel = 0; // Aggression level of the country
        this.economicStability = 0; // Economic stability of the country
        this.militaryReadiness = 0; // Military readiness of the country
        this.diplomaticRelations = 0; // Diplomatic relations with other countries
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
        this.militaryStrength = this.population + this.wealth / 100;
        this.overlordMilitaryStrength = this.overlord ? this.overlord.militaryStrength : 0;
    }

    printBorderingCountries() {
        console.log(`Bordering countries of ${this.name}:`);
        this.borderingCountries.forEach(country => console.log(country.name));
    }

    makeMove(countryManager, increaseWealth) {
        this.wealth -= this.vassals.size; // Decrease wealth based on the number of vassals
    
        if (this.wealth <= 0) {
            this.goBankrupt();
        } else {
            // Increase wealth proportional to population
            this.wealth += this.population / 100;
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
    
        // Check for rare random events
        if (Math.random() < 0.00005) {
            this.naturalDisaster();
        }

        // Binary choice to increase wealth or military strength
        if (increaseWealth) {
            this.wealth += 100; // Increase wealth
        } else {
            this.militaryStrength += 100; // Increase military strength
        }

        // Automatically increase population growth
        this.populationGrowth += 0.01;

        // Automatically increase economic stability
        this.economicStability += 0.01;

        // Automatically increase military readiness
        this.militaryReadiness += 0.01;
    }

    goBankrupt() {
        this.vassals.forEach(vassal => this.removeVassal(vassal));
        this.vassals.clear();
        if (!this.hasHalvedStrength) {
            this.militaryStrength /= 2;
            this.hasHalvedStrength = true;
        }
        this.wealth = 1000;
    }

    naturalDisaster() {
        const catastropheLevel = Math.random() * 0.6;
        this.population *= 1 - catastropheLevel;
        this.militaryStrength *= 1 - catastropheLevel;
        this.wealth *= 1 - catastropheLevel;

        if (this.vassals.size > 0) {
            const vassalsArray = Array.from(this.vassals);
            const randomVassal = vassalsArray[Math.floor(Math.random() * vassalsArray.length)];
            this.removeVassal(randomVassal);
        }
    }

    getDistance(target) {
        const thisIndex = this.getCountryCodeIndex(this.countryCode);
        const targetIndex = this.getCountryCodeIndex(target.countryCode);
        return distanceMatrix[thisIndex][targetIndex];
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

    // Methods to update focus properties
    increaseMilitarySpending(amount) {
        this.militarySpending += amount;
    }

    increaseEconomicGrowth(amount) {
        this.economicGrowth += amount;
    }

    increasePopulationGrowth(amount) {
        this.populationGrowth += amount;
    }

    increaseInternationalTies(amount) {
        this.internationalTies += amount;
    }

    increaseTechnologicalAdvancement(amount) {
        this.technologicalAdvancement += amount;
    }

    increaseCulturalDevelopment(amount) {
        this.culturalDevelopment += amount;
    }

    increaseEnvironmentalSustainability(amount) {
        this.environmentalSustainability += amount;
    }

    increaseHealthcareImprovement(amount) {
        this.healthcareImprovement += amount;
    }

    increaseEducationEnhancement(amount) {
        this.educationEnhancement += amount;
    }

    increaseInfrastructureDevelopment(amount) {
        this.infrastructureDevelopment += amount;
    }

    // Methods to update wargame-specific properties
    increaseAggressionLevel(amount) {
        this.aggressionLevel += amount;
    }

    increaseEconomicStability(amount) {
        this.economicStability += amount;
    }

    increaseMilitaryReadiness(amount) {
        this.militaryReadiness += amount;
    }

    increaseDiplomaticRelations(amount) {
        this.diplomaticRelations += amount;
    }

    increaseBorderingCountriesWealth(amount) {
        this.borderingCountries.forEach(country => {
            country.wealth += amount;
            country.updateMilitaryStrength(); // Update military strength based on new wealth
        });
    }

    getDetails() {
        return {
            name: this.name,
            Code: this.countryCode,
            Population: formatTo3SF(this.population),
            MilitaryStrength: formatTo3SF(this.militaryStrength),
            Wealth: formatTo3SF(this.wealth),
            Vassals: Array.from(this.vassals).map(vassal => vassal.name).join(", ") || "none",
            Overlord: this.overlord ? this.overlord.name : "none",
            BorderingCountries: Array.from(this.borderingCountries).map(country => country.name).join(", ") || "none",
            MilitarySpending: formatTo3SF(this.militarySpending),
            EconomicGrowth: formatTo3SF(this.economicGrowth),
            PopulationGrowth: formatTo3SF(this.populationGrowth),
            InternationalTies: formatTo3SF(this.internationalTies),
            TechnologicalAdvancement: formatTo3SF(this.technologicalAdvancement),
            CulturalDevelopment: formatTo3SF(this.culturalDevelopment),
            EnvironmentalSustainability: formatTo3SF(this.environmentalSustainability),
            HealthcareImprovement: formatTo3SF(this.healthcareImprovement),
            EducationEnhancement: formatTo3SF(this.educationEnhancement),
            InfrastructureDevelopment: formatTo3SF(this.infrastructureDevelopment)
        };
    }
}

function formatTo3SF(number) {
    return Number(number.toPrecision(3));
}

export { Country };