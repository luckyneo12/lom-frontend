const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://new-blogbackend.onrender.com/api";

export const createBlog = async (blogData, token) => {
  try {
    const formData = new FormData();

    // Add text fields
    formData.append("title", blogData.mainTitle);
    formData.append("subtitle", blogData.mainTitle); // Using mainTitle as subtitle
    formData.append("description", blogData.content);
    formData.append("subdescription", blogData.content); // Using content as subdescription
    formData.append("category", blogData.category);
    formData.append("seoMetaTitle", blogData.metaTitle);
    formData.append("seoMetaDescription", blogData.metaDescription);

    // Add tags
    blogData.tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    // Add sections
    blogData.additionalTitlesDescriptions.forEach((section, index) => {
      formData.append(`sections[${index}][title]`, section.title);
      formData.append(`sections[${index}][description]`, section.description);
    });

    // Add images
    if (blogData.images.length > 0) {
      // First image as main image
      const mainImageResponse = await fetch(blogData.images[0].url);
      const mainImageBlob = await mainImageResponse.blob();
      formData.append("mainImage", mainImageBlob, "main-image.jpg");

      // Additional images as section images
      for (let i = 1; i < blogData.images.length; i++) {
        const imageResponse = await fetch(blogData.images[i].url);
        const imageBlob = await imageResponse.blob();
        formData.append("sectionImages", imageBlob, `section-image-${i}.jpg`);
      }
    }

    const response = await fetch(`${API_URL}/blog`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create blog");
    }

    return await response.json();
  } catch (error) {
    console.error("Create blog error:", error);
    throw error;
  }
};
