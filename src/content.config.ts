import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      image_author: z
        .object({
          name: z.string().optional(),
          link: z.string().optional()
        })
        .optional()
    })
    .optional();

const blogCollection = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      publishDate: z.date().optional(),
      updateDate: z.date().optional(),
      draft: z.boolean().optional(),
      title: z.string(),
      excerpt: z.string().optional(),
      image: image(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
      metadata: metadataDefinition()
    })
});
const photographyCollection = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/photography' }),
  schema: ({ image }) =>
    z.object({
      publishDate: z.date().optional(),
      title: z.string(),
      excerpt: z.string().optional(),
      images: z.array(image())
    })
});

export const collections = {
  blog: blogCollection,
  photography: photographyCollection
};
