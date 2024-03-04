export class AddTaskDto {
  task_name: string;
  task_description: string;
  category: number;
  issue_type: number;
  priority: number;
  actual_hours: string;
  estimated_hours: string;
  start_date: string;
  end_date: string;
  project_id: number;
  assignee: number;
  parent_id: number;
  notify: number[];
}
export class AddTaskType {
  task_name: string;
  task_description: string;
  category: number;
  issue_type: number;
  priority: number;
  actual_hours: number;
  estimated_hours: number;
  start_date: Date;
  end_date: Date;
  project_id: number;
  assignee: number;
}
export class UpdateTaskDto {
  task_name: string;
  task_description: string;
  category: number;
  issue_type: number;
  priority: number;
  actual_hours: string;
  estimated_hours: string;
  start_date: Date;
  end_date: Date;
  project_id: number;
  assignee: number;
  task_status: number;
  comment: string;
  notify: number[];
}

export class ChangeTaskStatus {
  task_status: number;
  assignee: number;
}
export class FileRename {
  file_name: string;
}
export class RecentUpdatesDashboard {
  projects: number[];
}
export class AssignTaskParentDto {
  parent_id: number;
  child_id: number;
}
export class GetChildListDto {
  task_id: number;
}
export class NotifyTaskUsers {
  task_id: number;
  users: any;
}
export class AdvancedSearchDto {
  task_status: number[];
  priority: number[];
  relation: number[];
  category: number[];
  createdBy: number[];
  assigne: number[];
  issue_type: number[];
  keyword: string;
  start_date_from_date: string;
  start_date_to_date: string;
  due_date_from_date: string;
  due_date_to_date: string;
}

export class CommentTask {
  comment: string;
  task_id: number;
  notify: number[];
}

export class FilterRecentupdates {
  filterArray: [];
}
export class AddIssueType {
  issue_type: string;
}

export class AddCategory {
  category_name: string;
}
export class ReplaceCategory {
  replace_category: number;
}
export class ReplaceIssueType {
  replace_issueType: number;
}
//board filter
export class BoardFilter {
  issue_type: number;
  category: number;
  assignee: number;
}
export class BatchUpdateDto {
  tasks: number[];
  status: number;
  assigne: number;
  comment: string;
}
export class NormalSearchDto {
  status: number;
  subtasking: number;
  keyWord: string;
}
export class FileUpload {
  filename: string;
}
