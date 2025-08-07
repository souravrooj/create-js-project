import { BaseGenerator } from "./BaseGenerator";
import { Language } from "../types/ProjectType";

export class NestJSGenerator extends BaseGenerator {
  async generate(projectPath: string, projectName: string, language: Language): Promise<void> {
    // NestJS only supports TypeScript
    const ext = "ts";
    const isTypeScript = true;

    // Create directories
    const directories = [
      "src",
      "src/controllers",
      "src/services",
      "src/modules",
      "src/dto",
      "src/entities",
      "src/config",
      "src/common",
      "src/common/decorators",
      "src/common/guards",
      "src/common/interceptors",
      "test"
    ];

    await this.createDirectories(projectPath, directories);

    // Create files
    const files: Record<string, string> = {};

    // Main files
    files[`src/main.${ext}`] = this.getMainFile(ext);
    files[`src/app.${ext}`] = this.getAppFile(ext);
    files[`src/app.module.${ext}`] = this.getAppModule(ext);

    // Controllers
    files[`src/controllers/app.controller.${ext}`] = this.getAppController(ext);

    // Services
    files[`src/services/app.service.${ext}`] = this.getAppService(ext);

    // DTOs
    files[`src/dto/create-example.dto.${ext}`] = this.getCreateExampleDto(ext);

    // Entities
    files[`src/entities/example.entity.${ext}`] = this.getExampleEntity(ext);

    // Config
    files[`src/config/database.config.${ext}`] = this.getDatabaseConfig(ext);

    // Common
    files[`src/common/decorators/api-response.decorator.${ext}`] = this.getApiResponseDecorator(ext);

    // Test
    files[`test/app.e2e-spec.${ext}`] = this.getE2ETest(ext);
    files[`test/jest-e2e.json`] = this.getJestE2EConfig();

    // Package.json
    const dependencies = {
      "@nestjs/common": "^10.0.0",
      "@nestjs/core": "^10.0.0",
      "@nestjs/platform-express": "^10.0.0",
      "@nestjs/swagger": "^7.0.0",
      "reflect-metadata": "^0.1.13",
      "rxjs": "^7.8.1"
    };

    const devDependencies = {
      "@nestjs/cli": "^10.0.0",
      "@nestjs/schematics": "^10.0.0",
      "@nestjs/testing": "^10.0.0",
      "@types/express": "^4.17.21",
      "@types/jest": "^29.5.2",
      "@types/node": "^20.10.0",
      "@types/supertest": "^2.0.12",
      "jest": "^29.5.0",
      "source-map-support": "^0.5.21",
      "supertest": "^6.3.3",
      "ts-jest": "^29.1.0",
      "ts-loader": "^9.4.3",
      "ts-node": "^10.9.1",
      "tsconfig-paths": "^4.2.1",
      "typescript": "^5.3.2"
    };

    files["package.json"] = this.getPackageJson(projectName, dependencies, {
      build: "nest build",
      format: "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
      start: "nest start",
      "start:dev": "nest start --watch",
      "start:debug": "nest start --debug --watch",
      "start:prod": "node dist/main",
      lint: "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
      test: "jest",
      "test:watch": "jest --watch",
      "test:cov": "jest --coverage",
      "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
      "test:e2e": "jest --config ./test/jest-e2e.json"
    }, devDependencies);

    // TypeScript config
    files["tsconfig.json"] = this.getNestTsConfig();
    files["tsconfig.build.json"] = this.getNestBuildTsConfig();

    // Other config files
    files[".gitignore"] = this.getNestGitignore();
    files["README.md"] = this.getNestReadme(projectName);
    files["nest-cli.json"] = this.getNestCliConfig();
    files["jest.config.js"] = this.getJestConfig();
    files[".eslintrc.js"] = this.getEslintConfig();
    files[".prettierrc"] = this.getPrettierConfig();

    await this.createFiles(projectPath, files);
  }

  private getMainFile(ext: string): string {
    return `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(\`Application is running on: http://localhost:\${port}\`);
  console.log(\`Swagger documentation: http://localhost:\${port}/api\`);
}
bootstrap();`;
  }

  private getAppFile(ext: string): string {
    return `import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`;
  }

  private getAppModule(ext: string): string {
    return `import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`;
  }

  private getAppController(ext: string): string {
    return `import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from '../services/app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Returns a hello message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}`;
  }

  private getAppService(ext: string): string {
    return `import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}`;
  }

  private getCreateExampleDto(ext: string): string {
    return `import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExampleDto {
  @ApiProperty({
    description: 'The name of the example',
    example: 'Example Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the example',
    example: 'This is an example description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}`;
  }

  private getExampleEntity(ext: string): string {
    return `import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Example {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}`;
  }

  private getDatabaseConfig(ext: string): string {
    return `import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};`;
  }

  private getApiResponseDecorator(ext: string): string {
    return `import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseWrapper = <TModel extends Type<any>>(
  model: TModel,
  status = 200,
  description?: string,
) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
              message: {
                type: 'string',
              },
              statusCode: {
                type: 'number',
              },
            },
          },
        ],
      },
    }),
  );
};`;
  }

  private getE2ETest(ext: string): string {
    return `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.timestamp).toBeDefined();
        expect(res.body.uptime).toBeDefined();
      });
  });
});`;
  }

  private getJestE2EConfig(): string {
    return JSON.stringify({
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: '.',
      testEnvironment: 'node',
      testRegex: '.e2e-spec.ts$',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
    }, null, 2);
  }

  private getNestTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        module: 'commonjs',
        declaraction: true,
        removeComments: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        target: 'ES2020',
        sourceMap: true,
        outDir: './dist',
        baseUrl: './',
        incremental: true,
        skipLibCheck: true,
        strictNullChecks: false,
        noImplicitAny: false,
        strictBindCallApply: false,
        forceConsistentCasingInFileNames: false,
        noFallthroughCasesInSwitch: false,
      },
    }, null, 2);
  }

  private getNestBuildTsConfig(): string {
    return JSON.stringify({
      extends: './tsconfig.json',
      exclude: ['node_modules', 'test', 'dist', '**/*spec.ts'],
    }, null, 2);
  }

  private getNestGitignore(): string {
    return `# compiled output
/dist
/node_modules

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
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
.tern-port`;
  }

  private getNestReadme(projectName: string): string {
    return `# ${projectName}

A [NestJS](https://nestjs.com/) project created with [create-js-project](https://github.com/your-username/create-js-project).

## Description

[NestJS](https://nestjs.com/) framework TypeScript starter repository.

## Installation

\`\`\`bash
npm install
\`\`\`

## Running the app

\`\`\`bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
\`\`\`

## Test

\`\`\`bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
\`\`\`

## API Documentation

Once the application is running, you can access the Swagger documentation at:

\`\`\`
http://localhost:3000/api
\`\`\`

## Support

NestJS is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

NestJS is [MIT licensed](LICENSE).`;
  }

  private getNestCliConfig(): string {
    return JSON.stringify({
      collection: '@nestjs/schematics',
      sourceRoot: 'src',
      entryFile: 'main',
    }, null, 2);
  }

  private getJestConfig(): string {
    return `module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};`;
  }

  private getEslintConfig(): string {
    return `module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};`;
  }

  private getPrettierConfig(): string {
    return JSON.stringify({
      singleQuote: true,
      trailingComma: 'all',
    }, null, 2);
  }
}
