import { Module, MiddlewareConsumer } from '@nestjs/common';
//import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
//import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


// This file was change to use the current user middleware insred of the current user interceptor
// This is because the nest flow is middlewares -> guards -> interceptors -> response

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor
    // }

  ],
})

export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes("*")
  }
}
