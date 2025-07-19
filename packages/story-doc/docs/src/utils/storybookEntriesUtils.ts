import type { StoryIndex } from "virtual:storybook-index";

export const parseSectionFromEntry = (entry: StoryIndex['entries'][string]) => {
    const sections = entry.title.split('/');
    return {
        entry,
        section: sections.length > 1 ? sections[0] : 'home',
    };
}

export const parseSectionsFromEntries = (entries: StoryIndex['entries']) => {
    const sections = Object.entries(entries).reduce((acc, [key, value]) => {
        const section = parseSectionFromEntry(value).section
        if (acc.findIndex((item) => item === section) === -1) {
            acc.push(section);
        }
        return acc;
    }, [] as string[]);
    return sections;
}

export const parseMenuFromSectionAndEntries = (section: string, entries: StoryIndex['entries']) => {
    const menu = Object.entries(entries).reduce((acc, [key, value]) => {
        const parsedSection = parseSectionFromEntry(value);
        if (parsedSection.section === section) {
            acc.push({
                id: key,
                entry: parsedSection.entry,
            });
        }

        return acc;
    }, [] as { id: string, entry: StoryIndex['entries'][string] }[]);
    return menu;
}