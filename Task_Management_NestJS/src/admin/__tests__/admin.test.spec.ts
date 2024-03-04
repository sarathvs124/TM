import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../admin.controller';
import { AdminService } from '../admin.service';
import { AdminModule } from '../admin.module';

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;
  let adminModule: AdminModule;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AdminModule],
      controllers: [AdminController],
      providers: [AdminService],
    }).compile();

    adminController = app.get<AdminController>(AdminController);
    adminService = app.get<AdminService>(AdminService);
    adminModule = app.get<AdminModule>(AdminModule);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(adminController.getHello()).toBe('Hello World!');
    });
    it('should return "Hello World!"', () => {
      expect(adminService.getHello()).toBe('Hello World!');
    });
    it('should be defined', () => {
      expect(adminModule).toBeDefined();
    });
  });
});
