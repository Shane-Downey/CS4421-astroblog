import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    socialLinks: z.array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      }),
    ),
  }),
});

export const collections = { authors };