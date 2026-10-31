import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum([
      "Ideas & Observations",
      "Writing Life",
      "Faith & Discovery",
      "Projects & Updates",
    ]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/pages",
  }),
  schema: z.object({
    title: z.string(),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['want', 'reading', 'read']),
    rating: z.number().min(0).max(5).multipleOf(0.5).optional(),
    impression: z.string().optional(),
    order: z.number().int().nonnegative().optional(),
  }),
});

export const collections = {
  blog,
  pages,
  books,
};
