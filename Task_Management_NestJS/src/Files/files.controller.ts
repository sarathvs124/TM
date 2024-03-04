import { Files } from './../Entity/Files';
import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Put,
  UsePipes,
  Body,
  Delete,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoiValidationPipe } from '../Util/validate.pipe';
import {
  FindFiles,
  editFileName,
} from '../Validation-Schema/validation.schema';
import { FileFilterDto } from './file.dto';

@Controller('files')
export class FilesController {
  constructor(
    private fileServices: FilesService,
    @InjectRepository(Files) private fileRepo: Repository<Files>,
  ) {}
  // edit fileName
  @Put('fileName/:file_id')
  @UsePipes(new JoiValidationPipe(editFileName))
  updateFile(
    @Req() req: Request,
    @Param('file_id', ParseIntPipe) file_id: number,
    @Res() res: Response,
  ) {
    return this.fileServices.updateFile(req, file_id, res);
  }

  @Post('/getProjectFiles/:project_id')
  @UsePipes(new JoiValidationPipe(FindFiles))
  async getProjectFiles(
    @Body() findFile: FileFilterDto,
    @Param('project_id', ParseIntPipe) project_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.fileServices.getProjectFiles(project_id, req, findFile, res);
  }

  @Delete('deleteFile/:file_id')
  async deleteFile(
    @Param('file_id', ParseIntPipe) file_id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.fileServices.deleteFileById(file_id, req, res);
  }
}
