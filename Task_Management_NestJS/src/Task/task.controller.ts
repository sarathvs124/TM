import { TaskService } from './task.service';
import {
  TaskStatus,
  addTask,
  updateTask,
  recentUpdateDashboard,
  commentTask,
  AdvancedSearchValidate,
  GetChildListDtoValidate,
  boardFilter,
  filterRecentUpdateHome,
  NormalSearchValidate,
  addIssueType,
  addCategory,
  replacementIssueType,
  replacementCategory,
} from './../Validation-Schema/validation.schema';
import { JoiValidationPipe } from './../Util/validate.pipe';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  Req,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Put,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import {
  AddTaskDto,
  UpdateTaskDto,
  ChangeTaskStatus,
  RecentUpdatesDashboard,
  GetChildListDto,
  AdvancedSearchDto,
  FilterRecentupdates,
  CommentTask,
  BoardFilter,
  NormalSearchDto,
  AddIssueType,
  AddCategory,
  ReplaceIssueType,
  ReplaceCategory,
  FileUpload,
} from './task.dto';
const path = require('path');
import { Env } from '../environment';
import { Roles } from '../Auth/roles.decorator';
import { Role } from '../Enum/Role.enum';
const crypto = require('crypto-extra');
let encode: any;
let uniqueFileName: any;
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Post('/addTask')
  @UsePipes(new JoiValidationPipe(addTask))
  addTask(
    @Body() addTaskDto: AddTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.addTask(addTaskDto, req, res);
  }

  @Get('recentlyviewed')
  async recentlyViewedList(@Req() req: Request, @Res() res: Response) {
    return this.taskService.RecentlyViewedListService(req, res);
  }

  @Get('/getTask/:task_id')
  getTaskById(
    @Param('task_id', ParseIntPipe) task_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.getTaskById(task_id, req, res);
  }

  @Post('/tasklist/:project_id')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new JoiValidationPipe(NormalSearchValidate))
  getTaskList(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Body() normalSearchDto: NormalSearchDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.getTaskList(project_id, normalSearchDto, req, res);
  }

  //file upload
  @Post('upload/:task_id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, callback) {
          let directory = Env.TASK_FILES;
          callback(null, directory);
        },

        filename: async function (req, file, callback) {
          encode = crypto.randomString();
          uniqueFileName =
            encode + '_' + Date.now() + path.extname(file.originalname);
          if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'application/pdf' ||
            file.mimetype == 'text/csv' ||
            file.mimetype == 'video/mp4'
          ) {
            callback(null, uniqueFileName);
          }
        },
      }),
      fileFilter: async function (req, file, callback) {
        encode = crypto.randomString();
        uniqueFileName =
          encode + '_' + Date.now() + path.extname(file.originalname);
        if (
          file.mimetype != 'image/png' &&
          file.mimetype != 'image/jpg' &&
          file.mimetype != 'image/jpeg' &&
          file.mimetype != 'application/pdf' &&
          file.mimetype != 'text/csv' &&
          file.mimetype != 'video/mp4'
        ) {
          req.fileValidationError = 'goes wrong on the mimetype';

          callback(
            new BadRequestException({
              errorMessage:
                'Invalid fileType only supports(jpeg,jpg,png,mp4,csv,pdf)',
              statusCode: 710,
            }),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(
    @Req() req: Request,
    @Res() res: Response,
    @Param('task_id', ParseIntPipe) task_id: number,
    @Body() fileRealName: FileUpload,
    @UploadedFile() file,
  ) {
    const maxSize = 209715200;

    return this.taskService.uploadFile(
      file,
      req,
      task_id,
      uniqueFileName,
      maxSize,
      fileRealName,
      res,
    );
  }

  @Put('updateTask/:task_id')
  @UsePipes(new JoiValidationPipe(updateTask))
  updateTask(
    @Body() updateTasks: UpdateTaskDto,
    @Req() req: Request,
    @Res() response: Response,
    @Param('task_id', ParseIntPipe) task_id: number,
  ) {
    return this.taskService.updateTask(updateTasks, req, task_id, response);
  }

  @Put('changeStatus/:task_id')
  @UsePipes(new JoiValidationPipe(TaskStatus))
  changeStatus(
    @Body() taskStatus: ChangeTaskStatus,
    @Param('task_id', ParseIntPipe) task_id: number,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.taskService.changeTaskStatus(
      taskStatus,
      task_id,
      req,
      response,
    );
  }

  @Get('confirmDelete/:task_id')
  confirmDeleteTask(
    @Param('task_id', ParseIntPipe) task_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.confirmTaskDelete(task_id, req, res);
  }

  @Put('deleteTask/:task_id')
  deleteTask(
    @Param('task_id', ParseIntPipe) task_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.softDeleteTask(task_id, req, res);
  }

  //recent updates home page filter(old api get task history/project_id)
  @Post('getTaskHistory/:project_id')
  @UsePipes(new JoiValidationPipe(filterRecentUpdateHome))
  async FilterRecentupdates(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Body() projects: FilterRecentupdates,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.FilterRecentupdates(project_id, req, projects, res);
  }

  @Get('getTaskListDashboard')
  async getUserTaskList(@Req() req: Request, @Res() res: Response) {
    return this.taskService.getSelfTaskList(req, res);
  }

  @Post('getRecentUpdatesDashboard')
  @UsePipes(new JoiValidationPipe(recentUpdateDashboard))
  async getRecentUpdate(
    @Body() projects: RecentUpdatesDashboard,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.getRecentUpdateDashboard(projects, req, res);
  }

  @Post('subtask/:project_id')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new JoiValidationPipe(GetChildListDtoValidate))
  async getChildList(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Body() getChildListDto: GetChildListDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.getChildListService(
      project_id,
      getChildListDto,
      req,
      res,
    );
  }

  //advance search of task
  @Post('advancedsearch/:project_id')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new JoiValidationPipe(AdvancedSearchValidate))
  async advancedSearch(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Body() advancedSearchDto: AdvancedSearchDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.getAdvancedSearch(
      project_id,
      advancedSearchDto,
      req,
      res,
    );
  }
  //get category list
  @Get('getcategory')
  getCategory(@Req() req: Request, @Res() res: Response) {
    return this.taskService.getCategoryService(req, res);
  }
  //get issue_type list
  @Get('getIssue')
  async getIssue(@Req() req: Request, @Res() res: Response) {
    return this.taskService.getIssue(req, res);
  }

  @Post('commentTask/:project_id')
  @UsePipes(new JoiValidationPipe(commentTask))
  commentTask(
    @Body() commentTasks: CommentTask,
    @Param('project_id', ParseIntPipe) project_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.commentTask(commentTasks, project_id, req, res);
  }

  //board list and filter api
  @Post('board/:project_id')
  @UsePipes(new JoiValidationPipe(boardFilter))
  async getBoardHomeList(
    @Body() boardfilter: BoardFilter,
    @Param('project_id', ParseIntPipe) project_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.getBoardHomeList(project_id, req, boardfilter, res);
  }

  //add issue type
  @Post('addIssueType')
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(addIssueType))
  async addIssueType(
    @Body() issueType: AddIssueType,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.addIssueType(issueType, req, res);
  }
  //add category
  @Post('addCategory')
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(addCategory))
  async addCategory(
    @Body() category: AddCategory,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.addCategory(category, req, res);
  }

  // Gantt chart
  @Get('getGanttChart/:project_id')
  async ganttChart(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.getGanttChart(project_id, req, res);
  }

  // User gantt chart
  @Get('getUserGanttChart')
  async userGanttChart(@Req() req: Request, @Res() res: Response) {
    return this.taskService.getUserGanttChart(req, res);
  }

  //edit issue type
  @Put('editIssueType/:issue_id')
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(addIssueType))
  async editIssueType(
    @Body() issueType: AddIssueType,
    @Param('issue_id', ParseIntPipe) issue_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.editIssueType(issueType, issue_id, req, res);
  }
  //edit category
  @Put('editcategory/:category_id')
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(addCategory))
  async editcategory(
    @Body() category: AddCategory,
    @Param('category_id', ParseIntPipe) category_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.editcategory(category, category_id, req, res);
  }
  //Delete category
  @Put('deleteCategory/:category_id')
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(replacementCategory))
  async deletecategory(
    @Body() replaceCategory: ReplaceCategory,
    @Param('category_id', ParseIntPipe) category_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.deletecategory(
      replaceCategory,
      category_id,
      req,
      res,
    );
  }
  //Delete issue type
  @Put('deleteIssueType/:issue_id')
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(replacementIssueType))
  async deleteissueType(
    @Body() replaceIssueType: ReplaceIssueType,
    @Param('issue_id', ParseIntPipe) issue_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.deleteissueType(
      replaceIssueType,
      issue_id,
      req,
      res,
    );
  }
}
