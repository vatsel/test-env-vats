# NOTES: Environment Variable Editor

## Overview
**EnvironmentVariableEditor** manages the page
- a list of *EnvironmentVariableField* display and manage each env var
- *AddNewEnvVariableForm* is the button and form at the bottom of the list

The **layout** of the page is based on a responsive grid, the number and order of elements are important to keep the visual coherence
To this end *StyledGapColumn* is often inserted to standardise the visual gaps


## Changes to the brief's data
Each env var gets an added "last changed" date when the mock data is loaded. 
1. Users often want to edit the same values repeatedly, which is enabled via sorting by latest update.
2. Users want to easily tell when an env var has been last updated to check if it's useful


## Additions
1. Search helps users quickly find specific env vars
2. Sorting helps sift through when there are a lot of env var (ofc can be combined with search)
3. Copy to clipboard helps users work with large env values and use this module as a centralised repo


## Potentially non-obvious additions
- Common breakpoints (including mobile) have been tested to work
- Zod was added for input validation, enabling per-input-field tooltips in case of bad/incomplete input
- Sorting dropdown list supports ARIA keyboard inputs like ArrowDown/ArrowUp/Esc
- Search supports ARIA specs like results announcement
- Deleting, editing and adding new env vars mimics interfacing async with a server. Error results are handled
- Hovering over the environment value reveals a "click to copy to clipboard" functionality. Tabbing to the button and hitting enter also copies the text to clipboard


## AI prompts
Claude Code was not used to build this demo, though I do use it normally to speed up my work


## Other notes
As mentioned in the brief, the main component EnvironmentVariableEditor ends up a client component, as data is not fetched from the server so useState() holds it. In production we can use server side rendering by fetching data from the server


## remaining TODOs
1. The headline font is not Roobert or Inter but Geist, because neither of the fonts were designed for outline-only display. A few glyphs can be fixed in Roobert to display it as an outline
2. A dark mode was designed in Figma, which can be quickly implemented by changing the tailwindcss color values with a prefers-color-scheme media query
3. Mobile visual updates to increase the size of elements and bring things back into balance
4. Create a unique animated icon (SVG) for Environment Variables, to replace the evervault logo
5. pixel perfect optimisations