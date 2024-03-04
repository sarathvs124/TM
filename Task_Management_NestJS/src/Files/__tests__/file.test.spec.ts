import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Files } from '../../Entity/Files';
import { Project } from '../../Entity/Project';
import { ProjectResourceAllocation } from '../../Entity/Project_resource_allocation';
import { Task } from '../../Entity/Task';
import { User } from '../../Entity/User';
import { Repository } from 'typeorm/repository/Repository';
import { FilesController } from '../files.controller';
import { FilesService } from '../files.service';

import { Folders } from '../../Entity/Folders';
import { Request, Response } from 'express';
import {
  file,
  file1,
  file3,
  fileList,
  folder,
  project2,
  project3,
  projectResourceAllocation,
  projectResourceAllocation1,
} from './data';
import { TaskHistory } from '../../Entity/Task_History';
import { ALLOCATION_STATUS, STATUS } from '../../Enum/Enums.enum';
import { FileFilterDto } from '../file.dto';

const fs = require('fs');

const folderData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (options.where.folder_id === 1) {
      return folder;
    }
  }),
  find: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  create: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};
const fileData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (options.where.file_id === 100) {
      return file;
    }
  }),
  find: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  create: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation(() => {
    return true;
  }),
};
const projectResourceData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.allocated_user === currentUserObj1 &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED &&
      options.where.status === STATUS.ACTIVE &&
      options.where.project_id_resource_alloc === file.project_id_file
    ) {
      return projectResourceAllocation1;
    }
  }),
  find: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  create: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};
const projectData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  find: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  create: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};

const userData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.user_id === 1000 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return null;
    }
  }),
  find: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  create: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};
const fileName = {
  file_name: 'gvg....ugby',
};
let currentUserObj2 = {
  user_id: 1,
  user_name: 'Hemandh',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
  password_token: null,
  notification_url: null,
  status: 1,
  updated_date: new Date('2023-01-02T18:30:00.000Z'),
  created_date: new Date('2023-01-02T18:30:00.000Z'),
  active_projects: 18,
  new_user: 1,
  login_status: null,
  last_login: '1680167820',
  first_name: 'ddsfgd@@',
  last_name: 'vtgtgggg@@@',
  middle_name: 'ghhyhyhyh@@',
  phone_number: '33333332200',
  profile_photo:
    'https://dev-tm-images.innovaturelabs.com/GtGVdgUMIW_1680148392311.png',
  change_password_status: 1,
  role: {
    role_id: 1,
    role_name: 'Admin',
    status: 1,
    created_date: new Date('2023-01-02T18:30:00.000Z'),
    updated_date: new Date('2023-01-02T18:30:00.000Z'),
    authority: 1,
  },
};

let currentUserObj = {
  user_id: 1,
  user_name: 'Hemandh',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
  password_token: null,
  notification_url: null,
  status: 1,
  updated_date: new Date('2023-01-02T18:30:00.000Z'),
  created_date: new Date('2023-01-02T18:30:00.000Z'),
  active_projects: 18,
  new_user: 1,
  login_status: null,
  last_login: '1680167820',
  first_name: 'ddsfgd@@',
  last_name: 'vtgtgggg@@@',
  middle_name: 'ghhyhyhyh@@',
  phone_number: '33333332200',
  profile_photo:
    'https://dev-tm-images.innovaturelabs.com/GtGVdgUMIW_1680148392311.png',
  change_password_status: 1,
  role: {
    role_id: 1,
    role_name: 'Admin',
    status: 1,
    created_date: new Date('2023-01-02T18:30:00.000Z'),
    updated_date: new Date('2023-01-02T18:30:00.000Z'),
    authority: 1,
  },
};

let uploadedBy = {
  user_id: 10,
  user_name: 'Hemandh10',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
  password_token: null,
  notification_url: null,
  status: 1,
  updated_date: new Date('2023-01-02T18:30:00.000Z'),
  created_date: new Date('2023-01-02T18:30:00.000Z'),
  active_projects: 18,
  new_user: 1,
  login_status: null,
  last_login: '1680167820',
  first_name: 'ddsfgd@@',
  last_name: 'vtgtgggg@@@',
  middle_name: 'ghhyhyhyh@@',
  phone_number: '33333332200',
  profile_photo:
    'https://dev-tm-images.innovaturelabs.com/GtGVdgUMIW_1680148392311.png',
  change_password_status: 1,
  role: {
    role_id: 1,
    role_name: 'Admin',
    status: 1,
    created_date: new Date('2023-01-02T18:30:00.000Z'),
    updated_date: new Date('2023-01-02T18:30:00.000Z'),
    authority: 1,
  },
};
let currentUserObj1 = {
  user_id: 1,
  user_name: 'Hemandh',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
  password_token: null,
  notification_url: null,
  status: 1,
  updated_date: new Date('2023-01-02T18:30:00.000Z'),
  created_date: new Date('2023-01-02T18:30:00.000Z'),
  active_projects: 18,
  new_user: 1,
  login_status: null,
  last_login: '1680167820',
  first_name: 'ddsfgd@@',
  last_name: 'vtgtgggg@@@',
  middle_name: 'ghhyhyhyh@@',
  phone_number: '33333332200',
  profile_photo:
    'https://dev-tm-images.innovaturelabs.com/GtGVdgUMIW_1680148392311.png',
  change_password_status: 1,
  role: {
    role_id: 2,
    role_name: 'User',
    status: 1,
    created_date: new Date('2023-01-02T18:30:00.000Z'),
    updated_date: new Date('2023-01-02T18:30:00.000Z'),
    authority: 1,
  },
};
const requestMock: Request = {
  currentUser: currentUserObj,
  body: {
    file_name: 'sssd',
  },
} as unknown as Request;
const requestMock1: Request = {
  currentUser: currentUserObj1,
} as unknown as Request;
const requestMock2: Request = {
  currentUser: currentUserObj2,
  body: {
    file_name: '....',
  },
} as unknown as Request;
const requestMock3: Request = {
  currentUser: currentUserObj,
  body: {
    file_name: 'sswwsd',
  },
} as unknown as Request;
const responseMock: Response = {
  status: jest.fn((x) => statusResponseMock),
  send: jest.fn((x) => x),
} as unknown as Response;
const statusResponseMock = {
  send: jest.fn((x) => x),
};
describe('file', () => {
  let controller: FilesController;
  let service: FilesService;
  let resourceRepo: Repository<ProjectResourceAllocation>;
  let fileRepo: Repository<Files>;
  let projectRepo: Repository<Project>;
  let folderRepo: Repository<Folders>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(ProjectResourceAllocation),
          useValue: projectResourceData,
        },
        {
          provide: getRepositoryToken(Project),

          useValue: projectData,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userData,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Files),
          useValue: fileData,
        },
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: {},
        },

        {
          provide: getRepositoryToken(Folders),
          useValue: folderData,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        // {
        //   provide:fs,
        //   useValue: {
        //     rename: {
        //       Promise:true
        //     }
        //   }
        // }
      ],
    }).compile();
    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);
    projectRepo = module.get<Repository<Project>>(getRepositoryToken(Project));
    fileRepo = module.get<Repository<Files>>(getRepositoryToken(Files));
    resourceRepo = module.get<Repository<ProjectResourceAllocation>>(
      getRepositoryToken(ProjectResourceAllocation),
    );
    folderRepo = module.get<Repository<Folders>>(getRepositoryToken(Folders));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('update file - file not found', () => {
    it('should return 400 when file is not is found', async () => {
      const file_id = 100;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.updateFile(
        requestMock,
        file_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(402);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update file - file not found in controller', () => {
    it('should return 400 when file is not is found in controller', async () => {
      const file_id = 100;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await controller.updateFile(
        requestMock,
        file_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(402);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update file - unathoriased access', () => {
    it('should return 400 unathoriased access', async () => {
      const file_id = 1;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.updateFile(
        requestMock,
        file_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });
  describe('update file - unathoriased access 2nd', () => {
    it('should return 400 unathoriased access 2nd', async () => {
      const file_id = 1;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );

      const result = await service.updateFile(
        requestMock1,
        file_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });
  describe('update file - invalid file_type', () => {
    it('should return 400 invalid file_type', async () => {
      const file_id = 2;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file1);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );

      const result = await service.updateFile(
        requestMock,
        file_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(710);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('update file - file name does not match regx', () => {
    it('should return 400 file name does not match regx', async () => {
      const file_id = 1;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      const result = await service.updateFile(
        requestMock2,
        file_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(1400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('update file - no change in file_name', () => {
    it('should return 400 no change in file_name', async () => {
      const file_id = 3;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file3);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      const result = await service.updateFile(
        requestMock,
        file_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(1245);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  jest.mock('fs', () => ({
    promises: {
      rename: jest.fn(),
    },
  }));
  // describe('update file - successfully renamed', () => {
  //   it('should return 400 successfully renamed', async () => {
  //     const file_id=3;
  //     const prevFileName="sssd.jpeg"
  //     const FileName="XtHSxH1Bdn_1681197050231.jpeg";

  //     (fileRepo.findOne as jest.Mock).mockResolvedValueOnce((file3));
  //     (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce((projectResourceAllocation1));
  //     const result = await service.updateFile( requestMock3,file_id, responseMock);
  //     console.log(result,"@@@");

  //     expect(result).toBeDefined();
  //     expect(await fs.promises.rename).toHaveBeenCalledWith(
  //       Env.TASK_FILES + prevFileName,
  //       Env.TASK_FILES + FileName
  //     );
  //     expect(result.statusCode).toEqual(200);
  //     expect(responseMock.status).toHaveBeenCalledWith(200);
  //   });
  // });

  //file delete Api test cases

  describe(' file delete - file not found', () => {
    it('should return 400 file not found', async () => {
      const file_id = 100;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.deleteFileById(
        file_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(85);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe(' file delete -user is delveloper unauthoriased', () => {
    it('should return 400 user is delveloper unauthoriased', async () => {
      const file_id = 100;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );

      const result = await service.deleteFileById(
        file_id,
        requestMock1,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe(' file delete - suucessfuly deleted', () => {
    it('should return   suucessfuly deleted', async () => {
      const file_id = 1;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation,
      );

      const result = await service.deleteFileById(
        file_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe(' file delete - suucessfuly deleted controller', () => {
    it('should return   suucessfuly deleted controller', async () => {
      const file_id = 1;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation,
      );
      const result = await controller.deleteFile(
        file_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe(' file delete - unauthoriased', () => {
    it('should return 400  unauthoriased', async () => {
      const file_id = 100;
      (fileRepo.findOne as jest.Mock).mockResolvedValueOnce(file);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.deleteFileById(
        file_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  //get project files Api test cases
  describe('get project files - project not found', () => {
    it('should return 400  project not found', async () => {
      const project_id = 1;
      const findFile: FileFilterDto = {
        from_date: '2023-04-13',
        to_date: '2023-04-13',
        uploaded_by: 1,
        keyword: null,
      };

      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.getProjectFiles(
        project_id,
        requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get project files - unathorised', () => {
    it('should return 400 unathorised', async () => {
      const project_id = 1;
      const findFile: FileFilterDto = {
        from_date: '2023-04-13',
        to_date: '2023-04-13',
        uploaded_by: 1,
        keyword: null,
      };
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.getProjectFiles(
        project_id,
        requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });
  describe('get project files - unathorised in controller', () => {
    it('should return 400 unathorised in controller', async () => {
      const project_id = 1;
      const findFile: FileFilterDto = {
        from_date: '2023-04-13',
        to_date: '2023-04-13',
        uploaded_by: 1,
        keyword: null,
      };
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await controller.getProjectFiles(
        findFile,
        project_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });
  describe('get project files - folder not found', () => {
    it('should return 400 folder not found', async () => {
      const project_id = 1;
      const findFile: FileFilterDto = {
        from_date: '2023-04-13',
        to_date: '2023-04-13',
        uploaded_by: 1,
        keyword: null,
      };

      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project3);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      const result = await service.getProjectFiles(
        project_id,
        requestMock,
        findFile,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(801);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get project files - invalid from date', () => {
    it('should return 400 invalid from date', async () => {
      const project_id = 1;
      const findFile: FileFilterDto = {
        from_date: '2023-02-29',
        to_date: '2023-04-13',
        uploaded_by: 1,
        keyword: null,
      };

      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      const result = await service.getProjectFiles(
        project_id,
        requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(3042);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files - invalid to date', () => {
    it('should return 400 invalid to date', async () => {
      const project_id = 1;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: '2023-02-29',
        uploaded_by: 1,
        keyword: null,
      };

      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      const result = await service.getProjectFiles(
        project_id,
        requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(3043);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files - to_date < from_date', () => {
    it('should return 400 to_date < from_date', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: '2023-04-13',
        to_date: '2023-04-12',
        uploaded_by: null,
        keyword: null,
      };

      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(fileList),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3046);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files - no from date with to date', () => {
    it('should return 400 no from date with to date', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: '2023-04-13',
        uploaded_by: null,
        keyword: null,
      };

      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(fileList),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3041);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files - when uploaded by not found', () => {
    it('should return 400 when uploaded by not found', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: 2,
        keyword: null,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(fileList),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files - when uploaded by is not part of project', () => {
    it('should return 400 when uploaded by is not part of project', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: 10,
        keyword: null,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (options.where.allocated_user == uploadedBy) {
          return null;
        } else {
          return projectResourceAllocation1;
        }
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(fileList),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3048);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files - when invalid limit', () => {
    it('should return 400 when invalid limit', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 'asd' },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return projectResourceAllocation1;
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3073);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files -when limit > 3000', () => {
    it('should return 400 when limit > 3000', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4000 },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return projectResourceAllocation1;
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3677);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files -when page and last data is given', () => {
    it('should return 400 when page and last data is given', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4, page: 1, last_data: 5 },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return projectResourceAllocation1;
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2506);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files - when page is invalid', () => {
    it('should return 400 when page is invalid', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4, page: 'aaa' },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return projectResourceAllocation1;
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2505);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files - when last data is not number', () => {
    it('should return 400 when last data is not number', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4, last_data: 'aaa' },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return projectResourceAllocation1;
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3071);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files -No record exist on given data', () => {
    it('should return 400 No record exist on given data', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4, last_data: 1 },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return projectResourceAllocation1;
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2504);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project files -success case with page and limit', () => {
    it('should return 200 get project files with page and limit', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 10, page: 50 },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: '2023-04-13',
        to_date: null,
        uploaded_by: 25,
        keyword: 'a',
      };

      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (options.where.allocated_user == uploadedBy) {
          return true;
        } else {
          return projectResourceAllocation1;
        }
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(fileList),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result['subFiles']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project files -success case with only last data', () => {
    it('should return 200 get project files with only last data', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 10 },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: '2023-04-13',
        to_date: '2023-04-13',
        uploaded_by: null,
        keyword: null,
      };

      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (options.where.allocated_user == uploadedBy) {
          return true;
        } else {
          return projectResourceAllocation1;
        }
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getOne: jest.fn().mockResolvedValue(true),
              getMany: jest.fn().mockResolvedValue(fileList),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['subFiles']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project files -success case no parameters are given', () => {
    it('should return 200 no parameters are given', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: '2023-04-13',
        to_date: '2023-04-13',
        uploaded_by: null,
        keyword: null,
      };

      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(uploadedBy);
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (options.where.allocated_user == uploadedBy) {
          return true;
        } else {
          return projectResourceAllocation1;
        }
      });
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getOne: jest.fn().mockResolvedValue(true),
              getMany: jest.fn().mockResolvedValue(fileList),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['subFiles']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project files -success case', () => {
    it('should return 200 get project files', async () => {
      const project_id = 1;
      const _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 10, page: 1 },
      } as unknown as Request;
      const findFile: FileFilterDto = {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      };

      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(project2);
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(
        projectResourceAllocation1,
      );
      (folderRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'file') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(fileList),
            };
          }
        },
      );
      const result = await service.getProjectFiles(
        project_id,
        _requestMock,
        findFile,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['subFiles']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
});
