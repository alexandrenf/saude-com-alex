import "server-only";

import { db } from '~/server/db';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metaTitle: string | null;
  metaDescription: string | null;
  category: string | null;
  tags: string[];
  readingTime: number | null;
  featuredImage: string | null;
}

export interface BlogPostMeta {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  category: string | null;
  tags: string[];
  readingTime: number | null;
  featuredImage: string | null;
}

export interface CreatePostData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  published?: boolean;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
}

export interface UpdatePostData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  published?: boolean;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Calculate reading time (roughly 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  try {
    const posts = await db.post.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        category: true,
        tags: true,
        readingTime: true,
        featuredImage: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await db.post.findUnique({
      where: { 
        slug,
        published: true,
      },
    });

    return post;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  try {
    const post = await db.post.findUnique({
      where: { id },
    });

    return post;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
}

export async function createPost(data: CreatePostData): Promise<BlogPost> {
  try {
    const slug = data.slug ?? generateSlug(data.title);
    const readingTime = calculateReadingTime(data.content);
    
    // Check if slug already exists
    const existingPost = await db.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      throw new Error('A post with this slug already exists');
    }

    const post = await db.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        published: data.published ?? false,
        publishedAt: data.published ? new Date() : null,
        category: data.category,
        tags: data.tags ?? [],
        readingTime,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        featuredImage: data.featuredImage,
      },
    });

    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(id: number, data: UpdatePostData): Promise<BlogPost> {
  try {
    const updateData: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      published?: boolean;
      publishedAt?: Date | null;
      category?: string;
      tags?: string[];
      readingTime?: number;
      metaTitle?: string;
      metaDescription?: string;
      featuredImage?: string;
    } = { ...data };
    
    // If content is being updated, recalculate reading time
    if (data.content) {
      updateData.readingTime = calculateReadingTime(data.content);
    }

    // If publishing for the first time, set publishedAt
    if (data.published === true) {
      const existingPost = await db.post.findUnique({
        where: { id },
        select: { publishedAt: true },
      });
      
      if (!existingPost?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // If unpublishing, clear publishedAt
    if (data.published === false) {
      updateData.publishedAt = null;
    }

    const post = await db.post.update({
      where: { id },
      data: updateData,
    });

    return post;
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
}

export async function deletePost(id: number): Promise<boolean> {
  try {
    await db.post.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    return false;
  }
}

export async function getFeaturedPosts(): Promise<BlogPostMeta[]> {
  try {
    const posts = await db.post.findMany({
      where: { 
        published: true,
        category: 'featured', // Using category to mark featured posts
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        category: true,
        tags: true,
        readingTime: true,
        featuredImage: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    });

    return posts;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

export async function getPostsByCategory(category: string): Promise<BlogPostMeta[]> {
  try {
    const posts = await db.post.findMany({
      where: { 
        published: true,
        category,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        category: true,
        tags: true,
        readingTime: true,
        featuredImage: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    return posts;
  } catch (error) {
    console.error(`Error fetching posts by category ${category}:`, error);
    return [];
  }
}

export async function getPostsByTag(tag: string): Promise<BlogPostMeta[]> {
  try {
    const posts = await db.post.findMany({
      where: { 
        published: true,
        tags: {
          has: tag,
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        category: true,
        tags: true,
        readingTime: true,
        featuredImage: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    return posts;
  } catch (error) {
    console.error(`Error fetching posts by tag ${tag}:`, error);
    return [];
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await db.post.findMany({
      where: { published: true },
      select: { tags: true },
    });

    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    const categories = await db.post.findMany({
      where: { 
        published: true,
        category: { not: null },
      },
      select: { category: true },
      distinct: ['category'],
    });

    return categories
      .map(item => item.category)
      .filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function searchPosts(query: string): Promise<BlogPostMeta[]> {
  try {
    const posts = await db.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        category: true,
        tags: true,
        readingTime: true,
        featuredImage: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    return posts;
  } catch (error) {
    console.error(`Error searching posts with query ${query}:`, error);
    return [];
  }
}

// Admin functions to get all posts including unpublished
export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  try {
    const posts = await db.post.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return posts;
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    throw new Error('Failed to fetch posts');
  }
} 