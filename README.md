# LOM Frontend

A modern blog platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Section-based Blog Display**: Blogs are organized into sections (Featured Blogs, Marketing Blogs, Expert Speak)
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern UI Components**: Built with Tailwind CSS and custom components
- **Dynamic Blog Cards**: 
  - Fallback UI for missing images
  - Meta title and description support
  - Read time calculation
  - Tags display
  - Date and time information
- **Section Management**:
  - Sections are ordered and displayed accordingly
  - Each section shows its relevant blogs
  - Empty section handling with user-friendly messages
- **Advanced Blog Editor**:
  - Rich text editing with custom editor
  - Section-based content organization
  - Meta information management
  - Image upload and management
  - Tag management
  - Draft and publish functionality
  - Featured blog toggle

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lom-frontend.git
```

2. Install dependencies:
```bash
cd lom-frontend
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lom-frontend/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   │   └── blog/         # Blog management
│   │       ├── create/   # Create new blog
│   │       └── [blogId]/ # Edit existing blog
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── BlogGrid.tsx      # Grid layout for blogs
│   ├── Editor.tsx        # Rich text editor component
│   ├── SectionDisplay.tsx # Section-based blog display
│   └── ui/               # UI components
├── public/               # Static files
└── styles/              # Global styles
```

## Blog Editor Features

### Basic Information
- Title and description
- Category selection
- Tag management with add/remove functionality

### Meta Information
- Meta title and description
- Meta keywords management
- SEO optimization support

### Content Management
- Rich text editor with formatting options
- Main image upload and preview
- Section-based content organization
  - Section title and description
  - Section image upload
  - Section list items
  - Order management

### Publishing Options
- Draft/Published status toggle
- Featured blog toggle
- Preview functionality

## API Integration

The frontend integrates with a backend API for:
- Fetching sections
- Fetching blogs for each section
- Blog metadata and content
- Image upload and management
- Category management
- Blog CRUD operations

## Recent Updates

- Added advanced blog editor with section management
- Implemented rich text editing capabilities
- Added meta information management
- Enhanced image upload and preview functionality
- Improved blog organization with sections
- Added draft and publish functionality
- Enhanced error handling and loading states
- Improved responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any queries or support, please contact:

- **Name:** Lucky Neo
- **Phone:** +91 6269957381
- **Email:** mobiartlucky@gmail.com

## Acknowledgments

- Built with ❤️ by Lucky Neo
- Special thanks to the Next.js and Tailwind CSS communities 