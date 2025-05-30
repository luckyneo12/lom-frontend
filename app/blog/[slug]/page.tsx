import { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

export const metadata: Metadata = {
  title: "Blog Post",
  description: "Read our latest blog post",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
