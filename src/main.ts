import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('The App')
    .setDescription('Crappy API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api')
  app.enableCors();
  await app.listen(parseInt(process.env.SERVERPORT));
}
bootstrap();
