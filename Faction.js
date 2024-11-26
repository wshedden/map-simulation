export class Faction {
    constructor(name) {
        this.name = name;
        this.members = new Set();
    }

    addMember(country) {
        this.members.add(country);
    }

    removeMember(country) {
        this.members.delete(country);
    }

    hasMember(country) {
        return this.members.has(country);
    }
}