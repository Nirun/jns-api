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

  await app.init();
};

export default async (req: any, res: any) => {
  await createServer(server);
  return server(req, res);
};