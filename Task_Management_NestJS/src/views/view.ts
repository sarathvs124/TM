import {
  PROJECT_HISTORY_ACTION,
  HISTORY_TYPE,
  PIN_STATUS,
} from './../Enum/Enums.enum';
import { STATUS } from '../Enum/Enums.enum';
export class GetUserView {
  username: string;
  email: string;
  role: string;
  role_id: number;
  constructor(data) {
    this.username = data.user_name;
    this.email = data.email;
    this.role_id = data.role.role_id;
    this.role = data.role.role_name;
  }
}
export class LoginView {
  user_id: number;
  user_name: string;
  email: string;
  role: number;
  status: number;
  accessToken: string;
  refreshToken: string;
  constructor(data, accessToken, refreshToken) {
    this.user_id = data.user_id;
    this.user_name = data.user_name;
    this.email = data.email;
    this.role = data.role.role_id;
    this.status = data.status;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class TaskView {
  task_id: number;
  task_name: string;
  task_description: string;
  task_status: number;
  status: number;
  category_id: number;
  issue_id: number;
  category_name: string;
  issue_name: string;
  priority: number;
  actual_hours: string;
  estimated_hours: string;
  start_date: Date;
  end_date: Date;
  project_name: string;
  assignee: string;
  assignee_id: number;
  assigner: string;
  created_by: string;
  updated_by: string;
  task_relation: number;
  assignee_photo: string;
  created_by_photo: string;
  assigner_photo: string;
  parent_id: string;
  parent_task_name: string;
  constructor(taskData, parentTask) {
    this.task_id = taskData.task_id;
    this.task_name = taskData.task_name;
    this.task_description = taskData.task_description;
    this.task_status = taskData.task_status;
    this.status = taskData.status;
    this.task_relation = taskData.task_relation;

    if (taskData.task_category) {
      this.category_id = taskData.task_category.category_id;
      this.category_name = taskData.task_category.category_name;
    }
    if (taskData.task_issue) {
      this.issue_id = taskData.task_issue.issue_id;
      this.issue_name = taskData.task_issue.issue_name;
    }
    this.priority = taskData.priority;
    this.actual_hours = taskData.actual_hours;
    this.estimated_hours = taskData.estimated_hours;
    this.start_date = taskData.start_date;
    this.end_date = taskData.end_date;
    this.project_name = taskData.project_id.project_name;
    this.created_by = taskData.created_by.user_name;
    this.updated_by = taskData.updated_by.user_name;
    if (taskData.created_by) {
      this.created_by_photo = taskData.created_by.profile_photo || null;
    }
    if (taskData.assignee) {
      this.assignee = taskData.assignee.user_name || null;
      this.assignee_id = taskData.assignee.user_id || null;
      this.assignee_photo = taskData.assignee.profile_photo || null;
      if (taskData.assigner) {
        this.assigner = taskData.assigner.user_name || null;
        this.assigner_photo = taskData.assigner.profile_photo || null;
      }
    }

    if (parentTask != null) {
      this.parent_id = parentTask.task_id_parent.task_id;
      this.parent_task_name = parentTask.task_id_parent.task_name;
    }
  }
}

export class LoopTaskFilesView {
  files: any;
  constructor(fileData) {
    this.files = [];
    Promise.all(
      fileData.map(async (file) => {
        this.files.push(new TaskFilesView(file));
      }),
    );
  }
}
export class TaskFilesView {
  file_id: number;
  file_name: string;
  file_path: string;
  updated_date: Date;
  constructor(data) {
    this.file_id = data.file_id;
    this.file_name = data.file_name;
    this.file_path = data.file_path;
    this.updated_date = data.updated_date.toISOString().slice(0, 10);
  }
}

export class SetTaskHistoryView {
  task_id: number;
  task_name: string;
  task_description: string;
  task_status: number;
  status: number;
  task_created_date: Date;
  task_category_history: any;
  task_issue_history: any;
  priority: number;
  actual_hours: string;
  estimated_hours: string;
  start_date: Date;
  end_date: Date;
  task_history: any;
  assignee_history: any;
  assigner_history: any;
  created_by_history: any;
  updated_by_history: any;
  constructor(taskData) {
    this.task_id = taskData.task_id;
    this.task_name = taskData.task_name;
    this.task_description = taskData.task_description;
    this.task_status = taskData.task_status;
    this.status = taskData.status;
    this.task_created_date = taskData.created_date;
    this.task_category_history = taskData.task_category;
    this.task_issue_history = taskData.task_issue;
    this.priority = taskData.priority;
    this.actual_hours = taskData.actual_hours;
    this.estimated_hours = taskData.estimated_hours;
    this.start_date = taskData.start_date;
    this.end_date = taskData.end_date;
    this.task_history = taskData.project_id;
    this.created_by_history = taskData.created_by;
    this.updated_by_history = taskData.updated_by;
    if (taskData.assignee) {
      this.assignee_history = taskData.assignee;
      this.assigner_history = taskData.assigner;
    }
  }
}

export class ProfileView {
  user_id: number;
  user_name: string;
  email: string;
  status: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  profile_photo: string;
  phone_number: string;
  updated_date: Date;
  constructor(user) {
    this.user_id = user.user_id;
    this.user_name = user.user_name;
    this.email = user.email;
    this.status = user.status;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.phone_number = user.phone_number;
    this.profile_photo = user.profile_photo;
    this.updated_date = user.updated_date.toISOString().slice(0, 10);
    if (user.middle_name) {
      this.middle_name = user.middle_name;
    }
  }
}

export class ProjectStatus {
  project_id: number;
  project_name: string;
  project_code: string;
  project_description: string;
  status: number;
  project_status: number;
  start_date: Date;
  end_date: Date;
  total_resource: number;
  total_task: number;
  created_date: string;
  updated_date: string;
  openTask: number;
  closed: number;
  bug: number;
  developer_issue: number;
  request: number;
  task: number;
  other: number;
  folder_id: number;
  inProgress: number;
  resolved: number;
  categoryPercentage: number;

  constructor(
    project,
    totalTask,
    openTask,
    inProgress,
    resolved,
    closed,
    categoryPercentage,
  ) {
    this.project_id = project.project_id;
    this.project_name = project.project_name;
    this.project_code = project.project_code;
    this.project_description = project.project_description;
    this.status = project.status;
    this.project_status = project.project_status;
    this.start_date = project.start_date;
    this.end_date = project.end_date;
    this.created_date = project.created_date;
    this.updated_date = project.updated_date;
    this.total_resource = project.total_resource;
    this.total_task = totalTask;
    this.openTask = openTask;
    this.inProgress = inProgress;
    this.resolved = resolved;
    this.closed = closed;
    this.categoryPercentage = categoryPercentage;
  }
}
export class PinnedProjectView {
  projects = [];
  constructor(data) {
    Promise.all(
      data.map(async (project) => {
        this.projects.push(new ProjectView(project));
      }),
    );
  }
}
export class ProjectView {
  allocation_id: number;
  project_id: number;
  project_name: string;
  project_code: string;
  project_description: number;
  status: number;
  project_status: number;
  start_date: Date;
  end_date: Date;
  total_resource: number;
  total_task: number;
  created_date: string;
  updated_date: string;
  project_role: number;
  order: number;
  pinned: number;
  constructor(project) {
    if (project.pin_status == PIN_STATUS.PIN) {
      this.project_id = project.project_id_resource_alloc.project_id;
      this.project_name = project.project_id_resource_alloc.project_name;
      this.project_code = project.project_id_resource_alloc.project_code;
      this.project_description =
        project.project_id_resource_alloc.project_description;
      this.status = project.project_id_resource_alloc.status;
      this.project_status = project.project_id_resource_alloc.project_status;
      this.start_date = project.project_id_resource_alloc.start_date;
      this.end_date = project.project_id_resource_alloc.end_date;
      this.created_date = project.project_id_resource_alloc.created_date;
      this.updated_date = project.project_id_resource_alloc.updated_date;
      this.project_role = project.role.role_id;
      this.allocation_id = project.project_resource_allocation_id;
      this.order = project.pin_order;
      this.pinned = 1;
    } else if (project.pin_status == PIN_STATUS.UNPIN) {
      this.project_id = project.project_id_resource_alloc.project_id;
      this.project_name = project.project_id_resource_alloc.project_name;
      this.project_code = project.project_id_resource_alloc.project_code;
      this.project_description =
        project.project_id_resource_alloc.project_description;
      this.status = project.project_id_resource_alloc.status;
      this.project_status = project.project_id_resource_alloc.project_status;
      this.start_date = project.project_id_resource_alloc.start_date;
      this.end_date = project.project_id_resource_alloc.end_date;
      this.created_date = project.project_id_resource_alloc.created_date;
      this.updated_date = project.project_id_resource_alloc.updated_date;
      this.project_role = project.role.role_id;
      this.allocation_id = project.project_resource_allocation_id;
      this.order = project.pin_order;
      this.pinned = 0;
    }
  }
}
export class LoopAllocatedProjectView {
  allocatedProject: any;
  constructor(data) {
    this.allocatedProject = [];
    Promise.all(
      data.map(async (value) => {
        this.allocatedProject.push(new AllocatedProjectView(value));
      }),
    );
  }
}

export class AllocatedProjectView {
  from_date: string;
  to_date: string;
  project_name: string;
  project_code: string;
  assigned_by: string;
  role: string;
  constructor(value) {
    this.from_date = value.from_date;
    this.to_date = value.to_date;
    this.project_name = value.project_id_resource_alloc.project_name;
    this.project_code = value.project_id_resource_alloc.project_code;
    this.role = value.role.role_name;
    if (value.allocation_assigned_by) {
      this.assigned_by = value.allocation_assigned_by.user_name;
    }
  }
}

export class LoopTaskDashboard {
  tasks: any;
  constructor(data) {
    this.tasks = [];
    Promise.all(
      data.map(async (value) => {
        this.tasks.push(new DashboardTaskView(value));
      }),
    );
  }
}

export class DashboardTaskView {
  project_id: number;
  task_id: number;
  task_name: string;
  task_status: number;
  category_id: number;
  category_name: string;
  issue_id: number;
  issue_name: string;
  priority: number;
  end_date: Date;
  project_name: string;
  task_relation: number;
  constructor(data) {
    this.task_id = data.task_id;
    this.task_name = data.task_name;
    this.task_status = data.task_status;
    this.task_relation = data.task_relation;
    if (data.task_category) {
      this.category_id = data.task_category.category_id;
      this.category_name = data.task_category.category_name;
    }
    if (data.task_issue) {
      this.issue_id = data.task_issue.issue_id;
      this.issue_name = data.task_issue.issue_name;
    }
    this.priority = data.priority;
    this.end_date = data.end_date;
    if (data.project_id) {
      this.project_id = data.project_id.project_id;
      this.project_name = data.project_id.project_name;
    }
  }
}

export class AllocatedUser {
  user_name: string;
  role: string;
  joined_on: string;
  user_id: string;
  user: object;
  project_role_id: number;
  main_role: number;
  last_active: Date;
  allocation_from_date: string;
  allocation_to_date: string;
  allocation_updated_date: Date;
  constructor(data) {
    this.user_id = data.allocated_user.user_id;
    this.user_name = data.allocated_user.user_name;
    this.role = data.role.role_name;
    this.joined_on = data.allocated_user.created_date
      .toISOString()
      .slice(0, 10);
    this.allocation_from_date = data.from_date;
    this.allocation_to_date = data.to_date;
    this.allocation_updated_date = data.allocated_user.updated_date
      .toISOString()
      .slice(0, 10);
    this.main_role = data.allocated_user.role.role_id;
    if (data.allocated_user) {
      if (data.allocated_user.last_login) {
        this.last_active = new Date(data.allocated_user.last_login * 1000);
      } else {
        this.last_active = null;
      }
    }

    this.project_role_id = data.role.role_id;
    this.user = data.allocated_user;
  }
}
export class AllocatedUsersList {
  userlist = [];
  constructor(data) {
    for (let user of data) this.userlist.push(new AllocatedUser(user));
  }
}

export class TaskFileUploadView {
  project_id_file: number;
  task_id: number;
  task_name: string;
  task_description: string;
  task_status: number;
  status: number;
  created_date: string;
  updated_date: string;
  file_name: string;
  file_path: string;
  file_id: number;
  folder_id: number;
  folder_name: string;
  directory: string;
  file_type: string;

  constructor(task, saved) {
    this.task_id = task.task_id;
    this.task_name = task.task_name;
    this.task_description = task.task_description;
    this.file_name = saved.file_name;
    this.file_path = saved.file_path;
    this.file_id = saved.file_id;
    this.folder_id = saved.folder_id_files.folder_id;
    this.folder_name = saved.folder_id_files.folder_name;
    this.directory = saved.folder_id_files.directory;
    this.status = saved.status;
    this.created_date = saved.created_date;
    this.updated_date = saved.updated_date;
    this.file_type = saved.file_type;
  }
}

export class TaskHistoryView {
  task_history_id: number;
  task_id: number;
  task_name: string;
  new_task_name: string;
  file_name: string;
  new_file_name: string;
  file_path: string;
  new_file_path: string;
  task_description: string;
  new_task_description: string;
  status: number;
  task_status: number;
  task_history_status: number;
  new_task_status: number;
  task_created_date: Date;
  created_date: string;
  updated_date: Date;
  priority: number;
  new_priority: number;
  task_category_history: any;
  task_issue_history: any;
  new_task_issue_history: any;
  new_task_category_history: any;
  actual_hours: string;
  new_actual_hours: string;
  estimated_hours: string;
  new_estimated_hours: string;
  start_date: Date;
  new_start_date: Date;
  end_date: Date;
  new_end_date: Date;
  project_id: number;
  project_name: string;
  comment: string;
  action: number;
  assignee_history: any;
  assignee: any;
  assigner: any;
  new_assigner_history: any;
  action_by: any;
  file_history: any;
  user_photo: string;
  sort_date: string;
  group_date: string;
  update_type: number;
  profile_photo: string;

  project_history_id: number;
  project_code: string;
  project_description: string;
  allocation_from_date: Date;
  allocation_to_date: Date;
  allocated_role_id: number;
  allocated_role_name: string;
  resource_allocation_status: number;
  new_resource_allocation_status: number;
  allocated_user_id: number;
  allocated_user_name: string;

  constructor(historyData) {
    this.update_type = historyData.history_type;
    if (this.update_type == HISTORY_TYPE.TASK_HISTORY) {
      this.taskHistory(historyData);
    } else if (this.update_type == HISTORY_TYPE.PROJECT_HISTORY) {
      this.projectHistory(historyData);
    }
  }

  async projectHistory(historyData) {
    this.project_history_id = historyData.task_history_id;
    this.created_date = historyData.created_date.toISOString();
    this.sort_date = historyData.created_date.toISOString();
    this.group_date = historyData.created_date.toISOString().slice(0, 10);
    this.action = historyData.action;
    if (historyData.task_history) {
      this.project_id = historyData.task_history.project_id;
      this.project_name = historyData.task_history.project_name;
      this.project_code = historyData.task_history.project_code;
      this.project_description = historyData.task_history.project_description;
    }
    if (historyData.created_by_history) {
      this.action_by = historyData.created_by_history.user_name;
      this.profile_photo = historyData.created_by_history.profile_photo;
    }
    if (historyData.action == PROJECT_HISTORY_ACTION.ALLOCATE_USER) {
      if (historyData.allocation_data) {
        this.allocation_from_date = historyData.allocation_data.from_date;
        this.allocation_to_date = historyData.allocation_data.to_date;

        if (historyData.allocation_data.allocated_user) {
          this.allocated_user_id =
            historyData.allocation_data.allocated_user.user_id;
          this.allocated_user_name =
            historyData.allocation_data.allocated_user.user_name;
        }
        if (historyData.allocation_data.role) {
          this.allocated_role_id = historyData.allocation_data.role.role_id;
          this.allocated_role_name = historyData.allocation_data.role.role_name;
        }
      }
    } else if (historyData.action == PROJECT_HISTORY_ACTION.UN_ALLOCATE) {
      this.unallocatedHistory(historyData);
    }
  }

  async unallocatedHistory(historyData) {
    if (historyData.allocation_data) {
      this.resource_allocation_status =
        historyData.allocation_data.allocation_status;
      this.new_resource_allocation_status =
        historyData.allocation_data.new_allocation_status;
      if (historyData.allocation_data.allocated_user) {
        this.allocated_user_id =
          historyData.allocation_data.allocated_user.user_id;
        this.allocated_user_name =
          historyData.allocation_data.allocated_user.user_name;
      }
      if (historyData.allocation_data.role) {
        this.allocated_role_id = historyData.allocation_data.role.role_id;
        this.allocated_role_name = historyData.allocation_data.role.role_name;
      }
    }
  }
  async taskHistory(historyData) {
    this.task_history_id = historyData.task_history_id;
    this.task_id = historyData.task_id;
    this.task_name = historyData.task_name;
    this.task_description = historyData.task_description;
    this.action = historyData.action;
    this.created_date = historyData.created_date;
    this.sort_date = historyData.created_date.toISOString();
    this.group_date = historyData.created_date.toISOString().slice(0, 10);
    if (historyData.taskHistory) {
      this.status = historyData.taskHistory.status;
    }
    if (historyData.created_by_history) {
      this.action_by = historyData.created_by_history.user_name;
      this.profile_photo = historyData.created_by_history.profile_photo;
    }
    if (
      historyData.action == 7 ||
      historyData.action == 5 ||
      historyData.action == 6 ||
      historyData.action == 9
    ) {
      this.assignAndReassign(historyData);
    }
    if (historyData.action == 8) {
      this.task_status = historyData.task_status;
      this.new_task_status = historyData.new_task_status;
    }
    if (historyData.action == 4) {
      if (historyData.new_file_path && historyData.created_by_history) {
        this.action_by = historyData.created_by_history.user_name;
        this.file_name = historyData.new_file_name;
      } else if (historyData.file_name && historyData.created_by_history) {
        this.action_by = historyData.created_by_history.user_name;
        this.file_name = historyData.file_name;
      }
    }
    if (historyData.task_history) {
      this.project_id = historyData.task_history.project_id;
      this.project_name = historyData.task_history.project_name;
    }
    if (historyData.comment) {
      this.comment = historyData.comment;
    }
  }
  async assignAndReassign(historyData: any) {
    if (!historyData.new_assigner_history) {
      if (historyData.assignee_history) {
        this.assignee = historyData.assignee_history.user_name;
      }
      if (historyData.assigner_history) {
        this.assigner = historyData.assigner_history.user_name;
      }
    } else if (historyData.new_assigner_history) {
      if (historyData.new_assignee_history) {
        this.assignee = historyData.new_assignee_history.user_name;
        if (historyData.new_assigner_history) {
          this.assigner = historyData.new_assigner_history.user_name;
        }
      } else if (historyData.assignee_history) {
        this.assignee = historyData.assignee_history.user_name;
        if (historyData.assigner_history) {
          this.assigner = historyData.assigner_history.user_name;
        }
      }
    }
  }
}

export class ProfileImageView {
  user_id: number;
  user_name: string;
  email: string;
  status: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  profile_photo: string;
  phone_no: string;
  created_date: Date;
  updated_date: Date;
  constructor(data, file) {
    this.user_id = data.user_id;
    this.user_name = data.user_name;
    this.email = data.email;
    this.status = data.status;
    this.first_name = data.first_name;
    if (data.middle_name) {
      this.middle_name = data.middle_name;
    }
    this.last_name = data.last_name;
    this.phone_no = data.phone_number;
    if (file) {
      this.profile_photo = data.profile_photo;
    }
    this.created_date = data.created_date.toISOString().slice(0, 10);
    this.updated_date = data.updated_date.toISOString().slice(0, 10);
  }
}
export class ChangeTaskStatusView {
  task_name: string;
  task_description: string;
  new_task_status: number;
  task_status: number;
  created_date: any;
  updated_date: any;
  task_history_status: number;
  action: number;
  task_created_date: any;
  constructor(result, oldData, action) {
    this.task_name = result.task_name;
    this.task_description = result.task_description;
    this.new_task_status = result.task_status;
    this.task_status = oldData.task_status;
    this.created_date = new Date();
    this.updated_date = new Date();
    this.task_history_status = STATUS.ACTIVE;
    this.action = action;
    this.task_created_date = result.created_date;
  }
}

export class ChangeTaskAssigneeView {
  task_name: string;
  task_description: string;
  task_status: number;
  assignee_history: any;
  new_assignee_history: any;
  created_date: any;
  updated_date: any;
  task_history_status: number;
  action: number;
  task_created_date: any;
  constructor(result, oldData, action) {
    this.task_name = result.task_name;
    this.task_description = result.task_description;
    this.assignee_history = oldData.assignee;
    this.new_assignee_history = result.assignee;
    this.task_status = oldData.task_status;
    this.created_date = new Date();
    this.updated_date = new Date();
    this.task_history_status = STATUS.ACTIVE;
    this.action = action;
    this.task_created_date = result.created_date;
  }
}

export class ChangeTaskStatusAndAssigneeView {
  task_name: string;
  task_description: string;
  new_task_status: number;
  task_status: number;
  assignee_history: any;
  new_assignee_history: any;
  created_date: any;
  updated_date: any;
  task_history_status: number;
  action: number;
  task_created_date: any;
  constructor(result, oldData, action) {
    this.task_name = result.task_name;
    this.task_description = result.task_description;
    this.new_task_status = result.task_status;
    this.task_status = oldData.task_status;
    this.assignee_history = oldData.assignee;
    this.new_assignee_history = result.assignee;
    this.created_date = new Date();
    this.updated_date = new Date();
    this.task_history_status = STATUS.ACTIVE;
    this.action = action;
    this.task_created_date = result.created_date;
  }
}
export class FileRenameView {
  file_id: number;
  FileName: string;
  file_path: string;
  folder_id: number;
  constructor(result, file) {
    this.file_id = file.file_id;
    this.FileName = file.file_name;
    this.file_path = file.file_path;
  }
}

export class FileView {
  file_id: number;
  file_name: string;
  file_path: string;
  status: number;
  created_date: any;
  updated_date: any;
  file_type: string;
  updated_by_file: string;
  uploaded_by_file: string;
  constructor(file) {
    this.file_id = file.file_id;
    this.file_name = file.file_name;
    this.file_path = file.file_path;
    this.status = file.status;
    this.created_date = file.created_date.toISOString().slice(0, 10);
    this.updated_date = file.updated_date.toISOString().slice(0, 10);
    this.file_type = file.file_type;
    if (file.updated_by_file) {
      this.updated_by_file = file.updated_by_file.user_name;
    } else {
      this.updated_by_file = null;
    }
    if (file.created_by_file) {
      this.uploaded_by_file = file.created_by_file.user_name;
    } else {
      this.uploaded_by_file = null;
    }
  }
}

export class ChangeTaskStatusResponseView {
  task_id: number;
  task_name: string;
  task_description: string;
  task_status: number;
  status: number;
  category_id: number;
  issue_id: number;
  category_name: string;
  issue_name: string;
  priority: number;
  actual_hours: string;
  estimated_hours: string;
  start_date: Date;
  end_date: Date;
  project_id: number;
  project_name: string;
  assignee: string;
  assignee_id: number;
  assigner: string;
  created_by: string;
  updated_by: string;
  relation: number;
  constructor(taskData) {
    this.task_id = taskData.task_id;
    this.task_name = taskData.task_name;
    this.task_description = taskData.task_description;
    this.task_status = taskData.task_status;
    this.status = taskData.status;
    if (taskData.task_category) {
      this.category_id = taskData.task_category.category_id;
      this.category_name = taskData.task_category.category_name;
    }
    if (taskData.task_issue) {
      this.issue_id = taskData.task_issue.issue_id;
      this.issue_name = taskData.task_issue.issue_name;
    }
    this.priority = taskData.priority;
    this.actual_hours = taskData.actual_hours;
    this.estimated_hours = taskData.estimated_hours;
    this.start_date = taskData.start_date;
    this.end_date = taskData.end_date;
    this.project_name = taskData.project_id.project_name;
    if (taskData.created_by) {
      this.created_by = taskData.created_by.user_name;
    }
    if (taskData.updated_by) {
      this.updated_by = taskData.updated_by.user_name;
    }
    this.project_id = taskData.project_id.project_id;
    if (taskData.assignee) {
      this.assignee = taskData.assignee.user_name || null;
      this.assignee_id = taskData.assignee.user_id || null;
      if (taskData.assigner) {
        this.assigner = taskData.assigner.user_name || null;
      }
    }
    this.relation = taskData.task_relation;
  }
}

export class NotificationUserListView {
  user_id: number;
  user_name: string;
  constructor(user) {
    if (user) {
      this.user_id = user.user_id;
      this.user_name = user.user_name;
    }
  }
}

export class NotificationListViewLoop {
  notifications = [];
  constructor(data) {
    for (let value of data) {
      this.notifications.push(new NotificationListView(value));
    }
  }
}

export class NotificationListView {
  notification_id: number;
  content: string;
  status: number;
  view_status: number;
  created_date: Date;
  updated_date: Date;
  project_id: number;
  project_name: string;
  project_code: string;
  task_id: number;
  task_name: string;
  notification_type: number;
  action: number;
  profile_photo: string;
  constructor(notification) {
    this.notification_id = notification.notification_id;
    this.content = notification.content;
    this.status = notification.status;
    this.view_status = notification.view_status;
    this.created_date = notification.created_date;
    this.updated_date = notification.updated_date;
    this.notification_type = 2;
    if (notification.action) {
      this.action = notification.action;
    }
    if (notification.project_id_notification) {
      this.project_id = notification.project_id_notification.project_id;
      this.project_name = notification.project_id_notification.project_name;
      this.project_code = notification.project_id_notification.project_code;
    }
    if (notification.task_id_notification) {
      this.task_id = notification.task_id_notification.task_id;
      this.task_name = notification.task_id_notification.task_name;
      this.notification_type = 1;
    }
    if (notification.user_created_notification) {
      this.profile_photo = notification.user_created_notification.profile_photo;
    }
  }
}

export class GanttChartLoop {
  tasks: any;
  constructor(data) {
    this.tasks = [];
    Promise.all(
      data.map(async (value) => {
        if (value.end_date) {
          this.tasks.push(new GanttChartView(value));
        }
      }),
    );
  }
}

export class GanttChartView {
  task_id: number;
  task_name: string;
  task_description: string;
  task_status: number;
  start: number;
  duration: number;
  assignee_id: number;
  assignee_name: string;
  project_id: number;
  project_name: string;
  constructor(task) {
    this.task_id = task.task_id;
    this.task_name = task.task_name;
    this.task_description = task.task_description;
    this.task_status = task.task_status;
    if (task.start_date) {
      this.start = this.getHours(task.start_date);
      this.duration =
        this.getDuration(task.start_date, task.end_date) * 24 * 60 * 60 * 1000;
    } else {
      this.start = this.getHours(task.end_date);
      this.duration =
        this.getDuration(task.end_date, task.end_date) * 24 * 60 * 60 * 1000;
    }
    if (task.assignee) {
      this.assignee_id = task.assignee.user_id;
      this.assignee_name = task.assignee.user_name;
    }
    if (task.project_id) {
      this.project_id = task.project_id.project_id;
      this.project_name = task.project_id.project_name;
    }
  }

  getHours(data) {
    let aaa = new Date(data);
    const currentYear = aaa.getFullYear();
    const currentMonth = aaa.getMonth();
    const currentDay = aaa.getDate();
    return new Date(currentYear, currentMonth, currentDay, 0, 0, 0).getTime();
  }

  getDuration(date1, date2) {
    let data11 = new Date(date1);
    const yearData11 = data11.getFullYear();
    const monthData11 = data11.getMonth();
    const currentData11 = data11.getDate();
    let date12 = new Date(
      Date.UTC(yearData11, monthData11, currentData11, 0, 0, 0),
    );
    let data13 = new Date(date2);
    const yearData12 = data13.getFullYear();
    const monthData12 = data13.getMonth();
    const currentData12 = data13.getDate();
    let date22 = new Date(Date.UTC(yearData12, monthData12, currentData12));

    let Difference_In_Time = date22.getTime() - date12.getTime();
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days + 1;
  }
}

export class MemberListLoop {
  members: any;
  constructor(data, user) {
    this.members = [];
    Promise.all(
      data.map(async (value) => {
        let member = new MemberListView(value);
        this.members.push(member);
      }),
    );
  }
}

export class MemberListView {
  user_id: number;
  user_name: string;
  email: string;
  status: number;
  profile_photo: string;
  created_date: Date;
  updated_date: Date;
  last_active: Date;
  constructor(resource) {
    this.user_id = resource.allocated_user_user_id;
    this.user_name = resource.allocated_user_user_name;
    this.email = resource.allocated_user_email;
    this.status = resource.allocated_user_status;
    this.profile_photo = resource.allocated_user_profile_photo;
    this.created_date = resource.allocated_user_created_date;
    this.updated_date = resource.allocated_user_updated_date;
    if (resource.allocated_user_last_login) {
      this.last_active = new Date(resource.allocated_user_last_login * 1000);
    }
  }
}

export class BoardListLoop {
  openTasks: any;
  constructor(data) {
    this.openTasks = [];
    Promise.all(
      data.map(async (value) => {
        this.openTasks.push(new BoardTaskList(value));
      }),
    );
  }
}

export class BoardTaskList {
  task_id: number;
  task_name: string;
  task_description: string;
  status: number;
  task_status: number;
  created_date: Date;
  updated_date: Date;
  priority: number;
  actual_hours: number;
  estimated_hours: number;
  start_date: Date;
  end_date: Date;
  task_relation: number;
  attachment_status: string;
  assignee: string;
  assignee_id: number;
  category_id: number;
  category_name: string;
  issue_type_id: number;
  issue_type_name: string;
  constructor(data) {
    this.task_id = data.task_id;
    this.task_name = data.task_name;
    this.task_description = data.task_description;
    this.task_status = data.task_status;
    this.created_date = data.created_date;
    this.updated_date = data.updated_date;
    this.priority = data.priority;
    this.actual_hours = data.actual_hours;
    this.estimated_hours = data.estimated_hours;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.task_relation = data.task_relation;
    this.attachment_status = data.attachment_status;
    if (data.task_category) {
      this.category_id = data.task_category.category_id;
      this.category_name = data.task_category.category_name;
    }
    if (data.task_issue) {
      this.issue_type_id = data.task_issue.issue_id;
      this.issue_type_name = data.task_issue.issue_name;
    }
    if (data.assignee) {
      this.assignee = data.assignee.user_name;
      this.assignee_id = data.assignee.user_id;
    }
  }
}
