// Path: api/api/index.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    // These links ensure the UI loads even if Vercel doesn't serve the local CSS/JS
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


