import { NextRequest, NextResponse } from "next/server";

// GET /api/blog/[slug] - Get blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    // TODO: Implement database connection and fetch blog by slug
    return NextResponse.json({ 
      message: "Blog fetched successfully",
      blog: {
        _id: "1",
        slug: slug,
        title: "Sample Blog",
        content: "Sample content",
        mainImage: "/sample.jpg",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { message: "Error fetching blog" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[slug] - Update blog by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await request.json();
    
    // TODO: Implement database connection and update blog
    // Example MongoDB query:
    // await db.collection('blogs').updateOne(
    //   { slug: slug },
    //   { $set: { ...body, updatedAt: new Date() } }
    // );
    
    return NextResponse.json({
      message: "Blog updated successfully",
      blog: {
        ...body,
        slug: slug,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { message: "Error updating blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[slug] - Delete blog by slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // TODO: Implement database connection and delete blog
    // Example MongoDB query:
    // await db.collection('blogs').deleteOne({ slug: slug });
    
    return NextResponse.json(
      { 
        message: "Blog deleted successfully",
        deletedSlug: slug
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { message: "Error deleting blog" },
      { status: 500 }
    );
  }
} 