import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    CategoryModule, 
    UserModule, 
    AuthModule, 
    TransactionModule, 
    ConfigModule.forRoot({ isGlobal: true}), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: (configService:ConfigService) => ({
        type: 'mssql',
        host: 'devenvserver.database.windows.net',
        port: 1433,
        username: 'dbadmin',
        password: 'notpassword1@',
        database: 'devdb',
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
  }),
  inject: [ConfigService],
}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
