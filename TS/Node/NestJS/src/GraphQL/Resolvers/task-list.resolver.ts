import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { TaskList } from "../Models/task-list.model";

@Resolver(() => TaskList)
export class TaskListResolver {
  @Query(() => TaskList)
  async taskList(@Args('id', { type: () => Int }) id: number) {
    
  }

  @ResolveField()
  async tasks(@Parent() taskList: TaskList) {
    const { id } = taskList;

  }
}
