import fs from "fs-extra";
import path from "path";
import { ProjectType, Language } from "../types/ProjectType";
import { NodeJSGenerator } from "./NodeJSGenerator";
import { ExpressGenerator } from "./ExpressGenerator";
import { NextJSGenerator } from "./NextJSGenerator";
import { ReactGenerator } from "./ReactGenerator";
import { NestJSGenerator } from "./NestJSGenerator";
import { ElectronGenerator } from "./ElectronGenerator";
import { ReactNativeGenerator } from "./ReactNativeGenerator";


export class ProjectGenerator {
  async generateProject(projectName: string, projectType: ProjectType, language: Language): Promise<void> {
    const projectPath = path.join(process.cwd(), projectName);

    // Check if project directory already exists
    if (fs.existsSync(projectPath)) {
      throw new Error(`Project directory "${projectName}" already exists.`);
    }

    // Create project directory
    fs.ensureDirSync(projectPath);

    // Generate project based on type
    switch (projectType) {
      case "nodejs":
        await new NodeJSGenerator().generate(projectPath, projectName, language);
        break;
      case "express":
        await new ExpressGenerator().generate(projectPath, projectName, language);
        break;
      case "nextjs":
        await new NextJSGenerator().generate(projectPath, projectName, language);
        break;
      case "react":
        await new ReactGenerator().generate(projectPath, projectName, language);
        break;
      case "nest":
        await new NestJSGenerator().generate(projectPath, projectName, language);
        break;
      case "electron":
        await new ElectronGenerator().generate(projectPath, projectName, language);
        break;
      case "react-native":
        await new ReactNativeGenerator().generate(projectPath, projectName, language);
        break;
      default:
        throw new Error(`Unknown project type: ${projectType}`);
    }
  }
}
