# cfi-pros

[![CFI Pros CI](https://github.com/marcusgoll/cfi/actions/workflows/ci.yml/badge.svg)](https://github.com/marcusgoll/cfi/actions/workflows/ci.yml)

This is the front-end application for CFI Professionals, built with [Next.js](https://nextjs.org) 15 (App Router), TypeScript, and Tailwind CSS.

It is deployed automatically via [Vercel](https://vercel.com/).

## Getting Started

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Environment Variables:**
    Copy the `.env.example` file to `.env.local` and fill in any required variables (refer to Story 0.5 for details when available).
    ```bash
    cp .env.example .env.local
    ```
    Currently, the main variable is:
    - `NEXT_PUBLIC_USE_MOCK=1`: Set this to `1` to use mock data hooks (fetching from `/mocks/*.json`). Omit or set to `0` to attempt real API calls (not yet implemented).

3.  **Run the Development Server:**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## UI Components (shadcn/ui)

This project uses [shadcn/ui](https://ui.shadcn.com/) for its component library, built on top of Tailwind CSS and Radix UI.

To add new components:

```bash
pnpm dlx shadcn@latest add [component-name]
```

Components will be added to the `src/components/ui` directory.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
