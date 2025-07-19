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

export const parseDocsFromSectionAndEntries = (section: string, entries: StoryIndex['entries']) => {
    const menu = Object.entries(entries).reduce((acc, [key, value]) => {
        const parsedSection = parseSectionFromEntry(value);
        if (parsedSection.section.toLocaleLowerCase() === section) {
            acc.push(parsedSection.entry);
        }

        return acc;
    }, [] as StoryIndex['entries'][string][]);
    return menu;
}

export const parseMenuNavigatorFromDocs = (docs: StoryIndex['entries'][string][]) => {
    // 递归构建树
    const root: any[] = [];
    for (const doc of docs) {
        const parts = doc.title.split('/');
        let currentLevel = root;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            let node = currentLevel.find((item: any) => item.label === part);
            if (!node) {
                node = { label: part };
                if (i === parts.length - 1) {
                    node.id = doc.id;
                    node.entry = doc;
                } else {
                    node.children = [];
                }
                currentLevel.push(node);
            }
            if (i < parts.length - 1) {
                currentLevel = node.children;
            }
        }
    }
    return root;
}

export const getAllSectionIdPairs = (entries: StoryIndex['entries']) => {
    return Object.values(entries).map(entry => {
        const section = entry.title.includes('/') ? entry.title.split('/')[0].toLocaleLowerCase() : 'home';
        return { section, id: entry.id };
    });
}