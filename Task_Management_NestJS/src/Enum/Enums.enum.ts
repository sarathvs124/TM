import { HttpStatus } from '@nestjs/common';
export enum STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
}

export enum NEW_USER_STATUS {
  NEWBIE = 0,
  ACTIVE = 1,
}

export enum TASK_STATUS {
  OPEN = 1,
  INPROGRESS = 2,
  RESOLVED = 3,
  CLOSED = 4,
}

export enum TASK_CATEGORY {
  BUG = 1,
  DEVELOPER_ISSUE = 2,
  REQUEST = 3,
  TASK = 4,
  OTHER = 5,
}

export enum TASK_PRIORITY {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
}

export enum TASK_HISTORY_ACTION {
  DELETE_TASK = 1,
  CREATE_TASK = 2,
  UPDATE_TASK = 3,
  FILE_UPLOAD = 4,
  ASSIGN_TASK = 5,
  REASSIGN_TASK = 6,
  CREATE_AND_ASSIGN = 7,
  CHANGE_TASK_STATUS = 8,
  UPDATE_AND_REASSIGN = 9,
  COMMENT = 10,
  CHANGE_STATUS = 11,
  CHANGE_ASSIGNEE = 12,
  CHANGED_STATUS_ASSIGNEE = 13,
  FILE_RENAME = 14,
}

export enum NOTIFICATION_ENUM {
  ASSIGN_TASK = 1,
  REASSIGN_TASK = 2,
  ALLOCATION = 3,
  NOTIFY = 4,
  COMMENT_MENTION = 5,
  COMMENT_NOTIFY = 6,
  CHANGE_STATUS = 7,
  UNN_ALLOCATION = 8,
  ROLE_CHANGED = 9,
}

export enum PROJECT_HISTORY_ACTION {
  ALLOCATE_USER = 20,
  EDIT_PROJECT = 21,
  EDIT_ALLOCATION = 22,
  DELETE_PROJECT = 23,
  UN_ALLOCATE = 24,
}

export enum ALLOCATION_STATUS {
  ALLOCATED = 1,
  UNALLOCATED = 0,
}
export enum FOLDER_TYPE {
  PROJECT_FOLDER = 1,
}
export enum NOTIFCATION_STATUS {
  NOTVIEWED = 1,
  VIEWED = 2,
}
export enum NOTIFCATION_READ_STATUS {
  READ = 1,
  NOT_READ = 2,
}

export enum ROLE_AUTHORITY {
  TOP_LEVEL = 1,
  MEDIUM_LEVEL = 2,
}

export enum PIN_STATUS {
  PIN = 1,
  UNPIN = 0,
}

export enum TASK_RELATION {
  NORMAL = 1,
  PARENT = 2,
  CHILD = 3,
}

export enum SERVICE_EXCEPTION {
  ERROR_RESPONSE = HttpStatus.BAD_REQUEST,
  SUCCESS_RESPONSE = HttpStatus.OK,
  EXCEPTION_CATCH = HttpStatus.BAD_REQUEST,
  UN_AUTHORIZED = 399,
}
export enum CHANGE_PASSWORD_STATUS {
  NORMAL = 1,
  PASSWORD_CHANGED = 2,
}

export enum HISTORY_TYPE {
  TASK_HISTORY = 1,
  PROJECT_HISTORY = 2,
}
