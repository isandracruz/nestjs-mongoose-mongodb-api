import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from './dto/query-dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get("/find-all")
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/find-one/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }  

  @Get('/find-by-date')
  @ApiQuery({
    name: 'dateStart',
    required: true,
    type: String,
    description: 'The start of the date range',
    example: '2023-03-1',
  })
  @ApiQuery({
    name: 'dateEnd',
    required: true,
    type: String,
    description: 'The end of the date range',
    example: '2023-03-30',
  })
  findByDate(@Query() range: QueryDto) {
    return this.usersService.findByDate(range);
  }  

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('/change-active/:id')
  changeActive(@Param('id') id: string) {
    return this.usersService.changeActive(id);
  }

  @Delete('/remove/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
