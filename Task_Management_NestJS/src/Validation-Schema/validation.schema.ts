const Joi = require('joi').extend(require('@joi/date'));
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
let date = new Date().toISOString().slice(0, 10);

// Joi validation schema for create user
export const userSchema = Joi.object({
  user_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().min(10).max(55).required(),
  role: Joi.number().integer().strict().required(),
});

export const userEditSchema = Joi.object({
  user_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(10).max(55).required(),
  role: Joi.number().integer().strict().required(),
});

export const userAdminSchema = Joi.object({
  user_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(10).max(55).required(),
  password: joiPassword
    .string()
    .min(8)
    .max(25)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
});

// Joi validation schema for login form
export const loginSchema = Joi.object({
  email: Joi.string().email().min(10).max(55).required(),
  password: joiPassword.string().min(8).max(25).noWhiteSpaces().required(),
});

export const changePasswordSchema = Joi.object({
  old_password: joiPassword.string().min(8).max(25).noWhiteSpaces().required(),
  new_password: joiPassword
    .string()
    .min(8)
    .max(25)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
});

// Joi validation schema for email validation form for forgot password
export const validateEmail = Joi.object({
  email: Joi.string().min(10).max(55).required(),
});

// Joi validation schema for password validation form for forgot password
export const setPasswordForgotPassword = Joi.object({
  newPassword: joiPassword
    .string()
    .min(8)
    .max(25)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
});

export const refreshTokenValidate = Joi.object({
  refresh_token: Joi.string().required(),
});

// Joi validation schema for add task form
export const addTask = Joi.object({
  task_name: Joi.string().min(3).max(255).required(),
  task_description: Joi.string().min(10).max(60000).required(),
  category: Joi.number().integer().min(1).strict().allow(null).required(),
  issue_type: Joi.number().integer().min(1).strict().required(),
  priority: Joi.number().valid(1, 2, 3).strict().required(),
  actual_hours: Joi.string().allow(null),
  estimated_hours: Joi.string().allow(null),
  start_date: Joi.date().format('YYYY-MM-DD').iso().allow(null),
  end_date: Joi.date().format('YYYY-MM-DD').iso().allow(null),
  project_id: Joi.number().integer().strict().required(),
  assignee: Joi.number().integer().min(1).allow(null).strict(),
  parent_id: Joi.number()
    .integer()
    .min(1)
    .strict()
    .allow(null, '', '')
    .required(),
  notify: Joi.array().allow(null, '', '').required(),
});

export const updateTask = Joi.object({
  task_name: Joi.string().min(3).max(255).required(),
  task_description: Joi.string().min(10).max(60000).required(),
  category: Joi.number().integer().min(1).strict().allow(null).required(),
  issue_type: Joi.number().integer().min(1).strict().required(),
  priority: Joi.number().valid(1, 2, 3).strict().required(),
  actual_hours: Joi.string().allow(null),
  estimated_hours: Joi.string().allow(null),
  start_date: Joi.date().format('YYYY-MM-DD').iso().allow(null),
  end_date: Joi.date().format('YYYY-MM-DD').iso().allow(null),
  project_id: Joi.number().integer().strict().required(),
  assignee: Joi.number().min(-1).integer().strict().allow(null),
  task_status: Joi.number().valid(1, 2, 3, 4).integer().strict().required(),
  comment: Joi.string().allow(null, ''),
  notify: Joi.array().allow(null, ''),
});

export const TaskStatus = Joi.object({
  task_status: Joi.number().valid(1, 2, 3, 4).required(),
  assignee: Joi.number().integer().strict().min(1).allow(null).required(),
});

export const addProfile = Joi.object({
  first_name: Joi.string().min(3).max(30).required().trim(),
  middle_name: Joi.string().max(30).allow(null, '').trim(),
  last_name: Joi.string().max(30).required().trim(),
  phone_no: Joi.string().min(10).max(12).required().trim(),
});
//Joi Validation schema for add project
export const addProjectSchema = Joi.object({
  project_name: Joi.string().min(3).max(30).required(),
  project_code: Joi.string().min(3).max(15).required(),
  start_date: Joi.date().format('YYYY-MM-DD').iso().required(),
  end_date: Joi.date().format('YYYY-MM-DD').iso().required(),
  project_description: Joi.string().min(10).max(255).required(),
});
//Joi Validation scehma for edit project
export const updateProjectSchema = Joi.object({
  project_name: Joi.string().min(3).max(30).required(),
  start_date: Joi.date().format('YYYY-MM-DD').iso().required(),
  end_date: Joi.date().format('YYYY-MM-DD').iso().required(),
  project_description: Joi.string().min(10).max(255).required(),
});

// Joi validation schema for allocate user
export const allocateUser = Joi.object({
  users: Joi.array().items(Joi.required()).required(),
  from_date: Joi.date().required().format('YYYY-MM-DD').iso(),
  to_date: Joi.date().required().format('YYYY-MM-DD').iso(),
  role: Joi.number().valid(3, 4, 5, 6, 7).strict().required(),
});

// // Joi validation schema for edit fileName
export const editFileName = Joi.object({
  file_name: Joi.string().min(1).max(150).trim().required(),
});

// Pin project
export const pinProjectSchema = Joi.object({
  project_id: Joi.number().integer().strict().min(1).required(),
});

// Pin project sort
export const sortPinProject = Joi.object({
  project_id: Joi.array().items(Joi.required()).required(),
});

//Dashboard task list
export const recentUpdateDashboard = Joi.object({
  projects: Joi.array().items(Joi.required()).required(),
});
export const commentTask = Joi.object({
  comment: Joi.string().max(60000).required().trim(),
  task_id: Joi.number().integer().positive().strict().required(),
  notify: Joi.array().allow(null, '').required(),
});

//get notification
export const getNotificationSchema = Joi.object({
  user: Joi.number().integer().min(1).strict().allow(null).required(),
});
//   projects: Joi.array().items(Joi.required()).required(),
// });
export const AssignTaskParent = Joi.object({
  parent_id: Joi.number().required(),
  child_id: Joi.number().required(),
});
export const AdvancedSearchValidate = Joi.object({
  task_status: Joi.array().items().required(),
  priority: Joi.array().items().required(),
  relation: Joi.array().items().required(),
  category: Joi.array().items().required(),
  createdBy: Joi.array().items().required(),
  assigne: Joi.array().items().required(),
  issue_type: Joi.array().items().required(),
  keyword: Joi.string().allow(null, '', '').required(),
  start_date_from_date: Joi.date()
    .allow(null, '')
    .required()
    .format('YYYY-MM-DD')
    .utc(),
  start_date_to_date: Joi.date()
    .allow(null, '')
    .required()
    .format('YYYY-MM-DD')
    .utc(),
  due_date_from_date: Joi.date()
    .allow(null, '')
    .required()
    .format('YYYY-MM-DD')
    .utc(),
  due_date_to_date: Joi.date()
    .allow(null, '')
    .required()
    .format('YYYY-MM-DD')
    .utc(),
});
export const commentTaskValidate = Joi.object({
  comment: Joi.string().required(),
  task_id: Joi.number().required(),
});
export const GetChildListDtoValidate = Joi.object({
  task_id: Joi.number().required(),
});

export const BatchUpdateValidate = Joi.object({
  tasks: Joi.array().items().required(),
  status: Joi.number()
    .integer()
    .strict()
    .valid(1, 2, 3, 4)
    .allow(null, '')
    .required(),
  assigne: Joi.number().integer().strict().allow(null, '').required(),
  comment: Joi.string().allow(null, '').max(60000).required(),
});
export const FindFiles = Joi.object({
  from_date: Joi.date().allow(null).format('YYYY-MM-DD').iso(),
  to_date: Joi.date().allow(null).format('YYYY-MM-DD').iso(),
  uploaded_by: Joi.number().integer().strict().allow(null).min(1),
  keyword: Joi.string().allow(null),
});
export const NormalSearchValidate = Joi.object({
  status: Joi.number().valid(1, 2, 3, 4, 5).allow(null, '').required(),
  subtasking: Joi.number().valid(1, 2, 3).allow(null, '').required(),
  keyWord: Joi.string().allow(null, '').required(),
});
//homepage task history list
export const filterRecentUpdateHome = Joi.object({
  filterArray: Joi.array().required(),
});
//add issue type
export const addIssueType = Joi.object({
  issue_type: Joi.string().allow!(null, ' ').min(3).max(15).trim().required(),
});
//add category
export const addCategory = Joi.object({
  category_name: Joi.string().allow!(null, ' ')
    .min(3)
    .max(15)
    .trim()
    .required(),
});
//delete replacement category
export const replacementCategory = Joi.object({
  replace_category: Joi.number()
    .integer()
    .positive()
    .allow(null, '')
    .strict()
    .required(),
});
//delete replacement issue type
export const replacementIssueType = Joi.object({
  replace_issueType: Joi.number()
    .integer()
    .positive()
    .allow(null, '')
    .strict()
    .required(),
});
//board filter
export const boardFilter = Joi.object({
  issue_type: Joi.number()
    .integer()
    .positive()
    .allow(null, '')
    .strict()
    .required(),
  category: Joi.number()
    .integer()
    .positive()
    .allow(null, '')
    .strict()
    .required(),
  assignee: Joi.number()
    .integer()
    .positive()
    .allow(null, '')
    .strict()
    .required(),
});
export const roleFilter = Joi.object({
  roleFilter: Joi.number().integer().strict().positive(),
});
export const EditAllocateValidate = Joi.object({
  user_id: Joi.number().integer().positive().strict().required(),
  role: Joi.number().integer().positive().strict().required(),
  end_date: Joi.date().format('YYYY-MM-DD').iso().required(),
});
