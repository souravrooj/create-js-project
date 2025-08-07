import { BaseGenerator } from "./BaseGenerator";
import { Language } from "../types/ProjectType";

export class ExpressGenerator extends BaseGenerator {
  async generate(projectPath: string, projectName: string, language: Language): Promise<void> {
    const ext = this.getFileExtension(language);
    const isTypeScript = language === "ts";

    // Create directories
    const directories = [
      "src",
      "src/controllers",
      "src/models",
      "src/routes",
      "src/middleware",
      "src/config",
      "src/utils"
    ];

    await this.createDirectories(projectPath, directories);

    // Create files
    const files: Record<string, string> = {};

    // Main app file
    files[`src/app.${ext}`] = this.getAppFile(ext, isTypeScript);

    // Controllers
    files[`src/controllers/exampleController.${ext}`] = this.getExampleController(ext, isTypeScript);

    // Models
    files[`src/models/exampleModel.${ext}`] = this.getExampleModel(ext, isTypeScript);

    // Routes
    files[`src/routes/exampleRoute.${ext}`] = this.getExampleRoute(ext, isTypeScript);

    // Middleware
    files[`src/middleware/errorHandler.${ext}`] = this.getErrorHandler(ext, isTypeScript);

    // Config
    files[`src/config/database.${ext}`] = this.getDatabaseConfig(ext, isTypeScript);

    // Utils
    files[`src/utils/logger.${ext}`] = this.getLogger(ext, isTypeScript);

    // Entry point
    files[`src/index.${ext}`] = this.getIndexFile(ext, isTypeScript);

    // Package.json
    files["package.json"] = this.getPackageJson(projectName, {
      express: "^4.18.2",
      cors: "^2.8.5",
      helmet: "^7.1.0",
      morgan: "^1.10.0",
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
        express: "^4.18.2",
        cors: "^2.8.5",
        helmet: "^7.1.0",
        morgan: "^1.10.0",
        dotenv: "^16.3.1"
      }, {
        start: "node dist/index.js",
        dev: "nodemon src/index.ts",
        build: "tsc"
      }, {
        "@types/express": "^4.17.21",
        "@types/cors": "^2.8.17",
        "@types/morgan": "^1.9.9",
        "@types/node": "^20.10.0",
        "typescript": "^5.3.2",
        "nodemon": "^3.0.2",
        "ts-node": "^10.9.1"
      });
    }

    // Other config files
    files[".gitignore"] = this.getGitignore();
    files["README.md"] = this.getReadme(projectName, "A Node.js Express.js project with MVC structure.");
    files[".env.example"] = `PORT=3000
NODE_ENV=development
`;

    await this.createFiles(projectPath, files);
  }

  private getAppFile(ext: string, isTypeScript: boolean): string {
    const typeImports = isTypeScript ? `
import { Request, Response, NextFunction } from 'express';` : '';

    return `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();${typeImports}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/exampleRoute'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;`;
  }

  private getExampleController(ext: string, isTypeScript: boolean): string {
    const typeAnnotations = isTypeScript ? `
import { Request, Response } from 'express';` : '';

    return `${typeAnnotations}

exports.exampleController = (req, res) => {
  try {
    res.json({
      message: 'Hello from Controller',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createExample = (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    res.status(201).json({
      message: 'Example created successfully',
      data: { name, description }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};`;
  }

  private getExampleModel(ext: string, isTypeScript: boolean): string {
    return `// Example model - replace with your actual database model
class ExampleModel {
  constructor() {
    this.data = [];
  }

  findAll() {
    return this.data;
  }

  findById(id) {
    return this.data.find(item => item.id === id);
  }

  create(data) {
    const newItem = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    };
    this.data.push(newItem);
    return newItem;
  }

  update(id, data) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data, updatedAt: new Date().toISOString() };
      return this.data[index];
    }
    return null;
  }

  delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index !== -1) {
      return this.data.splice(index, 1)[0];
    }
    return null;
  }
}

module.exports = new ExampleModel();`;
  }

  private getExampleRoute(ext: string, isTypeScript: boolean): string {
    return `const express = require('express');
const router = express.Router();
const { exampleController, createExample } = require('../controllers/exampleController');

// GET /api/example
router.get('/example', exampleController);

// POST /api/example
router.post('/example', createExample);

// GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

module.exports = router;`;
  }

  private getErrorHandler(ext: string, isTypeScript: boolean): string {
    const typeAnnotations = isTypeScript ? `
import { Request, Response, NextFunction } from 'express';` : '';

    return `${typeAnnotations}

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';

  res.status(status).json({
    error: {
      message,
      status,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;`;
  }

  private getDatabaseConfig(ext: string, isTypeScript: boolean): string {
    return `// Database configuration
// Replace with your actual database setup (MongoDB, PostgreSQL, etc.)

const config = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'dev_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];`;
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

module.exports = logger;`;
  }

  private getIndexFile(ext: string, isTypeScript: boolean): string {
    return `const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(\`Server running on port \${PORT}\`);
  logger.info(\`Environment: \${process.env.NODE_ENV || 'development'}\`);
});`;
  }
}
