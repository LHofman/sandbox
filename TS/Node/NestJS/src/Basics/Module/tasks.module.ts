import { Module } from "@nestjs/common";
import { TasksController } from "src/Basics/Controller/tasks.controller";
import { TasksService } from "src/Basics/Service/tasks.Service";

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {};
