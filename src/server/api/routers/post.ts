import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Utility function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

// Utility function to estimate reading time
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export const postRouter = createTRPCRouter({
  // Get all published posts for public blog
  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.number().nullish(),
        category: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          published: true,
          ...(input.category && { category: input.category }),
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          tags: true,
          readingTime: true,
          featuredImage: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          slug: input.slug,
          published: true,
        },
      });

      return post;
    }),

  // Admin: Get all posts (published and unpublished)
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  // Admin: Get single post by ID (for editing)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });

      return post;
    }),

  // Admin: Create new post
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).default([]),
        featuredImage: z.string().optional(),
        published: z.boolean().default(false),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const slug = generateSlug(input.title);
      const readingTime = estimateReadingTime(input.content);

      // Check if slug already exists and make it unique
      const existingPost = await ctx.db.post.findUnique({
        where: { slug },
      });

      let finalSlug = slug;
      if (existingPost) {
        finalSlug = `${slug}-${Date.now()}`;
      }

      return ctx.db.post.create({
        data: {
          ...input,
          slug: finalSlug,
          readingTime,
          publishedAt: input.published ? new Date() : null,
        },
      });
    }),

  // Admin: Update post
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).default([]),
        featuredImage: z.string().optional(),
        published: z.boolean(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const readingTime = estimateReadingTime(input.content);

      // If title changed, regenerate slug
      const currentPost = await ctx.db.post.findUnique({
        where: { id },
        select: { title: true, slug: true, published: true },
      });

      let slug = currentPost?.slug;
      if (currentPost?.title !== input.title) {
        slug = generateSlug(input.title);
        
        // Check if new slug already exists
        const existingPost = await ctx.db.post.findUnique({
          where: { slug },
        });

        if (existingPost && existingPost.id !== id) {
          slug = `${slug}-${Date.now()}`;
        }
      }

      // Set publishedAt if publishing for the first time
      let publishedAt = undefined;
      if (input.published && !currentPost?.published) {
        publishedAt = new Date();
      } else if (!input.published) {
        publishedAt = null;
      }

      return ctx.db.post.update({
        where: { id },
        data: {
          ...updateData,
          slug,
          readingTime,
          ...(publishedAt !== undefined && { publishedAt }),
        },
      });
    }),

  // Admin: Delete post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),

  // Get unique categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.post.findMany({
      where: {
        published: true,
        category: { not: null },
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return categories
      .map((c) => c.category)
      .filter((c): c is string => c !== null);
  }),

  // Get featured posts
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(3) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          published: true,
          featuredImage: { not: null },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          readingTime: true,
          featuredImage: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        take: input.limit,
      });
    }),
});
