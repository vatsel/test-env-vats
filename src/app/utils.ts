import { EnvironmentVariable } from "./models";

export const wait = (s: number) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000)); 
};

export const getTimeStr = (envVar: EnvironmentVariable) => {
    if (envVar.lastUpdated && Date.now() - envVar.lastUpdated.getTime() < 24 * 60 * 60 * 1000) {
        return 'Updated just now';
    }

    if (Date.now() - envVar.createdAt.getTime() < 24 * 60 * 60 * 1000) {
        return 'Added just now';
    }

    if (envVar.lastUpdated) {
        if (envVar.lastUpdated.getFullYear() === new Date().getFullYear()) {
            return `Updated ${envVar.lastUpdated.toLocaleString('en-GB',{
                day: 'numeric',
                month: 'short',
            })}`
        }
        return `Updated ${envVar.lastUpdated.toLocaleString('en-GB',{
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })}`;

    } else { // no update date, return Added 
        if (envVar.createdAt.getFullYear() === new Date().getFullYear()) {
            return `Added ${envVar.createdAt.toLocaleString('en-GB',{
                day: 'numeric',
                month: 'short',
            })}`
        } 
        return `Added ${envVar.createdAt.toLocaleString('en-GB',{
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })}`
    }
}

export const getUpdatedOrCreatedAt = (envVar: EnvironmentVariable): Date => {
    if (envVar.lastUpdated) {
        return envVar.lastUpdated;
    } else {
        return envVar.createdAt;
    }
}