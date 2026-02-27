import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './Basics/Module/tasks.module';
import { /*logger,*/ LoggerMiddleware } from './Basics/Middleware/logger.middleware';
// import { TasksController } from './Controller/tasks.controller';

@Module({
  imports: [TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('tasks');
    // consumer.apply(logger).forRoutes(TasksController);
  }
}
