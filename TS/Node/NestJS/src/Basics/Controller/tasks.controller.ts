import { Body, Controller, DefaultValuePipe, Delete, Get, Header, HttpCode, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Redirect, UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import type { Observable } from 'rxjs/internal/Observable';
import { AuthGuard } from 'src/Basics/Guard/auth.guard';
import { Roles } from 'src/Basics/Guard/roles.decorator';
import { RolesGuard } from 'src/Basics/Guard/roles.guard';
import { LoggingInterceptor } from 'src/Basics/Interceptor/logging.interceptor';
import { ZodValidationPipe } from 'src/Basics/Pipe/validation.pipe';
// import { HttpExceptionFilter } from 'src/Exception/http-exception.filter';
import { type CreateTaskDTO, CreateTaskSchema, Task, TasksService } from 'src/Basics/Service/tasks.Service';

@Controller('tasks')
// @UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(
    @Query('listId', new DefaultValuePipe('default')) listId: string,
    @Query('completed') completed: boolean,
  ): Observable<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: string
  ): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (!task) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return task;
  }

  @Post()
  @HttpCode(204)
  @Header('Cache-Control', 'no-store')
  @UsePipes(new ZodValidationPipe(CreateTaskSchema))
  @Roles(['admin'])
  async create(@Body() createTaskDTO: CreateTaskDTO): Promise<void> {
    return this.tasksService.create(createTaskDTO);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDTO: CreateTaskDTO,
  ): Promise<void> {
    return this.tasksService.update(id, updateTaskDTO);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.delete(id);
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
}
