# Blog Dashboard Project Structure

## Directory Structure

```
blog-dashboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   │   ├── blog/         # Blog management
│   │   └── category/     # Category management
│   ├── auth/             # Authentication pages
│   │   ├── login/        # Login page
│   │   └── register/     # Registration page
│   ├── blog/             # Public blog pages
│   │   ├── [slug]/       # Individual blog posts
│   │   └── page.tsx      # Blog listing page
│   ├── components/       # Page-specific components
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   ├── ui/              # UI components
│   └── shared/          # Shared components
├── lib/                   # Utility functions
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Key Files

- `app/layout.tsx`: Root layout component
- `app/page.tsx`: Home page
- `app/dashboard/blog/page.tsx`: Blog management dashboard
- `components/ui/`: Reusable UI components
- `lib/utils.ts`: Utility functions
- `public/`: Static assets like images and fonts

## Contact Information

For any queries or support, please contact:
- **Name:** Lucky Neo
- **Phone:** +91 6269957381

## Development Guidelines

1. All components should be placed in the `components` directory
2. Page-specific components should be in the respective page directory
3. API routes should be in the `app/api` directory
4. Utility functions should be in the `lib` directory
5. Types should be in the `types` directory
6. Static assets should be in the `public` directory

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) 