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
├── components/            # React components
│   ├── BlogGrid.tsx      # Grid layout for blogs
│   ├── SectionDisplay.tsx # Section-based blog display
│   └── ui/               # UI components
├── public/               # Static files
└── styles/              # Global styles
```

## API Integration

The frontend integrates with a backend API for:
- Fetching sections
- Fetching blogs for each section
- Blog metadata and content

## Recent Updates

- Added section-based blog organization
- Improved blog card UI with fallback for missing images
- Added meta title and description support
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