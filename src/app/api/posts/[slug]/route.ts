import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, updatePost, deletePost, getPostById, type UpdatePostData } from "~/lib/blog";

interface RouteParams {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = (await request.json()) as UpdatePostData & { id?: number };
    
    // First get the post by slug to get the ID
    const existingPost = await getPostBySlug(params.slug);
    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const updatedPost = await updatePost(existingPost.id, body);
    
    return NextResponse.json({ 
      message: "Post updated successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error("Error updating post:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // First get the post by slug to get the ID
    const existingPost = await getPostBySlug(params.slug);
    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const success = await deletePost(existingPost.id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Post deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
} 