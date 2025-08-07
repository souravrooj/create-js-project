#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { ProjectGenerator } from "./generators/ProjectGenerator";
import { ProjectType } from "./types/ProjectType";

const program = new Command();

program
  .name("js-project-generator")
  .description("CLI to create various JavaScript/TypeScript project structures")
  .version("1.0.0")
  .argument("[project-name]", "Name of the project")
  .option("-t, --type <type>", "Project type (nodejs, express, nextjs, react, nest, electron, react-native)")
  .option("-l, --language <language>", "Language (js, ts)")
  .action(async (projectName?: string, options?: any) => {
    try {
      let finalProjectName = projectName;
      let projectType = options?.type;
      let language = options?.language;

      // If no project name provided, prompt for it
      if (!finalProjectName) {
        const nameAnswer = await inquirer.prompt([
          {
            type: "input",
            name: "projectName",
            message: "What is your project name?",
            validate: (input: string) => {
              if (!input.trim()) {
                return "Project name is required";
              }
              if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
                return "Project name can only contain letters, numbers, hyphens, and underscores";
              }
              return true;
            }
          }
        ]);
        finalProjectName = nameAnswer.projectName;
      }

      // If no project type provided, prompt for it
      if (!projectType) {
        const typeAnswer = await inquirer.prompt([
          {
            type: "list",
            name: "projectType",
            message: "What type of project do you want to create?",
            choices: [
              { name: "Node.js (Basic)", value: "nodejs" },
              { name: "Express.js (MVC)", value: "express" },
              { name: "Next.js", value: "nextjs" },
              { name: "React", value: "react" },
              { name: "NestJS", value: "nest" },
              { name: "Electron", value: "electron" },
              { name: "React Native", value: "react-native" }
            ]
          }
        ]);
        projectType = typeAnswer.projectType;
      }

      // If no language provided, prompt for it
      if (!language) {
        const languageAnswer = await inquirer.prompt([
          {
            type: "list",
            name: "language",
            message: "What language do you want to use?",
            choices: [
              { name: "JavaScript", value: "js" },
              { name: "TypeScript", value: "ts" }
            ]
          }
        ]);
        language = languageAnswer.language;
      }

      console.log(chalk.blue(`\n🚀 Creating ${projectType} project with ${language.toUpperCase()}...\n`));

      const generator = new ProjectGenerator();
      await generator.generateProject(finalProjectName!, projectType as ProjectType, language);

      console.log(chalk.green(`\n✅ Project "${finalProjectName}" created successfully!`));
      console.log(chalk.yellow(`\n📁 Next steps:`));
      console.log(chalk.white(`  cd ${finalProjectName}`));
      console.log(chalk.white(`  npm install`));
      
      // Show specific start commands based on project type
      switch (projectType) {
        case "nextjs":
          console.log(chalk.white(`  npm run dev`));
          break;
        case "react":
          console.log(chalk.white(`  npm start`));
          break;
        case "electron":
          console.log(chalk.white(`  npm run dev`));
          break;
        case "react-native":
          console.log(chalk.white(`  npx react-native run-android`));
          console.log(chalk.white(`  # or npx react-native run-ios`));
          break;
        default:
          console.log(chalk.white(`  npm start`));
      }

    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

program.parse();
