import { BaseGenerator } from "./BaseGenerator";
import { Language } from "../types/ProjectType";

export class ElectronGenerator extends BaseGenerator {
  async generate(projectPath: string, projectName: string, language: Language): Promise<void> {
    const ext = this.getFileExtension(language);
    const isTypeScript = language === "ts";

    // Create directories
    const directories = [
      "src",
      "src/main",
      "src/renderer",
      "src/renderer/components",
      "src/renderer/styles",
      "src/preload",
      "public",
      "build"
    ];

    await this.createDirectories(projectPath, directories);

    // Create files
    const files: Record<string, string> = {};

    // Main process files
    files[`src/main/main.${ext}`] = this.getMainProcessFile(ext, isTypeScript);
    files[`src/main/preload.${ext}`] = this.getPreloadFile(ext, isTypeScript);

    // Renderer process files
    files[`src/renderer/index.html`] = this.getRendererHTML();
    files[`src/renderer/renderer.${ext}`] = this.getRendererFile(ext, isTypeScript);
    files[`src/renderer/styles/main.css`] = this.getRendererCSS();

    // Package.json
    const dependencies = {
      "electron": "^27.0.0"
    };

    const devDependencies = {
      "electron-builder": "^24.6.4",
      "concurrently": "^8.2.2",
      "wait-on": "^7.2.0",
      "cross-env": "^7.0.3",
      ...(isTypeScript && {
        "@types/node": "^20.10.0",
        "typescript": "^5.3.2",
        "electron-reload": "^1.5.0"
      })
    };

    files["package.json"] = this.getPackageJson(projectName, dependencies, {
      start: "electron .",
      dev: "concurrently \"npm run dev:renderer\" \"wait-on http://localhost:3000 && npm run dev:main\"",
      "dev:main": "cross-env NODE_ENV=development electron .",
      "dev:renderer": "cd src/renderer && npm start",
      build: "npm run build:renderer && npm run build:main",
      "build:main": "tsc src/main/main.ts --outDir dist/main",
      "build:renderer": "cd src/renderer && npm run build",
      dist: "electron-builder",
      "dist:win": "electron-builder --win",
      "dist:mac": "electron-builder --mac",
      "dist:linux": "electron-builder --linux"
    }, devDependencies);

    // Electron builder config
    files["electron-builder.json"] = this.getElectronBuilderConfig();

    // TypeScript config if needed
    if (isTypeScript) {
      files["tsconfig.json"] = this.getElectronTsConfig();
    }

    // Other config files
    files[".gitignore"] = this.getElectronGitignore();
    files["README.md"] = this.getElectronReadme(projectName);

    await this.createFiles(projectPath, files);
  }

  private getMainProcessFile(ext: string, isTypeScript: boolean): string {
    const typeImports = isTypeScript ? `
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';` : '';

    return `const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');${typeImports}

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false
  });

  // Load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || \`file://\${__dirname}/../renderer/index.html\`;
  mainWindow.loadURL(startUrl);

  // Open the DevTools in development.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('app:get-version', () => {
  return app.getVersion();
});

ipcMain.handle('app:get-name', () => {
  return app.getName();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.`;
  }

  private getPreloadFile(ext: string, isTypeScript: boolean): string {
    const typeImports = isTypeScript ? `
import { contextBridge, ipcRenderer } from 'electron';` : '';

    return `const { contextBridge, ipcRenderer } = require('electron');${typeImports}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getName: () => ipcRenderer.invoke('app:get-name'),
  // Add more API methods here as needed
});`;
  }

  private getRendererHTML(): string {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Electron App</title>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
    <link rel="stylesheet" href="styles/main.css">
  </head>
  <body>
    <div id="root">
      <div class="container">
        <h1>Welcome to Electron!</h1>
        <p>This is an Electron application created with create-js-project.</p>
        <div class="info">
          <p><strong>App Name:</strong> <span id="app-name">Loading...</span></p>
          <p><strong>Version:</strong> <span id="app-version">Loading...</span></p>
        </div>
        <div class="actions">
          <button id="reload-btn">Reload</button>
          <button id="devtools-btn">Toggle DevTools</button>
        </div>
      </div>
    </div>
    <script src="renderer.js"></script>
  </body>
</html>`;
  }

  private getRendererFile(ext: string, isTypeScript: boolean): string {
    const typeImports = isTypeScript ? `
declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
      getName: () => Promise<string>;
    };
  }
}` : '';

    return `${typeImports}

// DOM elements
const appNameElement = document.getElementById('app-name');
const appVersionElement = document.getElementById('app-version');
const reloadBtn = document.getElementById('reload-btn');
const devtoolsBtn = document.getElementById('devtools-btn');

// Load app info
async function loadAppInfo() {
  try {
    const name = await window.electronAPI.getName();
    const version = await window.electronAPI.getVersion();
    
    if (appNameElement) appNameElement.textContent = name;
    if (appVersionElement) appVersionElement.textContent = version;
  } catch (error) {
    console.error('Failed to load app info:', error);
  }
}

// Event listeners
if (reloadBtn) {
  reloadBtn.addEventListener('click', () => {
    window.location.reload();
  });
}

if (devtoolsBtn) {
  devtoolsBtn.addEventListener('click', () => {
    // This would need to be handled by the main process
    console.log('Toggle DevTools clicked');
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadAppInfo();
});

// Add some interactive features
document.addEventListener('keydown', (event) => {
  // Ctrl+R to reload
  if (event.ctrlKey && event.key === 'r') {
    event.preventDefault();
    window.location.reload();
  }
  
  // F12 to toggle devtools (would need main process handling)
  if (event.key === 'F12') {
    event.preventDefault();
    console.log('F12 pressed - would toggle DevTools');
  }
});`;
  }

  private getRendererCSS(): string {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.info {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
}

.info p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info strong {
  color: #ffd700;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  button {
    width: 200px;
  }
}`;
  }

  private getElectronBuilderConfig(): string {
    return JSON.stringify({
      appId: "com.example.electron-app",
      productName: "Electron App",
      directories: {
        output: "dist"
      },
      files: [
        "dist/**/*",
        "node_modules/**/*",
        "package.json"
      ],
      mac: {
        category: "public.app-category.utilities",
        target: "dmg"
      },
      win: {
        target: "nsis"
      },
      linux: {
        target: "AppImage"
      }
    }, null, 2);
  }

  private getElectronTsConfig(): string {
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

  private getElectronGitignore(): string {
    return `# Dependencies
node_modules/

# Production builds
dist/
build/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db`;
  }

  private getElectronReadme(projectName: string): string {
    return `# ${projectName}

An [Electron](https://www.electronjs.org/) application created with [create-js-project](https://github.com/your-username/create-js-project).

## Features

- Cross-platform desktop application
- Modern web technologies (HTML, CSS, JavaScript/TypeScript)
- Native system integration
- Easy packaging and distribution

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

This will start both the renderer process (web app) and the main process (Electron).

### Building

To build the application for distribution:

\`\`\`bash
npm run build
\`\`\`

### Packaging

To create distributable packages:

\`\`\`bash
# For all platforms
npm run dist

# For specific platforms
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
\`\`\`

## Project Structure

\`\`\`
src/
├── main/           # Main process (Electron)
│   ├── main.ts     # Main entry point
│   └── preload.ts  # Preload script
├── renderer/       # Renderer process (Web app)
│   ├── index.html  # Main HTML file
│   ├── renderer.ts # Renderer script
│   └── styles/     # CSS files
└── preload/        # Preload scripts
\`\`\`

## Available Scripts

- \`npm start\` - Start the Electron app
- \`npm run dev\` - Start development mode with hot reload
- \`npm run build\` - Build the application
- \`npm run dist\` - Create distributable packages
- \`npm run dist:win\` - Create Windows package
- \`npm run dist:mac\` - Create macOS package
- \`npm run dist:linux\` - Create Linux package

## Learn More

To learn more about Electron, take a look at the following resources:

- [Electron Documentation](https://www.electronjs.org/docs) - learn about Electron features and API.
- [Electron Forge](https://www.electronforge.io/) - tools for creating, publishing, and installing modern Electron applications.

## License

This project is licensed under the MIT License.`;
  }
}
