import {
  BatchUpdateValidate,
  allocateUser,
  pinProjectSchema,
  roleFilter,
  EditAllocateValidate,
  addProjectSchema,
  updateProjectSchema,
} from '../Validation-Schema/validation.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '../Auth/roles.decorator';
import { Role } from '../Enum/Role.enum';
import { JoiValidationPipe } from '../Util/validate.pipe';

import {
  AddProjectDto,
  AllocateUserDto,
  EditAllocateUserDto,
  PinProjectDto,
  UpdateProjectDto,
} from './Project.dto';
import { ProjectService } from './project.service';
import { Request, Response } from 'express';
import { BatchUpdateDto } from '../Task/task.dto';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  //get project overall status
  @Get('/overallProjectStatus/:id')
  @Roles(Role.ADMIN, Role.USER)
  overallProjectStatus(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    return this.projectService.overallProjectStatus(req, id, res);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(addProjectSchema))
  async addProject(
    @Body() addProjectDto: AddProjectDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.projectService.addProjectService(addProjectDto, req, res);
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateProjectSchema))
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.projectService.updateProjectService(
      id,
      updateProjectDto,
      req,
      response,
    );
  }
  //project members search and role filter(old api name- allocatedUsersList)
  @Post('Usersprojects/:project_id')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new JoiValidationPipe(roleFilter))
  async getProjectMemberList(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.projectService.getProjectMemberList(project_id, req, res);
  }

  //  Allocate users to project
  @Post('/allocateUser/:project_id')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new JoiValidationPipe(allocateUser))
  allocateUser(
    @Body() allocateUserDto: AllocateUserDto,
    @Param('project_id', ParseIntPipe) project_id: number,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.projectService.allocateUsers(
      allocateUserDto,
      req,
      project_id,
      response,
    );
  }

  //get currentUser allocated projectList
  @Get('/getProject')
  getProjectById(@Req() req: Request, @Res() res: Response) {
    return this.projectService.getProjectById(req, res);
  }
  //project delete
  @Delete('/project/:id')
  async deleteProject(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.projectService.deleteProject(id, req, res);
  }

  @Delete('unallocated/:id')
  @Roles(Role.ADMIN, Role.USER)
  async unallocatedUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.projectService.unallocatedUserService(id, req, response);
  }

  @Get('getUnallocatedUsers/:project_id')
  @Roles(Role.ADMIN, Role.USER)
  async getUnallocatedUsers(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.projectService.getUnAllocatedUsers(project_id, req, response);
  }

  @Get('projectRole/:project_id')
  async getUserProjectRole(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.projectService.getUserProjectRole(project_id, req, response);
  }

  @Post('pinProject')
  @UsePipes(new JoiValidationPipe(pinProjectSchema))
  async pinProject(
    @Body() pinProject: PinProjectDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.projectService.pinProject(pinProject, req, response);
  }
  @Post('batch/:project_id')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new JoiValidationPipe(BatchUpdateValidate))
  async batchUpdate(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Body() batchUpdateDto: BatchUpdateDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.projectService.batchUpdateService(
      project_id,
      batchUpdateDto,
      req,
      response,
    );
  }
  @Post('editallocated/:project_id')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new JoiValidationPipe(EditAllocateValidate))
  async editAllocate(
    @Param('project_id', ParseIntPipe) project_id: number,
    @Body() editAllocateUserDto: EditAllocateUserDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.projectService.editAllocateUserService(
      project_id,
      editAllocateUserDto,
      req,
      response,
    );
  }
}
