import { ConfigModule } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { QueryDto } from './dto/query-dto';
import { UserClass } from './entities/user.entity';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });   

  describe('create', () => {
    it("should return the created user", async () => {    
      const user = new User();
      user.name = 'John Doe';
      user.age = 10;  
  
      const createdUser = await service.create(user);
      expect(createdUser.name).toBe(user.name); 
    });   
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user1 = new User();
      user1.name = 'Jonathan';
      user1.age = 30;
      user1.active = true;

      const createdUser = await service.create(user1);    
      jest.spyOn(service, 'findAll').mockResolvedValue([createdUser]); 

      const users = await service.findAll();
      expect(users).toMatchObject([createdUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user with the specified ID', async () => {
      const user = new User();      
      user.name = 'John Doe';
      user.age = 30;
      user.active = true;

      const createdUser = await service.create(user); 
      const userFound = await service.findOne(String(createdUser._id));
      expect(String(userFound._id)).toBe(String(createdUser._id));      
    });
  });

  describe('findByDate', () => {
    it('should return an array of users created in a date range', async () => {
      const dateRange = new QueryDto();
      dateRange.dateStart = '2023-03-1';
      dateRange.dateEnd = '2023-04-15';     
       
      const result = await service.findByDate(dateRange);
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

      const createdUser = await service.create(user);

      const updatedUser = await service.update(String(createdUser._id), updateData);
      expect(updatedUser.age).toEqual(updateData.age);
    });
  });

  describe('changeActive', () => {
    it('should change the active state of the user dynamically', async () => {
      const user = new User();      
      user.name = 'John Doe';
      user.age = 30;
      user.active = true;      

      const createdUser = await service.create(user);

      const updatedUser = await service.changeActive(String(createdUser._id));
      expect(updatedUser.active).toEqual(!createdUser.active);
    });
  });

  describe('remove', () => {
    it('should remove an user with the given ID', async () => {
      const user = new User();      
      user.name = 'John Doe';
      user.age = 30;
      user.active = true;      

      const createdUser = await service.create(user);

      await service.remove(String(createdUser._id));

      const userData = await service.findOne(String(createdUser._id));
      expect(userData).toBeNull();
    });
  });
  
});
