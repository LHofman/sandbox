import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Task } from "./task.model";

@ObjectType()
export class TaskList {
  @Field(type => Int)
  id: number;

  @Field(type => [Task])
  tasks: Task[];
}
