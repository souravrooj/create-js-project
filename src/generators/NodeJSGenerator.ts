import { BaseGenerator } from "./BaseGenerator";
import { Language } from "../types/ProjectType";

export class NodeJSGenerator extends BaseGenerator {
  async generate(projectPath: string, projectName: string, language: Language): Promise<void> {
    const ext = this.getFileExtension(language);
    const isTypeScript = language === "ts";

    // Create directories
    const directories = [
      "src",
      "src/utils",
      "src/config"
    ];

    await this.createDirectories(projectPath, directories);

    // Create files
    const files: Record<string, string> = {};

    // Main entry point
    files[`src/index.${ext}`] = this.getIndexFile(ext, isTypeScript);

    // Utils
    files[`src/utils/logger.${ext}`] = this.getLogger(ext, isTypeScript);

    // Config
    files[`src/config/app.${ext}`] = this.getAppConfig(ext, isTypeScript);

    // Package.json
    files["package.json"] = this.getPackageJson(projectName, {
      dotenv: "^16.3.1"
    }, {
      start: `node src/index.${ext}`,
      dev: `nodemon src/index.${ext}`,
      build: isTypeScript ? "tsc" : "echo 'No build step needed for JavaScript'"
    });

    // TypeScript config if needed
    if (isTypeScript) {
      files["tsconfig.json"] = this.getTsConfig();
      files["package.json"] = this.getPackageJson(projectName, {
        dotenv: "^16.3.1"
      }, {
        start: "node dist/index.js",
        dev: "nodemon src/index.ts",
        build: "tsc"
      }, {
        "@types/node": "^20.10.0",
        "typescript": "^5.3.2",
        "nodemon": "^3.0.2",
        "ts-node": "^10.9.1"
      });
    }

    // Other config files
    files[".gitignore"] = this.getGitignore();
    files["README.md"] = this.getReadme(projectName, "A basic Node.js project.");
    files[".env.example"] = `NODE_ENV=development
PORT=3000
`;

    await this.createFiles(projectPath, files);
  }

  private getIndexFile(ext: string, isTypeScript: boolean): string {
    const typeImports = isTypeScript ? `
import { config } from './config/app';
import { logger } from './utils/logger';` : '';

    return `require('dotenv').config();${typeImports}
const { config } = require('./config/app');
const { logger } = require('./utils/logger');

async function main() {
  try {
    logger.info('Starting application...');
    logger.info(\`Environment: \${config.env}\`);
    logger.info(\`Port: \${config.port}\`);
    
    // Your application logic here
    logger.info('Application started successfully!');
    
    // Example: Keep the process running
    process.on('SIGINT', () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();`;
  }

  private getLogger(ext: string, isTypeScript: boolean): string {
    return `// Simple logger utility
const logger = {
  info: (message, meta = {}) => {
    console.log(\`[INFO] \${new Date().toISOString()}\`, message, meta);
  },
  
  error: (message, error = null) => {
    console.error(\`[ERROR] \${new Date().toISOString()}\`, message, error);
  },
  
  warn: (message, meta = {}) => {
    console.warn(\`[WARN] \${new Date().toISOString()}\`, message, meta);
  },
  
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(\`[DEBUG] \${new Date().toISOString()}\`, message, meta);
    }
  }
};

module.exports = { logger };`;
  }

  private getAppConfig(ext: string, isTypeScript: boolean): string {
    return `// Application configuration
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  
  // Add your configuration here
  app: {
    name: process.env.APP_NAME || 'Node.js App',
    version: process.env.APP_VERSION || '1.0.0'
  }
};

module.exports = { config };`;
  }
}
