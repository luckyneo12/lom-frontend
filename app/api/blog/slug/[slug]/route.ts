import { NextRequest, NextResponse } from "next/server";

// GET /api/blog/slug/[slug] - Get blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    
    // Fetch blog post from the backend API
    const response = await fetch(`${apiUrl}/api/blog/slug/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { message: "Blog not found" },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch blog: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.blog) {
      return NextResponse.json(
        { message: "Blog data is missing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ blog: data.blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Error fetching blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/slug/[slug] - Delete blog by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    
    // Delete blog post from the backend API
    const response = await fetch(`${apiUrl}/api/blog/slug/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete blog: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Error deleting blog" },
      { status: 500 }
    );
  }
} 