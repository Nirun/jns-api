// Path: api/api/index.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const server = express();

export const createServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  
  // Ensure this matches your requirement for public access
  app.enableCors(); 
  
  // If you use a global prefix in main.ts, add it here too
  // app.setGlobalPrefix('api'); 
  const config = new DocumentBuilder()
    .setTitle('JNS API')
    .setDescription('Lead Engineer Assignment - URL Shortener API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // We mount Swagger at /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    // CRITICAL: Vercel serverless functions don't have local swagger-ui assets
    // We point to a CDN to ensure the UI actually renders instead of a 404/blank page
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });

  await app.init();
};

export default async (req: any, res: any) => {
  await createServer(server);
  return server(req, res);
};


