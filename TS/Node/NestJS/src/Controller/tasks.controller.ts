import { Body, Controller, Delete, Get, Header, HttpCode, Param, Post, Put, Query, Redirect, Req } from '@nestjs/common';
import type { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

class CreateTaskDTO {
  description: string;
}

@Controller('tasks')
export class TasksController {
  @Get()
  findAll(
    @Query('listId') listId: string,
    @Query('completed') completed: boolean,
  ): Observable<string[]> {
    return of([]);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<string> {
    return Promise.resolve(`This action returns a #${id} task`);
  }

  @Post()
  @HttpCode(204)
  @Header('Cache-Control', 'no-store')
  async create(@Body() createTaskDTO: CreateTaskDTO): Promise<void> {
    return Promise.resolve();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDTO: CreateTaskDTO,
  ): Promise<string> {
    return Promise.resolve(`This action updates a #${id} task`);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return Promise.resolve(`This action removes a #${id} task`);
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
}
