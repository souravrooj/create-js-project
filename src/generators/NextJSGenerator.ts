import { BaseGenerator } from "./BaseGenerator";
import { Language } from "../types/ProjectType";

export class NextJSGenerator extends BaseGenerator {
  async generate(projectPath: string, projectName: string, language: Language): Promise<void> {
    const ext = this.getFileExtension(language);
    const isTypeScript = language === "ts";

    // For Next.js, we'll use App Router by default (modern approach)
    const useAppRouter = true;

    // Create directories
    const directories = [
      "src",
      "src/components",
      "src/lib",
      "src/styles",
      "public"
    ];

    // Add router-specific directories
    if (useAppRouter) {
      directories.push(
        "src/app",
        "src/app/api"
      );
    } else {
      directories.push(
        "src/pages",
        "src/pages/api"
      );
    }

    await this.createDirectories(projectPath, directories);

    // Create files
    const files: Record<string, string> = {};

    // Next.js config
    files["next.config.js"] = this.getNextConfig(useAppRouter);
    
    // Router-specific files
    if (useAppRouter) {
      files[`src/app/layout.${ext}`] = this.getLayoutFile(ext, isTypeScript);
      files[`src/app/page.${ext}`] = this.getPageFile(ext, isTypeScript);
      files[`src/app/globals.css`] = this.getGlobalCSS();
      files[`src/app/api/hello/route.${ext}`] = this.getApiRoute(ext, isTypeScript);
    } else {
      files[`src/pages/_app.${ext}`] = this.getAppFile(ext, isTypeScript);
      files[`src/pages/index.${ext}`] = this.getIndexPage(ext, isTypeScript);
      files[`src/pages/api/hello.${ext}`] = this.getApiPage(ext, isTypeScript);
      files[`src/styles/globals.css`] = this.getGlobalCSS();
    }

    // Components
    files[`src/components/Header.${ext}`] = this.getHeaderComponent(ext, isTypeScript);
    files[`src/components/Footer.${ext}`] = this.getFooterComponent(ext, isTypeScript);

    // Lib utilities
    files[`src/lib/utils.${ext}`] = this.getUtilsFile(ext, isTypeScript);

    // Package.json
    const dependencies = {
      "next": "^14.0.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    };

    const devDependencies: Record<string, string> = isTypeScript ? {
      "@types/node": "^20.10.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "typescript": "^5.3.2",
      "eslint": "^8.54.0",
      "eslint-config-next": "^14.0.0"
    } : {
      "eslint": "^8.54.0",
      "eslint-config-next": "^14.0.0"
    };

    files["package.json"] = this.getPackageJson(projectName, dependencies, {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint"
    }, devDependencies);

    // TypeScript config if needed
    if (isTypeScript) {
      files["tsconfig.json"] = this.getNextTsConfig();
    }

    // Other config files
    files[".gitignore"] = this.getNextGitignore();
    files["README.md"] = this.getNextReadme(projectName);
    files[".eslintrc.json"] = this.getEslintConfig();

    await this.createFiles(projectPath, files);
  }

  private getNextConfig(useAppRouter: boolean): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: ${useAppRouter},
  },
  // Add your Next.js configuration here
}

module.exports = nextConfig`;
  }

  private getLayoutFile(ext: string, isTypeScript: boolean): string {
    const typeImports = isTypeScript ? `
import type { Metadata } from 'next'` : '';

    return `import './globals.css'${typeImports}

export const metadata = {
  title: 'Next.js App',
  description: 'Created with create-js-project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

import Header from '../components/Header'
import Footer from '../components/Footer'`;
  }

  private getPageFile(ext: string, isTypeScript: boolean): string {
    return `export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Next.js!
      </h1>
      <p className="text-center text-lg text-gray-600">
        Get started by editing src/app/page.${ext}
      </p>
      <div className="mt-8 text-center">
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Learn more about Next.js →
        </a>
      </div>
    </div>
  )
}`;
  }

  private getGlobalCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`;
  }

  private getHeaderComponent(ext: string, isTypeScript: boolean): string {
    return `export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            Next.js App
          </div>
          <div className="space-x-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}`;
  }

  private getFooterComponent(ext: string, isTypeScript: boolean): string {
    return `export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Next.js App. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Built with Next.js and create-js-project
          </p>
        </div>
      </div>
    </footer>
  )
}`;
  }

  private getUtilsFile(ext: string, isTypeScript: boolean): string {
    return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add your utility functions here
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}`;
  }

  private getNextTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "es6"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        paths: {
          "@/*": ["./src/*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    }, null, 2);
  }

  private getNextGitignore(): string {
    return `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`;
  }

  private getNextReadme(projectName: string): string {
    return `# ${projectName}

This is a [Next.js](https://nextjs.org/) project bootstrapped with [create-js-project](https://github.com/your-username/create-js-project).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`src/app/page.tsx\`. The page auto-updates as you edit the file.

This project uses [\`next/font\`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.`;
  }

  private getEslintConfig(): string {
    return JSON.stringify({
      extends: "next/core-web-vitals"
    }, null, 2);
  }

  private getApiRoute(ext: string, isTypeScript: boolean): string {
    return `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ 
    message: 'Data received successfully!',
    data: body,
    timestamp: new Date().toISOString()
  });
}`;
  }

  private getAppFile(ext: string, isTypeScript: boolean): string {
    const typeImports = isTypeScript ? `
import type { AppProps } from 'next/app'` : '';

    return `import '../styles/globals.css'${typeImports}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

import Header from '../components/Header'
import Footer from '../components/Footer'`;
  }

  private getIndexPage(ext: string, isTypeScript: boolean): string {
    return `export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Next.js!
      </h1>
      <p className="text-center text-lg text-gray-600">
        Get started by editing src/pages/index.${ext}
      </p>
      <div className="mt-8 text-center">
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Learn more about Next.js →
        </a>
      </div>
    </div>
  )
}`;
  }

  private getApiPage(ext: string, isTypeScript: boolean): string {
    return `import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
  timestamp: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    res.status(200).json({ 
      message: 'Hello from Next.js API!',
      timestamp: new Date().toISOString()
    })
  } else if (req.method === 'POST') {
    res.status(200).json({ 
      message: 'Data received successfully!',
      timestamp: new Date().toISOString()
    })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(\`Method \${req.method} Not Allowed\`)
  }
}`;
  }
}
