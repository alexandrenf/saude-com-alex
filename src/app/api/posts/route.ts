import { NextRequest, NextResponse } from "next/server";
import { createPost, getAllPosts, type CreatePostData } from "~/lib/blog";

interface CreatePostRequest {
  title: string;
  excerpt?: string;
  content: string;
  date?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePostData;
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const post = await createPost(body);
    
    return NextResponse.json({ 
      message: "Post created successfully",
      slug: post.slug,
      id: post.id
    });
  } catch (error) {
    console.error("Error creating post:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 