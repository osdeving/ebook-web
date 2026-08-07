import type { ChapterDefinition } from "../framework/types";

const modules = import.meta.glob<{ default: ChapterDefinition }>("./*/chapter.ts", {
  eager: true,
});

export const chapters = Object.freeze(
  Object.values(modules)
    .map((module) => module.default)
    .sort((left, right) => Number(left.number) - Number(right.number)),
);

export function getChapter(slug: string): ChapterDefinition | undefined {
  return chapters.find((chapter) => chapter.slug === slug);
}
