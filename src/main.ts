import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters';

async function bootstrap() {
  // Crear la aplicación HTTP
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT') || '3001', 10);
  
  // Configurar filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Configurar pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configurar CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configurar microservicio TCP
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: port + 1000, // Puerto para microservicio (4001 si HTTP es 3001)
    },
  });

  // Iniciar tanto el servidor HTTP como el microservicio
  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`🚀 User Microservice is running on:`);
  console.log(`📡 HTTP Server: http://localhost:${port}`);
  console.log(`🔄 Microservice TCP: localhost:${port + 1000}`);
  console.log(`📊 Database: MySQL`);
  console.log(`🛠️  Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});
