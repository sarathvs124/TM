import { ErrorStatus } from './../ErrorStatus';
export const errorCodesAndMessage = {
  '"email" is required': { errorMessage: 'Email not provided', statusCode: 10 },
  '"password" is required': {
    errorMessage: 'Password not provided',
    statusCode: 12,
  },
  'user not found': {
    errorMessage: 'User not found',
    statusCode: ErrorStatus.USER_NOT_FOUND,
  },
  'wrong password': {
    errorMessage: 'Wrong password',
    statusCode: ErrorStatus.WRONG_PASSWORD,
  },
  '"email" must be a string': {
    errorMessage: 'Email must be a string',
    statusCode: 13,
  },
  '"email" is not allowed to be empty': {
    errorMessage: 'Email is not allowed to be empty',
    statusCode: 16,
  },
  '"password" must be a string': {
    errorMessage: 'Password must be a string',
    statusCode: 14,
  },
  '"password" is not allowed to be empty': {
    errorMessage: 'Password is not allowed to be empty',
    statusCode: 15,
  },
  '"old_password" is not allowed to be empty': {
    errorMessage: 'old password is required',
    statusCode: 96,
  },
  '"new_password" is not allowed to be empty': {
    errorMessage: 'New Passwod is required',
    statusCode: 97,
  },
  'Password Cannot Be Same': {
    errorMessage: 'New and old password cannot be same',
    statusCode: 18,
  },
  'Password doesnt match with old password': {
    errorMessage: 'Password doesnt match with old password',
    statusCode: 20,
  },
  'Dont use same old password': {
    errorMessage: 'Dont use same old password',
    statusCode: 20,
  },
  '"email" is not allowed': {
    errorMessage: 'Email is not allowed',
    statusCode: 22,
  },
  'token expired': {
    errorMessage: 'Token has expired',
    statusCode: 23,
  },
  'exception caught in catch': {
    errorMessage: 'Exception',
    statusCode: 400,
  },
  'wrong purpose of token': {
    errorMessage: 'Wrong token',
    statusCode: 25,
  },
  'process failed': {
    errorMessage: 'Process failed',
    statusCode: 26,
  },
  'invalid token': {
    errorMessage: 'Invalid token',
    statusCode: 27,
  },
  '"newPassword" is not allowed to be empty': {
    errorMessage: 'Password is not allowed to be empty',
    statusCode: 31,
  },
  '"newPassword" must be a string': {
    errorMessage: 'New password must be a string',
    statusCode: 32,
  },
  '"newPassword" is required': {
    errorMessage: 'New password is not given',
    statusCode: 33,
  },
  'role not found': {
    errorMessage: 'role not found',
    statusCode: 90,
  },
  '"user_name" is not allowed': {
    errorMessage: 'user_name not required',
    statusCode: 91,
  },
  'user already allocated to project': {
    errorMessage: 'user already allocated to project',
    statusCode: 92,
  },
  '"role" must be a number': {
    errorMessage: 'role must be number',
    statusCode: 93,
  },
  '"user_name" must be a string': {
    errorMessage: 'user_name must be string',
    statusCode: 94,
  },
  '"user_name" is not allowed to be empty': {
    errorMessage: 'user_name is not allowed to be empty',
    statusCode: 95,
  },
  '"old_password" is required': {
    errorMessage: 'old password is not provided',
    statusCode: 16,
  },
  '"new_password" is required': {
    errorMessage: 'new password is not provided',
    statusCode: 17,
  },

  'cannot delete by yourself': {
    errorMessage: 'cannot delete your account by yourself',
    statusCode: 98,
  },
  '"user_name" is required': {
    errorMessage: 'user_name is not provided',
    statusCode: 112,
  },
  '"role" is required': {
    errorMessage: 'role is not provided',
    statusCode: 113,
  },
  '"old_password" must be a string': {
    errorMessage: 'old_password" must be a string',
    statusCode: 114,
  },
  '"new_password" must be a string': {
    errorMessage: 'new_password" must be a string',
    statusCode: 115,
  },
  //task
  '"task_name" is required': {
    errorMessage: 'Task name is required',
    statusCode: 99,
  },
  '"task_name" is not allowed to be empty': {
    errorMessage: 'Task name is not allowed to be empty',
    statusCode: 34,
  },
  '"task_name" must be a string': {
    errorMessage: 'Task name must be a string',
    statusCode: 35,
  },
  '"project_id" is required': {
    errorMessage: 'Project id is required',
    statusCode: 36,
  },
  '"project_id" must be a number': {
    errorMessage: 'Project id must be a number',
    statusCode: 37,
  },
  '"priority" is required': {
    errorMessage: 'Priority is required',
    statusCode: 38,
  },
  '"priority" must be a number': {
    errorMessage: 'Priority must be a number',
    statusCode: 39,
  },
  '"category" is required': {
    errorMessage: 'category is required',
    statusCode: 40,
  },
  '"category" must be a number': {
    errorMessage: 'Category must be a number',
    statusCode: 41,
  },
  '"task_description" is required': {
    errorMessage: 'Description is required',
    statusCode: 42,
  },
  '"task_description" is not allowed to be empty': {
    errorMessage: 'Description is not allowed to be empty',
    statusCode: 43,
  },
  '"task_description" must be a string': {
    errorMessage: 'Description bust be a string',
    statusCode: 44,
  },
  '"estimated_hours" must be a string': {
    errorMessage: 'Estimated hours must be a string',
    statusCode: 45,
  },
  '"actual_hours" must be a string': {
    errorMessage: 'Actual hours must be a string',
    statusCode: 46,
  },
  '"assignee" must be a number': {
    errorMessage: 'Assignee must be a number',
    statusCode: 47,
  },
  '"start_date" must be a valid date': {
    errorMessage: 'Start date must be a valid date',
    statusCode: 48,
  },
  '"end_date" must be a valid date': {
    errorMessage: 'End date must be a valid date',
    statusCode: 49,
  },
  'project not found': {
    errorMessage: 'Project not found',
    statusCode: 50,
  },
  'could not crete task': {
    errorMessage: 'Could not create task',
    statusCode: 51,
  },
  'task not found': {
    errorMessage: 'Task not found',
    statusCode: 52,
  },
  '"from_date" is required': {
    errorMessage: 'From date is not given',
    statusCode: 53,
  },
  '"to_date" is required': {
    errorMessage: 'To date is not given',
    statusCode: 54,
  },
  '"from_date" must be a valid date': {
    errorMessage: 'From date must be a valid date',
    statusCode: 55,
  },
  '"to_date" must be a valid date': {
    errorMessage: 'To date must be a valid date',
    statusCode: 56,
  },
  '"users" does not contain 1 required value(s)': {
    errorMessage: 'No user is provided to allocate',
    statusCode: 57,
  },
  '"category" must be greater than or equal to 1': {
    errorMessage: 'Invalid category',
    statusCode: 58,
  },
  '"priority" must be one of [1, 2, 3]': {
    errorMessage: 'Invalid priority',
    statusCode: 59,
  },
  //project
  'project code already exists': {
    errorMessage: 'project code already exists',
    statusCode: 100,
  },
  '"project_name" is required': {
    errorMessage: 'project name is not provided',
    statusCode: 101,
  },
  '"project_code" is required': {
    errorMessage: 'project code is not provided',
    statusCode: 102,
  },
  '"project_description" is required': {
    errorMessage: 'project description is not provided',
    statusCode: 103,
  },
  '"start_date" is required': {
    errorMessage: 'start date is not provided',
    statusCode: 104,
  },
  '"end_date" is required': {
    errorMessage: 'end date is not provided',
    statusCode: 105,
  },
  '"project_name" is not allowed to be empty': {
    errorMessage: 'project name is required',
    statusCode: 106,
  },
  '"project_code" is not allowed to be empty': {
    errorMessage: 'project code is required',
    statusCode: 107,
  },
  '"project_description" is not allowed to be empty': {
    errorMessage: 'project_description  is required',
    statusCode: 108,
  },
  '"project_name" must be a string': {
    errorMessage: 'project_name  must be string',
    statusCode: 109,
  },
  '"project_code" must be a string': {
    errorMessage: 'project_code  must be string',
    statusCode: 110,
  },
  '"project_description" must be a string': {
    errorMessage: 'project_description  must be string',
    statusCode: 111,
  },
  '"first_name" is not allowed to be empty': {
    errorMessage: 'first_name is not allowed to be empty',
    statusCode: 267,
  },
  '"last_name" is not allowed to be empty': {
    errorMessage: 'last_name is not allowed to be empty',
    statusCode: 113,
  },
  '"phone_no" must be a number': {
    errorMessage: 'phone_no is not allowed to be empty AND only use numbers',
    statusCode: 114,
  },
  'getaddrinfo EAI_AGAIN smtp.gmail.com': {
    errorMessage: 'Mail not sent',
    statusCode: 115,
  },
  'cant change project': {
    errorMessage: 'Cant change project',
    statusCode: 116,
  },
  '"project_id" is not allowed': {
    errorMessage: 'project id not allowed to update',
    statusCode: 120,
  },
  '"project_code" is not allowed': {
    errorMessage: 'project code not allowed to update',
    statusCode: 121,
  },
  '"refresh_token" is required': {
    errorMessage: 'Missing refresh token',
    statusCode: 122,
  },
  '"refresh_token" must be a string': {
    errorMessage: 'Refresh token must be string',
    statusCode: 123,
  },
  '"refresh_token" is not allowed to be empty': {
    errorMessage: 'Refresh cant be empty',
    statusCode: 238,
  },
  'wrong token': {
    errorMessage: 'Wrong token',
    statusCode: 124,
  },
  '"task_status" must be one of [1, 2, 3, 4]': {
    errorMessage: 'Invalid task status',
    statusCode: 125,
  },
  'no change in task status': {
    errorMessage: 'No change in status',
    statusCode: 126,
  },
  '"task_status" is required': {
    errorMessage: 'Task status is not given',
    statusCode: 127,
  },
  '"file_name" is not allowed to be empty': {
    errorMessage: 'file_Name is not allowed to be empty',
    statusCode: 128,
  },
  '"start_date" must be in ISO 8601 date format': {
    errorMessage: 'valid start_date format YYYY-MM-DD',
    statusCode: 72,
  },
  '"end_date" must be in ISO 8601 date format': {
    errorMessage: 'valid end_date format YYYY-MM-DD',
    statusCode: 73,
  },
  '"from_date" must be in ISO 8601 date format': {
    errorMessage: 'valid from_date format YYYY-MM-DD',
    statusCode: 235,
  },
  '"to_date" must be in ISO 8601 date format': {
    errorMessage: 'valid to_date format YYYY-MM-DD',
    statusCode: 236,
  },
  '"from_date" must be in YYYY-MM-DD format': {
    errorMessage: 'valid from_date format YYYY-MM-DD',
    statusCode: 235,
  },
  '"to_date" must be in YYYY-MM-DD format': {
    errorMessage: 'valid to_date format YYYY-MM-DD',
    statusCode: 236,
  },
  'folder not found': {
    errorMessage: 'Folder not found',
    statusCode: 801,
  },
  '"new_password" should not contain white spaces': {
    errorMessage: 'new_password" should not contain white spaces',
    statusCode: 234,
  },
  '"old_password" should not contain white spaces': {
    errorMessage: 'old_password" should not contain white spaces',
    statusCode: 1111,
  },

  '"new_password" should contain at least 1 uppercase character': {
    errorMessage: 'new_password" should contain at least 1 uppercase character',
    statusCode: 230,
  },
  '"new_password" should contain at least 1 lowercase character': {
    errorMessage: 'new_password" should contain at least 1 lowercase character',
    statusCode: 231,
  },
  '"new_password" length must be at least 8 characters long': {
    errorMessage: 'new_password" length must be at least 8 characters long',
    statusCode: 228,
  },
  '"old_password" length must be at least 8 characters long': {
    errorMessage: 'old_password" length must be at least 8 characters long',
    statusCode: 1113,
  },
  '"new_password" should contain at least 1 special character': {
    errorMessage: 'new_password" should contain at least 1 special character',
    statusCode: 229,
  },
  '"new_password" length must be less than or equal to 25 characters long': {
    errorMessage:
      'new_password" length must be less than or equal to 25 characters long',
    statusCode: 233,
  },
  '"old_password" length must be less than or equal to 25 characters long': {
    errorMessage:
      'old_password" length must be less than or equal to 25 characters long',
    statusCode: 1112,
  },
  'New and old password cannot be same': {
    errorMessage: 'New and old password cannot be same',
    statusCode: 237,
  },
  '"role" must be one of [3, 4, 5, 6, 7]': {
    errorMessage: 'Invalid project role',
    statusCode: 239,
  },
  'Access Denied': {
    errorMessage: 'you doesnt have autority',
    statusCode: 400,
  },
  '"first_name" is required': {
    errorMessage: 'first_name is required',
    statusCode: 238,
  },
  '"last_name" is required': {
    errorMessage: 'last_name is required',
    statusCode: 239,
  },
  '"phone_no" is required': {
    errorMessage: 'phone_no is required',
    statusCode: 240,
  },
  '"phone_no" must be a safe number': {
    errorMessage: 'phone_no must not be more than 18 numbers',
    statusCode: 241,
  },
  '"newPassword" length must be at least 8 characters long': {
    errorMessage: 'Password must have at least 8 characters',
    statusCode: 60,
  },
  '"newPassword" length must be less than or equal to 25 characters long': {
    errorMessage: 'Password can only have 25 characters',
    statusCode: 61,
  },
  '"newPassword" should contain at least 1 special character': {
    errorMessage: 'Password should contain at least 1 special characters',
    statusCode: 62,
  },
  '"newPassword" should contain at least 1 uppercase character': {
    errorMessage: 'Password should contain at least 1 uppercase characters',
    statusCode: 63,
  },
  '"user_name" length must be less than or equal to 30 characters long': {
    errorMessage: 'user name must be 30 characters',
    statusCode: 1001,
  },
  '"email" length must be less than or equal to 55 characters long': {
    errorMessage: 'email must be under 55 characters',
    statusCode: 1002,
  },
  '"user_name" length must be at least 3 characters long': {
    errorMessage: 'user_name atleast 3 characters needed',
    statusCode: 1003,
  },
  '"project_name" length must be less than or equal to 30 characters long': {
    errorMessage: 'project_name must be under 30 characters needed',
    statusCode: 1004,
  },
  '"project_name" length must be at least 3 characters long': {
    errorMessage: 'project_name atleast 3 characters needed',
    statusCode: 1005,
  },
  '"project_code" length must be at least 3 characters long': {
    errorMessage: 'project_code atleast 3 characters needed',
    statusCode: 1006,
  },
  '"project_code" length must be less than or equal to 15 characters long': {
    errorMessage: 'project_code must be under 15 characters needed',
    statusCode: 1007,
  },
  '"project_description" length must be less than or equal to 255 characters long':
    {
      errorMessage: 'project_description must be under 255 characters needed',
      statusCode: 1008,
    },
  '"task_name" length must be at least 3 characters long': {
    errorMessage: 'Task name must be at least 3 characters long',
    statusCode: 64,
  },
  '"task_name" length must be less than or equal to 255 characters long': {
    errorMessage: 'Task name must be less than 255 characters long',
    statusCode: 65,
  },
  '"estimated_hours" is not allowed to be empty': {
    errorMessage: 'Estimated is not allowed to be empty',
    statusCode: 66,
  },
  '"actual_hours" is not allowed to be empty': {
    errorMessage: 'Actual hour is not allowed to be empty',
    statusCode: 67,
  },
  '"project_description" length must be at least 10 characters long': {
    errorMessage: 'project_description must atleast 10 characters',
    statusCode: 1009,
  },
  '"email" length must be at least 10 characters long': {
    errorMessage: 'email must have atleast 10 characters',
    statusCode: 1010,
  },
  '"task_description" length must be less than or equal to 60000 characters long':
    {
      errorMessage: 'Task description cant have 60000+ characters',
      statusCode: 1038,
    },
  'cannot delete self': {
    errorMessage: 'cannot delete yourself',
    statusCode: 1011,
  },
  '"start_date" must be greater than or equal to "now"': {
    errorMessage: 'start date must be greater than or equal to current date',
    statusCode: 1012,
  },
  '"end_date" must be greater than or equal to "now"': {
    errorMessage: 'end date must be greater than or equal to current date',
    statusCode: 1013,
  },
  '"from_date" must be greater than or equal to "now"': {
    errorMessage: 'from date must be greater than or equal to current date',
    statusCode: 1014,
  },
  '"to_date" must be greater than or equal to "now"': {
    errorMessage: 'to date must be greater than or equal to current date',
    statusCode: 1015,
  },
  '"assignee" is required': {
    errorMessage: 'assignee is required',
    statusCode: 65,
  },
  'assignee is not part of project': {
    errorMessage: 'Assignee is not part of project',
    statusCode: 68,
  },
  'email already exists': {
    errorMessage: 'email already exists',
    statusCode: 1015,
  },
  '"role" is not allowed to be empty': {
    errorMessage: 'role is not allowed to be empty',
    statusCode: 1016,
  },
  '"task_description" length must be at least 10 characters long': {
    errorMessage: 'Task description must have  at least 10 characters',
    statusCode: 69,
  },
  '"estimated_hours" must be greater than or equal to 0': {
    errorMessage: 'Estimated hours cannot be less than 0',
    statusCode: 70,
  },
  '"actual_hours" must be greater than or equal to 0': {
    errorMessage: 'Actual hours cannot be less than 0',
    statusCode: 71,
  },
  '"start_date" must be in YYYY-MM-DD format': {
    errorMessage: 'start date must be in YYYY-MM-DD format',
    statusCode: 72,
  },
  '"end_date" must be in YYYY-MM-DD format': {
    errorMessage: 'end date must be in YYYY-MM-DD format',
    statusCode: 73,
  },
  '"end_date" must be greater than or equal to start date': {
    errorMessage: 'end date must be in YYYY-MM-DD format',
    statusCode: 74,
  },
  'end_date is smaller than start date': {
    errorMessage: 'end date must be greater than start date',
    statusCode: 75,
  },
  '"new_password" should contain at least 1 numeric character': {
    errorMessage: 'new_password" should contain at least 1 numeric character',
    statusCode: 232,
  },
  '"first_name" length must be less than or equal to 30 characters long': {
    errorMessage:
      'first_name length must be less than or equal to 30 characters long',
    statusCode: 1017,
  },
  '"phone_no" length must be less than or equal to 12 characters long': {
    errorMessage:
      'phone_no length must be less than or equal to 12 numbers long',
    statusCode: 1018,
  },
  '"phone_no" length must be at least 10 characters long': {
    errorMessage: 'phone_no length must be at least 10 numbers long',
    statusCode: 1019,
  },
  '"first_name" with value "4323333" fails to match the required pattern: /^[a-zA-Z, ]*$/':
    {
      errorMessage:
        'first_name with value 4323333 fails to match the required pattern: /^[a-zA-Z, ]*$/',
      statusCode: 1020,
    },
  '"last_name" with value "5666666" fails to match the required pattern: /^[a-zA-Z, ]*$/':
    {
      errorMessage:
        'last_name with value 5666666 fails to match the required pattern: /^[a-zA-Z, ]*$/',
      statusCode: 1021,
    },
  '"first_name" length must be at least 3 characters long': {
    errorMessage: 'first_name length must be at least 3 characters long',
    statusCode: 1022,
  },
  '"last_name" length must be at least 3 characters long': {
    errorMessage: 'last_name length must be at least 3 characters long',
    statusCode: 1023,
  },
  '"last_name" length must be less than or equal to 30 characters long': {
    errorMessage:
      'last_name length must be less than or equal to 30 characters long',
    statusCode: 1024,
  },
  '"password" length must be at least 8 characters long': {
    errorMessage: 'Invalid password',
    statusCode: 1025,
  },
  '"password" length must be less than or equal to 25 characters long': {
    errorMessage: 'Invalid password',
    statusCode: 1025,
  },
  '"password" should contain at least 1 special character': {
    errorMessage: 'Invalid password',
    statusCode: 1025,
  },
  '"password" should contain at least 1 lowercase character': {
    errorMessage: 'Invalid password',
    statusCode: 1025,
  },
  '"password" should contain at least 1 uppercase character': {
    errorMessage: 'Invalid password',
    statusCode: 1025,
  },
  '"password" should contain at least 1 numeric character': {
    errorMessage: 'Invalid password',
    statusCode: 1025,
  },
  '"password" should not contain white spaces': {
    errorMessage: 'Invalid password',
    statusCode: 1025,
  },
  '"phone_no" is not allowed to be empty': {
    errorMessage: 'phone_no is not allowed to be empty',
    statusCode: 1019,
  },
  'Invalid sort method': {
    errorMessage: 'Invalid sort method',
    statusCode: 1026,
  },
  'zero is not a page': {
    errorMessage: 'Invalid page number',
    statusCode: 1027,
  },
  'end_date cont be grater than end date of project': {
    errorMessage: 'End date cant be greater than projects end date',
    statusCode: 1029,
  },
  'task exist in the project': {
    errorMessage: 'This task exists in the project',
    statusCode: 1030,
  },
  'you cant remove assignee': {
    errorMessage: 'You cant remove assignee',
    statusCode: 1031,
  },
  '"assignee" must be greater than or equal to 1': {
    errorMessage: 'Invalid user id',
    statusCode: 1032,
  },
  '"assignee" must be greater than or equal to -1': {
    errorMessage: 'Invalid user id',
    statusCode: 1032,
  },
  'no change in data': {
    errorMessage: 'No change in data',
    statusCode: 1033,
  },
  'Task name should only have numbers and alphabet': {
    errorMessage: 'Invalid task name',
    statusCode: 1034,
  },
  'in the name one space is allowed': {
    errorMessage: 'in the name one space is allowed',
    statusCode: 1999,
  },
  '"newPassword" should contain at least 1 lowercase character': {
    errorMessage: 'Password should contain atleast 1 lowercase',
    statusCode: 1035,
  },
  '"newPassword" should contain at least 1 numeric character': {
    errorMessage: 'Password should contain atleast 1 number',
    statusCode: 1036,
  },
  '"users" must be an array': {
    errorMessage: 'Users must be provided in an array',
    statusCode: 1037,
  },
  'no changes made': {
    errorMessage: 'no changes made',
    statusCode: 1050,
  },
  'cannot remove themself': {
    errorMessage: 'cannot delete user themself',
    statusCode: 1998,
  },
  '"file_name" is required': {
    errorMessage: 'file_name is mandatory',
    statusCode: 1325,
  },
  '"file_name" length must be less than or equal to 150 characters long': {
    errorMessage:
      'file_name length must be less than or equal to 150 characters long',
    statusCode: 1326,
  },
  '"file_name" must be a string': {
    errorMessage: 'file_name must be a string',
    statusCode: 1327,
  },
  '"estimated_hours" must have no more than 2 decimal places': {
    errorMessage: 'Estimated hour is not valid',
    statusCode: 76,
  },
  '"actual_hours" must have no more than 2 decimal places': {
    errorMessage: 'Actual hour is not valid',
    statusCode: 77,
  },
  'users id must be greater than or equal to 1': {
    errorMessage: 'User id cant be less than 1',
    statusCode: 78,
  },
  '"users" is required': {
    errorMessage: 'User is required',
    statusCode: 79,
  },
  'end_date is smaller than projects end date': {
    errorMessage: 'End date is smaller than projects end date',
    statusCode: 81,
  },
  '"start_date" must be greater than or equal to projects start dt': {
    errorMessage: 'Start date is smaller than projects start date',
    statusCode: 82,
  },
  'end_date is larger than proj end date': {
    errorMessage: 'End date must be less than projects end date',
    statusCode: 83,
  },
  'start is larger than proj end date': {
    errorMessage: 'Start date must be greater than projects start date',
    statusCode: 84,
  },
  '"project_id" must be greater than or equal to 1': {
    errorMessage: 'Invalid project id',
    statusCode: 3000,
  },
  '"project_id" must be an array': {
    errorMessage: 'Project id must be an array',
    statusCode: 601,
  },
  '"project_id" does not contain 1 required value(s)': {
    errorMessage: 'No value is provided',
    statusCode: 609,
  },
  //
  '"issue_type" is required': {
    errorMessage: 'issue_type is required',
    statusCode: 630,
  },
  '"issue_type" must be a number': {
    errorMessage: 'issue_type must be a number',
    statusCode: 631,
  },
  '"issue_type" must be greater than or equal to 1': {
    errorMessage: 'issue type is not valid',
    statusCode: 632,
  },
  'category not found': {
    errorMessage: 'Category not found',
    statusCode: 633,
  },
  'issue not found': {
    errorMessage: 'issue_type not found',
    statusCode: 634,
  },
  '"comment" is required': {
    errorMessage: 'comment is required',
    statusCode: 1501,
  },
  '"task_id" is required': {
    errorMessage: 'task_id is required',
    statusCode: 1502,
  },
  '"user" must be greater than or equal to 1': {
    errorMessage: 'Invalid user id value',
    statusCode: 3031,
  },
  '"user" must be a number': {
    errorMessage: 'Invalid user id value',
    statusCode: 3031,
  },
  '"user" is required': {
    errorMessage: 'User is required',
    statusCode: 3032,
  },
  '"unread_only" is required': {
    errorMessage: 'Unread_only is required',
    statusCode: 636,
  },
  '"unread_only" must be one of [0, 1, null]': {
    errorMessage: 'Invalid un read value ',
    statusCode: 614,
  },
  'notification not found': {
    errorMessage: 'Notification not found ',
    statusCode: 637,
  },
  '"assigne" is required': {
    errorMessage: 'assigne" is required',
    statusCode: 1301,
  },

  '"createdBy" is required': {
    errorMessage: 'createdBy" is required',
    statusCode: 1303,
  },

  '"relation" is required': {
    errorMessage: 'relation" is required',
    statusCode: 1302,
  },
  '"task_status" must be an array': {
    errorMessage: '"task_status" must be an array',
    statusCode: 1305,
  },

  '"priority" must be an array': {
    errorMessage: '"priority" must be an array',
    statusCode: 1306,
  },
  '"relation" must be an array': {
    errorMessage: '"relation" must be an array',
    statusCode: 1307,
  },
  '"category" must be an array': {
    errorMessage: '"category" must be an array',
    statusCode: 1308,
  },
  '"createdBy" must be an array': {
    errorMessage: '"createdBy" must be an array',
    statusCode: 1309,
  },
  '"assigne" must be an array': {
    errorMessage: '"assigne" must be an array',
    statusCode: 1310,
  },
  '"issue_type" must be an array': {
    errorMessage: '"issue_type" must be an array',
    statusCode: 1311,
  },
  '"projects" does not contain 1 required value(s)': {
    errorMessage: 'No value provided',
    statusCode: 3025,
  },
  '"projects" is required': {
    errorMessage: 'Projects not provided',
    statusCode: 3023,
  },
  '"projects" must be an array': {
    errorMessage: 'Projects must be array',
    statusCode: 3024,
  },
  'file not found': {
    errorMessage: 'File not found',
    statusCode: 85,
  },
  '"parent_id" is required': {
    errorMessage: 'parent id is required',
    statusCode: 1031,
  },
  '"notify" is required': {
    errorMessage: 'notify is required',
    statusCode: 1032,
  },
  '"notify" must be an array': {
    errorMessage: 'notify must be array',
    statusCode: 1033,
  },
  '"parent_id" must be a number': {
    errorMessage: 'parent_id must be number',
    statusCode: 1034,
  },
  '"keyword" is required': {
    errorMessage: 'keyword is required',
    statusCode: 1079,
  },
  '"tasks" is required': {
    errorMessage: 'task not provided',
    statusCode: '1788',
  },
  '"tasks" must be an array': {
    errorMessage: 'task must be array',
    statusCode: '1789',
  },
  '"status" is required': {
    errorMessage: 'status not provided',
    statusCode: 130,
  },
  '"tasks" does not contain 1 required value(s)': {
    errorMessage: 'atleast one task required',
    statusCode: 3513,
  },
  '"status" must be one of [1, 2, 3, 4, null, ]': {
    errorMessage: 'status not valid',
    statusCode: 3514,
  },
  '"uploaded_by" must be a number': {
    errorMessage: 'Invalid user id',
    statusCode: 3044,
  },
  '"uploaded_by" must be greater than or equal to 1': {
    errorMessage: 'Invalid user id',
    statusCode: 3044,
  },
  '"keyword" must be a string': {
    errorMessage: 'Search key must be a string',
    statusCode: 3045,
  },
  '"comment" is not allowed to be empty': {
    errorMessage: 'comment is not allowed to be empty',
    statusCode: 2501,
  },
  '"status" must be one of [1, 2, 3, 4, 5, null, ]': {
    errorMessage: 'Invalid status',
    statusCode: '68',
  },
  '"subtasking" is required': {
    errorMessage: 'subtasking not provided',
    statusCode: 140,
  },
  '"subtasking" must be one of [1, 2, 3, null, ]': {
    errorMessage: 'Invalid subtask',
    statusCode: 128,
  },
  '"keyWord" is required': {
    errorMessage: 'Keyword not provided',
    statusCode: 1026,
  },
  '"keyWord" must be a string': {
    errorMessage: 'Keyword must be string',
    statusCode: 1030,
  },
  'Invalid input in userFilter': {
    errorMessage: 'Invalid input in userFilter',
    statusCode: 3011,
  },
  'Invalid input in due date': {
    errorMessage: 'Invalid input in due date',
    statusCode: 3012,
  },
  'Duplication in project': {
    errorMessage: 'Duplication in project',
    statusCode: 3026,
  },
  'From date is less than projects start date': {
    errorMessage: 'From date is less than projects start date',
    statusCode: 3042,
  },
  'To date is greater than projects end date': {
    errorMessage: 'To date is greater than projects end date',
    statusCode: 3043,
  },
  'From date is greater than to date': {
    errorMessage: 'From date is greater than to date',
    statusCode: 3046,
  },
  'From date is required': {
    errorMessage: 'From date is required',
    statusCode: 3041,
  },
  '"start_date_from_date" must be in YYYY-MM-DD format': {
    errorMessage: 'start_date_from_date is must be YYYY-MM-DD',
    statusCode: 3520,
  },

  '"keyword" is not allowed to be empty': {
    errorMessage: 'Search key should not be empty',
    statusCode: 3047,
  },

  '"start_date_to_date" must be in YYYY-MM-DD format': {
    errorMessage: 'start_date_to_date is must be YYYY-MM-DD',
    statusCode: 3521,
  },

  '"due_date_from_date" must be in YYYY-MM-DD format': {
    errorMessage: 'due_date_from_date is must be YYYY-MM-DD',
    statusCode: 3522,
  },

  '"due_date_to_date" must be in YYYY-MM-DD format': {
    errorMessage: 'due_date_to_date is must be YYYY-MM-DD',
    statusCode: 3523,
  },
  '"filterArray" is required': {
    errorMessage: 'filterArray is required',
    statusCode: 1504,
  },
  '"issue_type" is not allowed to be empty': {
    errorMessage: 'issue_type is not allowed to be empty',
    statusCode: 2508,
  },
  '"category_name" is not allowed to be empty': {
    errorMessage: 'category_name is not allowed to be empty',
    statusCode: 2509,
  },
  '"issue_type" length must be at least 3 characters long': {
    errorMessage: 'issue_type length must be at least 3 characters long',
    statusCode: 1403,
  },
  '"issue_type" length must be less than or equal to 15 characters long': {
    errorMessage:
      'issue_type length must be less than or equal to 15 characters long',
    statusCode: 1404,
  },
  '"category_name" length must be at least 3 characters long': {
    errorMessage: 'category_name length must be at least 3 characters long',
    statusCode: 1413,
  },
  '"category_name" length must be less than or equal to 15 characters long': {
    errorMessage:
      'category_name length must be less than or equal to 15 characters long',
    statusCode: 1414,
  },
  '"category_name" is required': {
    errorMessage: 'category_name is required',
    statusCode: 1411,
  },
  'Invalid grouping': {
    errorMessage: 'Invalid grouping',
    statusCode: 3051,
  },
  'Invalid status': {
    errorMessage: 'Invalid status',
    statusCode: 3052,
  },
  'unauthorized access': {
    errorMessage: 'Unauthorized access',
    statusCode: 399,
  },
  '"filterArray" must be an array': {
    errorMessage: 'filterArray must be an array',
    statusCode: 1611,
  },
  '"category_name" must be a string': {
    errorMessage: 'category_name must be a string',
    statusCode: 2510,
  },
  '"issue_type" must be a string': {
    errorMessage: 'issue_type must be a string',
    statusCode: 2511,
  },
  '"task_id" must be a number': {
    errorMessage: 'task_id must be a number',
    statusCode: 2512,
  },
  '"comment" must be a string': {
    errorMessage: 'comment must be a string',
    statusCode: 2513,
  },
  '"parent_task_id" is required': {
    errorMessage: 'parent_task_id  is required',
    statusCode: 3509,
  },
  '"comment" length must be less than or equal to 60000 characters long': {
    errorMessage:
      'comment length must be less than or equal to 60000 characters long',
    statusCode: 2514,
  },
  '"project_id" must be an integer': {
    errorMessage: 'Invalid project id',
    statusCode: 3000,
  },
  '"project_id" must be a safe number': {
    errorMessage: 'Invalid project id',
    statusCode: 3000,
  },
  '"user" must be an integer': {
    errorMessage: 'Invalid user id value',
    statusCode: 3031,
  },
  '"user" must be a safe number': {
    errorMessage: 'Invalid user id value',
    statusCode: 3031,
  },
  '"task_id" must be an integer': {
    errorMessage: 'Invalid task_id',
    statusCode: 2516,
  },
  '"task_id" must be a safe number': {
    errorMessage: 'Invalid task_id',
    statusCode: 2516,
  },
  '"task_id" must be a positive number': {
    errorMessage: 'Invalid task_id',
    statusCode: 2516,
  },
  '"issue_type" must be an integer': {
    errorMessage: 'Invalid issue_type',
    statusCode: 2517,
  },
  '"issue_type" must be a positive number': {
    errorMessage: 'Invalid issue_type',
    statusCode: 2517,
  },
  '"issue_type" must be a safe number': {
    errorMessage: 'Invalid issue_type',
    statusCode: 2517,
  },
  '"category" must be an integer': {
    errorMessage: 'Invalid category',
    statusCode: 2518,
  },
  '"category" must be a positive number': {
    errorMessage: 'Invalid category',
    statusCode: 2518,
  },
  '"category" must be a safe number': {
    errorMessage: 'Invalid category',
    statusCode: 2518,
  },
  '"assignee" must be an integer': {
    errorMessage: 'Invalid assignee',
    statusCode: 2519,
  },
  '"assignee" must be a positive number': {
    errorMessage: 'Invalid assignee',
    statusCode: 2519,
  },
  '"assignee" must be a safe number': {
    errorMessage: 'Invalid assignee',
    statusCode: 2519,
  },
  'no notifications by this user': {
    errorMessage: 'No notifications by this user',
    statusCode: 3033,
  },
  '"start_date" must be less than or equal to projects end dt': {
    errorMessage: 'Start date must be less than or equal to projects end date',
    statusCode: 655,
  },
  'end_date cont be less than start date of project': {
    errorMessage:
      'End date must be greater than or equal to projects start date',
    statusCode: 667,
  },
  'object.unknown': {
    errorMessage: 'Unexpected field is detected',
    statusCode: 408,
  },
  '"replace_issueType" is required': {
    errorMessage: 'replace_issueType is required',
    statusCode: 1513,
  },
  '"replace_issueType" must be a number': {
    errorMessage: 'replace_issueType must be a number',
    statusCode: 2520,
  },
  '"replace_issueType" must be an integer': {
    errorMessage: 'replace_issueType must be an integer',
    statusCode: 2521,
  },
  '"replace_issueType" must be a positive number': {
    errorMessage: 'replace_issueType must be greater than zero',
    statusCode: 2522,
  },
  'replace_category must be a category_id of the existing category': {
    errorMessage:
      'replace_category must be a category_id of the existing category',
    statusCode: 2523,
  },
  'replacementCategory not found': {
    errorMessage: 'replacementCategory not found',
    statusCode: 2524,
  },
  '"replace_category" must be a number': {
    errorMessage: 'replace_category must be a number',
    statusCode: 2525,
  },
  '"replace_category" must be a positive number': {
    errorMessage: 'replace_category must be greater than zero',
    statusCode: 2526,
  },
  '"replace_category" must be an integer': {
    errorMessage: 'replace_category must be an integer',
    statusCode: 2527,
  },
  'middle_name should only contains alphabetic characters only': {
    errorMessage: 'middle_name should only contains alphabetic characters only',
    statusCode: 2528,
  },
  '"first_name" must be a string': {
    errorMessage: 'first_name must be a string',
    statusCode: 2529,
  },

  '"middle_name" must be a string': {
    errorMessage: 'middle_name must be a string',
    statusCode: 2530,
  },
  '"last_name" must be a string': {
    errorMessage: 'last_name must be a string',
    statusCode: 2531,
  },
  '"phone_no" must be a string': {
    errorMessage: 'phone_no must be a string',
    statusCode: 2532,
  },
  '"middle_name" length must be less than or equal to 30 characters long': {
    errorMessage:
      'middle_name length must be less than or equal to 30 characters long',
    statusCode: 2533,
  },
  '"middle_name" is required': {
    errorMessage: 'middle_name is required',
    statusCode: 2534,
  },
  'invalid start date': {
    errorMessage: 'Invalid start date',
    statusCode: 698,
  },
  'invalid end date': {
    errorMessage: 'Invalid end date',
    statusCode: 699,
  },
  'invalid from date': {
    errorMessage: 'Invalid from date',
    statusCode: 3042,
  },
  'invalid to date': {
    errorMessage: 'Invalid to date',
    statusCode: 3043,
  },
  '"start_date_from_date" must be a valid date': {
    errorMessage: 'start_date_from_date must be string',
    statusCode: 3561,
  },
  '"start_date_to_date" must be a valid date': {
    errorMessage: 'start_date_to_date must be string',
    statusCode: 3562,
  },
  '"due_date_from_date" must be a valid date': {
    errorMessage: 'due_date_from_date must be string',
    statusCode: 3563,
  },
  '"due_date_to_date" must be a valid date': {
    errorMessage: 'due_date_to_date must be string',
    statusCode: 3564,
  },
  '"replace_category" is required': {
    errorMessage: 'replace_category is required',
    statusCode: 2535,
  },
  'defaultCategory cannot be delete': {
    errorMessage: 'defaultCategory cannot be delete',
    statusCode: 2536,
  },
  'default issueType cannot be delete': {
    errorMessage: 'default issueType cannot be delete',
    statusCode: 2537,
  },
  'defaultCategory cannot be editted': {
    errorMessage: 'defaultCategory cannot be editted',
    statusCode: 2538,
  },
  'default issueType cannot be editted': {
    errorMessage: 'default issueType cannot be editted',
    statusCode: 2539,
  },
  'uploaded user is not part of the project': {
    errorMessage: 'Uploaded user is not part of the project',
    statusCode: 3048,
  },
  '"user_id" must be a number': {
    errorMessage: 'user-id is must be number',
    statusCode: 3674,
  },
  '"user_id" is required': {
    errorMessage: 'user-id is not provided',
    statusCode: 923,
  },
  '"parent_id" must be greater than or equal to 1': {
    errorMessage: '"parent_id" must be greater than or equal to 1',
    statusCode: 3574,
  },
  '"replace_category" must be a safe number': {
    errorMessage: 'replace_category must be a valid category',
    statusCode: 2550,
  },
  '"replace_issueType" must be a safe number': {
    errorMessage: 'replace_issueType must be a valid issueType',
    statusCode: 2551,
  },
  '"task_id" cannot be infinity': {
    errorMessage: 'Invalid task_id',
    statusCode: 2516,
  },
  '"replace_issueType" cannot be infinity': {
    errorMessage: 'replace_issueType must be a valid issueType',
    statusCode: 2551,
  },
  '"replace_category" cannot be infinity': {
    errorMessage: 'replace_category must be a valid category',
    statusCode: 2550,
  },
  '"issue_type" cannot be infinity': {
    errorMessage: 'Invalid issue_type',
    statusCode: 2517,
  },
  '"category" cannot be infinity': {
    errorMessage: 'Invalid category',
    statusCode: 2518,
  },
  '"assignee" cannot be infinity': {
    errorMessage: 'Invalid assignee',
    statusCode: 2519,
  },
  '"project_id" cannot be infinity': {
    errorMessage: 'Invalid project id',
    statusCode: 3000,
  },
  '"parent_id" cannot be infinity': {
    errorMessage: 'parent task not found',
    statusCode: 1071,
  },
  '"parent_id" must be a safe number': {
    errorMessage: 'parent task not found',
    statusCode: 1071,
  },
  //201-400 request
  '"filterArray" accepts only 1 and 2': {
    errorMessage: 'filterArray accepts only 1 and 2',
    statusCode: 1610,
  },
  '"email" must be a valid email': {
    errorMessage: 'email must be valid',
    statusCode: 3789,
  },
  '"assigne" must be a number': {
    errorMessage: 'Assignee must be a number',
    statusCode: 47,
  },
  '"user_id" must be an integer': {
    errorMessage: 'invalid user_id',
    statusCode: 3675,
  },
  '"role" must be an integer': {
    errorMessage: 'invalid role',
    statusCode: 3676,
  },
  '"user_id" must be a positive number': {
    errorMessage: 'invalid user_id',
    statusCode: 3675,
  },
  '"role" must be a positive number': {
    errorMessage: 'invalid role',
    statusCode: 3676,
  },
  'invalid last data': {
    errorMessage: 'The last data is invalid',
    statusCode: 3071,
  },
  'last data not found': {
    errorMessage: 'The last data not found',
    statusCode: 3072,
  },
  'invalid limit': {
    errorMessage: 'Invalid limit value',
    statusCode: 3073,
  },
  'limit must not be greater than totalCount': {
    errorMessage: 'limit must not be greater than totalCount',
    statusCode: 3074,
  },
  'invalid last id': {
    errorMessage: 'Invalid last id',
    statusCode: 2500,
  },
  'last id missing': {
    errorMessage: 'Last id is missing',
    statusCode: 2502,
  },
  'last data missing': {
    errorMessage: 'Last data is missing',
    statusCode: 2503,
  },
  'no record exist on given data': {
    errorMessage: 'No record exist on given data',
    statusCode: 2504,
  },
  'invalid page': {
    errorMessage: 'Invalid page number',
    statusCode: 2505,
  },
  'both page and last data will not be accepted': {
    errorMessage: 'Both page and last data will not be accepted',
    statusCode: 2506,
  },
  'both page and last data or last id will not be accepted': {
    errorMessage: 'Both page and last data or last id will not be accepted',
    statusCode: 2507,
  },
  'page must not be greater than limit': {
    errorMessage: 'page must not be greater than total count',
    statusCode: 3678,
  },

  'limit must not be greater than 3000': {
    errorMessage: 'limit must not be greater than 3000',
    statusCode: 3677,
  },
  'cannot remove them self': {
    errorMessage: 'cannot unallocate themself',
    statusCode: 1998,
  },
};
