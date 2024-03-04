import { ProjectHistory } from './Project_history';
import { RecentlyViewed } from './Recently_viewed';
import { Issue } from './Issue';
import { Files } from './Files';
import { Folders } from './Folders';
import { Project } from './Project';
import { TaskHistory } from './Task_History';
import { Task } from './Task';
import { Roles } from './Roles';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectResourceAllocation } from './Project_resource_allocation';
import { Notifications } from './Notifications';
import { PinProject } from './Pin_project';
import { Category } from './Category';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;
  @Column({ type: 'varchar', length: 30 })
  user_name: string;
  @Column({ type: 'varchar', length: 60 })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  password_token: string;
  @Column({ nullable: true })
  notification_url: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column()
  updated_date: Date;
  @Column()
  created_date: Date;
  @Column({ nullable: true })
  active_projects: number;
  @Column({ type: 'tinyint' })
  new_user: number;
  @Column({ type: 'tinyint', nullable: true })
  login_status: number;
  @Column({ type: 'bigint', nullable: true })
  last_login: number;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ nullable: true })
  middle_name: string;
  @Column({ nullable: true })
  phone_number: string;
  @Column({ nullable: true })
  profile_photo: string;
  @Column({ nullable: true, type: 'tinyint' })
  change_password_status: number;
  @ManyToOne(() => Roles, (role) => role.user)
  @JoinColumn({ name: 'role' })
  role: Roles;

  @OneToMany(() => Task, (task) => task.assignee)
  assignee: Task[];
  @OneToMany(() => Task, (task) => task.assigner)
  assigner: Task[];
  @OneToMany(() => Task, (task) => task.created_by)
  created_by: Task[];
  @OneToMany(() => Task, (task) => task.updated_by)
  updated_by: Task[];
  @OneToMany(() => TaskHistory, (task_history) => task_history.assignee_history)
  assignee_history: TaskHistory[];
  @OneToMany(
    () => TaskHistory,
    (task_history) => task_history.new_assignee_history,
  )
  new_assignee_history: TaskHistory[];
  @OneToMany(() => TaskHistory, (task_history) => task_history.assigner_history)
  assigner_history: TaskHistory[];
  @OneToMany(
    () => TaskHistory,
    (task_history) => task_history.new_assigner_history,
  )
  new_assigner_history: TaskHistory[];
  @OneToMany(
    () => TaskHistory,
    (task_history) => task_history.created_by_history,
  )
  created_by_history: TaskHistory[];
  @OneToMany(
    () => TaskHistory,
    (task_history) => task_history.updated_by_history,
  )
  updated_by_history: TaskHistory[];
  @OneToMany(() => Project, (project) => project.project_created_by)
  project_created_by: Project[];
  @OneToMany(() => Project, (project) => project.project_updated_by)
  project_updated_by: Project[];
  @OneToMany(
    () => ProjectResourceAllocation,
    (project_resource) => project_resource.allocated_user,
  )
  allocated_user: Project[];
  @ManyToOne(
    () => ProjectResourceAllocation,
    (project_resource) => project_resource.allocation_assigned_by,
  )
  allocation_assigned_by: Project[];
  @OneToMany(() => Folders, (folder) => folder.created_by_folders)
  created_by_folders: Folders[];
  @OneToMany(() => Folders, (folder) => folder.updated_by_folders)
  updated_by_folders: Folders[];
  @OneToMany(() => Files, (file) => file.created_by_file)
  created_by_file: Files[];
  @OneToMany(() => Files, (file) => file.updated_by_file)
  updated_by_file: Files[];
  @OneToMany(
    () => Notifications,
    (notification) => notification.user_id_notification,
  )
  user_id_notification: Notifications[];
  @OneToMany(() => PinProject, (pin_project) => pin_project.user_id_pin)
  user_id_pin: PinProject[];
  @OneToMany(() => Category, (category) => category.created_by_category)
  created_by_category: Category[];
  @OneToMany(() => Category, (category) => category.updated_by_category)
  updated_by_category: Category[];
  @OneToMany(() => Issue, (issue) => issue.created_by_issue)
  created_by_issue: Issue[];
  @OneToMany(() => Issue, (issue) => issue.updated_by_issue)
  updated_by_issue: Issue[];
  @OneToMany(
    () => Notifications,
    (notification) => notification.user_created_notification,
  )
  user_created_notification: Notifications[];
  @OneToMany(
    () => RecentlyViewed,
    (recently_viewed) => recently_viewed.user_recently_viewed,
  )
  user_recently_viewed: RecentlyViewed[];
  @OneToMany(
    () => ProjectHistory,
    (project_history) => project_history.created_by_project_history,
  )
  created_by_project_history: ProjectHistory[];
  @OneToMany(
    () => ProjectHistory,
    (project_history) => project_history.updated_by_project_history,
  )
  updated_by_project_history: ProjectHistory[];
  @OneToMany(
    () => ProjectHistory,
    (project_history) => project_history.allocated_resource,
  )
  allocated_resource: ProjectHistory[];
}
