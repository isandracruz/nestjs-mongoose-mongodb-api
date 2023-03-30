import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Model } from "mongoose";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { UserClass } from './entities/user.entity';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { QueryDto } from './dto/query-dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;  
  let module: TestingModule;  
    
  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {provide: getModelToken(User.name), useValue: Model}
      ],
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        MongooseModule.forFeature([
          {
            name: UserClass.name,
            schema: UserSchema,
          },
        ]),
      ],
    }).compile();   

    controller = module.get<UsersController>(UsersController); 
    service = module.get<UsersService>(UsersService); 
  });  

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });  

  describe('create', () => {
    it("should return the created user", async () => {    
      const user = new User();
      user.name = 'John Doe';
      user.age = 10;  
  
      const createdUser = await controller.create(user);
      expect(createdUser.name).toBe(user.name); 
    });  
  });  
  
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user1 = new User();
      user1.name = 'John Doe';
      user1.age = 30;
      user1.active = true;

      const createdUser = await controller.create(user1);      

      jest.spyOn(service, 'findAll').mockResolvedValue([createdUser]);

      const users = await controller.findAll();
      expect(users).toMatchObject([createdUser]);
      
    });
  });

  describe('findOne', () => {
    it('should return a user with the specified ID', async () => {
      const user = new User();      
      user.name = 'John Doe';
      user.age = 30;
      user.active = true;

      const createdUser = await controller.create(user); 
      const userFound = await controller.findOne(String(createdUser._id));
      expect(String(userFound._id)).toBe(String(createdUser._id));      
    });
  });

  describe('findByDate', () => {
    it('should return an array of users created in a date range', async () => {
      const dateRange = new QueryDto();
      dateRange.dateStart = '2023-03-1';
      dateRange.dateEnd = '2023-04-15';     
       
      const result = await controller.findByDate(dateRange);
      expect(Array.isArray(result)).toBe(true);     
    });
  });

  describe('update', () => {
    it('should update an user with the given ID', async () => {
      const user = new User();      
      user.name = 'John Doe';
      user.age = 30;
      user.active = true;

      const updateData = { age: 40 };

      const createdUser = await controller.create(user);

      const updatedUser = await controller.update(String(createdUser._id), updateData);
      expect(updatedUser.age).toEqual(updateData.age);
    });
  });

  describe('changeActive', () => {
    it('should change the active state of the user dynamically', async () => {
      const user = new User();      
      user.name = 'John Doe';
      user.age = 30;
      user.active = true;      

      const createdUser = await controller.create(user);

      const updatedUser = await controller.changeActive(String(createdUser._id));
      expect(updatedUser.active).toEqual(!createdUser.active);
    });
  });

  describe('remove', () => {
    it('should remove an user with the given ID', async () => {
      const user = new User();      
      user.name = 'John Doe';
      user.age = 30;
      user.active = true;      

      const createdUser = await controller.create(user);

      await controller.remove(String(createdUser._id));

      const userData = await controller.findOne(String(createdUser._id));
      expect(userData).toBeNull();
    });
  });
  
});

  

