export function formatPopulation(population) {
    if (population >= 1e9) {
        return `${(population / 1e9).toFixed(2)}B`;
    } else if (population >= 1e6) {
        return `${(population / 1e6).toFixed(2)}M`;
    } else if (population >= 1e3) {
        return `${(population / 1e3).toFixed(2)}K`;
    } else {
        return population;
    }
}