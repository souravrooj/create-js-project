import { BaseGenerator } from "./BaseGenerator";
import { Language } from "../types/ProjectType";

export class ReactGenerator extends BaseGenerator {
  async generate(projectPath: string, projectName: string, language: Language): Promise<void> {
    const ext = this.getFileExtension(language);
    const isTypeScript = language === "ts";

    // Create directories
    const directories = [
      "src",
      "src/components",
      "src/hooks",
      "src/utils",
      "src/styles",
      "public"
    ];

    await this.createDirectories(projectPath, directories);

    // Create files
    const files: Record<string, string> = {};

    // Vite config
    files["vite.config.ts"] = this.getViteConfig();
    
    // Main files
    files[`src/main.${ext}`] = this.getMainFile(ext, isTypeScript);
    files[`src/App.${ext}`] = this.getAppFile(ext, isTypeScript);
    files[`src/index.css`] = this.getIndexCSS();

    // Components
    files[`src/components/Header.${ext}`] = this.getHeaderComponent(ext, isTypeScript);
    files[`src/components/Footer.${ext}`] = this.getFooterComponent(ext, isTypeScript);

    // Hooks
    files[`src/hooks/useLocalStorage.${ext}`] = this.getLocalStorageHook(ext, isTypeScript);

    // Utils
    files[`src/utils/helpers.${ext}`] = this.getHelpersFile(ext, isTypeScript);

    // Package.json
    const dependencies = {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    };

    const devDependencies = {
      "@vitejs/plugin-react": "^4.2.0",
      "vite": "^5.0.0",
      ...(isTypeScript && {
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "typescript": "^5.3.2"
      })
    };

    files["package.json"] = this.getPackageJson(projectName, dependencies, {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
      lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
    }, devDependencies);

    // TypeScript config if needed
    if (isTypeScript) {
      files["tsconfig.json"] = this.getReactTsConfig();
      files["tsconfig.node.json"] = this.getNodeTsConfig();
    }

    // Other config files
    files[".gitignore"] = this.getReactGitignore();
    files["README.md"] = this.getReactReadme(projectName);
    files[".eslintrc.cjs"] = this.getEslintConfig();
    files["index.html"] = this.getIndexHTML();

    await this.createFiles(projectPath, files);
  }

  private getViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})`;
  }

  private getMainFile(ext: string, isTypeScript: boolean): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.${ext}'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
  }

  private getAppFile(ext: string, isTypeScript: boolean): string {
    return `import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to React!
        </h1>
        <div className="text-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code>src/App.${ext}</code> and save to test HMR
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App`;
  }

  private getIndexCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}`;
  }

  private getHeaderComponent(ext: string, isTypeScript: boolean): string {
    return `export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            React App
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
          <p>&copy; 2024 React App. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Built with React and create-js-project
          </p>
        </div>
      </div>
    </footer>
  )
}`;
  }

  private getLocalStorageHook(ext: string, isTypeScript: boolean): string {
    return `import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}`;
  }

  private getHelpersFile(ext: string, isTypeScript: boolean): string {
    return `// Utility functions

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}`;
  }

  private getReactTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,

        /* Bundler mode */
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",

        /* Linting */
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }]
    }, null, 2);
  }

  private getNodeTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: "ESNext",
        moduleResolution: "bundler",
        allowSyntheticDefaultImports: true
      },
      include: ["vite.config.ts"]
    }, null, 2);
  }

  private getReactGitignore(): string {
    return `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`;
  }

  private getReactReadme(projectName: string): string {
    return `# ${projectName}

This project was created with [create-js-project](https://github.com/your-username/create-js-project).

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`src/App.tsx\`. The page auto-updates as you edit the file.

## Available Scripts

- \`npm run dev\` - Start the development server
- \`npm run build\` - Build the app for production
- \`npm run preview\` - Preview the production build
- \`npm run lint\` - Run ESLint

## Learn More

To learn more about React, take a look at the following resources:

- [React Documentation](https://react.dev/) - learn about React features and API.
- [Vite Documentation](https://vitejs.dev/) - learn about Vite features and API.

## Deploy on Vercel

The easiest way to deploy your React app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=react&utm_source=create-react-app&utm_campaign=create-react-app-readme) from the creators of Next.js.

Check out our [React deployment documentation](https://react.dev/learn/start-a-new-react-project#production-builds) for more details.`;
  }

  private getEslintConfig(): string {
    return `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}`;
  }

  private getIndexHTML(): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }
}
