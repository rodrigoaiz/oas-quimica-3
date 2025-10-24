import { defineCollection, z } from 'astro:content';

const objetos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    cover: z.string().default('/images/cover-placeholder.jpg'),
    duration: z.string().optional(),
    level: z.string().default('Química 3'),
    order: z.number().default(0),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Campos para pantallas individuales
    oaSlug: z.string().optional(),
    screenSlug: z.string().optional(),
  })
});

export const collections = { objetos };
