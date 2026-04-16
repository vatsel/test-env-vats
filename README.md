# NOTES: Environment Variable Editor


## Changes to the data
Each env var gets an added "last changed" date when the mock data is read. 
1. Users often want to edit the same values repeatedly, which is enabled via sorting by latest update.
2. Users want to easily tell when an env var has been last updated to check if it's useful


## Additions
1. Search helps users quickly find specific env vars
2. Sorting helps when there are a lot of env var
3. Copy to clipboard helps users work with large env values and use this module as a centralised repo


## Potentially non-obvious additions
- Common breakpoints (including mobile) have been tested
- Added Zod for input validation, hopefully that's allowed, as Zod enables per-field input tooltips in case of bad/incomplete input
- Sorting dropdown list supports ARIA keyboard inputs like ArrowDown/ArrowUp/Esc
- Search supports ARIA specs like results announcement
- Deleting, editing and adding new env vars mimics interfacing with a server, async and error results are handled
- Hovering over the environment value reveals a "click to copy to clipboard" functionality. Tabbing to the button and hitting enter achieves the same result


## AI prompts
Claude Code was not used to build this demo, though I do use it normally


## Other notes
As mentioned in the brief, the main component EnvironmentVariableEditor ends up a client component, as data is not fetched from the server so useState() holds it. In prod we can use SSR by fetching from the server


## remaining TODOs
1. the 'outline' style header font is actually a different font to the solid font. we can use the same font if we fix some of the letter glyphs which are not designed for transparency.
2. A dark mode was designed in Figma, which can be quickly implemented by changing the tailwindcss color values with a prefers-color-scheme media query