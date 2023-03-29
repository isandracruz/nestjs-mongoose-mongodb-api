import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryDto } from './dto/query-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserClass } from './entities/user.entity';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserClass.name) private readonly userModel: Model<UserDocument>,
  ) {}
  
  create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  findByDate(range: QueryDto): Promise<UserDocument[]> {
    return this.userModel.find({
      $and: [
        {created_at: {$gte: range.dateStart}},
        {created_at: {$lte: range.dateEnd}}
      ]
    });
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true});
  }

  async changeActive(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    return this.userModel.findByIdAndUpdate(id, { active: !user.active }, {new: true});
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
