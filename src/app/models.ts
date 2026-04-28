import { SORT_OPTIONS } from "./constants";

export type EnvironmentVariable = {
    id: string;
    name: string;
    value: string;
    createdAt: Date;
    lastUpdated: Date | null;
}


/**  Matches zod's error format */
export type ParseErrors = {
    formErrors: string[],
    // partial to warn compiler about optional fields
    fieldErrors: Partial<Record<string, string[]>>, 
}


export type ApiResponse = {
    success: false;
    errors: ParseErrors
} | { 
    success: true; 
};

export type SortOption = typeof SORT_OPTIONS[number];