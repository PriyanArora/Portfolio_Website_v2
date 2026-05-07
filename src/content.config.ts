import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders';

const projects = defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './content/projects' }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),                                                                                                                                                         
        description: z.string(),
        status: z.enum(['live', 'in-progress', 'coming-soon']),
        tags: z.array(z.string()),                                                                                                                                                
        thumbnail: z.string(),
        repoUrl: z.string().optional(),                                                                                                                                           
        liveUrl: z.string().optional(),
        featured: z.boolean(),                                                                                                                                                    
        order: z.number(),
    }),                                                                                                                                                                         
});

export const collections = { projects };