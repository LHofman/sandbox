import { Injectable } from "@nestjs/common";
import { Observable, of } from "rxjs";
import z from "zod/v3";

export interface Task {
  id: string;
  description: string;
}

export const CreateTaskSchema = z.object({
  description: z.string()
}).required();

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];

  findAll(): Observable<Task[]> {
    return of(this.tasks);
  }

  async findOne(id: string): Promise<Task|undefined> {
    return Promise.resolve(this.tasks.find((task) => task.id === id));
  }

  async create(createTaskDTO: CreateTaskDTO): Promise<void> {
    this.tasks.push({
      id: '' + Math.floor(Math.random() * 1000000),
      ...createTaskDTO,
    });
    return Promise.resolve();
  }

  async update(id: string, updateTaskDTO: CreateTaskDTO): Promise<void> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return Promise.resolve();

    this.tasks[index] = {
      ...this.tasks[index],
      ...updateTaskDTO,
    };

    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return Promise.resolve();

    this.tasks.splice(index, 1);

    return Promise.resolve();
  }
}
