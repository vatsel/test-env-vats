export const UNKNOWN_ERROR = "Request failed. Please try again";
export const HIDDEN_ENV_CHAR = "*";
export const SORT_OPTIONS = [ // first is the default 
    'Last Updated',
    'Name A-Z',
    'Name Z-A'
] as const;
export const DATE_FORMAT_THIS_YEAR: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
};
export const DATE_FORMAT_OTHER_YEAR: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric', 
};
export const JUST_NOW_MS = 24 * 60 * 60 * 1000;