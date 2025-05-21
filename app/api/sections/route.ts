import { NextRequest, NextResponse } from "next/server";

export interface Section {
  _id?: string;
  title: string;
  description: string;
  type: 'featured' | 'latest' | 'category' | 'custom';
  category?: string;
  limit: number;
  order: number;
  displayStyle: 'grid' | 'list' | 'carousel';
  isActive: boolean;
}

// Mock posts data
const mockPosts = [
  {
    _id: "1",
    slug: "sample-post-1",
    title: "Roblox launches new ad format, strengthens partnership with Google",
    description: "This is a sample post description that will be truncated to 25 words maximum. This is just for testing purposes.",
    mainImage: "/s1.jpeg",
    createdAt: new Date().toISOString(),
    readTime: "14 min read",
    featured: true,
    tags: ["Featured", "Marketing"]
  },
  {
    _id: "2",
    slug: "sample-post-2",
    title: "Roblox launches new ad format, strengthens partnership with Google",
    description: "Another sample post description for testing the truncation feature.",
    mainImage: "/s5.jpeg",
    createdAt: new Date().toISOString(),
    readTime: "14 min read",
    featured: false,
    tags: ["Marketing", "Featured"]
  },
  {
    _id: "3",
    slug: "sample-post-3",
    title: "Roblox launches new ad format, strengthens partnership with Google",
    description: "Third sample post to demonstrate the grid layout with multiple posts.",
    mainImage: "/s3.jpeg",
    createdAt: new Date().toISOString(),
    readTime: "14 min read",
    featured: false,
    tags: ["Marketing", "Featured"]
  },
  {
    _id: "4",
    slug: "sample-post-4",
    title: "Roblox launches new ad format, strengthens partnership with Google",
    description: "Fourth sample post with different tags and content.",
    mainImage: "/s4.jpeg",
    createdAt: new Date().toISOString(),
    readTime: "14 min read",
    featured: true,
    tags: ["Featured", "Technology"]
  },
  {
    _id: "5",
    slug: "sample-post-5",
    title: "Roblox launches new ad format, strengthens partnership with Google",
    description: "Fifth sample post with unique content and tags.",
    mainImage: "/s2.jpeg",
    createdAt: new Date().toISOString(),
    readTime: "14 min read",
    featured: false,
    tags: ["Technology", "Featured"]
  },
  {
    _id: "6",
    slug: "sample-post-6",
    title: "Roblox launches new ad format, strengthens partnership with Google",
    description: "Sixth sample post with different content and tags.",
    mainImage: "/v1.jpeg",
    createdAt: new Date().toISOString(),
    readTime: "14 min read",
    featured: true,
    tags: ["Featured", "Marketing"]
  },
  {
    _id: "7",
    slug: "sample-post-7",
    title: "Roblox launches new ad format, strengthens partnership with Google",
    description: "Seventh sample post with unique content.",
    mainImage: "/v4.jpeg",
    createdAt: new Date().toISOString(),
    readTime: "14 min read",
    featured: false,
    tags: ["Marketing", "Featured"]
  },
  {
    _id: "8",
    slug: "sample-post-8",
    title: "Roblox launches new ad format, strengthens partnership with Google",
    description: "Eighth sample post with different content and tags.",
    mainImage: "/s3.jpeg",
    createdAt: new Date().toISOString(),
    readTime: "14 min read",
    featured: false,
    tags: ["Technology", "Featured"]
  }
];

// GET /api/sections - Get all active sections with their blogs
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement database connection and fetch sections
    const sections = [
      {
        _id: "1",
        title: "Featured Posts",
        description: "Our most popular articles",
        type: "featured",
        limit: 6,
        order: 1,
        displayStyle: "grid",
        isActive: true,
        posts: mockPosts
      },
      {
        _id: "2",
        title: "Latest Posts",
        description: "Recently published articles",
        type: "latest",
        limit: 4,
        order: 2,
        displayStyle: "list",
        isActive: true,
        posts: mockPosts.slice(0, 4)
      }
    ];

    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { message: "Error fetching sections" },
      { status: 500 }
    );
  }
}

// POST /api/sections - Create a new section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Implement database connection and create section
    return NextResponse.json({ message: "Section created successfully" });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { message: "Error creating section" },
      { status: 500 }
    );
  }
} 