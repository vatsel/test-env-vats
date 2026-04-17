import data from './data/environment-variables.json'
import { EnvironmentVariable } from './models';


const dates: Date[] = [
    new Date('2024-01-21'),
    new Date('2025-02-11'),
    new Date('2026-01-05'),
    new Date('2026-02-01'),
    new Date('2026-02-09'),
    new Date('2026-02-23'),
    new Date('2026-03-11'),
    new Date('2026-04-06'),
];


export async function loadEnvironmentVariables(someId: string): Promise<EnvironmentVariable[]> {
    // do nothing with our dummy id, use our mock data instead

    // This method doesn't guarantee the update date is after creation date
    // we will discard the creation date if there's a non null lastUpdate
    const envVars: EnvironmentVariable[] = data.map((datum) => {
        const hasUpdateDate = Math.random() > 0.7;

        return {
            name: datum.name,
            value: datum.value,
            createdAt: dates[Math.floor(Math.random() * dates.length)],
            lastUpdated: hasUpdateDate ? dates[Math.floor(Math.random() * dates.length)] : null
        };
    });
    
    return envVars;
}