import { ProjectGenerator } from '../generators/ProjectGenerator';
import { ProjectType, Language } from '../types/ProjectType';
import fs from 'fs-extra';
import path from 'path';

describe('ProjectGenerator', () => {
  const testProjectName = 'test-project';
  const testProjectPath = path.join(process.cwd(), testProjectName);

  afterEach(async () => {
    // Clean up test project directory
    if (fs.existsSync(testProjectPath)) {
      await fs.remove(testProjectPath);
    }
  });

  describe('generateProject', () => {
    it('should create a Node.js project successfully', async () => {
      const generator = new ProjectGenerator();
      
      await expect(
        generator.generateProject(testProjectName, 'nodejs', 'js')
      ).resolves.not.toThrow();

      expect(fs.existsSync(testProjectPath)).toBe(true);
      expect(fs.existsSync(path.join(testProjectPath, 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(testProjectPath, 'src'))).toBe(true);
    });

    it('should create an Express.js project successfully', async () => {
      const generator = new ProjectGenerator();
      
      await expect(
        generator.generateProject(testProjectName, 'express', 'ts')
      ).resolves.not.toThrow();

      expect(fs.existsSync(testProjectPath)).toBe(true);
      expect(fs.existsSync(path.join(testProjectPath, 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(testProjectPath, 'src/controllers'))).toBe(true);
    });

    it('should throw error if project directory already exists', async () => {
      const generator = new ProjectGenerator();
      
      // Create the directory first
      await fs.ensureDir(testProjectPath);
      
      await expect(
        generator.generateProject(testProjectName, 'nodejs', 'js')
      ).rejects.toThrow(`Project directory "${testProjectName}" already exists.`);
    });
  });
});
