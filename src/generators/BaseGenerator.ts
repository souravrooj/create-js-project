import fs from "fs-extra";
import path from "path";
import { Language } from "../types/ProjectType";

export abstract class BaseGenerator {
  protected async createDirectories(projectPath: string, directories: string[]): Promise<void> {
    for (const dir of directories) {
      const dirPath = path.join(projectPath, dir);
      await fs.ensureDir(dirPath);
    }
  }

  protected async createFiles(projectPath: string, files: Record<string, string>): Promise<void> {
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(projectPath, filePath);
      await fs.outputFile(fullPath, content.trim());
    }
  }

  protected getFileExtension(language: Language): string {
    return language === "ts" ? "ts" : "js";
  }

  protected getPackageJson(projectName: string, dependencies: Record<string, string> = {}, scripts: Record<string, string> = {}, devDependencies: Record<string, string> = {}): string {
    const packageJson = {
      name: projectName,
      version: "1.0.0",
      description: `A ${projectName} project`,
      main: "src/index.js",
      scripts: {
        start: "node src/index.js",
        ...scripts
      },
      dependencies,
      devDependencies,
      keywords: [],
      author: "",
      license: "MIT"
    };

    return JSON.stringify(packageJson, null, 2);
  }

  protected getTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist", "**/*.test.ts"]
    }, null, 2);
  }

  protected getGitignore(): string {
    return `node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
dist/
build/
.DS_Store
*.log
coverage/
.nyc_output/
.vscode/
.idea/
*.swp
*.swo
`;
  }

  protected getReadme(projectName: string, description: string): string {
    return `# ${projectName}

${description}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

## Available Scripts

- \`npm start\` - Start the application
- \`npm run build\` - Build the application
- \`npm test\` - Run tests

## Project Structure

\`\`\`
src/
├── index.js          # Entry point
└── ...
\`\`\`

## License

MIT
`;
  }

  abstract generate(projectPath: string, projectName: string, language: Language): Promise<void>;
}
