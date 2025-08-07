# js-project-generator

A powerful CLI tool to quickly scaffold various JavaScript and TypeScript project structures with best practices and modern tooling.

## 🎯 **What is js-project-generator?**

`js-project-generator` is a command-line tool that helps you create new JavaScript and TypeScript projects instantly. Instead of manually setting up project structures, installing dependencies, and configuring tools like ESLint, Prettier, and testing frameworks, this CLI does it all for you with a single command.

### **Why use js-project-generator?**
- ⚡ **Save Time**: Create fully configured projects in seconds
- 🛠️ **Zero Configuration**: Everything is pre-configured and ready to run
- 📚 **Best Practices**: Follows industry standards and conventions
- 🎨 **Modern Tooling**: Includes ESLint, Prettier, Jest, and more
- 🔧 **Multiple Frameworks**: Support for 7 popular project types
- 📱 **Cross-Platform**: Works on Windows, macOS, and Linux

## 🚀 Features

- **Multiple Project Types**: Support for 7 different project types
- **Language Support**: JavaScript and TypeScript options (where applicable)
- **Modern Tooling**: Pre-configured with ESLint, Prettier, and testing frameworks
- **Best Practices**: Follows industry standards and conventions
- **Zero Configuration**: Ready-to-run projects out of the box

## 📦 Supported Project Types

| Project Type | JavaScript | TypeScript | Description |
|--------------|------------|------------|-------------|
| **Node.js** | ✅ | ✅ | Basic Node.js server application |
| **Express.js** | ✅ | ✅ | Express.js MVC application |
| **Next.js** | ❌ | ✅ | Full-stack React framework |
| **React** | ✅ | ✅ | React application with Vite |
| **NestJS** | ❌ | ✅ | Progressive Node.js framework |
| **Electron** | ✅ | ✅ | Cross-platform desktop app |
| **React Native** | ✅ | ❌ | Mobile app development |

## 🛠️ Installation

### Global Installation (Recommended)

```bash
npm install -g js-project-generator
```

### Local Installation

```bash
npx js-project-generator@latest
```

## 🚀 **Quick Start**

The easiest way to get started is using the interactive mode:

```bash
js-project-generator
```

This will guide you through the process step by step, asking for:
1. **Project name** (e.g., `my-awesome-app`)
2. **Project type** (Node.js, Express, React, etc.)
3. **Language** (JavaScript or TypeScript)

Then it creates your project with all the necessary files and configurations!

## 📖 Usage

### Interactive Mode (Easiest)

```bash
js-project-generator
```

This will prompt you for:
- Project name
- Project type
- Language (JavaScript/TypeScript)

### Command Line Arguments (Advanced)

If you prefer to specify everything in one command:

```bash
js-project-generator <project-name> --type <project-type> --language <language>
```

#### Examples

```bash
# Create an Express.js project with TypeScript
js-project-generator my-api --type express --language ts

# Create a React project with JavaScript
js-project-generator my-app --type react --language js

# Create a Next.js project (TypeScript only)
js-project-generator my-nextjs-app --type nextjs

# Create a NestJS project (TypeScript only)
js-project-generator my-nest-api --type nest

# Create an Electron app with TypeScript
js-project-generator my-desktop-app --type electron --language ts

# Create a React Native app
js-project-generator my-mobile-app --type react-native
```

## 🏗️ Project Structures

### Node.js
```
project-name/
├── src/
│   ├── index.js
│   ├── app.js
│   ├── utils/
│   └── config/
├── package.json
├── .gitignore
└── README.md
```

### Express.js (MVC)
```
project-name/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── app.js
├── package.json
├── .gitignore
└── README.md
```

### Next.js
```
project-name/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   └── styles/
├── public/
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

### React (Vite)
```
project-name/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### NestJS
```
project-name/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── modules/
│   ├── dto/
│   ├── entities/
│   ├── config/
│   └── common/
├── test/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

### Electron
```
project-name/
├── src/
│   ├── main/
│   ├── renderer/
│   └── preload/
├── public/
├── build/
├── package.json
├── electron-builder.json
└── README.md
```

### React Native
```
project-name/
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   ├── utils/
│   └── assets/
├── android/
├── ios/
├── App.js
├── index.js
├── metro.config.js
├── babel.config.js
├── package.json
└── README.md
```

## 🎯 What's Included

Each generated project comes with:

- **📦 Package.json** with appropriate dependencies and scripts
- **⚙️ TypeScript configuration** (for TS projects)
- **🔍 ESLint and Prettier** configuration for code quality
- **📝 Git ignore** file to exclude unnecessary files
- **📚 Comprehensive README** with setup instructions
- **🏗️ Basic project structure** following best practices
- **🚀 Development scripts** (start, dev, build, test, lint)
- **🧪 Testing setup** with Jest (where applicable)
- **🎨 Styling configuration** (CSS, Tailwind, etc.)
- **📱 Platform-specific configs** (for Electron, React Native)

## 🚀 Quick Start Examples

### Express.js API (Backend)
```bash
js-project-generator my-api --type express --language ts
cd my-api
npm install
npm run dev
# Your API will be running at http://localhost:3000
```

### React App (Frontend)
```bash
js-project-generator my-react-app --type react --language ts
cd my-react-app
npm install
npm start
# Your React app will open at http://localhost:3000
```

### Next.js App (Full-stack)
```bash
js-project-generator my-nextjs-app --type nextjs
cd my-nextjs-app
npm install
npm run dev
# Your Next.js app will be running at http://localhost:3000
```

### Node.js Server (Simple)
```bash
js-project-generator my-server --type nodejs --language js
cd my-server
npm install
npm start
# Your server will be running at http://localhost:3000
```

## 🔧 Development

### Prerequisites
- Node.js 14.0.0 or later
- npm or yarn

### Setup (For Contributors)
```bash
git clone https://github.com/souravrooj/create-js-project.git
cd create-js-project
npm install
npm run build
```

### For End Users
If you just want to use the tool, simply install it globally:
```bash
npm install -g js-project-generator
```

### Available Scripts
- `npm run build` - Build the project
- `npm run dev` - Run in development mode
- `npm run start` - Run the built version
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Commander.js](https://github.com/tj/commander.js) for CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) for interactive prompts
- [fs-extra](https://github.com/jprichardson/node-fs-extra) for file operations

## 📞 Support

If you encounter any issues or have questions:

1. **📋 Check the [Issues](https://github.com/souravrooj/create-js-project/issues) page** - Your question might already be answered
2. **🐛 Create a new issue** with detailed information about your problem
3. **💻 Include your environment**: Node.js version, operating system, and CLI command you used
4. **📧 Contact directly**: Email souravrooj64@gmail.com for urgent issues

### Common Issues
- **"Command not found"**: Make sure you installed the package globally with `npm install -g js-project-generator`
- **"Permission denied"**: On Linux/Mac, you might need to use `sudo npm install -g js-project-generator`
- **"Project directory already exists"**: Choose a different project name or delete the existing directory

## 📧 Contact

- **Author**: Sourav Rooj
- **Email**: souravrooj64@gmail.com
- **Phone**: +91 7001014799 (India)
- **GitHub**: [@souravrooj](https://github.com/souravrooj)

---

**Happy coding! 🎉**
