import { EnvironmentVariable } from "./models";
import { DATE_FORMAT_THIS_YEAR, DATE_FORMAT_OTHER_YEAR, JUST_NOW_MS } from "./constants";

export const wait = (s: number) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000)); 
};

const formatDate = (date: Date): string => {
    const dateFormat = (date.getFullYear() === new Date().getFullYear())
        ? DATE_FORMAT_THIS_YEAR
        : DATE_FORMAT_OTHER_YEAR;
    
    return date.toLocaleString('en-GB', dateFormat);
};

export const getTimeStr = (envVar: EnvironmentVariable) => {
    if (envVar.lastUpdated && Date.now() - envVar.lastUpdated.getTime() < JUST_NOW_MS) {
        return 'Updated just now';
    }

    if (Date.now() - envVar.createdAt.getTime() < JUST_NOW_MS) {
        return 'Added just now';
    }

    if (envVar.lastUpdated) {
        return `Updated ${formatDate(envVar.lastUpdated)}`;

    } 
    // no update date, return Added 
    return `Added ${formatDate(envVar.createdAt)}`;
}

export const getUpdatedOrCreatedAt = (envVar: EnvironmentVariable): Date => {
    if (envVar.lastUpdated) {
        return envVar.lastUpdated;
    } else {
        return envVar.createdAt;
    }
}