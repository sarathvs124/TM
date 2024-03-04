import {
  AddTaskDto,
  ChangeTaskStatus,
  GetChildListDto,
  AddCategory,
  AddIssueType,
  ReplaceIssueType,
  AdvancedSearchDto,
  NormalSearchDto,
  RecentUpdatesDashboard,
  ReplaceCategory,
  FileUpload,
  FilterRecentupdates,
  BoardFilter,
  CommentTask,
} from '../task.dto';
import { ALLOCATION_STATUS, STATUS } from '../../Enum/Enums.enum';
import { Profile } from '../../Entity/Profile';
import { RecentlyViewed } from '../../Entity/Recently_viewed';
import { TaskRelationship } from '../../Entity/TaskRelationship';
import { ProjectHistory } from '../../Entity/Project_history';
import { Issue } from '../../Entity/Issue';
import { Category } from '../../Entity/Category';
import { ProjectResourceAllocation } from '../../Entity/Project_resource_allocation';
import { Notifications } from '../../Entity/Notifications';
import { TaskHistory } from '../../Entity/Task_History';
import { TaskController } from '../task.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../task.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as jwt from 'jsonwebtoken';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../../Entity/Task';
import { Project } from '../../Entity/Project';
import { User } from '../../Entity/User';
import { Files } from '../../Entity/Files';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import {
  _recentUpdatesDashBoards1,
  _reviewedList,
  _taskList,
  _tasklist1,
  _taskList12,
  addTaskCreateNotification,
  addTaskInput1,
  addTaskInput2,
  addTaskInputEnDt0,
  addTaskInputEnDtGreaterThanProjEnDt,
  addTaskInputEnDtInvalid,
  addTaskInputEnDtLessThanProjStDt,
  addTaskInputEnDtLessThanStDt,
  addTaskInputStDt0,
  addTaskInputStDtGreaterProjectEnDt,
  addTaskInputStDtInvalid,
  addTaskInputStDtLessProjectStDt,
  addTaskInputWhenCategoryNotFound,
  addTaskInputWithAssignee,
  addTaskInputWithInvalidActualHr1,
  addTaskInputWithInvalidActualHr2,
  addTaskInputWithInvalidEstHr1,
  addTaskInputWithInvalidEstHr2,
  addTaskInputWithInvalidEstHr3,
  addTaskInputWithInvalidEstHr4,
  addTaskInputWithInvalidEstHr5,
  addTaskInputWithInvalidTaskDesc,
  addTaskInputWithInvalidTaskName,
  addTaskInputWithNotify,
  addTaskInputWithNotifyUserNotExist,
  addTaskInputWithParent,
  addTaskInputWithUnallocatedAssignee,
  addTaskResult,
  addTaskResultWithAssignee,
  category,
  categorys,
  categorys2,
  changeStatusResultToClosed,
  changeStatusResultToResolved,
  createCategory,
  createIssueType,
  deleteChildTaskResult,
  deleteParentTaskResult,
  deleteTaskDeveloper,
  deleteTaskResult,
  editCategory,
  editCategory1,
  getChildTaskResult,
  getTaskByIdHistoryData,
  getTaskByIdParent,
  issueType,
  issueType1,
  parentTaskAddTask,
  project_3,
  recentlyViewedDataGetTaskById,
  resourceAllocationAdminDataDeleteTask,
  taskDataGetChildTaskById,
  taskDataGetTaskById,
  taskRelationDataDeleteChildTask,
  uniqueCategory,
  uniqueIssueType,
  taskList,
  issueType3,
  replaceIssue,
  replaceIssue2,
  issueType4,
  replacementIssuetasklist,
  category1,
  category2,
  category3,
  issueType5,
  replacementCategory,
  issueTaskList1,
  category4,
  replacementCategorytasklist,
  category5,
  fileUploadTaskData,
  fileUploadProjectFolder1,
  fileUploadProjectFolder,
  unauthorised,
  projectMember1,
  projectMember,
  fileUploadSave,
  category7,
  category8Result,
  issueTypeLastValue,
  issueTypeResult,
  filterHome,
  boardProject,
  boardRes,
  filterHome2,
  boardAssignee,
  lastValueFilterHome,
  commentTaskId,
  commentHistory,
  projectData1,
  allocatedData1,
  _notifyMention,
  updateTaskData,
  taskUpdateTask,
  updateTaskAllocation,
  assigneeAllocationUpdateTask,
  updateTaskresult,
  updateTaskDataChangeProject,
  updateTaskAllocationDeveloper,
  updateTaskDataInvalidActual,
  updateTaskDataInvalidEstimated,
  updateTaskDataInvalidTaskDescription,
  updateTaskDataInvalidTaskName,
  taskUpdateTaskWithAssignee,
  myTasks,
  taskRelationDataParent,
  deleteTaskFailedResult,
  ganttChartResponse,
  updateTaskresult2,
  taskUpdateTaskWithoutDate,
  updateTaskDataNoChangeInData1,
  updateTaskDataNoChangeInData2,
  updateTaskDataNoChangeInData3,
  taskUpdateTaskWithoutDateAndWithAssignee,
  updateTaskDataNoChangeInData4,
  taskUpdateTask3,
  updateTaskDataNoChangeInData5,
  updateTaskresult3,
  validateNotifyIsNumberInput,
  validateNotifyAndCommentInUpdateTaskData,
  taskDataEndDateValidatedata1,
  taskDataEndDateValidatedata2,
  taskDataEndDateValidatedata3,
  taskDataEndDateValidatedata4,
  fileListGetTaskById,
  updateTaskDataEnDtDateCheck,
  updateTaskDataStDtDateCheck,
  updateTaskDataValidateNotify1,
  replaceCategory2,
  replacementCategorytasklist1,
  updateTaskDataAndNotify,
  commentHistory1,
  updateTaskDataAndNotifyANdComment,
  commentHistory2,
} from '../__tests__/data';

const changeStatusAssignee = {
  user_id: 1,
  user_name: 'Hemandh',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
  password_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
  notification_url: null,
  status: 1,
  updated_date: new Date('2023-01-14T09:39:02.000Z'),
  created_date: new Date('2023-01-14T09:39:02.000Z'),
  active_projects: 10,
  new_user: 1,
  login_status: null,
  last_login: '1680239403',
  first_name: null,
  last_name: null,
  middle_name: null,
  phone_number: null,
  profile_photo: null,
  change_password_status: 1,
};

const changeStatusAssignee3 = {
  user_id: 2,
  user_name: 'Hemandh',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
  password_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
  notification_url: null,
  status: 1,
  updated_date: new Date('2023-01-14T09:39:02.000Z'),
  created_date: new Date('2023-01-14T09:39:02.000Z'),
  active_projects: 10,
  new_user: 1,
  login_status: null,
  last_login: '1680239403',
  first_name: null,
  last_name: null,
  middle_name: null,
  phone_number: null,
  profile_photo: null,
  change_password_status: 1,
};
const changeStatusResult1 = {
  task_id: 10,
  task_name: 'qweartastssssu',
  task_description: 'tabvnvsmsjh,gsh j,bnh',
  status: 1,
  task_status: 1,
  created_date: new Date('2023-03-31T05:10:43.000Z'),
  updated_date: new Date('2023-03-31T12:16:10.842Z'),
  priority: 1,
  actual_hours: '72.00',
  estimated_hours: '72.00',
  start_date: '2023-02-28',
  end_date: '2023-03-02',
  task_relation: 1,
  attachment_status: null,
  project_id: {
    project_id: 2,
    project_name: 'Project 1',
    project_code: 'Proj_101',
    project_description: 'dummy project is live 1',
    status: 1,
    project_status: null,
    end_date: '2023-08-15',
    start_date: '2023-02-15',
    created_date: new Date('2023-02-15T04:58:04.000Z'),
    updated_date: new Date('2023-02-15T04:58:04.000Z'),
    total_resource: 5,
    total_task: 10,
  },
  assignee: changeStatusAssignee,
  created_by: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
  },
  assigner: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
    role: {
      role_id: 1,
      role_name: 'Admin',
      status: 1,
      created_date: new Date('2023-01-02T18:30:00.000Z'),
      updated_date: new Date('2023-01-02T18:30:00.000Z'),
      authority: 1,
    },
  },
  updated_by: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
    role: {
      role_id: 1,
      role_name: 'Admin',
      status: 1,
      created_date: new Date('2023-01-02T18:30:00.000Z'),
      updated_date: new Date('2023-01-02T18:30:00.000Z'),
      authority: 1,
    },
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
const project_2 = {
  project_id: 2,
  project_name: 'Project 1',
  project_code: 'Proj_101',
  project_description: 'dummy project is live 1',
  status: 1,
  project_status: null,
  end_date: '2023-08-15',
  start_date: '2023-02-15',
  created_date: new Date('2023-02-15T04:58:04.000Z'),
  updated_date: new Date('2023-02-15T04:58:04.000Z'),
  total_resource: 5,
  total_task: 4,
};

const changeStatusAssignee2 = {
  user_id: 2,
  user_name: 'Hemandh2',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
  password_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
  notification_url: null,
  status: 1,
  updated_date: new Date('2023-01-14T09:39:02.000Z'),
  created_date: new Date('2023-01-14T09:39:02.000Z'),
  active_projects: 10,
  new_user: 1,
  login_status: null,
  last_login: '1680239403',
  first_name: null,
  last_name: null,
  middle_name: null,
  phone_number: null,
  profile_photo: null,
  change_password_status: 1,
};
const changeStatusTask = {
  task_id: 12,
  task_name: 'qweartastssssu',
  task_description: 'tabvnvsmsjh,gsh j,bnh',
  status: 1,
  task_status: 2,
  created_date: new Date('2023-03-31T05:10:43.000Z'),
  updated_date: new Date('2023-03-31T09:34:13.000Z'),
  priority: 1,
  actual_hours: '72.00',
  estimated_hours: '72.00',
  start_date: '2023-02-28',
  end_date: '2023-03-02',
  task_relation: 1,
  attachment_status: null,
  project_id: project_2,
  assignee: changeStatusAssignee,
  created_by: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680239403',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
  },
};

const changeStatusResult2 = {
  task_id: 10,
  task_name: 'qweartastssssu',
  task_description: 'tabvnvsmsjh,gsh j,bnh',
  status: 1,
  task_status: 1,
  created_date: new Date('2023-03-31T05:10:43.000Z'),
  updated_date: new Date('2023-03-31T12:16:10.842Z'),
  priority: 1,
  actual_hours: '72.00',
  estimated_hours: '72.00',
  start_date: '2023-02-28',
  end_date: '2023-03-02',
  task_relation: 1,
  attachment_status: null,
  project_id: {
    project_id: 2,
    project_name: 'Project 1',
    project_code: 'Proj_101',
    project_description: 'dummy project is live 1',
    status: 1,
    project_status: null,
    end_date: '2023-08-15',
    start_date: '2023-02-15',
    created_date: new Date('2023-02-15T04:58:04.000Z'),
    updated_date: new Date('2023-02-15T04:58:04.000Z'),
    total_resource: 5,
    total_task: 10,
  },
  assignee: changeStatusAssignee2,
  created_by: {
    user_id: 1,
    user_name: 'Hemandhh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
  },
  assigner: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
    role: {
      role_id: 1,
      role_name: 'Admin',
      status: 1,
      created_date: new Date('2023-01-02T18:30:00.000Z'),
      updated_date: new Date('2023-01-02T18:30:00.000Z'),
      authority: 1,
    },
  },
  updated_by: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
    role: {
      role_id: 1,
      role_name: 'Admin',
      status: 1,
      created_date: new Date('2023-01-02T18:30:00.000Z'),
      updated_date: new Date('2023-01-02T18:30:00.000Z'),
      authority: 1,
    },
  },
};

const changeStatusResult3 = {
  task_id: 10,
  task_name: 'qweartastssssu',
  task_description: 'tabvnvsmsjh,gsh j,bnh',
  status: 2,
  task_status: 2,
  created_date: new Date('2023-03-31T05:10:43.000Z'),
  updated_date: new Date('2023-03-31T12:16:10.842Z'),
  priority: 1,
  actual_hours: '72.00',
  estimated_hours: '72.00',
  start_date: '2023-02-28',
  end_date: '2023-03-02',
  task_relation: 1,
  attachment_status: null,
  project_id: {
    project_id: 2,
    project_name: 'Project 1',
    project_code: 'Proj_101',
    project_description: 'dummy project is live 1',
    status: 1,
    project_status: null,
    end_date: '2023-08-15',
    start_date: '2023-02-15',
    created_date: new Date('2023-02-15T04:58:04.000Z'),
    updated_date: new Date('2023-02-15T04:58:04.000Z'),
    total_resource: 5,
    total_task: 10,
  },
  assignee: changeStatusAssignee,
  created_by: {
    user_id: 1,
    user_name: 'Hemandhh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
  },
  assigner: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
    role: {
      role_id: 1,
      role_name: 'Admin',
      status: 1,
      created_date: new Date('2023-01-02T18:30:00.000Z'),
      updated_date: new Date('2023-01-02T18:30:00.000Z'),
      authority: 1,
    },
  },
  updated_by: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680259713',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
    role: {
      role_id: 1,
      role_name: 'Admin',
      status: 1,
      created_date: new Date('2023-01-02T18:30:00.000Z'),
      updated_date: new Date('2023-01-02T18:30:00.000Z'),
      authority: 1,
    },
  },
};
const changeStatusTaskNoAssignee = {
  task_id: 15,
  task_name: 'qweartastssssu',
  task_description: 'tabvnvsmsjh,gsh j,bnh',
  status: 1,
  task_status: 1,
  created_date: new Date('2023-03-31T05:10:43.000Z'),
  updated_date: new Date('2023-03-31T09:34:13.000Z'),
  priority: 1,
  actual_hours: '72.00',
  estimated_hours: '72.00',
  start_date: '2023-02-28',
  end_date: '2023-03-02',
  task_relation: 1,
  attachment_status: null,
  project_id: project_2,
  created_by: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680239403',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
  },
};
const changeStatusTask1 = {
  task_id: 14,
  task_name: 'qweartastssssu',
  task_description: 'tabvnvsmsjh,gsh j,bnh',
  status: 1,
  task_status: 1,
  created_date: new Date('2023-03-31T05:10:43.000Z'),
  updated_date: new Date('2023-03-31T09:34:13.000Z'),
  priority: 1,
  actual_hours: '72.00',
  estimated_hours: '72.00',
  start_date: '2023-02-28',
  end_date: '2023-03-02',
  task_relation: 1,
  attachment_status: null,
  project_id: project_2,
  assignee: changeStatusAssignee,
  created_by: {
    user_id: 1,
    user_name: 'Hemandh',
    email: 'hemandh.hemandh@gmail.com',
    password: '$2b$10$qNaMDNV3hQa7msdAVFCeseNdhCwzcIaLE1FMHErNLvRnuGZjmLUbi',
    password_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTcyNzM0LCJleHAiOjE2ODAxNzMwMzR9.Gb-XfYOn_1cit_oyVyIHuQ5no1s598q_4CUedXeXkoU',
    notification_url: null,
    status: 1,
    updated_date: new Date('2023-01-14T09:39:02.000Z'),
    created_date: new Date('2023-01-14T09:39:02.000Z'),
    active_projects: 10,
    new_user: 1,
    login_status: null,
    last_login: '1680239403',
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: 1,
  },
};
const dummyDeveloper = {
  user_id: 3,
  user_name: 'dummy3',
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

const dummyUnauthorized = {
  user_id: 2,
  user_name: 'dummy',
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
const requestMock: Request = {
  currentUser: currentUserObj,
} as unknown as Request;

const responseMock: Response = {
  status: jest.fn((x) => statusResponseMock),
  send: jest.fn((x) => x),
} as unknown as Response;
const statusResponseMock = {
  send: jest.fn((x) => x),
};
requestMock.headers = {
  'x-access-token': 'my-token',
};
const taskData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.task_id === 10 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return {
        task_id: 10,
        task_name: 'dummy task',
        task_description: 'tabvnvsmsjh,gsh j,bnh',
        status: 1,
        task_status: 1,
        created_date: new Date('2023-03-31T05:10:43.000Z'),
        updated_date: new Date('2023-03-31T05:10:43.000Z'),
        priority: 1,
        actual_hours: '72.00',
        estimated_hours: '72.00',
        start_date: '2023-02-28',
        end_date: '2023-03-02',
        task_relation: 1,
        attachment_status: null,
        project_id: project_2,
      };
    } else if (
      options.where.task_id === 11 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return {
        task_id: 11,
        task_name: 'dummy task 11',
        task_description: 'tabvnvsmsjh,gsh j,bnh',
        status: 1,
        task_status: 2,
        created_date: new Date('2023-03-31T05:10:43.000Z'),
        updated_date: new Date('2023-03-31T05:10:43.000Z'),
        priority: 1,
        actual_hours: '72.00',
        estimated_hours: '72.00',
        start_date: '2023-02-28',
        end_date: '2023-03-02',
        task_relation: 1,
        attachment_status: null,
        project_id: project_2,
      };
    } else if (
      options.where.task_id === 12 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return changeStatusTask;
    } else if (
      options.where.task_id === 14 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return changeStatusTask1;
    } else if (
      options.where.task_id === 15 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return changeStatusTaskNoAssignee;
    } else if (
      options.where.task_id === 16 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return {
        task_id: 16,
        task_name: 'dummy task 11',
        task_description: 'tabvnvsmsjh,gsh j,bnh',
        status: 1,
        task_status: 1,
        created_date: new Date('2023-03-31T05:10:43.000Z'),
        updated_date: new Date('2023-03-31T05:10:43.000Z'),
        priority: 1,
        actual_hours: '72.00',
        estimated_hours: '72.00',
        start_date: '2023-02-28',
        end_date: '2023-03-02',
        task_relation: 1,
        attachment_status: null,
        project_id: project_2,
        assignee: changeStatusAssignee3,
      };
    } else if (
      options.where.task_id === 17 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return deleteChildTaskResult;
    } else if (
      options.where.task_id === 18 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return deleteParentTaskResult;
    } else if (
      options.where.task_id === 19 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return taskDataGetTaskById;
    } else if (
      options.where.task_id === 20 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return taskDataGetChildTaskById;
    } else {
      return null;
    }
  }),
  find: jest.fn().mockImplementation((options: any) => {}),
  update: jest.fn().mockImplementation((options: any) => {}),
  save: jest.fn().mockImplementation((options: any) => {}),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  count: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};

const projectData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.project_id === 2 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return project_2;
    }
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  find: jest.fn().mockImplementation((options: any) => {}),
  update: jest.fn().mockImplementation((options: any) => {}),
  createQueryBuilder: jest.fn(() => ({})),
};

const resourceAllocationData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.project_id_resource_alloc === project_2 &&
      options.where.allocated_user === currentUserObj &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
    ) {
      return {
        project_resource_allocation_id: 2,
        allocation_status: 1,
        status: 1,
        from_date: '2023-02-15',
        to_date: '2023-03-15',
        pin_status: 1,
        pin_order: 2,
        created_date: new Date('2023-02-15T04:58:05.000Z'),
        updated_date: new Date('2023-02-15T04:58:05.000Z'),
        role: {
          role_id: 3,
          role_name: 'Project_Admin',
          status: 1,
          created_date: new Date('2023-01-02T18:30:00.000Z'),
          updated_date: new Date('2023-01-02T18:30:00.000Z'),
          authority: 2,
        },
      };
    } else if (
      options.where.project_id_resource_alloc === project_2 &&
      options.where.allocated_user == dummyDeveloper &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
    ) {
      return {
        project_resource_allocation_id: 2,
        allocation_status: 1,
        status: 1,
        from_date: '2023-02-15',
        to_date: '2023-03-15',
        pin_status: 1,
        pin_order: 2,
        created_date: new Date('2023-02-15T04:58:05.000Z'),
        updated_date: new Date('2023-02-15T04:58:05.000Z'),
        role: {
          role_id: 5,
          role_name: 'Developer',
          status: 1,
          created_date: new Date('2023-01-02T18:30:00.000Z'),
          updated_date: new Date('2023-01-02T18:30:00.000Z'),
          authority: 2,
        },
      };
    } else if (
      options.where.project_id_resource_alloc === project_3 &&
      options.where.allocated_user == dummyDeveloper &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
    ) {
      return deleteTaskDeveloper;
    } else if (
      options.where.project_id_resource_alloc === project_2 &&
      options.where.allocated_user == changeStatusAssignee &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
    ) {
      return {
        project_resource_allocation_id: 2,
        allocation_status: 1,
        status: 1,
        from_date: '2023-02-15',
        to_date: '2023-03-15',
        pin_status: 1,
        pin_order: 2,
        created_date: new Date('2023-02-15T04:59:05.000Z'),
        updated_date: new Date('2023-02-15T04:59:05.000Z'),
        role: {
          role_id: 5,
          role_name: 'Developer',
          status: 1,
          created_date: new Date('2023-01-02T18:30:00.000Z'),
          updated_date: new Date('2023-01-02T18:30:00.000Z'),
          authority: 2,
        },
      };
    } else if (
      options.where.project_id_resource_alloc === project_3 &&
      options.where.allocated_user == currentUserObj &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
    ) {
      return resourceAllocationAdminDataDeleteTask;
    } else if (
      options.where.project_id_resource_alloc === project_2 &&
      options.where.allocated_user === dummyUnauthorized &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
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
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};

const userData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (options.where.user_id === 1) {
      return changeStatusAssignee;
    } else if (options.where.user_id === 2) {
      return changeStatusAssignee2;
    } else if (options.where.user_id === 1001) {
      return dummyUnauthorized;
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
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};

const historyData = {
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

const notificationData = {
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
};

const recentlyViewedData = {
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

const taskRelationData = {
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

const fileData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  find: jest.fn().mockImplementation((options: any) => {}),
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

const categoryData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.status === STATUS.ACTIVE &&
      options.where.category_id === 1
    ) {
      return categorys;
    }
    if (
      options.where.status === STATUS.ACTIVE &&
      options.where.category_id === 7
    ) {
      return categorys;
    }

    if (
      options.where.status === STATUS.ACTIVE &&
      options.where.category_name === 'Testing'
    ) {
      return categorys2;
    }
    if (
      options.where.status === STATUS.ACTIVE &&
      options.where.category_id === 8
    ) {
      return editCategory1;
    }
  }),
  find: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.category_id === 7 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return category3;
    }
    if (
      options.where.category_id === 5 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return category3;
    }
    if (
      options.where.category_id === 100 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return replacementCategory;
    }
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  create: jest.fn().mockImplementation((options: any) => {}),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};

const issueTypeData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.status === STATUS.ACTIVE &&
      options.where.issue_id === 2
    ) {
      return issueType;
    }
    if (
      options.where.status === STATUS.ACTIVE &&
      options.where.issue_id === 7
    ) {
      return issueType;
    }

    if (
      options.where.status === STATUS.ACTIVE &&
      options.where.issue_name === 'Other'
    ) {
      return issueType;
    }
    if (
      options.where.status === STATUS.ACTIVE &&
      options.where.issue_id === 8
    ) {
      return issueType5;
    }
  }),
  find: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.issue_id === 7 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return replaceIssue2;
    } else if (
      options.where.issue_id === 5 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return replaceIssue2;
    } else if (
      options.where.issue_id === 100 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return replaceIssue;
    }
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  create: jest.fn().mockImplementation((options: any) => {}),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};

describe('task', () => {
  let controller: TaskController;
  let service: TaskService;
  let taskRepo: Repository<Task>;
  let taskRelationRepo: Repository<TaskRelationship>;
  let categoryRepo: Repository<Category>;
  let issueTypeRepo: Repository<Issue>;
  let projectRepo: Repository<Project>;
  let userRepo: Repository<User>;
  let resourceRepo: Repository<ProjectResourceAllocation>;
  let notificationRepo: Repository<Notifications>;
  let fileRepo: Repository<Files>;
  let historyRepo: Repository<TaskHistory>;
  let recentlyViewRepo: Repository<RecentlyViewed>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        JwtService,
        {
          provide: JwtService,
          useValue: {
            sign: (payload: any) => jwt.sign(payload, 'secret'),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(Task),
          useValue: taskData,
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
          provide: getRepositoryToken(Files),
          useValue: fileData,
        },
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: historyData,
        },
        {
          provide: getRepositoryToken(Notifications),
          useValue: notificationData,
        },
        {
          provide: getRepositoryToken(ProjectResourceAllocation),
          useValue: resourceAllocationData,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryData,
        },
        {
          provide: getRepositoryToken(Issue),
          useValue: issueTypeData,
        },
        {
          provide: getRepositoryToken(ProjectHistory),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TaskRelationship),
          useValue: taskRelationData,
        },
        {
          provide: getRepositoryToken(RecentlyViewed),
          useValue: recentlyViewedData,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: {},
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
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
    taskRepo = module.get<Repository<Task>>(getRepositoryToken(Task));
    taskRelationRepo = module.get<Repository<TaskRelationship>>(
      getRepositoryToken(TaskRelationship),
    );
    categoryRepo = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    issueTypeRepo = module.get<Repository<Issue>>(getRepositoryToken(Issue));
    projectRepo = module.get<Repository<Project>>(getRepositoryToken(Project));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    resourceRepo = module.get<Repository<ProjectResourceAllocation>>(
      getRepositoryToken(ProjectResourceAllocation),
    );
    notificationRepo = module.get<Repository<Notifications>>(
      getRepositoryToken(Notifications),
    );
    fileRepo = module.get<Repository<Files>>(getRepositoryToken(Files));
    historyRepo = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
    recentlyViewRepo = module.get<Repository<RecentlyViewed>>(
      getRepositoryToken(RecentlyViewed),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('confirm delete task', () => {
    it('should return 200 when user is able to delete task', async () => {
      const task_id = 10;
      const result = await controller.confirmDeleteTask(
        task_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('confirm delete task', () => {
    it('should return 200 when user is able to delete task', async () => {
      const task_id = 10;
      const result = await service.confirmTaskDelete(
        task_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('confirm delete task', () => {
    it('should return 400 when task not found', async () => {
      const task_id = 80;
      const result = await service.confirmTaskDelete(
        task_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(52);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('confirm delete task', () => {
    it('should return un authorized access when no allocation is found found', async () => {
      const task_id = 10;
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
      } as unknown as Request;
      const result = await service.confirmTaskDelete(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('confirm delete task', () => {
    it('should return 400 when task not found', async () => {
      const task_id = 10;
      let _requestMock: Request = {
        currentUser: dummyDeveloper,
      } as unknown as Request;
      const result = await service.confirmTaskDelete(
        task_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('confirm delete task', () => {
    it('should return 400 when task not found', async () => {
      const task_id = 11;
      const result = await service.confirmTaskDelete(
        task_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(202);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('add task with assignee not allocated to project', () => {
    it('should return 400 when add task with assignee does not belongs to project', async () => {
      const taskBody: AddTaskDto = addTaskInputWithAssignee;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);

      const result = await service.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(51);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task - Controller', () => {
    it('should return 200 when task is created', async () => {
      const taskBody: AddTaskDto = addTaskInput1;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(addTaskResult);

      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('add task - when project not found', () => {
    it('should return 400 when project not found', async () => {
      const taskBody: AddTaskDto = addTaskInput2;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;

      (projectRepo.findOne as jest.Mock).mockImplementationOnce((task) => {
        if (task.project_id === 3) {
          return Promise.resolve(null);
        }
      });

      const result = await service.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when user is not allocated', () => {
    it('should return 400 when user is not allocated', async () => {
      const taskBody: AddTaskDto = addTaskInput1;
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
        body: taskBody,
      } as unknown as Request;

      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('add task when user is developer', () => {
    it('should return 400 when user is developer', async () => {
      const taskBody: AddTaskDto = addTaskInput1;
      let _requestMock: Request = {
        currentUser: dummyDeveloper,
        body: taskBody,
      } as unknown as Request;

      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('add task when parent task not found', () => {
    it('should return 400 when parent task not found', async () => {
      const taskBody: AddTaskDto = addTaskInputWithParent;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(1071);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when parent task is found and task exist', () => {
    it('should return 400 when parent task is found and task exist', async () => {
      const taskBody: AddTaskDto = addTaskInputWithParent;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(1030);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when parent task is found', () => {
    it('should return 200 when parent task is found', async () => {
      const taskBody: AddTaskDto = addTaskInputWithParent;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          } else if (method === 'taskParent') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
            };
          }
        },
      );
      (taskRelationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'relation') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(addTaskResult);

      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('add task when start date is set to 0', () => {
    it('should return 400 when start date is set to 0', async () => {
      const taskBody: AddTaskDto = addTaskInputStDt0;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(48);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when end date is set to 0', () => {
    it('should return 400 when end date is set to 0', async () => {
      const taskBody: AddTaskDto = addTaskInputEnDt0;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(49);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when start date is set to invalid', () => {
    it('should return 400 when start date is set to invalid', async () => {
      const taskBody: AddTaskDto = addTaskInputStDtInvalid;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(698);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when start date is < project start date', () => {
    it('should return 400 when start date is < project start date', async () => {
      const taskBody: AddTaskDto = addTaskInputStDtLessProjectStDt;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(82);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when start date is > project end date', () => {
    it('should return 400 when start date is > project end date', async () => {
      const taskBody: AddTaskDto = addTaskInputStDtGreaterProjectEnDt;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(655);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when end date is invalid', () => {
    it('should return 400 when start date is invalid', async () => {
      const taskBody: AddTaskDto = addTaskInputEnDtInvalid;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(699);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when end date is > proj end date', () => {
    it('should return 400 when start date is > proj end date', async () => {
      const taskBody: AddTaskDto = addTaskInputEnDtGreaterThanProjEnDt;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(1029);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when end date is < proj start date', () => {
    it('should return 400 when start date is < proj start date', async () => {
      const taskBody: AddTaskDto = addTaskInputEnDtLessThanProjStDt;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(667);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when end date is < start date', () => {
    it('should return 400 when start date is < start date', async () => {
      const taskBody: AddTaskDto = addTaskInputEnDtLessThanStDt;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(75);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when task name is invalid', () => {
    it('should return 400 when task name is invalid', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidTaskName;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(1034);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when task description is invalid', () => {
    it('should return 400 when task description is invalid', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidTaskDesc;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(69);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when actual hour is invalid', () => {
    it('should return 400 when actual hour is invalid', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidActualHr1;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(77);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('add task when actual hour is invalid with 2 "."', () => {
    it('should return 400 when actual hour is invalid with 2 "."', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidActualHr2;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(77);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when estimated hour is invalid with string', () => {
    it('should return 400 when actual hour is invalid with string', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidEstHr1;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(76);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when estimated hour is invalid with proper value with invalid bfr decimal > 72', () => {
    it('should return 400 when actual hour is invalid with proper value with invalid bfr decimal > 72', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidEstHr2;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(76);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when estimated hour is just above 72', () => {
    it('should return 400 when actual hour is just above 72', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidEstHr3;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(76);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when estimated hour is 0', () => {
    it('should return 400 when actual hour is 0', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidEstHr4;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(76);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when estimated hour is totally invalid', () => {
    it('should return 400 when actual hour is totally invalid', async () => {
      const taskBody: AddTaskDto = addTaskInputWithInvalidEstHr5;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTaskAddTask),
      }));
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(76);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when category not found', () => {
    it('should return 400 when category not found', async () => {
      const taskBody: AddTaskDto = addTaskInputWhenCategoryNotFound;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(633);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task when issue type not found', () => {
    it('should return 400 when issue type not found', async () => {
      const taskBody: AddTaskDto = addTaskInputWhenCategoryNotFound;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(634);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task with assignee', () => {
    it('should return 200 when add task with assignee', async () => {
      const taskBody: AddTaskDto = addTaskInputWithAssignee;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(
        addTaskResultWithAssignee,
      );
      (notificationRepo.create as jest.Mock).mockResolvedValueOnce(
        addTaskCreateNotification,
      );
      const result = await service.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('add task with assignee not found', () => {
    it('should return 400 when add task with assignee does not exist', async () => {
      const taskBody: AddTaskDto = addTaskInputWithAssignee;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(addTaskResult);

      const result = await service.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task with assignee not allocated to project', () => {
    it('should return 400 when add task with assignee does not belongs to project', async () => {
      const taskBody: AddTaskDto = addTaskInputWithUnallocatedAssignee;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(addTaskResult);

      const result = await service.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(68);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add task with notify', () => {
    it('should return 200 with notify', async () => {
      const taskBody: AddTaskDto = addTaskInputWithNotify;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(addTaskResult);

      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(1771);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('add task with notify user does not exist', () => {
    it('should return 200 with notify user does not exist', async () => {
      const taskBody: AddTaskDto = addTaskInputWithNotifyUserNotExist;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(addTaskResult);

      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(1770);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('add task - hasStartDate start_date must be a valid date', () => {
    it('should return 400 hasStartDate start_date must be a valid date', async () => {
      const taskBody: AddTaskDto = addTaskInput1;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const findByIdMock = jest.fn().mockResolvedValueOnce(1);
      jest.spyOn(service, 'hasStartDate').mockImplementationOnce(findByIdMock);

      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toEqual(48);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('change status', () => {
    it('should return 200 when success', async () => {
      const task_id = 12;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await controller.changeStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('change status', () => {
    it('should return 200 when success', async () => {
      const task_id = 12;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('change status - task not found', () => {
    it('should return 400 when task not found', async () => {
      const task_id = 13;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(52);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('change status - user is not part of project', () => {
    it('should return 400 when user is not part of project', async () => {
      const task_id = 12;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('edit category,issuetype and delete issue type40%', () => {
    it('should return 400 when assignee is not found', async () => {
      const task_id = 12;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: 55,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('change status - there is no change in data', () => {
    it('should return 200 when there is no change in data', async () => {
      const task_id = 14;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1033);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('change status - assignee is not part of project', () => {
    it('should return 400 when assignee is not part of project', async () => {
      const task_id = 14;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: 2,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(68);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('change status - when try to remove assignee', () => {
    it('should return 400 when try to remove assignee', async () => {
      const task_id = 12;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: null,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1031);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('change status - when no change in data without assignee', () => {
    it('should return 200 when no change in data without assignee', async () => {
      const task_id = 15;
      const requestBody: ChangeTaskStatus = {
        task_status: 1,
        assignee: null,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1033);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('change status - when success', () => {
    it('should return 200 when success', async () => {
      const task_id = 15;
      const requestBody: ChangeTaskStatus = {
        task_status: 3,
        assignee: null,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('change status - change status and assignee with no assignee in old data', () => {
    it('should return 200 when success change status and assignee with no assignee in old data', async () => {
      const task_id = 15;
      const requestBody: ChangeTaskStatus = {
        task_status: 3,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(changeStatusResult2);
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('change status - when both status and assignee changes', () => {
    it('should return 200 when success when both status and assignee changes', async () => {
      const task_id = 16;
      const requestBody: ChangeTaskStatus = {
        task_status: 2,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.save as jest.Mock).mockImplementationOnce((task) => {
        return Promise.resolve(changeStatusResult2);
      });
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  //qqq
  describe('change status - success when status changes but not assignee', () => {
    it('should return 200 when success when status changes but not assignee', async () => {
      const task_id = 12;
      const requestBody: ChangeTaskStatus = {
        task_status: 3,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(
        changeStatusResultToResolved,
      );
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('change status - when no change in status, but assignee', () => {
    it('should return 200 when success when no change in status, but assignee', async () => {
      const task_id = 16;
      const requestBody: ChangeTaskStatus = {
        task_status: 2,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(changeStatusResult3);
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('change status - success when both changes', () => {
    it('should return 200 when success when both changes', async () => {
      const task_id = 16;
      const requestBody: ChangeTaskStatus = {
        task_status: 2,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(changeStatusResult3);
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('change status - success when status changes to resolved', () => {
    it('should return 200 when success when status changes to resolved', async () => {
      const task_id = 16;
      const requestBody: ChangeTaskStatus = {
        task_status: 2,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(
        changeStatusResultToResolved,
      );
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('change status - success when status changes to closed', () => {
    it('should return 200 when success when status changes to closed', async () => {
      const task_id = 16;
      const requestBody: ChangeTaskStatus = {
        task_status: 2,
        assignee: 1,
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(
        changeStatusResultToClosed,
      );
      const result = await service.changeTaskStatus(
        requestBody,
        task_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Delete task - success when delete task', () => {
    it('should return 200 when success when delete task', async () => {
      const task_id = 10;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(deleteTaskResult);
      const result = await controller.deleteTask(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Delete task - success when delete task', () => {
    it('should return 200 when success when delete task', async () => {
      const task_id = 17;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRelationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'taskRelation') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),

              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest
                .fn()
                .mockResolvedValue(taskRelationDataDeleteChildTask),
            };
          } else if (method === 'taskRelationCount') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      (taskRepo.save as jest.Mock).mockImplementationOnce((task) => {
        if (task == deleteChildTaskResult) {
          return Promise.resolve(deleteTaskResult);
        }
      });
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(deleteTaskResult);
      const result = await service.softDeleteTask(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Delete soft task - task not found', () => {
    it('should return 400 when given task is not found', async () => {
      const task_id = 1000;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      (taskRepo.save as jest.Mock).mockResolvedValueOnce(deleteTaskResult);

      const result = await service.softDeleteTask(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(52);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Delete soft task - when user not allocated to project', () => {
    it('should return 400 when user not allocated to project', async () => {
      const task_id = 17;
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
      } as unknown as Request;

      (taskRepo.save as jest.Mock).mockResolvedValueOnce(deleteTaskResult);

      const result = await service.softDeleteTask(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('Delete soft task - when user is a developer', () => {
    it('should return 400 when user is a developer', async () => {
      const task_id = 17;
      let _requestMock: Request = {
        currentUser: dummyDeveloper,
      } as unknown as Request;

      (taskRepo.save as jest.Mock).mockResolvedValueOnce(deleteTaskResult);

      const result = await service.softDeleteTask(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('Delete soft task - when failed to delete task', () => {
    it('should return 400 when failed to delete task', async () => {
      const task_id = 18;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRelationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'taskRelation') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(taskRelationDataParent),
            };
          }
        },
      );
      (taskRepo.save as jest.Mock).mockImplementationOnce((task) => {
        if (task == deleteParentTaskResult) {
          return Promise.resolve(deleteTaskFailedResult);
        }
      });
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(
        deleteTaskFailedResult,
      );
      const result = await service.softDeleteTask(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get sub task - success ', () => {
    it('should return 200 when success', async () => {
      const task_id: GetChildListDto = { task_id: 17 };
      const project_id = 2;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      (taskRelationRepo.find as jest.Mock).mockResolvedValueOnce(
        getChildTaskResult,
      );

      const result = await controller.getChildList(
        project_id,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get sub task service - success ', () => {
    it('should return 200 when success service', async () => {
      const task_id: GetChildListDto = { task_id: 17 };
      const project_id = 2;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      (taskRelationRepo.find as jest.Mock).mockResolvedValueOnce(
        getChildTaskResult,
      );

      const result = await service.getChildListService(
        project_id,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get sub task service - when project not found ', () => {
    it('should return 400 when project not found', async () => {
      const task_id: GetChildListDto = { task_id: 17 };
      const project_id = 1000;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      (taskRelationRepo.find as jest.Mock).mockResolvedValueOnce(
        getChildTaskResult,
      );

      const result = await service.getChildListService(
        project_id,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get sub task service - when not allocated to project ', () => {
    it('should return 400 when not allocated to project', async () => {
      const task_id: GetChildListDto = { task_id: 17 };
      const project_id = 2;
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
      } as unknown as Request;

      (taskRelationRepo.find as jest.Mock).mockResolvedValueOnce(
        getChildTaskResult,
      );

      const result = await service.getChildListService(
        project_id,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('get sub task service - when task is not a parent task', () => {
    it('should return 400 when task is not a parent task', async () => {
      const task_id: GetChildListDto = { task_id: 17 };
      const project_id = 2;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      (taskRelationRepo.find as jest.Mock).mockResolvedValueOnce(
        getChildTaskResult,
      );
      (taskRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.getChildListService(
        project_id,
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(52);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('add category', () => {
    it('should return 400 when unique', async () => {
      const _category: AddCategory = { category_name: 'ededededede' };
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(uniqueCategory);
      const result = await service.addCategory(
        _category,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1439);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  // add category succeess message expected
  describe('add category success expected', () => {
    it('should return 200 when success', async () => {
      const _category: AddCategory = { category_name: 'djujtuj' };
      (categoryRepo.save as jest.Mock).mockResolvedValueOnce(createCategory);
      const result = await service.addCategory(
        _category,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('add category success expected in controller', () => {
    it('should return 200 when success in controller', async () => {
      const _category: AddCategory = { category_name: 'djujtuj' };
      (categoryRepo.save as jest.Mock).mockResolvedValueOnce(createCategory);
      const result = await controller.addCategory(
        _category,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  //add issue type find  unique name
  describe('add issue_type', () => {
    it('should return 400 when unique in issueType', async () => {
      const _issueType: AddIssueType = { issue_type: 'kkkkkddrededkk' };
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(uniqueIssueType);
      const result = await service.addIssueType(
        _issueType,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1510);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  // add issueType succeess message expected
  describe('add issueType success expected', () => {
    it('should return 200 when success', async () => {
      const _issueType: AddIssueType = { issue_type: 'kkdee3r3kkddrededkk' };
      (issueTypeRepo.save as jest.Mock).mockResolvedValueOnce(createIssueType);
      const result = await service.addIssueType(
        _issueType,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // add issueType succeess message expected in controller
  describe('add issueType success expected in controller', () => {
    it('should return 200 when success', async () => {
      const _issueType: AddIssueType = { issue_type: 'kkdee3r3kkddrededkk' };
      (issueTypeRepo.save as jest.Mock).mockResolvedValueOnce(createIssueType);
      const result = await controller.addIssueType(
        _issueType,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // add issueType while issueType is empty
  describe('add issueType while issueType is empty', () => {
    it('should return 400 when issueType is empty', async () => {
      const _issueType: AddIssueType = { issue_type: null };

      const result = await service.addIssueType(
        _issueType,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2508);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // add issueType while issueType  does not match regx
  describe('add issueType while issueType  does not match regx', () => {
    it('should return 400 when issueType does not match regx', async () => {
      const _issueType: AddIssueType = { issue_type: 'fcfc    uyfufuifitf6' };
      const result = await service.addIssueType(
        _issueType,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1402);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // add category while category is empty
  describe('add category while category is empty', () => {
    it('should return 400 when category is empty', async () => {
      const _category: AddCategory = { category_name: null };
      const result = await service.addCategory(
        _category,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2509);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // add category while category  does not match regx
  describe('add category while category  does not match regx', () => {
    it('should return 400 when category does not match regx', async () => {
      const _category: AddCategory = { category_name: 'fwefefe   xddg' };
      const result = await service.addCategory(
        _category,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1412);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit category while category does not match regx
  describe('edit category while category does not match regx', () => {
    it('should return 400 when category does not match regx', async () => {
      const category_id = 1;
      const _category: AddCategory = {
        category_name: 'hbwbhwdhxb    wdwedwdwdbwd',
      };
      const result = await service.editcategory(
        _category,
        category_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1412);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit category while category not found

  describe('edit category not found', () => {
    it('should return 400 when edit invalid category', async () => {
      const category_id = 100;
      const _category: AddCategory = { category_name: 'ededededede' };
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(category_id);
      const result = await service.editcategory(
        _category,
        category_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(633);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit category while editting default category

  describe('edit category default category', () => {
    it('should return 400 when edit invalid category', async () => {
      const category_id = 1;
      const _category: AddCategory = { category_name: 'ededededede' };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(categorys);
      const result = await service.editcategory(
        _category,
        category_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2538);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit category while category is unique

  describe('edit category unique', () => {
    it('should return 400 when unique edit category', async () => {
      const category_id = 8;
      const _category: AddCategory = { category_name: 'ededededede' };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(categorys2);
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(editCategory1);
      const result = await service.editcategory(
        _category,
        category_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1439);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit category service  successs

  describe('edit category service  successs', () => {
    it('should return 200 when  edit category is success', async () => {
      const category_id = 8;
      const _category: AddCategory = { category_name: 'ededeyydedede' };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(categorys);
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(editCategory);
      const result = await service.editcategory(
        _category,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  // edit category in controller is  successs

  describe('edit category controller  successs', () => {
    it('should return 200 when  edit category in controller is success', async () => {
      const category_id = 8;
      const _category: AddCategory = { category_name: 'ededeyydedede' };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(categorys);
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(editCategory);
      const result = await controller.editcategory(
        _category,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // edit issueType while issueType does not match regx
  describe('edit issueType while issueType does not match regx', () => {
    it('should return 400 when issueType does not match regx', async () => {
      const issue_type_id = 1;
      const _issueType: AddIssueType = {
        issue_type: 'hbwbhwdhxb    wdwedwdwdbwd',
      };
      const result = await service.editIssueType(
        _issueType,
        issue_type_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1402);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // add issueType succeess message expected in controller
  describe('add issueType success expected in controller', () => {
    it('should return 200 when success', async () => {
      const _issueType: AddIssueType = { issue_type: 'kkdee3r3kkddrededkk' };
      (issueTypeRepo.save as jest.Mock).mockResolvedValueOnce(createIssueType);
      const result = await controller.addIssueType(
        _issueType,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // add issueType while issueType is empty
  describe('add issueType while issueType is empty', () => {
    it('should return 400 when issueType is empty', async () => {
      const _issueType: AddIssueType = { issue_type: null };

      const result = await service.addIssueType(
        _issueType,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2508);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // add issueType while issueType  does not match regx
  describe('add issueType while issueType  does not match regx', () => {
    it('should return 400 when issueType does not match regx', async () => {
      const _issueType: AddIssueType = { issue_type: 'fcfc    uyfufuifitf6' };
      const result = await service.addIssueType(
        _issueType,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1402);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit category while issueType not found

  describe('edit issueType not found', () => {
    it('should return 400 when edit invalid issueType', async () => {
      const issue_type_id = 100;
      const _issueType: AddIssueType = { issue_type: 'hbwbhwdhdbwd' };
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(issue_type_id);
      const result = await service.editIssueType(
        _issueType,
        issue_type_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(634);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit category while editting default category

  describe('edit issueType default issueType', () => {
    it('should return 400 when edit invalid issueType', async () => {
      const issue_type_id = 2;
      const _issueType: AddIssueType = { issue_type: 'hbwbeehwdhdbwd' };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const result = await service.editIssueType(
        _issueType,
        issue_type_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2539);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit issueType while issueType is unique

  describe('edit issueType unique', () => {
    it('should return 400 when unique edit issueType', async () => {
      const issue_type_id = 5;
      const _issueType: AddIssueType = { issue_type: 'hbwbeehwdhdbwd' };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType1);
      const result = await service.editIssueType(
        _issueType,
        issue_type_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1510);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // edit issueType service  successs

  describe('edit issueType service  successs', () => {
    it('should return 200 when  edit issueType is success', async () => {
      const issue_type_id = 7;
      const _issueType: AddIssueType = { issue_type: 'hbwbeefhwdhdbwd' };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType1);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType1);
      const result = await service.editIssueType(
        _issueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // edit issueType controller  successs

  describe('edit issueType controller  successs', () => {
    it('should return 200 when  edit issueType in controller is success', async () => {
      const issue_type_id = 7;
      const _issueType: AddIssueType = { issue_type: 'hbwbeefhwdhdbwd' };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType1);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType1);
      const result = await controller.editIssueType(
        _issueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // delete issueType service issueType not found

  describe('delete  issueType service issueType not found', () => {
    it('should return 400 when issueType not found', async () => {
      const issue_type_id = 100;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: 1 };
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(issue_type_id);

      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(634);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  // delete issueType service cannot be deleted

  describe('defaultissueType cannot be deleted', () => {
    it('should return 400 when  defaultissueType cannot be deleted', async () => {
      const issue_type_id = 1;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: 3 };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);

      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2537);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete  issueType service if active taskexist,replace_issueType should not be null', () => {
    it('should return 400 when  if active taskexist,replace_issueType should not be null', async () => {
      const issue_type_id = 5;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: null };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType3);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);

      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1590);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete  issueType service replace_issueType must be a issue_id other than deleting issueType', () => {
    it('should return 400 when replace_issueType must be a issue_id other than deleting issueType', async () => {
      const issue_type_id = 5;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: 5 };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType3);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(replaceIssue2);

      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1514);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('delete  issueType for having task', () => {
    it('should return 200 for having task ', async () => {
      const issue_type_id = 7;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: 5 };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType4);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(replaceIssue2);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(
        replacementIssuetasklist,
      );
      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('delete  issueType for having task in controller', () => {
    it('should return 200 for having task in controller ', async () => {
      const issue_type_id = 7;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: 5 };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType4);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(replaceIssue2);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(
        replacementIssuetasklist,
      );
      const result = await controller.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('delete  issueType service replacement Issue_type not found', () => {
    it('should return 400 when replacement Issue_type not found', async () => {
      const issue_type_id = 5;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: 100 };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType3);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(replaceIssue);

      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1438);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('delete replaceIssueType should be null if no active task exist', () => {
    it('should return 400 when replaceIssueType should be null if no active task exist', async () => {
      const issue_type_id = 5;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: 3 };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType3);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2554);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete issueType service deleted successfully', () => {
    it('should return 200 when deleted successfully', async () => {
      const issue_type_id = 5;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: null };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType3);
      (taskRepo.find as jest.Mock).mockImplementationOnce((options: any) => {
        if (
          options.where.task_issue.issue_id === 5 &&
          options.where.status === STATUS.ACTIVE
        )
          return issueTaskList1;
      });
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(replaceIssue);

      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('delete issueType controler deleted successfully', () => {
    it('should return 200 in controler when deleted successfully', async () => {
      const issue_type_id = 5;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: null };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType3);
      // (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList1);
      (taskRepo.find as jest.Mock).mockImplementationOnce((options: any) => {
        if (
          options.where.task_issue.issue_id === 5 &&
          options.where.status === STATUS.ACTIVE
        )
          return issueTaskList1;
      });

      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(replaceIssue);

      const result = await controller.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('delete  category service category not found', () => {
    it('should return 400 when category not found', async () => {
      const category_id = 100;
      const replaceCategory: ReplaceCategory = { replace_category: 1 };
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(category_id);

      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(633);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('defaultcategory cannot be deleted', () => {
    it('should return 400 when  defaultcategory cannot be deleted', async () => {
      const category_id = 1;
      const replaceCategory: ReplaceCategory = { replace_category: 1 };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category1);

      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2537);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete  category service if active taskexist,replace_category should not be null', () => {
    it('should return 400 when  if active taskexist,replace_category should not be null', async () => {
      const category_id = 5;
      const replaceCategory: ReplaceCategory = { replace_category: null };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category2);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);

      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1589);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete  category service replacement category not found', () => {
    it('should return 400 when replacement category not found', async () => {
      const category_id = 5;
      const replaceCategory: ReplaceCategory = { replace_category: 100 };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category3);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(
        replacementCategory,
      );

      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2524);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete replacecategory should be null if no active task exist', () => {
    it('should return 400 when replacecategory should be null if no active task exist', async () => {
      const category_id = 5;
      const replaceCategory: ReplaceCategory = { replace_category: 3 };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category3);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce([]);
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2553);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete category service deleted successfully', () => {
    it('should return 200 when deleted successfully', async () => {
      const category_id = 5;
      const replaceCategory: ReplaceCategory = { replace_category: null };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category3);
      (taskRepo.find as jest.Mock).mockImplementationOnce((options: any) => {
        if (
          options.where.task_category.category_id === 5 &&
          options.where.status === STATUS.ACTIVE
        )
          return issueTaskList1;
      });
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('delete category service deleted successfully in controller', () => {
    it('should return 200 when deleted successfully in controller', async () => {
      const category_id = 5;
      const replaceCategory: ReplaceCategory = { replace_category: null };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category3);
      (taskRepo.find as jest.Mock).mockImplementationOnce((options: any) => {
        if (
          options.where.task_category.category_id === 5 &&
          options.where.status === STATUS.ACTIVE
        )
          return issueTaskList1;
      });
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce([]);

      const result = await controller.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('delete  category service if active taskexist,replace_category should not be null', () => {
    it('should return 400 when  if active taskexist,replace_category should not be null', async () => {
      const category_id = 5;
      const replaceCategory: ReplaceCategory = { replace_category: null };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category3);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);

      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1589);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete  category service replace_category must be a category_id other than deleting category', () => {
    it('should return 400 when replace_category must be a category_id other than deleting category', async () => {
      const category_id = 5;
      const replaceCategory: ReplaceCategory = { replace_category: 5 };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category3);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(category3);

      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2523);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('delete  category for having task', () => {
    it('should return 200 for category having task ', async () => {
      const category_id = 7;
      const replaceCategory: ReplaceCategory = { replace_category: 5 };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category4);
      (categoryRepo.find as jest.Mock).mockImplementationOnce(
        (options: any) => {
          if (
            options.where.status === STATUS.ACTIVE &&
            options.where.category_id != 7
          ) {
            return category5;
          }
        },
      );
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(category5);
      (taskRepo.find as jest.Mock).mockImplementationOnce((options: any) => {
        if (
          options.where.task_category.category_id === 7 &&
          options.where.status === STATUS.ACTIVE
        ) {
          return replacementCategorytasklist;
        }
      });
      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('delete  category for having task in controller', () => {
    it('should return 200 for category having task in controller ', async () => {
      const category_id = 7;
      const replaceCategory: ReplaceCategory = { replace_category: 5 };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category4);
      (categoryRepo.find as jest.Mock).mockImplementationOnce(
        (options: any) => {
          if (
            options.where.status === STATUS.ACTIVE &&
            options.where.category_id != 7
          ) {
            return category5;
          }
        },
      );
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(category5);
      (taskRepo.find as jest.Mock).mockImplementationOnce((options: any) => {
        if (
          options.where.task_category.category_id === 7 &&
          options.where.status === STATUS.ACTIVE
        ) {
          return replacementCategorytasklist;
        }
      });
      const result = await controller.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  // add category while category is empty
  describe('add category while category is empty', () => {
    it('should return 400 when category is empty', async () => {
      const _category: AddCategory = { category_name: null };
      const result = await service.addCategory(
        _category,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2509);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // add category while category  does not match regx
  describe('add category while category  does not match regx', () => {
    it('should return 400 when category does not match regx', async () => {
      const _category: AddCategory = { category_name: 'fwefefe   xddg' };
      const result = await service.addCategory(
        _category,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1412);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('Get task by id - controller', () => {
    it('should return 200 in get task by id', async () => {
      const task_id = 19;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'files') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(fileListGetTaskById),
            };
          }
        },
      );
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'taskHistory') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(getTaskByIdHistoryData),
            };
          }
        },
      );
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'recent') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest
                .fn()
                .mockResolvedValue(recentlyViewedDataGetTaskById),
            };
          }
        },
      );
      const result = await controller.getTaskById(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Get task by id - when task not found', () => {
    it('should return 400 when task not found', async () => {
      const task_id = 1000;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      const result = await service.getTaskById(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(52);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Get task by id - when user is not allocated', () => {
    it('should return 400 when user is not allocated', async () => {
      const task_id = 19;
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
      } as unknown as Request;

      const result = await service.getTaskById(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('Get child task by id ', () => {
    it('should return 200 in get child task by id', async () => {
      const task_id = 20;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      (fileRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'files') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            };
          }
        },
      );
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'taskHistory') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(getTaskByIdHistoryData),
            };
          }
        },
      );
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'recent') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (taskRelationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'parent') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(getTaskByIdParent),
            };
          }
        },
      );
      const result = await controller.getTaskById(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  //ganttz
  describe('gantt chart - get gantt chart data', () => {
    it('should return 200 get gantt chart data', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { status: 1 },
      } as unknown as Request;
      const project_id = 2;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await controller.ganttChart(
        project_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result[0][0].task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('gantt chart - get gantt chart data with grouping', () => {
    it('should return 200 get gantt chart data with grouping', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { group: 1 },
      } as unknown as Request;
      const project_id = 2;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await controller.ganttChart(
        project_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result[0][0].task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('gantt chart - get gantt invalid grouping', () => {
    it('should return 400 get gantt chart invalid grouping', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { group: 10 },
      } as unknown as Request;
      const project_id = 2;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await service.getGanttChart(
        project_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3051);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('gantt chart - get gantt invalid status', () => {
    it('should return 400 get gantt chart invalid grouping', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { status: 10 },
      } as unknown as Request;
      const project_id = 2;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await service.getGanttChart(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3052);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('gantt chart - get gantt chart project not found', () => {
    it('should return 400 get gantt chart project not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      const project_id = 2000;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await service.getGanttChart(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('gantt chart - get gantt chart unauthorized', () => {
    it('should return 400 get gantt chart unauthorized', async () => {
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
        query: {},
      } as unknown as Request;
      const project_id = 2;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await service.getGanttChart(
        project_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('user gantt chart - get gantt chart data', () => {
    it(' user should return 200 get gantt chart data', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { status: 1 },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await controller.userGanttChart(
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result[0][0].task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('user gantt chart - get gantt chart data with grouping', () => {
    it('user should return 200 get gantt chart data with grouping', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { group: 1 },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await controller.userGanttChart(
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result[0][0].task_id).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('user gantt chart - get gantt invalid grouping', () => {
    it('user should return 400 get gantt chart invalid grouping', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { group: 10 },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await service.getUserGanttChart(
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3051);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('user gantt chart - get gantt invalid status', () => {
    it('user should return 400 get gantt chart invalid grouping', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { status: 10 },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(ganttChartResponse),
            };
          }
        },
      );
      const result = await service.getUserGanttChart(
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3052);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  it('should be defined', () => {
    expect(controller.advancedSearch).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.getAdvancedSearch).toBeDefined();
  });
  describe('get AdvancedSearch when project not found', () => {
    it('should return 400 when project not found', async () => {
      let project_id = 20;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search when user is not allocated ', () => {
    it('should return 400 when Unauthorized', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
        body: advancedSearchDto,
      } as unknown as Request;
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Unauthorized access',
        statusCode: 399,
      });
    });
  });

  describe('when advance search when search column missing', () => {
    it('should return 400 when search column missing ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'task_id',
          searchCol: '',
        },
      } as unknown as Request;
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Search column missing',
        statusCode: 128,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search when search column not valid field', () => {
    it('should return 400 when search column contain not valid field ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: 'AXybcuhu',
        },
      } as unknown as Request;
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid field',
        statusCode: 68,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search when search column  valid field search key not found', () => {
    it('should return 400 when search column contain  valid field search key not found ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: 'task_id',
        },
      } as unknown as Request;
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing search key',
        statusCode: 129,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search when sort column  valid field sort method not found', () => {
    it('should return 400 when sort column  valid field sort method not found ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: '',
        },
      } as unknown as Request;
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing sort method',
        statusCode: 130,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search when sort method  valid field sort column not found', () => {
    it('should return 400 when sort method  valid field sort column not found ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: '',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing sort column',
        statusCode: 131,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search when invalid sort field', () => {
    it('should return 400 when invalid sort field ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'ddddd',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid sort field',
        statusCode: 140,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when advance search in service ', () => {
    it('should return 200 when advance search ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search in service ', () => {
    it('should return 200 when advance search ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await controller.advancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when advance search has invalid status ', () => {
    it('should return 400 when advance search has invalid status', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [5],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await controller.advancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  status in task status ',
        statusCode: 3500,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when advance search has invalid prirotiy ', () => {
    it('should return 400 when advance search has invalid prirotiy', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [5],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await controller.advancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  priority in priority',
        statusCode: 3501,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search has invalid task relation ', () => {
    it('should return 400 when advance search has invalid task relation', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [],
        priority: [],
        relation: [5],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await controller.advancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  relation status in relation',
        statusCode: 3503,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search has status , prirotiy and task relation ', () => {
    it('should return 200 when advance search has status , prirotiy and task relation', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await controller.advancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has invalid issue type ', () => {
    it('should return 400 when advance search has invalid issue type ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [10],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await controller.advancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  issue_type in issue_type',
        statusCode: 3506,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search has  issue type ', () => {
    it('should return 200 when advance search has  issue type ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [2],
        keyword: '',
        start_date_from_date: '',
        start_date_to_date: '',
        due_date_from_date: '',
        due_date_to_date: '',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has  valid date ', () => {
    it('should return 200 when advance search has valid date ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [2],
        keyword: '',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has keyword ', () => {
    it('should return 200 when advance search has keyword ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when advance search has searchKey ', () => {
    it('should return 200 when advance search has searchKey ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  //ri_
  describe('when advance search has invalid created user when user not found ', () => {
    it('should return 400 when advance search has invalid created user when user not found ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [5],
        assigne: [],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  user in createdBy',
        statusCode: 3504,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search has invalid assigne user when user not found ', () => {
    it('should return 400 when advance search has invalid assigne user when user not found ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [],
        assigne: [5],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  user in assigne',
        statusCode: 3505,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search has invalid created user when user not allocated to project ', () => {
    it('should return 400 when advance search has invalid created user when user not allocated to project ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [2],
        assigne: [],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  user in createdBy',
        statusCode: 3504,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when advance search has invalid assigne user when user not allocated to project ', () => {
    it('should return 400 when advance search has invalid assigne user when user not allocated to project ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [],
        assigne: [2],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  user in assigne',
        statusCode: 3505,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when advance search has  created user  ', () => {
    it('should return 200 when advance search has  created user  ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [currentUserObj.user_id],
        assigne: [],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has  assigne  and null ', () => {
    it('should return 200 when advance search has  assigne and null ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [currentUserObj.user_id],
        assigne: [currentUserObj.user_id, null],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has  assigne  as null ', () => {
    it('should return 200 when advance search has  assigne as null ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [currentUserObj.user_id],
        assigne: [null],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has  assigne  ', () => {
    it('should return 200 when advance search has  assigne ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [],
        createdBy: [currentUserObj.user_id],
        assigne: [currentUserObj.user_id],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has  invalid category  ', () => {
    it('should return 400 when advance search has  category ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [10],
        createdBy: [currentUserObj.user_id],
        assigne: [currentUserObj.user_id],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid  category in category',
        statusCode: 3502,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when advance search has   category  ', () => {
    it('should return 200 when advance search has  category ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [1],
        createdBy: [currentUserObj.user_id],
        assigne: [currentUserObj.user_id],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has   category as null  ', () => {
    it('should return 200 when advance search has  category as null ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [null],
        createdBy: [currentUserObj.user_id],
        assigne: [currentUserObj.user_id],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when advance search has   category and null  ', () => {
    it('should return 200 when advance search has  category and null ', async () => {
      let project_id = 2;
      let advancedSearchDto: AdvancedSearchDto = {
        task_status: [1],
        priority: [2],
        relation: [1],
        category: [null, 1],
        createdBy: [currentUserObj.user_id],
        assigne: [currentUserObj.user_id],
        issue_type: [2],
        keyword: 'sdfg',
        start_date_from_date: '2000-03-20',
        start_date_to_date: '2000-03-20',
        due_date_from_date: '2000-03-20',
        due_date_to_date: '2000-03-20',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: advancedSearchDto,
        query: {
          searchKey: 'hello',
          searchCol: 'task_name',
          sortCol: 'task_id',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getAdvancedSearch(
        project_id,
        advancedSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  it('should be defined', () => {
    expect(controller.getTaskList).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.getTaskList).toBeDefined();
  });
  describe('get NormalSearch when project not found', () => {
    it('should return 400 when project not found', async () => {
      let project_id = 20;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      const result = await controller.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when NormalSearch  when user is not allocated ', () => {
    it('should return 400 when Unauthorized', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: dummyUnauthorized,
        body: normalSearchDto,
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Unauthorized access',
        statusCode: 399,
      });
    });
  });

  describe('when NormalSearch  when search column missing', () => {
    it('should return 400 when search column missing ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'task_id',
          searchCol: '',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Search column missing',
        statusCode: 128,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when NormalSearch when search column not valid field', () => {
    it('should return 400 when search column contain not valid field ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: '',
          searchCol: 'AXybcuhu',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid field',
        statusCode: 68,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when NormalSearch when search column  valid field search key not found', () => {
    it('should return 400 when search column contain  valid field search key not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: '',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing search key',
        statusCode: 129,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when NormalSearch when sort column  valid field sort method not found', () => {
    it('should return 400 when sort column  valid field sort method not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'task_id',
          sortMethod: '',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing sort method',
        statusCode: 130,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when NormalSearch when sort method  valid field sort column not found', () => {
    it('should return 400 when sort method  valid field sort column not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: '',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing sort column',
        statusCode: 131,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when NormalSearch when invalid sort field', () => {
    it('should return 400 when invalid sort field ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: '',
          searchCol: '',
          sortCol: 'ddddd',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid sort field',
        statusCode: 140,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when NormalSearch when search column  valid field search key2 not found', () => {
    it('should return 400 when search column contain  valid field search key2 not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey2: '',
          searchCol2: 'task_name',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing search key ',
        statusCode: 129,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when NormalSearch when search column  valid field search key3 not found', () => {
    it('should return 400 when search column contain  valid field search key3 not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey3: '',
          searchCol3: 'task_name',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: ' Missing search key',
        statusCode: 129,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when NormalSearch when search column  valid field search column 2 not found', () => {
    it('should return 400 when search column contain  valid field search column 2 not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey2: 'sdfghj',
          searchCol2: '',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Search column missing.',
        statusCode: 128,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when NormalSearch when search column  valid field search column 2 not found', () => {
    it('should return 400 when search column contain  valid field ssearch column 2 not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey3: 'erftgh',
          searchCol3: '',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Search column missing ',
        statusCode: 128,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when NormalSearch when search column  invalid field search column 2 not found', () => {
    it('should return 400 when search column contain  invalid field search column 2 not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey2: 'sdfghj',
          searchCol2: 'ertghj',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid field ',
        statusCode: 68,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when NormalSearch when search column  invalid field search column 3 not found', () => {
    it('should return 400 when search column contain  valid field ssearch column 3 not found ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey3: 'erftgh',
          searchCol3: 'sdfgh',
        },
      } as unknown as Request;
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: ' Invalid field',
        statusCode: 68,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when NormalSearch ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: null,
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {},
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when NormalSearch when contain keyword ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: 'null',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {},
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when NormalSearch when  task status 1 ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: 1,
        subtasking: null,
        keyWord: 'null',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when NormalSearch when contain searchKey ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: null,
        subtasking: null,
        keyWord: 'null',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when NormalSearch when contain status 2 and task relation 1 ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: 2,
        subtasking: 1,
        keyWord: 'null',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when NormalSearch when contain status 2 and task relation 1 ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: 2,
        subtasking: 1,
        keyWord: 'null',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when NormalSearch when contain status 3 and task relation 2 ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: 3,
        subtasking: 2,
        keyWord: 'null',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when NormalSearch when contain status 4 and task relation 3 ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: 4,
        subtasking: 3,
        keyWord: 'null',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when NormalSearch when contain status 4 and task relation 3 ', () => {
    it('should return 200 when search  ', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: 5,
        subtasking: null,
        keyWord: 'null',
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(_taskList),
      }));
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  it('should be defined', () => {
    expect(service.handleCron).toBeDefined();
  });
  describe('when scheduler on run ', () => {
    it('should return 200 when search  ', async () => {
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(_tasklist1);
      await service.handleCron();
    });
  });
  it('should be defined', () => {
    expect(controller.recentlyViewedList).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.RecentlyViewedListService).toBeDefined();
  });
  describe('when recently viewed list', () => {
    it('should return 200 when search  ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: '',
        },
      } as unknown as Request;
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockReturnValue(2),
          getMany: jest.fn().mockResolvedValue(_reviewedList),
        }),
      );
      const result = await service.RecentlyViewedListService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(Object.keys(result)).toStrictEqual([
        'total',
        'dataCount',
        'page',
        'data',
      ]);
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when recently viewed list in the controller', () => {
    it('should return 200 when search  ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: '',
        },
      } as unknown as Request;
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockReturnValue(2),
          getMany: jest.fn().mockResolvedValue(_reviewedList),
        }),
      );
      const result = await controller.recentlyViewedList(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(Object.keys(result)).toStrictEqual([
        'total',
        'dataCount',
        'page',
        'data',
      ]);
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when recently viewed list sort method  not found', () => {
    it('should return 200 when search  ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: '',
          sortCol: 'dfghj',
          sortMethod: '',
        },
      } as unknown as Request;
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockReturnValue(2),
          getMany: jest.fn().mockResolvedValue(_reviewedList),
        }),
      );
      const result = await controller.recentlyViewedList(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing sort method',
        statusCode: 130,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recently viewed list sort column  not found', () => {
    it('should return 400 when search  ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: '',
          sortCol: '',
          sortMethod: 'asc',
        },
      } as unknown as Request;
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockReturnValue(2),
          getMany: jest.fn().mockResolvedValue(_reviewedList),
        }),
      );
      const result = await controller.recentlyViewedList(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing sort column',
        statusCode: 131,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recently viewed list invalid sort column', () => {
    it('should return 400 when search  ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: '',
          sortCol: 'dfgh',
          sortMethod: 'asc',
        },
      } as unknown as Request;
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockReturnValue(2),
          getMany: jest.fn().mockResolvedValue(_reviewedList),
        }),
      );
      const result = await controller.recentlyViewedList(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid sort field',
        statusCode: 140,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when recently viewed list when search task list', () => {
    it('should return 200 when search  ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: 'wsertyu',
          sortCol: '',
          sortMethod: '',
        },
      } as unknown as Request;
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockReturnValue(2),
          getMany: jest.fn().mockResolvedValue(_reviewedList),
        }),
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(_taskList12),
      }));
      const result = await controller.recentlyViewedList(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(Object.keys(result)).toStrictEqual([
        'total',
        'dataCount',
        'page',
        'data',
      ]);
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when recently viewed list when search task by name list', () => {
    it('should return 200 when search  ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: 'sdf',
          sortCol: '',
          sortMethod: '',
        },
      } as unknown as Request;
      (recentlyViewRepo.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getCount: jest.fn().mockReturnValue(0),
          getMany: jest.fn().mockResolvedValue([]),
        }),
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }));
      const result = await controller.recentlyViewedList(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(Object.keys(result)).toStrictEqual([
        'total',
        'dataCount',
        'page',
        'data',
      ]);
      expect(result['total']).toStrictEqual(0);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  it('should be defined', () => {
    expect(controller.getRecentUpdate).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.getRecentUpdateDashboard).toBeDefined();
  });
  describe('when recentupdates in the dashboard when duplication project', () => {
    it('should return 400 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1, 1],
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: '',
          sortCol: '',
        },
        body: _projects,
      } as unknown as Request;
      const result = await service.getRecentUpdateDashboard(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Duplication in project',
        statusCode: 3026,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recentupdates in the dashboard when not allocated', () => {
    it('should return 400 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1],
      };
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchKey: '',
          sortCol: '',
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }));
      const result = await service.getRecentUpdateDashboard(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Project not found at index 0',
        statusCode: 3021,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recentupdates in the dashboard when invalid limit value', () => {
    it('should return 400 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1],
      };

      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: 'sss',
          last_data: '',
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }));
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method === 'historyOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getRecentUpdateDashboard(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid limit value',
        statusCode: 3073,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recentupdates in the dashboard when  limit value above 3000', () => {
    it('should return 400 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1],
      };

      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: 3001,
          last_data: '',
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }));
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method === 'historyOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getRecentUpdateDashboard(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'limit must not be greater than 3000',
        statusCode: 3677,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recentupdates in the dashboard when  last data non integer', () => {
    it('should return 400 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1],
      };

      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: 'sdfg',
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }));
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method === 'historyOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getRecentUpdateDashboard(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'The last data is invalid',
        statusCode: 3071,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recentupdates in the dashboard when  last data non found', () => {
    it('should return 400 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1],
      };

      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: 11,
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }));
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method === 'historyOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getRecentUpdateDashboard(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'The last data not found',
        statusCode: 3072,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recentupdates when invalid project id ', () => {
    it('should return 400 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1.1],
      };

      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: 11,
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }));
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method === 'historyOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getRecentUpdateDashboard(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid project id at index 0',
        statusCode: 3022,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when recentupdates in service  ', () => {
    it('should return 200 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1],
      };

      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }));
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method === 'historyOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
          if (method == 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(2),
              getMany: jest.fn().mockReturnValueOnce(_recentUpdatesDashBoards1),
            };
          }
          if (method == 'taskHistoryObj1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(2),
              getMany: jest
                .fn()
                .mockResolvedValueOnce(_recentUpdatesDashBoards1),
            };
          }
        },
      );
      const result = await service.getRecentUpdateDashboard(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when recentupdates in controller ', () => {
    it('should return 200 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1],
      };

      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }));
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method === 'historyOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
          if (method == 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(2),
              getMany: jest.fn().mockReturnValueOnce(_recentUpdatesDashBoards1),
            };
          }
          if (method == 'taskHistoryObj1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(2),
              getMany: jest
                .fn()
                .mockResolvedValueOnce(_recentUpdatesDashBoards1),
            };
          }
        },
      );
      const result = await controller.getRecentUpdate(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when recentupdates in controller when last data passed ', () => {
    it('should return 200 when search  ', async () => {
      let _projects: RecentUpdatesDashboard = {
        projects: [1],
      };

      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: 11,
        },
        body: _projects,
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(true),
      }));
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method === 'historyOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(1),
            };
          }
          if (method == 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(2),
              getMany: jest.fn().mockReturnValueOnce(_recentUpdatesDashBoards1),
            };
          }
          if (method == 'taskHistoryObj1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(2),
              getMany: jest
                .fn()
                .mockResolvedValueOnce(_recentUpdatesDashBoards1),
            };
          }
        },
      );
      const result = await controller.getRecentUpdate(
        _projects,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  //get category list test cases

  describe('get category list when last data is invalid', () => {
    it('should return 400 when last data is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 'aaaa' },
      } as unknown as Request;

      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3071);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get category list when last data not found', () => {
    it('should return 400 when last data not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 12 },
      } as unknown as Request;

      (categoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'category') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3072);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get category list when limit is invalid', () => {
    it('should return 400 when limit is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 1.1 },
      } as unknown as Request;

      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3073);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get category list when limit is > 3000', () => {
    it('should return 400 when limit is > 3000', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4000 },
      } as unknown as Request;

      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3677);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get category list both page and last date will not be accepted', () => {
    it('should return 400  both page and last date will not be accepted', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 1, last_data: 1 },
      } as unknown as Request;
      (categoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'category') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(category7),
            };
          }
        },
      );

      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2506);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get category list invalid page', () => {
    it('should return 400 when invalid page', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 'dgdfe' },
      } as unknown as Request;

      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2505);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get category list when api is successfull', () => {
    it('should return 200 when api is successfull', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 12 },
      } as unknown as Request;

      (categoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'category') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(category7),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(category8Result),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get category list when api is successfull in controller', () => {
    it('should return 200 when api is successfull in controller', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 12 },
      } as unknown as Request;

      (categoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'category') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(category7),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(category8Result),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await controller.getCategory(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get category list when api is successfull without last_data', () => {
    it('should return 200 when api is successfull without last_data', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 12 },
      } as unknown as Request;

      (categoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'category') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(category7),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(category8Result),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get category list when api is successfull without last_data and page', () => {
    it('should return 200 when api is successfull without last_data and page', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;

      (categoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'category') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(category8Result),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get category list when api is successfull with limit and page', () => {
    it('should return 200 when api is successfull with limit and page', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 5, page: 2 },
      } as unknown as Request;

      (categoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'category') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(category8Result),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.getCategoryService(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // describe('get category list when api exception case', () => {
  //   it('should return 400 when api exception case', async () => {
  //     let requestMock: Request = {
  //       currentUser: currentUserObj,
  //       query: {limit:5,page:2},

  //     } as unknown as Request;

  //     (issueTypeRepo.createQueryBuilder as jest.Mock).mockImplementation(
  //       (method:any) => {
  //         if (method == 'category') {
  //           return {
  //             where: jest.fn().mockReturnThis(),
  //             andWhere:jest.fn().mockReturnThis(),
  //             orderBy:jest.fn().mockReturnThis(),
  //             offset: jest.fn().mockReturnThis(),
  //             limit: jest.fn().mockReturnThis(),
  //             getOne: jest.fn().mockResolvedValue(null),
  //             getCount: jest.fn().mockResolvedValue(1),
  //             getMany: jest.fn().mockResolvedValue(issueTypeResult),

  //           };
  //         }
  //       },
  //     );
  //     (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
  //       (method:any) => {
  //         if (method == 'task') {
  //           return {
  //             where: jest.fn().mockReturnThis(),
  //             andWhere:jest.fn().mockReturnThis(),
  //             getCount: jest.fn().mockResolvedValue(1),

  //           };
  //         }
  //       },
  //     );
  //     const result = await service.getCategoryService(
  //       requestMock,
  //       responseMock,
  //     );
  //     console.log(result,"e334");

  //     expect(result).toBeDefined();
  //     expect(result.statusCode).toStrictEqual(400);
  //     expect(responseMock.status).toHaveBeenCalledWith(400);
  //   });
  // });

  //get issue list test cases

  describe('get issue list when last data is invalid', () => {
    it('should return 400 when last data is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 'aaaa' },
      } as unknown as Request;

      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3071);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get issue list when last data not found', () => {
    it('should return 400 when last data not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 12 },
      } as unknown as Request;

      (issueTypeRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'issue_type') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3072);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get issue list when limit is invalid', () => {
    it('should return 400 when limit is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 1.1 },
      } as unknown as Request;

      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3073);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get issue list when limit is > 3000', () => {
    it('should return 400 when limit is > 3000', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4000 },
      } as unknown as Request;

      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3677);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get issue list both page and last date will not be accepted', () => {
    it('should return 400  both page and last date will not be accepted', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 1, last_data: 1 },
      } as unknown as Request;
      (issueTypeRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'issue_type') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(issueTypeLastValue),
            };
          }
        },
      );

      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2506);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get issue list invalid page', () => {
    it('should return 400 when invalid page', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 'dgdfe' },
      } as unknown as Request;

      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2505);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get issue list when api is successfull', () => {
    it('should return 200 when api is successfull', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 12 },
      } as unknown as Request;

      (issueTypeRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'issue_type') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(issueTypeLastValue),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(issueTypeResult),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('get issue list when api is successfull in controller', () => {
    it('should return 200 when api is successfull in controller', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 12 },
      } as unknown as Request;

      (issueTypeRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'issue_type') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(issueTypeLastValue),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(issueTypeResult),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await controller.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get issue list when api is successfull without last_data', () => {
    it('should return 200 when api is successfull without last_data', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 12 },
      } as unknown as Request;
      (issueTypeRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'issue_type') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(issueTypeLastValue),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(issueTypeResult),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get issue list when api is successfull without last_data and page', () => {
    it('should return 200 when api is successfull without last_data and page', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;

      (issueTypeRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'issue_type') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(issueTypeResult),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get issue list when api is successfull with limit and page', () => {
    it('should return 200 when api is successfull with limit and page', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 5, page: 2 },
      } as unknown as Request;

      (issueTypeRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'issue_type') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
              getCount: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(issueTypeResult),
            };
          }
        },
      );
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.getIssue(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // describe('get issue list when api exception case', () => {
  //   it('should return 400 when api exception case', async () => {
  //     let requestMock: Request = {
  //       currentUser: currentUserObj,
  //       query: {limit:5,page:2},

  //     } as unknown as Request;

  //     (categoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
  //       (method:any) => {
  //         if (method == 'issue_typesss') {
  //           return {
  //             where: jest.fn().mockReturnThis(),
  //             andWhere:jest.fn().mockReturnThis(),
  //             orderBy:jest.fn().mockReturnThis(),
  //             offset: jest.fn().mockReturnThis(),
  //             limit: jest.fn().mockReturnThis(),
  //             getOne: jest.fn().mockResolvedValue(null),
  //             getCount: jest.fn().mockResolvedValue(1),
  //             getMany: jest.fn().mockResolvedValue(issueTypeResult),

  //           };
  //         }
  //       },
  //     );
  //     (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
  //       (method:any) => {
  //         if (method == 'task') {
  //           return {
  //             where: jest.fn().mockReturnThis(),
  //             andWhere:jest.fn().mockReturnThis(),
  //             getCount: jest.fn().mockResolvedValue(1),

  //           };
  //         }
  //       },
  //     );
  //     const result = await service.getIssue(
  //       requestMock,
  //       responseMock,
  //     );
  //     console.log(result,"e334");

  //     expect(result).toBeDefined();
  //     expect(result.statusCode).toStrictEqual(400);
  //     expect(responseMock.status).toHaveBeenCalledWith(400);
  //   });
  // });

  //task file upload test cases

  describe('task file upload api File not received', () => {
    it('should return 400 File not received', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: 'dgdfe' },
      } as unknown as Request;
      const task_id = 1;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = undefined;

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(708);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('task file upload api file size should be less than or equal to 200MB', () => {
    it('should return 400 file size should be less than or equal to 200MB', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: 'dgdfe' },
      } as unknown as Request;
      const task_id = 1;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 309715200,
      };

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(711);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('task file upload api Task not found', () => {
    it('should return 400 Task not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: 'dgdfe' },
      } as unknown as Request;
      const task_id = 100;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (taskRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.task_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(52);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('task file upload api Project not found', () => {
    it('should return 400 Project not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: 'dgdfe' },
      } as unknown as Request;
      const task_id = 100;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (taskRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.task_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadTaskData;
        }
      });
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('task file upload api Folder not found', () => {
    it('should return 400 Folder not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: 'dgdfe' },
      } as unknown as Request;
      const task_id = 43;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (taskRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.task_id === 43 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadTaskData;
        }
      });
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder1;
        }
      });

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(801);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('task file upload api Unauthorized access', () => {
    it('should return 400 Unauthorized access', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: 'dgdfe' },
      } as unknown as Request;
      const task_id = 43;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (taskRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.task_id === 43 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadTaskData;
        }
      });
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id_resource_alloc === fileUploadProjectFolder &&
          option.where.allocated_user === unauthorised &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return null;
        }
      });

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });
  describe('task file upload api Unauthorized access developer', () => {
    it('should return 400 Unauthorized access developer', async () => {
      let requestMock: Request = {
        currentUser: unauthorised,
        body: { file_name: 'dgdfe' },
      } as unknown as Request;
      const task_id = 43;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (taskRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.task_id === 43 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadTaskData;
        }
      });
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id_resource_alloc.project_id === 2 &&
          option.where.allocated_user.user_id === 1 &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember1;
        }
      });

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });
  describe('task file upload api file_name cannot be empty', () => {
    it('should return 400 file_name cannot be empty', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: '' },
      } as unknown as Request;
      const task_id = 43;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (taskRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.task_id === 43 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadTaskData;
        }
      });
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id_resource_alloc.project_id === 2 &&
          option.where.allocated_user.user_id === 1 &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2570);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('task file upload api sucessfully uploaded', () => {
    it('should return 200 sucessfully uploaded', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: 'dddd' },
      } as unknown as Request;
      const task_id = 43;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (taskRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.task_id === 43 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadTaskData;
        }
      });
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id_resource_alloc.project_id === 2 &&
          option.where.allocated_user.user_id === 1 &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (fileRepo.save as jest.Mock).mockImplementation((option: any) => {
        {
          return fileUploadSave;
        }
      });

      const result = await service.uploadFile(
        file,
        requestMock,
        task_id,
        uniqueFileName,
        maxSize,
        fileRealName,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('task file upload api sucessfully uploaded in controller', () => {
    it('should return 200 sucessfully uploaded in controller', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file_name: 'dddd' },
      } as unknown as Request;
      const task_id = 43;
      const fileRealName: FileUpload = {
        filename: 'dedded',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (taskRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.task_id === 43 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadTaskData;
        }
      });
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id_resource_alloc.project_id === 2 &&
          option.where.allocated_user.user_id === 1 &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (fileRepo.save as jest.Mock).mockImplementation((option: any) => {
        {
          return fileUploadSave;
        }
      });

      const result = await controller.uploadFile(
        requestMock,
        responseMock,
        task_id,
        fileRealName,
        file,
      );
      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  it('should be defined', () => {
    expect(controller.commentTask).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.commentTask).toBeDefined();
  });
  describe('comment on a task when project not found', () => {
    it('should return 400 when project not found in controller', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 44;
      let commentTask: CommentTask = {
        comment: '',
        task_id: 1,
        notify: [],
      };
      const result = await controller.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Project not found',
        statusCode: 50,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('comment on a task when unauthorised user call api', () => {
    it('should return 400 when unauthorised user call api controller', async () => {
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
      } as unknown as Request;
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: '',
        task_id: 1,
        notify: [],
      };
      const result = await controller.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Unauthorized access',
        statusCode: 399,
      });
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('comment on a task when task not found', () => {
    it('should return 400 when task not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: '',
        task_id: 1,
        notify: [],
      };

      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await controller.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Task not found',
        statusCode: 52,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('comment on a task when only comment ', () => {
    it('should return 200  when only commented', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: 'efrgth',
        task_id: 1,
        notify: [],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);

      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual([
        { successMessage: 'Comment Added', statusCode: 200 },
      ]);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('comment on a task when only comment with mention where user not found', () => {
    it('should return 200  when only commented with mention where user is not found', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: ' aagrgrtrtrtrr efrgth @rijo@gmail.com',
        task_id: 1,
        notify: [],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      commentHistory.comment = ' aagrgrtrtrtrr efrgth @rijo@gmail.com';
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);
      userRepo.findOne = jest.fn().mockReturnValue(null);

      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual([
        {
          user_id: '@rijo@gmail.com',
          mentioned_user: 'not found',
          errorMessage: 'User not found',
          statusCode: 31,
        },
      ]);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('comment on a task when only comment with mention where user is not part of project', () => {
    it('should return 200  when only commented with mention where user is not part of project', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: ' aagrgrtrtrtrr efrgth @rijo@gmail.com',
        task_id: 1,
        notify: [],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      commentHistory.comment = ' aagrgrtrtrtrr efrgth @rijo@gmail.com';
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);
      userRepo.findOne = jest
        .fn()
        .mockReturnValue(projectMember1.allocated_user);
      resourceRepo.findOne = jest
        .fn()
        .mockImplementationOnce((options: any) => {
          let proj = options.where.project_id_resource_alloc;
          if (
            options.where.allocated_user === currentUserObj &&
            options.where.project_id_resource_alloc === proj &&
            options.where.status === 1 &&
            options.where.allocation_status === 1
          ) {
            return allocatedData1;
          } else {
            return null;
          }
        });

      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual([
        {
          user_id: 2,
          user_name: 'kelbin',
          mentioned_user: 'mentioned user is not part of this project',
          errorMessage: 'User not allocated to this project',
          statusCode: 1500,
        },
      ]);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('comment on a task when only comment with mention where user is part of project and notified ', () => {
    it('should return 200  when only commented with mention where user is not part of projecta and notifed', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: ' aagrgrtrtrtrr efrgth @rijo@gmail.com',
        task_id: 1,
        notify: [],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      projectRepo.findOne = jest.fn().mockReturnValue(projectData1);
      commentHistory.comment = ' aagrgrtrtrtrr efrgth @rijo@gmail.com';
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);
      userRepo.findOne = jest.fn().mockReturnValue(currentUserObj);
      resourceRepo.findOne = jest.fn().mockImplementation((options: any) => {
        let proj = options.where.project_id_resource_alloc;

        if (
          options.where.allocated_user === currentUserObj &&
          options.where.project_id_resource_alloc === proj &&
          options.where.status === 1 &&
          options.where.allocation_status === 1
        ) {
          return allocatedData1;
        }
      });
      notificationRepo.create = jest.fn().mockReturnValue(_notifyMention);
      notificationRepo.save = jest.fn().mockReturnValue(_notifyMention);
      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual([
        {
          user_id: 1,
          mentioned_user: 'Hemandh',
          successMessage: 'Comment Added',
          statusCode: 200,
        },
      ]);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('comment on a task when only comment with mention where user is part of project and notified and notify comment where user not found', () => {
    it('should return 200  when only commented with mention where user is not part of projecta and notifed and notify comment where user not found', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: 'cfvgbh',
        task_id: 1,
        notify: [2],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      userRepo.createQueryBuilder = jest.fn().mockReturnValue(null);

      projectRepo.findOne = jest.fn().mockReturnValue(projectData1);
      commentHistory.comment = ' aagrgrtrtrtrr efrgth @rijo@gmail.com';
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);
      userRepo.findOne = jest.fn().mockReturnValue(currentUserObj);
      resourceRepo.findOne = jest.fn().mockImplementation((options: any) => {
        let proj = options.where.project_id_resource_alloc;

        if (
          options.where.allocated_user === currentUserObj &&
          options.where.project_id_resource_alloc === proj &&
          options.where.status === 1 &&
          options.where.allocation_status === 1
        ) {
          return allocatedData1;
        }
      });
      notificationRepo.create = jest.fn().mockReturnValue(_notifyMention);
      notificationRepo.save = jest.fn().mockReturnValue(_notifyMention);
      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('comment on a task when only comment with mention where user is part of project and notified and notify comment where user is not part of project ', () => {
    it('should return 200  when only commented with mention where user is not part of projecta and notifed and notify comment where user is not part of project ', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: 'cfvgbh',
        task_id: 1,
        notify: [2],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      userRepo.createQueryBuilder = jest.fn().mockReturnValue(currentUserObj);

      projectRepo.findOne = jest.fn().mockReturnValue(projectData1);
      commentHistory.comment = ' aagrgrtrtrtrr efrgth @rijo@gmail.com';
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);
      userRepo.findOne = jest.fn().mockReturnValue(currentUserObj);
      resourceRepo.findOne = jest.fn().mockImplementation((options: any) => {
        let proj = options.where.project_id_resource_alloc;

        if (
          options.where.allocated_user === currentUserObj &&
          options.where.project_id_resource_alloc === proj &&
          options.where.status === 1 &&
          options.where.allocation_status === 1
        ) {
          return allocatedData1;
        } else {
          return null;
        }
      });
      notificationRepo.create = jest.fn().mockReturnValue(_notifyMention);
      notificationRepo.save = jest.fn().mockReturnValue(_notifyMention);
      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when successfully notify and comment ', () => {
    it('should return 200  when only commented with mention where user is not part of projecta and notifed and notify comment  ', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: 'cfvgbh',
        task_id: 1,
        notify: [2],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      (userRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'user') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(currentUserObj),
            };
          }
        },
      );

      projectRepo.findOne = jest.fn().mockReturnValue(projectData1);
      commentHistory.comment = ' aagrgrtrtrtrr efrgth';
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);
      userRepo.findOne = jest.fn().mockReturnValue(currentUserObj);
      resourceRepo.findOne = jest.fn().mockReturnValue(allocatedData1);
      notificationRepo.create = jest.fn().mockReturnValue(_notifyMention);
      notificationRepo.save = jest.fn().mockReturnValue(_notifyMention);
      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual([
        { successMessage: 'Comment Added', statusCode: 200 },
      ]);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when failed to notify and added comment ', () => {
    it('should return 200  when only commented with mention where user is not part of projecta and notifed and notify comment  ', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: 'cfvgbh',
        task_id: 1,
        notify: [2],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      (userRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'user') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );

      projectRepo.findOne = jest.fn().mockReturnValue(projectData1);
      commentHistory.comment = ' aagrgrtrtrtrr efrgth';
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);
      userRepo.findOne = jest.fn().mockReturnValue(currentUserObj);
      resourceRepo.findOne = jest.fn().mockReturnValue(allocatedData1);
      notificationRepo.create = jest.fn().mockReturnValue(_notifyMention);
      notificationRepo.save = jest.fn().mockReturnValue(_notifyMention);
      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual([
        { successMessage: 'Comment Added', statusCode: 200 },
        {
          task_id: 517,
          notificationFailed:
            'notification failed for the following user_ids:2',
          errorMessage: 'comment added notification to 2 user_notiy failed',
          statusCode: 1770,
        },
      ]);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when comment and notify failed in where user not part of project ', () => {
    it('should return 200  when only commented with mention where user is not part of projecta and notifed and notify comment  ', async () => {
      let project_id = 2;
      let commentTask: CommentTask = {
        comment: 'cfvgbh',
        task_id: 1,
        notify: [2],
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: commentTask,
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(commentTaskId),
            };
          }
        },
      );
      (userRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'user') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(currentUserObj),
            };
          }
        },
      );

      projectRepo.findOne = jest.fn().mockReturnValue(projectData1);
      commentHistory.comment = ' aagrgrtrtrtrr efrgth';
      historyRepo.create = jest.fn().mockReturnValue(commentHistory);
      historyRepo.save = jest.fn().mockReturnValue(commentHistory);
      userRepo.findOne = jest.fn().mockReturnValue(currentUserObj);
      resourceRepo.findOne = jest
        .fn()
        .mockImplementationOnce((options: any) => {
          let proj = options.where.project_id_resource_alloc;

          if (
            options.where.allocated_user === currentUserObj &&
            options.where.project_id_resource_alloc === proj &&
            options.where.status === 1 &&
            options.where.allocation_status === 1
          ) {
            return allocatedData1;
          } else {
            return null;
          }
        });
      notificationRepo.create = jest.fn().mockReturnValue(_notifyMention);
      notificationRepo.save = jest.fn().mockReturnValue(_notifyMention);
      const result = await service.commentTask(
        commentTask,
        project_id,
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual([
        { successMessage: 'Comment Added', statusCode: 200 },
        {
          task_id: 517,
          notificationFailed:
            'notification failed for the following user_ids:Hemandh',
          errorMessage:
            'comment added notification to Hemandh user_notiy failed',
          statusCode: 1770,
        },
      ]);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update task - task not found', () => {
    it('should return 400 task not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 24;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 24 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return null;
        }
      });

      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(52);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - cannot change project', () => {
    it('should return 400 cannot change project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      const result = await service.updateTask(
        updateTaskDataChangeProject,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(116);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - when user is unauthorized', () => {
    it('should return 400 when user is unauthorized', async () => {
      let _requestMock: Request = {
        currentUser: dummyDeveloper,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == dummyDeveloper
        ) {
          return updateTaskAllocationDeveloper;
        }
      });
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('update task - when actual hour is invalid', () => {
    it('should return 400 when actual hour is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      const result = await service.updateTask(
        updateTaskDataInvalidActual,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(77);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - when estimated hour is invalid', () => {
    it('should return 400 when estimated hour is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      const result = await service.updateTask(
        updateTaskDataInvalidEstimated,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(76);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('update task - when issue type not found', () => {
    it('should return 400 when issue type not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(634);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('update task - when category not found', () => {
    it('should return 400 when category not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);

      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(633);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - when task description is small', () => {
    it('should return 400 when task description is small', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);

      const result = await service.updateTask(
        updateTaskDataInvalidTaskDescription,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(69);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - when task name is invalid', () => {
    it('should return 400 when task name is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);

      const result = await service.updateTask(
        updateTaskDataInvalidTaskName,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1034);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - when task name is invalid', () => {
    it('should return 400 when task name is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);

      const result = await service.updateTask(
        updateTaskDataInvalidTaskName,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1034);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - when task exist', () => {
    it('should return 400 when task exist', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });

      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(true),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1030);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('update task - assignee is not part of project', () => {
    it('should return 400 when assignee is not part of project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return null;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(false),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(68);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - assignee not found', () => {
    it('should return 400 when assignee not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return null;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return null;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(false),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  //matchh
  describe('update task - notify failed:need to change for notify', () => {
    it('should return 200 when notify failed:need to change for notify', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(2);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3522);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('update task - start_date must be a valid date', () => {
    it('should return 400 when start_date must be a valid date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(4);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(48);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - end_date must be a valid date', () => {
    it('should return 400 when end_date must be a valid date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(5);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(49);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - start_date must be greater than or equal to projects start dt', () => {
    it('should return 400 when start_date must be greater than or equal to projects start dt', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(6);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(82);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - end_date cont be grater than end date of project', () => {
    it('should return 400 end_date cont be grater than end date of project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(7);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1029);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - end_date is smaller than start date', () => {
    it('should return 400 end_date is smaller than start date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(8);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(75);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - start_date must be less than or equal to projects end dt', () => {
    it('should return 400 start_date must be less than or equal to projects end dt', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(8);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(75);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - start_date must be less than or equal to projects end dt', () => {
    it('should return 400 start_date must be less than or equal to projects end dt', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(11);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(655);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - end_date cont be less than start date of project', () => {
    it('should return 400 end_date cont be less than start date of project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(12);
      jest
        .spyOn(service, 'validateDateAndNotify')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(667);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - validateNotifyAndCommentInUpdateTask user not found', () => {
    it('should return 400 validateNotifyAndCommentInUpdateTask user not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(1);
      jest
        .spyOn(service, 'validateNotifyAndCommentInUpdateTask')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1770);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - validateNotifyAndCommentInUpdateTask user not found rejectUsers', () => {
    it('should return 400 validateNotifyAndCommentInUpdateTask user not found rejectUsers', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(2);
      jest
        .spyOn(service, 'validateNotifyAndCommentInUpdateTask')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1770);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - validateNotifyIsNumber notify must be number', () => {
    it('should return 400 validateNotifyIsNumber notify must be number', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const returnValue = jest.fn().mockResolvedValue(1);
      jest
        .spyOn(service, 'validateNotifyIsNumber')
        .mockImplementation(returnValue);
      const result = await service.updateTask(
        updateTaskData,
        _requestMock,
        task_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3578);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('update task - controller', () => {
    it('should return 200 sucessfully update task', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult);
      const result = await controller.updateTask(
        updateTaskData,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result['task_id']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // matchh
  describe('update task - controller', () => {
    it('should return 200 sucessfully update task', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult3);
      const result = await controller.updateTask(
        updateTaskData,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result['task_id']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update task - no change in data when have assignee in both data', () => {
    it('should return 400 no change in data when have assignee in both data', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTaskWithoutDateAndWithAssignee;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithoutDateAndWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithoutDateAndWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult2);
      const result = await controller.updateTask(
        updateTaskDataNoChangeInData3,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1033);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update task - no change in data when have assignee in old data only', () => {
    it('should return 400 no change in data when have assignee in old data only', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTaskWithoutDateAndWithAssignee;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithoutDateAndWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult2);
      const result = await controller.updateTask(
        updateTaskDataNoChangeInData4,
        _requestMock,
        responseMock,
        task_id,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3522);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update task - no change in data with no assignee', () => {
    it('should return 400 no change in data with no assignee', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 28;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 28 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTaskWithoutDate;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithoutDate.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult2);
      const result = await controller.updateTask(
        updateTaskDataNoChangeInData1,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1033);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update task - when un assigne', () => {
    it('should return 200 when un assigne', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 28;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 28 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask3;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask3.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult2);
      const result = await controller.updateTask(
        updateTaskDataNoChangeInData5,
        _requestMock,
        responseMock,
        task_id,
      );
      expect(result).toBeDefined();
      expect(result['task_id']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update task - no change in data with no assignee in old and -1 in new', () => {
    it('should return 400 no change in data with no assignee in old and -1 in new', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 28;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 28 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTaskWithoutDate;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithoutDate.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult2);
      const result = await controller.updateTask(
        updateTaskDataNoChangeInData2,
        _requestMock,
        responseMock,
        task_id,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1033);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update task - assignee not part of project old data ', () => {
    it('should return 400 assignee not part of project old data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTaskWithAssignee;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return null;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult);
      const result = await controller.updateTask(
        updateTaskData,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(68);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - assignee not found of project old data ', () => {
    it('should return 400 assignee not found of project old data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTaskWithAssignee;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return null;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const result = await controller.updateTask(
        updateTaskData,
        _requestMock,
        responseMock,
        task_id,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update task - notify user invalid', () => {
    it('should return 400 notify user invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTaskWithAssignee;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTaskWithAssignee.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return null;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      const result = await controller.updateTask(
        updateTaskData,
        _requestMock,
        responseMock,
        task_id,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  it('should be defined', () => {
    expect(controller.getUserTaskList).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.getSelfTaskList).toBeDefined();
  });
  describe('to get  my tasks when last data is invalid', () => {
    it('should return 400 when last data is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '',
          last_data: 'cvb',
          limit: '',
        },
      } as unknown as Request;

      const result = await controller.getUserTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'The last data is invalid',
        statusCode: 3071,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get  my tasks when limit is invalid', () => {
    it('should return 400 when limit is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '',
          last_data: '',
          limit: 'dfgh',
        },
      } as unknown as Request;

      const result = await controller.getUserTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid limit value',
        statusCode: 3073,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get  my tasks when limit is above 3000', () => {
    it('should return 400 when limit is above 3000', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '',
          last_data: '',
          limit: '5000',
        },
      } as unknown as Request;

      const result = await controller.getUserTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'limit must not be greater than 3000',
        statusCode: 3677,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get  my tasks  when last data not found', () => {
    it('should return 400 when last data not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '',
          last_data: '4',
          limit: '',
          page: '',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await controller.getUserTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'The last data not found',
        statusCode: 3072,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get  my tasks  when last data and page no ', () => {
    it('should return 400 when last data not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '',
          last_data: '4',
          limit: '',
          page: '2',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          }
        },
      );
      const result = await controller.getUserTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Both page and last data will not be accepted',
        statusCode: 2506,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get  my tasks  when last data', () => {
    it('should return 400 when last data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '',
          last_data: '4',
          limit: '',
          page: '',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          } else if (method == 'mytask') {
            return {
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(myTasks),
            };
          }
        },
      );
      (taskRepo.count as jest.Mock).mockReturnValue(10);
      const result = await service.getSelfTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['assignedToMeCount']).toStrictEqual(10);
      expect(result['dataCount']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get  my tasks  when dueDate invalid date', () => {
    it('should return 400 when last data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '',
          last_data: '4',
          limit: '',
          page: '',
          dueDate: '7',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          } else if (method == 'mytask') {
            return {
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(myTasks),
            };
          }
        },
      );
      (taskRepo.count as jest.Mock).mockReturnValue(10);
      const result = await service.getSelfTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid input in due date',
        statusCode: 3012,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('to get  my tasks  when dueDate invalid date', () => {
    it('should return 400 when last data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '5',
          last_data: '4',
          limit: '',
          page: '',
          dueDate: '7',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          } else if (method == 'mytask') {
            return {
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(myTasks),
            };
          }
        },
      );
      (taskRepo.count as jest.Mock).mockReturnValue(10);
      const result = await service.getSelfTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid input in userFilter',
        statusCode: 3011,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get  my tasks  when last data and use as created by', () => {
    it('should return 200 when last data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '1',
          last_data: '1',
          limit: '5',
          page: '',
          dueDate: '0',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          } else if (method == 'mytask') {
            return {
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(myTasks),
            };
          }
        },
      );
      (taskRepo.count as jest.Mock).mockReturnValue(10);
      const result = await service.getSelfTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['assignedToMeCount']).toStrictEqual(10);
      expect(result['dataCount']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get  my tasks  when last data and use as created by and due date', () => {
    it('should return 200 when last data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '1',
          last_data: '1',
          limit: '5',
          page: '',
          dueDate: '1',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          } else if (method == 'mytask') {
            return {
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(myTasks),
            };
          }
        },
      );
      (taskRepo.count as jest.Mock).mockReturnValue(10);
      const result = await service.getSelfTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['assignedToMeCount']).toStrictEqual(10);
      expect(result['dataCount']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get  my tasks  when last data and use as created by and due date', () => {
    it('should return 200 when last data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '1',
          last_data: '',
          limit: '5',
          page: '',
          dueDate: '2',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          } else if (method == 'mytask') {
            return {
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(myTasks),
            };
          }
        },
      );
      (taskRepo.count as jest.Mock).mockReturnValue(10);
      const result = await service.getSelfTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['assignedToMeCount']).toStrictEqual(10);
      expect(result['dataCount']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get  my tasks  when last data and use as created by and due date', () => {
    it('should return 200 when last data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '1',
          last_data: '',
          limit: '',
          page: '',
          dueDate: '3',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          } else if (method == 'mytask') {
            return {
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(myTasks),
            };
          }
        },
      );
      (taskRepo.count as jest.Mock).mockReturnValue(10);
      const result = await service.getSelfTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['assignedToMeCount']).toStrictEqual(10);
      expect(result['dataCount']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('to get  my tasks  when last data and use as created by and due date', () => {
    it('should return 200 when last data ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          userFilter: '',
          last_data: '',
          limit: '',
          page: '',
          dueDate: '',
          searchKey: 'dfg',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(taskList[0]),
            };
          } else if (method == 'mytask') {
            return {
              where: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(myTasks),
            };
          }
        },
      );
      (taskRepo.count as jest.Mock).mockReturnValue(10);
      const result = await service.getSelfTaskList(
        _requestMock,

        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['assignedToMeCount']).toStrictEqual(10);
      expect(result['dataCount']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  //recent updates test cases

  describe('recent updates home page filter when last data is invalid', () => {
    it('should return 400 when last data is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 'aaaa' },
      } as unknown as Request;
      const project_id = 1;
      const projects = {
        filterArray: [1],
      };

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3071);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('recent updates home page filter when last data not found', () => {
    it('should return 400 when last data not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 12 },
      } as unknown as Request;
      const project_id = 1;
      const projects = {
        filterArray: [1],
      };

      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'taskHistory') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3072);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('recent updates home page filter when limit is invalid', () => {
    it('should return 400 when limit is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 1.1 },
      } as unknown as Request;
      const project_id = 1;
      const projects = {
        filterArray: [1],
      };

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3073);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('recent updates home page filter when limit is > 3000', () => {
    it('should return 400 when limit is > 3000', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4000 },
      } as unknown as Request;
      const project_id = 1;
      const projects = {
        filterArray: [1],
      };

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3677);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('recent updates home page filter both page and last date will not be accepted', () => {
    it('should return 400  both page and last date will not be accepted', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 1, last_data: 1 },
      } as unknown as Request;
      const project_id = 16;
      const projects = {
        filterArray: [1],
      };
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'taskHistory') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(filterHome),
            };
          }
        },
      );

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2506);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('recent updates home page filter filterArray accepts only 0,1 and 2', () => {
    it('should return 400 when filterArray accepts only 0,1 and 2', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 'dgdfe' },
      } as unknown as Request;
      const project_id = 16;
      const projects = {
        filterArray: [1, 3],
      };

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1610);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('recent updates home page filter project not found', () => {
    it('should return 400 when project not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 1 },
      } as unknown as Request;
      const project_id = 100;
      const projects = {
        filterArray: [1],
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('recent updates home page filter unathoriased', () => {
    it('should return 400 when unathoriased', async () => {
      let requestMock: Request = {
        currentUser: unauthorised,
        query: { page: 1 },
      } as unknown as Request;
      const project_id = 100;
      const projects = {
        filterArray: [],
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder1;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return null;
        }
      });

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('recent updates home page filter api success case', () => {
    it('should return 200 when success case', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 1 },
      } as unknown as Request;
      const project_id = 100;
      const projects = {
        filterArray: [1],
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder1;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(filterHome2),
            };
          }
          if (method == 'taskHistoryObj1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(filterHome2),
            };
          }
        },
      );

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('recent updates home page filter api success case with limit ad last_data', () => {
    it('should return 200 when success case with limit ad last_data', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 197, limit: 8 },
      } as unknown as Request;
      const project_id = 100;
      const projects = {
        filterArray: [1],
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder1;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'taskHistory') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastValueFilterHome),
            };
          }
          if (method == 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              // getOne: jest.fn().mockResolvedValue(lastValueFilterHome),
              getMany: jest.fn().mockResolvedValue(filterHome2),
            };
          }
          if (method == 'taskHistoryObj1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              // getOne: jest.fn().mockResolvedValue(lastValueFilterHome),
              getMany: jest.fn().mockResolvedValue(filterHome2),
            };
          }
        },
      );

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('recent updates home page filter api exception case', () => {
    it('should return 200 when exception case', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 197, limit: 8 },
      } as unknown as Request;
      const project_id = 100;
      const projects = {
        filterArray: [1],
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder1;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              // getOne: jest.fn().mockResolvedValue(lastValueFilterHome),
              getMany: jest.fn().mockResolvedValue(filterHome2),
            };
          }
          if (method == 'taskHistoryObj1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              // getOne: jest.fn().mockResolvedValue(lastValueFilterHome),
              getMany: jest.fn().mockResolvedValue(filterHome2),
            };
          }
        },
      );

      const result = await service.FilterRecentupdates(
        project_id,
        requestMock,
        projects,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('recent updates home page filter api success case in controller', () => {
    it('should return 200 when success case in controller', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { page: 1 },
      } as unknown as Request;
      const project_id = 100;
      const projects: FilterRecentupdates = {
        filterArray: [],
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return fileUploadProjectFolder1;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (historyRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(filterHome2),
            };
          }
          if (method == 'taskHistoryObj1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(filterHome2),
            };
          }
        },
      );

      const result = await controller.FilterRecentupdates(
        project_id,
        projects,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  // board api testcases
  //   describe('board list and filter api issue not found', () => {
  //     it('should return 400 when issue not found', async () => {
  //       let requestMock: Request = {
  //         currentUser: currentUserObj,
  //       } as unknown as Request;
  //       const project_id = 2;
  //       const boardfilter: BoardFilter = {
  //         issue_type: 200,
  //         category: null,
  //         assignee: null,
  //       };

  //       (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
  //         if (option.where.project_id === 2 && option.where.status === STATUS.ACTIVE) {
  //           return boardProject
  //         }
  //       });
  //       (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
  //         if (option.where.allocated_user.user_id === 1 && option.where.project_id_resource_alloc.project_id === 100 && option.where.status === STATUS.ACTIVE && option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED) {
  //           return projectMember
  //         }
  //       });
  //       (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
  //         if (option.where.issue_id === 200 && option.where.status === STATUS.ACTIVE) {
  //           return null
  //         }
  //       });
  //       (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
  //         (method: any) => {
  //           if (method == 'task') {
  //             return {
  //               leftJoinAndSelect: jest.fn().mockReturnThis(),
  //               where: jest.fn().mockReturnThis(),
  //               andWhere: jest.fn().mockReturnThis(),
  //               orderBy: jest.fn().mockReturnThis(),
  //               offset: jest.fn().mockReturnThis(),
  //               limit: jest.fn().mockReturnThis(),
  //               getCount: jest.fn().mockResolvedValue(2),
  //               getMany: jest.fn().mockResolvedValue([]),

  //             };
  //           }
  //           if (method == 'task1') {
  //             return {
  //               leftJoinAndSelect: jest.fn().mockReturnThis(),
  //               where: jest.fn().mockReturnThis(),
  //               andWhere: jest.fn().mockReturnThis(),
  //               orderBy: jest.fn().mockReturnThis(),
  //               offset: jest.fn().mockReturnThis(),
  //               limit: jest.fn().mockReturnThis(),
  //               getCount: jest.fn().mockResolvedValue(2),
  //               getMany: jest.fn().mockResolvedValue([]),

  //             };
  //           }
  //           if (method == 'task2') {
  //             return {
  //               leftJoinAndSelect: jest.fn().mockReturnThis(),
  //               where: jest.fn().mockReturnThis(),
  //               andWhere: jest.fn().mockReturnThis(),
  //               orderBy: jest.fn().mockReturnThis(),
  //               offset: jest.fn().mockReturnThis(),
  //               limit: jest.fn().mockReturnThis(),
  //               getCount: jest.fn().mockResolvedValue(2),
  //               getMany: jest.fn().mockResolvedValue([]),

  //             };
  //           }
  //           if (method == 'task3') {
  //             return {
  //               leftJoinAndSelect: jest.fn().mockReturnThis(),
  //               where: jest.fn().mockReturnThis(),
  //               andWhere: jest.fn().mockReturnThis(),
  //               orderBy: jest.fn().mockReturnThis(),
  //               offset: jest.fn().mockReturnThis(),
  //               limit: jest.fn().mockReturnThis(),
  //               getCount: jest.fn().mockResolvedValue(2),
  //               getMany: jest.fn().mockResolvedValue([]),

  //             };
  //           }
  //         },
  //       );

  //       const result = await service.getBoardHomeList(
  //         project_id,
  //         requestMock,
  //         boardfilter,
  //         responseMock,
  //       );
  // console.log(result,"3245");

  //       expect(result).toBeDefined();
  //       expect(result.statusCode).toStrictEqual(634);

  //       expect(responseMock.status).toHaveBeenCalledWith(400);
  //     });
  //   });

  describe('board list and filter api project not found', () => {
    it('should return 400 when project not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const project_id = 1;
      const boardfilter: BoardFilter = {
        issue_type: null,
        category: null,
        assignee: null,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });

      const result = await service.getBoardHomeList(
        project_id,
        requestMock,
        boardfilter,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('board list and filter api Unauthorized', () => {
    it('should return 400 when Unauthorized', async () => {
      let requestMock: Request = {
        currentUser: unauthorised,
      } as unknown as Request;
      const project_id = 2;
      const boardfilter: BoardFilter = {
        issue_type: null,
        category: null,
        assignee: null,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardProject;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return null;
        }
      });

      const result = await service.getBoardHomeList(
        project_id,
        requestMock,
        boardfilter,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('board list and filter api success without filter', () => {
    it('should return 400 when success without filter', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const project_id = 2;
      const boardfilter: BoardFilter = {
        issue_type: null,
        category: null,
        assignee: null,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardProject;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task2') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task3') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
        },
      );

      const result = await service.getBoardHomeList(
        project_id,
        requestMock,
        boardfilter,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('board list and filter api category not found', () => {
    it('should return 400 when category not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const project_id = 2;
      const boardfilter: BoardFilter = {
        issue_type: 2,
        category: 2,
        assignee: null,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardProject;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task2') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task3') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
        },
      );
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return issueType;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });

      const result = await service.getBoardHomeList(
        project_id,
        requestMock,
        boardfilter,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(633);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('board list and filter api user not found', () => {
    it('should return 400 when user not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const project_id = 2;
      const boardfilter: BoardFilter = {
        issue_type: 2,
        category: 1,
        assignee: 100,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardProject;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task2') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task3') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
        },
      );
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return issueType;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return category;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });

      const result = await service.getBoardHomeList(
        project_id,
        requestMock,
        boardfilter,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('board list and filter api user not found in controller', () => {
    it('should return 400 when user not found in controller', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const project_id = 2;
      const boardfilter: BoardFilter = {
        issue_type: 2,
        category: 1,
        assignee: 100,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardProject;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task2') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task3') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
        },
      );
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return issueType;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return category;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });

      const result = await controller.getBoardHomeList(
        boardfilter,
        project_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('board list and filter api success case with filters', () => {
    it('should return 200 when success case with filters', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const project_id = 2;
      const boardfilter: BoardFilter = {
        issue_type: 2,
        category: 1,
        assignee: 1,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardProject;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task2') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task3') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
        },
      );
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return issueType;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return category;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardAssignee;
        }
      });

      const result = await service.getBoardHomeList(
        project_id,
        requestMock,
        boardfilter,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('board list and filter api exception case', () => {
    it('should return 400 when  exception case', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const project_id = 2;
      const boardfilter: BoardFilter = {
        issue_type: 2,
        category: 1,
        assignee: 1,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardProject;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
            };
          }
          if (method == 'task1') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task2') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task3') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
        },
      );
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return issueType;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return category;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardAssignee;
        }
      });

      const result = await service.getBoardHomeList(
        project_id,
        requestMock,
        boardfilter,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('board list and filter api exception case 1 catch', () => {
    it('should return 200 whenexception case 1 catch', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const project_id = 2;
      const boardfilter: BoardFilter = {
        issue_type: 2,
        category: 1,
        assignee: 1,
      };

      (projectRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.project_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardProject;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.allocated_user.user_id === 1 &&
          option.where.project_id_resource_alloc.project_id === 100 &&
          option.where.status === STATUS.ACTIVE &&
          option.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return projectMember;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task10') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task2') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
          if (method == 'task3') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(boardRes),
            };
          }
        },
      );
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_id === 2 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return issueType;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return category;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return boardAssignee;
        }
      });

      const result = await service.getBoardHomeList(
        project_id,
        requestMock,
        boardfilter,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateNotifyIsNumber- user id is invalid', () => {
    it('should return 400 when user id is invalid', async () => {
      let noifyUsers = [];
      let stringUser = [];
      let numberUser = [];
      const result = await service.validateNotifyIsNumber(
        validateNotifyIsNumberInput,
        numberUser,
        stringUser,
        noifyUsers,
      );
      expect(result).toStrictEqual(1);
    });
  });

  describe('validateNotifyAndCommentInUpdateTask- user id is invalid', () => {
    it('should return 400 when user id is invalid', async () => {
      let commentSuccess = new Array();
      let userNotFound = [];
      let userArray = [];
      let rejectUsers = new Array();
      let allocatedUsers = new Array();
      let array = [userNotFound, rejectUsers, allocatedUsers, userArray];

      const result = await service.validateNotifyAndCommentInUpdateTask(
        validateNotifyAndCommentInUpdateTaskData,
        changeStatusTask,
        12,
        commentSuccess,
        requestMock,
        array,
      );
      expect(result).toStrictEqual(2);
    });
  });

  describe('taskDataEndDateValidate when date not string', () => {
    it('should return 400 when date not string', async () => {
      const result = await service.taskDataEndDateValidate(
        taskDataEndDateValidatedata1,
        '2023-04-17',
        '2023-04-17',
      );
      expect(result).toStrictEqual(5);
    });
  });

  describe('taskDataEndDateValidate when date is invalid', () => {
    it('should return 400 when date is invalid', async () => {
      const result = await service.taskDataEndDateValidate(
        taskDataEndDateValidatedata2,
        '2023-04-17',
        '2023-04-17',
      );
      expect(result).toStrictEqual(5);
    });
  });

  describe('taskDataEndDateValidate when end date is greater than start date', () => {
    it('should return 400 when end date is greater than start date', async () => {
      const result = await service.taskDataEndDateValidate(
        taskDataEndDateValidatedata3,
        '2023-04-17',
        '2023-04-18',
      );
      expect(result).toStrictEqual(8);
    });
  });

  describe('taskDataStartDate when start date is invalid', () => {
    it('should return 400 when start date is invalid', async () => {
      const result = await service.taskDataStartDate(
        taskDataEndDateValidatedata1,
        '2023-04-17',
        '2023-04-18',
      );
      expect(result).toStrictEqual(4);
    });
  });

  describe('taskDataStartDate when start date is invalid 2 ', () => {
    it('should return 400 when start date is invalid 2 ', async () => {
      const result = await service.taskDataStartDate(
        taskDataEndDateValidatedata2,
        '2023-04-17',
        '2023-04-18',
      );
      expect(result).toStrictEqual(4);
    });
  });

  describe('taskDataStartDate when projectStartDate > start_date', () => {
    it('should return 400 when projectStartDate > start_date', async () => {
      const result = await service.taskDataStartDate(
        taskDataEndDateValidatedata4,
        new Date('2090-04-17'),
        new Date('2023-04-17'),
      );
      expect(result).toStrictEqual(6);
    });
  });

  describe('taskDataStartDate when start_date > projectEndDate', () => {
    it('should return 400 when start_date > projectEndDate', async () => {
      const result = await service.taskDataStartDate(
        taskDataEndDateValidatedata4,
        new Date('2022-02-02'),
        new Date('2022-02-02'),
      );
      expect(result).toStrictEqual(11);
    });
  });

  describe('taskDataEndDateValidate when end_date > projectEndDate', () => {
    it('should return 400 when end_date > projectEndDate', async () => {
      const result = await service.taskDataEndDateValidate(
        taskDataEndDateValidatedata4,
        new Date('2022-02-02'),
        new Date('2022-02-02'),
      );
      expect(result).toStrictEqual(7);
    });
  });

  describe('taskDataEndDateValidate when end_date < projectStartDate', () => {
    it('should return 400 when end_date < projectStartDate', async () => {
      const result = await service.taskDataEndDateValidate(
        taskDataEndDateValidatedata4,
        new Date('2023-02-28'),
        new Date('2023-02-28'),
      );
      expect(result).toStrictEqual(12);
    });
  });

  describe('validateDateAndNotify 2', () => {
    it('should return 2 validateDateAndNotify', async () => {
      let noChangeArrray = [1];
      let commentSuccess = [];
      let noifyUsers = [1];

      const result = await service.validateDateAndNotify(
        updateTaskData,
        noChangeArrray,
        commentSuccess,
        noifyUsers,
        taskDataGetTaskById,
        requestMock,
      );
      expect(result).toStrictEqual(2);
    });
  });

  describe('validateDateAndNotify 4', () => {
    it('should return 4 validateDateAndNotify', async () => {
      let noChangeArrray = [];
      let commentSuccess = [];
      let noifyUsers = [];
      const _requestMock: Request = {
        currentUser: currentUserObj,
        body: { start_date: 0 },
      } as unknown as Request;
      const result = await service.validateDateAndNotify(
        updateTaskData,
        noChangeArrray,
        commentSuccess,
        noifyUsers,
        taskDataGetTaskById,
        _requestMock,
      );
      expect(result).toStrictEqual(4);
    });
  });

  describe('validateDateAndNotify 5', () => {
    it('should return 5 validateDateAndNotify', async () => {
      let noChangeArrray = [];
      let commentSuccess = [];
      let noifyUsers = [];
      const _requestMock: Request = {
        currentUser: currentUserObj,
        body: { end_date: 0 },
      } as unknown as Request;
      const result = await service.validateDateAndNotify(
        updateTaskData,
        noChangeArrray,
        commentSuccess,
        noifyUsers,
        taskDataGetTaskById,
        _requestMock,
      );
      expect(result).toStrictEqual(5);
    });
  });

  describe('validateDateAndNotify case1', () => {
    it('should return case1 validateDateAndNotify', async () => {
      let noChangeArrray = [];
      let commentSuccess = [];
      let noifyUsers = [];
      const _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const result = await service.validateDateAndNotify(
        updateTaskDataStDtDateCheck,
        noChangeArrray,
        commentSuccess,
        noifyUsers,
        taskDataGetTaskById,
        _requestMock,
      );
      expect(result).toStrictEqual(4);
    });
  });

  describe('validateDateAndNotify case2', () => {
    it('should return case2 validateDateAndNotify', async () => {
      let noChangeArrray = [];
      let commentSuccess = [];
      let noifyUsers = [];
      const _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const result = await service.validateDateAndNotify(
        updateTaskDataEnDtDateCheck,
        noChangeArrray,
        commentSuccess,
        noifyUsers,
        taskDataGetTaskById,
        _requestMock,
      );
      expect(result).toStrictEqual(5);
    });
  });

  describe('validateNotfyOnly 2', () => {
    it('should return 2 validateNotfyOnly', async () => {
      let rejectUsersNotify = [1];
      let allocatedUsersNotify = [2];
      const _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const findByIdMock = jest.fn().mockResolvedValueOnce(true);
      jest
        .spyOn(service, 'validateNotify12')
        .mockImplementationOnce(findByIdMock);
      const result = await service.validateNotfyOnly(
        updateTaskDataValidateNotify1,
        taskDataGetTaskById,
        _requestMock,
        rejectUsersNotify,
        allocatedUsersNotify,
      );
      expect(result).toStrictEqual(2);
    });
  });

  describe('validateNotfyOnly 1', () => {
    it('should return 1 validateNotfyOnly', async () => {
      let rejectUsersNotify = [1];
      let allocatedUsersNotify = [];
      const _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const findByIdMock = jest.fn().mockResolvedValueOnce(true);
      jest
        .spyOn(service, 'validateNotify12')
        .mockImplementationOnce(findByIdMock);
      const result = await service.validateNotfyOnly(
        updateTaskDataValidateNotify1,
        taskDataGetTaskById,
        _requestMock,
        rejectUsersNotify,
        allocatedUsersNotify,
      );
      expect(result).toStrictEqual(1);
    });
  });

  describe('validateNotfyOnly when allocatedUsers.length > 0', () => {
    it('should return undefined validateNotfyOnly when allocatedUsers.length > 0', async () => {
      let rejectUsersNotify = [];
      let allocatedUsersNotify = [currentUserObj];
      const _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const findByIdMock = jest.fn().mockResolvedValueOnce(true);
      jest
        .spyOn(service, 'validateNotify12')
        .mockImplementationOnce(findByIdMock);
      const result = await service.validateNotfyOnly(
        updateTaskDataValidateNotify1,
        taskDataGetTaskById,
        _requestMock,
        rejectUsersNotify,
        allocatedUsersNotify,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('validateNotify when allocatedUsers.length > 0', () => {
    it('should return pass validateNotify when allocatedUsers.length > 0', async () => {
      let allocatedUsers = [currentUserObj];
      const _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const result = await service.validateNotify(
        allocatedUsers,
        taskDataGetTaskById,
        _requestMock,
      );
      expect(result).toBeUndefined();
    });
  });

  //edit issuetype
  describe('edit issueType service  successs new issuetype', () => {
    it('should return 200 when  edit issueType is success if  new issuetype', async () => {
      const issue_type_id = 6;
      const _issueType: AddIssueType = { issue_type: 'hbwbeefhwdhdbwd' };
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_name === _issueType.issue_type &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_id === 6 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return issueType1;
        }
      });
      const result = await service.editIssueType(
        _issueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  // edit category
  describe('edit category service  successs new category', () => {
    it('should return 200 when  edit category is success if  new category', async () => {
      const category_id = 8;
      const _category: AddCategory = { category_name: 'ededeyydedede' };
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_name === _category.category_name &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_id === 8 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return editCategory;
        }
      });
      const result = await service.editcategory(
        _category,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  // describe('add category service exception case', () => {
  //   it('should return 400 when  add category exception case', async () => {
  //     const _category: AddCategory = { category_name:"d4f4" };
  //     (categoryRepo.find as jest.Mock).mockImplementation((option: any) => {
  //       if (option.where.category_name === -1 && option.where.status === STATUS.ACTIVE) {
  //         return "cedcec";

  //       }
  //     });
  //     // (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
  //     //   if (option.where.category_id === 8 && option.where.status === STATUS.ACTIVE) {
  //     //     return -1

  //     //   }
  //     // });
  //     (categoryRepo.save as jest.Mock).mockResolvedValueOnce([1]);

  //     const result = await service.addCategory(
  //       _category,
  //       requestMock,
  //       responseMock,
  //     );
  //     console.log(result,"9876");

  //     expect(result).toBeDefined();
  //     expect(result.statusCode).toStrictEqual(400);
  //     expect(responseMock.status).toHaveBeenCalledWith(400);
  //   });
  // });

  describe('edit category service exception case', () => {
    it('should return 400 when  edit category exception case', async () => {
      const category_id = 8;
      const _category: AddCategory = { category_name: 'wwsss' };
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_name === _category.category_name &&
          option.where.status === STATUS.ACTIVE
        ) {
          return undefined;
        }
      });
      (categoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.category_id === 8 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return -1;
        }
      });
      const result = await service.editcategory(
        _category,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('delete  issueType expection case', () => {
    it('should return 400 for expection case ', async () => {
      const issue_type_id = 7;
      const replaceIssueType: ReplaceIssueType = { replace_issueType: 6 };
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType4);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (issueTypeRepo.find as jest.Mock).mockResolvedValueOnce(replaceIssue2);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(
        replacementIssuetasklist,
      );
      const result = await service.deleteissueType(
        replaceIssueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('delete  category expection case', () => {
    it('should return 400 for expection case ', async () => {
      const category_id = 7;
      const replaceCategory: ReplaceCategory = { replace_category: 6 };
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category4);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(taskList);
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(replaceCategory2);
      (taskRepo.find as jest.Mock).mockResolvedValueOnce(
        replacementCategorytasklist1,
      );
      const result = await service.deletecategory(
        replaceCategory,
        category_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('edit issueType service exception case', () => {
    it('should return 400 when  edit issueType exception case', async () => {
      const issue_type_id = 8;
      const _issueType: AddIssueType = { issue_type: 'wwsss' };
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_name === _issueType.issue_type &&
          option.where.status === STATUS.ACTIVE
        ) {
          return undefined;
        }
      });
      (issueTypeRepo.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.issue_id === 8 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return -1;
        }
      });
      const result = await service.editIssueType(
        _issueType,
        issue_type_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('user not found when mention a user', () => {
    it('should return 200 sucessfully update task', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult3);
      historyRepo.create = jest.fn().mockReturnValue(commentHistory1);
      const result = await controller.updateTask(
        updateTaskDataAndNotify,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result['task_id']).toBeDefined();
      expect(result).toStrictEqual({
        task_id: 429,
        errorMessage: 'User not found rijo@gmail.com',
        statusCode: 1770,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when successfully mention through comment', () => {
    it('should return 200 sucessfully update task', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return dummyDeveloper;
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult3);
      historyRepo.create = jest.fn().mockReturnValue(commentHistory1);
      const result = await controller.updateTask(
        updateTaskDataAndNotify,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result['task_id']).toBeDefined();

      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when successfully mention through comment', () => {
    it('should return 200 sucessfully update task', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return dummyDeveloper;
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult3);
      historyRepo.create = jest.fn().mockReturnValue(commentHistory1);
      const result = await controller.updateTask(
        updateTaskDataAndNotify,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result['task_id']).toBeDefined();

      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when successfully task commented and notify', () => {
    it('should return 200 sucessfully update task', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return dummyDeveloper;
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult3);
      historyRepo.create = jest.fn().mockReturnValue(commentHistory1);
      const result = await controller.updateTask(
        updateTaskDataAndNotifyANdComment,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result['task_id']).toBeDefined();

      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when failed to notify user', () => {
    it('should return 400 sucessfully update task', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.task_id == 23 &&
          options.where.status == STATUS.ACTIVE
        ) {
          return taskUpdateTask;
        }
      });
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.allocated_user == currentUserObj
        ) {
          return updateTaskAllocation;
        } else if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.project_id_resource_alloc ==
            taskUpdateTask.project_id &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
        ) {
          return assigneeAllocationUpdateTask;
        }
      });
      (userRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.user_id == updateTaskData.assignee &&
          options.where.status == STATUS.ACTIVE
        ) {
          return dummyDeveloper;
        }
      });
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method: any) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      (categoryRepo.findOne as jest.Mock).mockResolvedValueOnce(category);
      (issueTypeRepo.findOne as jest.Mock).mockResolvedValueOnce(issueType);
      (taskRepo.save as jest.Mock).mockResolvedValueOnce(updateTaskresult3);
      historyRepo.create = jest.fn().mockReturnValue(commentHistory2);
      const result = await controller.updateTask(
        updateTaskDataAndNotifyANdComment,
        _requestMock,
        responseMock,
        task_id,
      );

      expect(result).toBeDefined();
      expect(result['task_id']).toBeDefined();
      expect(result).toStrictEqual({
        task_id: 429,
        errorMessage: 'User not found 23',
        statusCode: 1770,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block add task', () => {
    it('should return exception add task', async () => {
      const taskBody: AddTaskDto = addTaskInput1;
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: taskBody,
      } as unknown as Request;
      (projectRepo.findOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test error');
      });
      const result = await controller.addTask(
        taskBody,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block get task by id', () => {
    it('should return exception task by id', async () => {
      const task_id = 20;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.findOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test error');
      });
      const result = await service.getTaskById(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block get task list', () => {
    it('should return exception task list', async () => {
      let project_id = 2;
      let normalSearchDto: NormalSearchDto = {
        status: 5,
        subtasking: null,
        keyWord: 'null',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (projectRepo.findOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test error');
      });
      const result = await service.getTaskList(
        project_id,
        normalSearchDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block get sub4TaskList', () => {
    it('should return exception sub4TaskList', async () => {
      let normalSearchDto: NormalSearchDto = {
        status: 5,
        subtasking: null,
        keyWord: 'null',
      };
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: normalSearchDto,
        query: {
          searchKey: 'erftgh',
          searchCol: 'task_name',
        },
      } as unknown as Request;
      (taskRepo.createQueryBuilder as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const result = await service.sub4TaskList(
        responseMock,
        project_2,
        normalSearchDto,
        _requestMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block updateTask', () => {
    it('should return exception updateTask', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: {},
      } as unknown as Request;
      const task_id = 23;
      (taskRepo.findOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test error');
      });
      const result = await service.updateTask(
        updateTaskDataAndNotifyANdComment,
        _requestMock,
        task_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Process failed',
        statusCode: 26,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block getTaskHistoryData', () => {
    it('should return exception getTaskHistoryData', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (historyRepo.save as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const result = await service.getTaskHistoryData(
        taskDataEndDateValidatedata1,
        taskDataEndDateValidatedata2,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Process failed',
        statusCode: 26,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block confirmTaskDelete', () => {
    it('should return exception confirmTaskDelete', async () => {
      const task_id = 2;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const result = await service.confirmTaskDelete(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block softDeleteTask', () => {
    it('should return exception softDeleteTask', async () => {
      const task_id = 2;
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (taskRepo.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const result = await service.softDeleteTask(
        task_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('catch block fileTaskHistory', () => {
    it('should return exception fileTaskHistory', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const task_file = {};
      (historyRepo.create as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const result = await service.fileTaskHistory(
        taskData,
        task_file,
        project_2,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
});
