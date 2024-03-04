import { ProjectResourceAllocation } from './../Entity/Project_resource_allocation';
import {
  ALLOCATION_STATUS,
  HISTORY_TYPE,
  SERVICE_EXCEPTION,
  TASK_HISTORY_ACTION,
} from './../Enum/Enums.enum';
const crypto = require('crypto-extra');
import { Project } from '../Entity/Project';
import { STATUS } from '../Enum/Enums.enum';
import { Files } from './../Entity/Files';
import {
  HttpException,
  HttpStatus,
  Logger,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, response } from 'express';
import { Folders } from '../Entity/Folders';
import { User } from '../Entity/User';
import { CustomValidation } from '../Util/custom-validation.schema';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Env } from '../environment';
import { FileRenameView, FileView } from '../views/view';
import { Status } from '../Entity/Status';
import { TaskHistory } from '../Entity/Task_History';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ProjectRole } from '../Enum/Role.enum';
import { FileFilterDto } from './file.dto';
import { isInt } from 'class-validator';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Folders) private folderRepo: Repository<Folders>,
    @InjectRepository(Files) private fileRepo: Repository<Files>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(TaskHistory) private historyRepo: Repository<TaskHistory>,
    @InjectRepository(ProjectResourceAllocation)
    private resourceAllocationRepo: Repository<ProjectResourceAllocation>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  //fileName edit
  async updateFile(req: Request, file_id: number, res: Response) {
    try {
      let user = req['currentUser'];

      const file = await this.fileRepo.findOne({
        relations: ['project_id_file', 'task_id_file'],
        where: { file_id: file_id },
      });

      if (!file) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'file not found',
          statusCode: 402,
        });
      }
      const activeMembers = await this.resourceAllocationRepo.findOne({
        relations: ['role'],
        where: {
          allocated_user: user,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
          status: STATUS.ACTIVE,
          project_id_resource_alloc: file.project_id_file,
        },
      });

      if (!activeMembers) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }

      if (user.role.role_id == 2 && activeMembers.role.role_id == 5) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }

      let fileExt = '.' + file.file_type.split('/').slice()[1];

      if (
        fileExt != '.jpeg' &&
        fileExt != '.jpg' &&
        fileExt != '.png' &&
        fileExt != '.pdf' &&
        fileExt != '.mp4' &&
        fileExt != ',csv'
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'Invalid fileType only supports(jpeg,jpg,png,mp4,csv,pdf)',
          statusCode: 710,
        });
      }
      if (
        !req.body.file_name
          .trim()
          .match(/^(?!\s)[^\s.]*([ ]{1}[^\s.]+)*[^\s.]?(?<!\s)$/)
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'file name must have one space btw 2 words & dot operator is excluded',
          statusCode: 1400,
        });
      }

      const prevFileName = file.file_path.split('/').slice()[3];

      const prevName = file.file_name.split('_').slice()[0] + fileExt;

      const path = file.file_path;

      const newPath = file.file_path.split('/');

      let encode = crypto.randomString();

      const FileName = encode + '_' + Date.now() + fileExt;

      if (prevName == req.body.file_name.trim() + fileExt) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'There is no change in file_name',
          statusCode: 1245,
        });
      }

      const result = file.file_name.split('_').slice(0, -1).join('_');

      newPath[newPath.length - 1] = FileName;
      let filePath = '';

      for (let value in newPath) {
        filePath = filePath + newPath[value] + '/';
      }

      filePath = filePath.slice(0, -1);

      file.file_path = filePath;
      file.updated_by_file = user.user_id;
      file.file_name = req.body.file_name.trim() + fileExt;
      file.updated_date = new Date();

      await fs.promises.rename(
        Env.TASK_FILES + prevFileName,
        Env.TASK_FILES + FileName,
      );
      //  await fs.promises.rename('/home/kelbinjacob/Videos/Phase2-15-02-2023-TaskManagement/task-management-tool/Task_Management_NestJS/TaskFiles/'+prevFileName, '/home/kelbinjacob/Videos/Phase2-15-02-2023-TaskManagement/task-management-tool/Task_Management_NestJS/TaskFiles/'+FileName)
      const fileRenamed = await this.fileRepo.save(file);

      if (!fileRenamed) {
        throw new HttpException(
          'Changes not reflected in DB',
          HttpStatus.CONFLICT,
        );
      } else {
        this.fileRenameTaskHistory(file, req, path, prevFileName, response);
        return res
          .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
          .send(new FileRenameView(result, file));
      }
    } catch (error) {
      throw new HttpException(
        'file directory not detected',
        HttpStatus.CONFLICT,
      );
    }
  }

  async fileRenameTaskHistory(file, req, path, prevFileName, res) {
    try {
      const fileRenameHistory = this.historyRepo.create({
        task_id: file.task_id_file.task_id,
        task_name: file.task_id_file.task_name,
        task_description: file.task_id_file.task_description,
        new_file_name: file.file_name,
        task_history: file.project_id_file,
        new_file_path: file.file_path,
        task_history_status: Status.ACTIVE,
        task_created_date: file.task_id_file.created_date,
        file_name: prevFileName,
        file_path: path,
        file_history: file,
        status: file.status,
        created_date: new Date(),
        updated_date: new Date(),
        created_by_history: req['currentUser'],
        updated_by_history: req['currentUser'],
        action: TASK_HISTORY_ACTION.FILE_RENAME,
        history_type: HISTORY_TYPE.TASK_HISTORY,
      });
      return await this.historyRepo.save(fileRenameHistory);
    } catch (error) {
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getProjectFiles(
    project_id: number,
    req: Request,
    findFile: FileFilterDto,
    res: Response,
  ) {
    try {
      let project = await this.projectRepo.findOne({
        relations: ['project_folder'],
        where: { project_id, status: STATUS.ACTIVE },
      });

      if (!project) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      this.logger.debug(
        'File list and filter: project exist in db, User: ' +
          req['currentUser'].user_name,
      );
      let partOfProject = await this.resourceAllocationRepo.findOne({
        where: {
          allocated_user: req['currentUser'],
          project_id_resource_alloc: project,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!partOfProject) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      this.logger.debug(
        'File list and filter: user is part of project, User: ' +
          req['currentUser'].user_name,
      );
      if (!project.project_folder) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('folder not found'));
      }
      let from_date: Date;
      let to_date: Date;
      if (findFile.from_date) {
        let validatedStartDate = await this.validateDate(findFile.from_date);
        if (!validatedStartDate) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid from date'));
        }
        from_date = new Date(findFile.from_date);
      }
      if (findFile.to_date) {
        let validatedEndDate = await this.validateDate(findFile.to_date);
        if (!validatedEndDate) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid to date'));
        } else if (!findFile.from_date) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('From date is required'));
        }
        to_date = new Date(findFile.to_date);
        if (to_date < from_date) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('From date is greater than to date'));
        }
      }
      return await this.findFilesSub(
        findFile,
        project,
        req,
        from_date,
        to_date,
        res,
      );
    } catch (error) {
      this.logger.error('project list with filter  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async validateUploadedBy(findFile, project) {
    if (findFile.uploaded_by) {
      let user = await this.userRepo.findOne({
        where: { user_id: findFile.uploaded_by, status: STATUS.ACTIVE },
      });

      if (!user) {
        return 1;
      }

      let assigneeExists = await this.resourceAllocationRepo.findOne({
        where: {
          allocated_user: user,
          project_id_resource_alloc: project,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!assigneeExists) {
        return 2;
      }
    } else {
      return;
    }
  }

  async findFilesSub(
    findFile: any,
    project: any,
    req: any,
    from_date: any,
    to_date: any,
    res: any,
  ) {
    let validateUploadedByRes = await this.validateUploadedBy(
      findFile,
      project,
    );
    switch (validateUploadedByRes) {
      case 1:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      case 2:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation('uploaded user is not part of the project'),
          );
      default:
    }
    this.logger.debug(
      'File list and filter: validations passed, User: ' +
        req['currentUser'].user_name,
    );
    let FileResponse = {};
    let subFolders = await this.folderRepo.find({
      relations: ['updated_by_folders'],
      where: { parent_folder: project.project_folder, status: STATUS.ACTIVE },
    });
    this.logger.debug(
      'File list and filter: took sub folders,sub folder count is ' +
        subFolders.length +
        ' User: ' +
        req['currentUser'].user_name,
    );
    let validateReqGetProjectFile = await this.validateReqGetProjectFile(req);
    switch (validateReqGetProjectFile) {
      case 1:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid limit'));
      case 2:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid last data'));
      case 3:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('no record exist on given data'));
      case 4:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid page'));
      case 5:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation(
              'both page and last data will not be accepted',
            ),
          );
      case 6:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('limit must not be greater than 3000'));
      default:
    }
    let lastData = req.query.last_data || null;
    const page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || null;
    let startIndex = (page - 1) * limit;
    let offsetQuery = this.fileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.updated_by_file', 'updated_by_file')
      .leftJoinAndSelect('file.created_by_file', 'created_by_file')
      .where('file.status =:status', { status: STATUS.ACTIVE })
      .andWhere('file.folder_id =:folder_id', {
        folder_id: project.project_folder.folder_id,
      });

    let query = this.fileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.updated_by_file', 'updated_by_file')
      .leftJoinAndSelect('file.created_by_file', 'created_by_file')
      .where('file.status =:status', { status: STATUS.ACTIVE })
      .andWhere('file.folder_id =:folder_id', {
        folder_id: project.project_folder.folder_id,
      });

    if (findFile.from_date && !findFile.to_date) {
      let current_date = new Date();
      this.logger.debug(
        'File list and filter: to date is not given so took current date ' +
          current_date +
          ' as to date, User: ' +
          req['currentUser'].user_name,
      );
      current_date.setDate(current_date.getDate() + 1);
      query.andWhere('file.created_date BETWEEN :fromDate AND :toDate', {
        fromDate: from_date,
        toDate: current_date,
      });
      offsetQuery.andWhere('file.created_date BETWEEN :fromDate AND :toDate', {
        fromDate: from_date,
        toDate: current_date,
      });
    }
    if (findFile.from_date && findFile.to_date) {
      this.logger.debug(
        'File list and filter: both dates are given, from date is ' +
          findFile.from_date +
          ' to date is ' +
          findFile.to_date +
          ' , User: ' +
          req['currentUser'].user_name,
      );
      to_date.setDate(to_date.getDate() + 1);
      query.andWhere('file.created_date BETWEEN :fromDate AND :toDate', {
        fromDate: from_date,
        toDate: to_date,
      });
      offsetQuery.andWhere('file.created_date BETWEEN :fromDate AND :toDate', {
        fromDate: from_date,
        toDate: to_date,
      });
    }
    if (findFile.uploaded_by) {
      query.andWhere('file.created_by =:created_by', {
        created_by: findFile.uploaded_by,
      });
      offsetQuery.andWhere('file.created_by =:created_by', {
        created_by: findFile.uploaded_by,
      });
      this.logger.debug(
        'File list and filter: filter by assignee is implemented, assignee id is ' +
          findFile.uploaded_by +
          ' , User: ' +
          req['currentUser'].user_name,
      );
    }
    if (findFile.keyword) {
      query.andWhere(' file.file_name LIKE:searchKey', {
        searchKey: `%${findFile.keyword
          .toString()
          .toString()
          .trim()
          .replace(/[_%]/g, '\\$&')}%`,
      });
      offsetQuery.andWhere(' file.file_name LIKE:searchKey', {
        searchKey: `%${findFile.keyword
          .toString()
          .toString()
          .trim()
          .replace(/[_%]/g, '\\$&')}%`,
      });
      this.logger.debug(
        'File list and filter: file name searched is ' +
          findFile.keyword.trim() +
          ' , User: ' +
          req['currentUser'].user_name,
      );
    }
    query.orderBy('file.file_id', 'ASC');
    offsetQuery.orderBy('file.file_id', 'ASC');

    let total = await query.getCount();
    if (!limit) {
      limit = total;
    }
    if (req.query.page) {
      //
      startIndex = await this.setStartIndex(startIndex, total);
      query.offset(startIndex).limit(limit);
    } else if (lastData) {
      let lastValue = await offsetQuery
        .andWhere('file.file_id <=:file_id', { file_id: lastData })
        .getCount();
      query.offset(lastValue).limit(limit);
    } else {
      query.offset(startIndex).limit(limit);
    }
    let files = await query.getMany();

    let subFiles = [];
    await Promise.all(
      files.map(async (file) => {
        subFiles.push(new FileView(file));
      }),
    );
    let fileCount = subFiles.length;
    FileResponse['pagerData'] = { total: total, subFileDataCount: fileCount };
    FileResponse['subFolders'] = subFolders;
    FileResponse['subFiles'] = subFiles;
    this.logger.debug(
      'File list and filter: set view and returning, file count is ' +
        subFiles.length +
        ' , User: ' +
        req['currentUser'].user_name,
    );
    return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(FileResponse);
  }

  async setStartIndex(startIndex, total) {
    if (startIndex > total) {
      startIndex = total + 1;
    }
    return startIndex;
  }

  async validateReqGetProjectFile(req) {
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 1;
      }
      if (limitPerPage > 3000) {
        return 6;
      }
    }
    if (req.query.page && req.query.last_data) {
      return 5;
    }
    if (req.query.page) {
      let pageNo = Number(req.query.page);
      if (isNaN(pageNo) || !isInt(pageNo) || pageNo < 1) {
        return 4;
      }
    }
    if (req.query.last_data) {
      return this.validateReqGetProjectFileSub(req);
    }
  }

  async validateReqGetProjectFileSub(req) {
    let lastDataId = Number(req.query.last_data);
    if (isNaN(lastDataId) || !isInt(lastDataId)) {
      return 2;
    }
    let lastValue = await this.fileRepo
      .createQueryBuilder('file')
      .where('file.file_id =:file_id', { file_id: lastDataId })
      .andWhere('file.status =:status', { status: STATUS.ACTIVE })
      .getOne();
    if (!lastValue) {
      return 3;
    }
  }
  // delete a file
  async deleteFileById(file_id, req: Request, res: Response) {
    try {
      let file = await this.fileRepo.findOne({
        relations: ['project_id_file', 'task_id_file', 'created_by_file'],
        where: { status: STATUS.ACTIVE, file_id: file_id },
      });

      if (!file) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('file not found'));
      }
      let access = await this.resourceAllocationRepo.findOne({
        relations: ['role'],
        where: {
          allocated_user: req['currentUser'],
          project_id_resource_alloc: file.project_id_file,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (access) {
        if (access.role.role_id == ProjectRole.DEVELOPER) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
        } else {
          let fileName = file.file_path.split('/').slice(-1)[0];

          await new Promise((f) => setTimeout(f, 1000));
          fs.unlink(Env.TASK_FILES + fileName, (err) => {
            this.logger.error(
              'Delete file: no file fount to unlink: ' +
                req['currentUser'].user_name,
            );
          });

          file.status = STATUS.INACTIVE;
          await this.fileRepo.save(file);
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'File deleted',
            statusCode: 200,
          });
        }
      } else {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
    } catch (error) {
      this.logger.error('delete file  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async validateDate(date) {
    this.logger.debug('validate' + date);

    let dateObject = new Date(date);
    let dateString = dateObject.toISOString().slice(0, 10).toString();
    if (date.toString() != dateString) {
      return false;
    } else {
      return true;
    }
  }
}
