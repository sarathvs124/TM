import { ProjectResourceAllocation } from './Project_resource_allocation';
import { Task } from './Task';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';
import { Files } from './Files';
import { Issue } from './Issue';
import { Category } from './Category';
import { Notifications } from './Notifications';

@Entity({ name: 'task_history' })
export class TaskHistory {
  @PrimaryGeneratedColumn()
  task_history_id: number;
  @Column({ nullable: true })
  task_id: number;
  @Column({ nullable: true })
  task_name: string;
  @Column({ nullable: true })
  new_task_name: string;
  @Column({ nullable: true })
  file_name: string;
  @Column({ nullable: true })
  new_file_name: string;
  @Column({ nullable: true })
  file_path: string;
  @Column({ nullable: true })
  new_file_path: string;
  @Column({ type: 'text', nullable: true })
  task_description: string;
  @Column({ type: 'text', nullable: true })
  new_task_description: string;
  @Column({ type: 'tinyint', nullable: true })
  status: number;
  @Column({ type: 'tinyint', nullable: true })
  task_status: number;
  @Column({ type: 'tinyint' })
  task_history_status: number;
  @Column({ type: 'tinyint', nullable: true })
  new_task_status: number;
  @Column({ nullable: true })
  task_created_date: Date;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ type: 'tinyint', nullable: true })
  priority: number;
  @Column({ type: 'tinyint', nullable: true })
  new_priority: number;
  @Column({ nullable: true })
  actual_hours: string;
  @Column({ nullable: true })
  new_actual_hours: string;
  @Column({ nullable: true })
  estimated_hours: string;
  @Column({ nullable: true })
  new_estimated_hours: string;
  @Column({ type: 'date', nullable: true })
  start_date: Date;
  @Column({ type: 'date', nullable: true })
  new_start_date: Date;
  @Column({ type: 'date', nullable: true })
  end_date: Date;
  @Column({ type: 'date', nullable: true })
  new_end_date: Date;
  @Column({ nullable: true, type: 'text' })
  comment: string;
  @Column({ type: 'tinyint' })
  action: number;
  @Column({ type: 'tinyint' })
  history_type: number;

  @Column({ nullable: true, type: 'tinyint' })
  resource_allocation_status: number;

  @ManyToOne(() => Project, (project) => project.task_history)
  @JoinColumn({ name: 'project_id' })
  task_history: Project;
  @ManyToOne(() => User, (user) => user.assignee_history)
  @JoinColumn({ name: 'assignee' })
  assignee_history: User;
  @ManyToOne(() => User, (user) => user.new_assignee_history)
  @JoinColumn({ name: 'new_assignee' })
  new_assignee_history: User;
  @ManyToOne(() => User, (user) => user.assigner_history)
  @JoinColumn({ name: 'assigner' })
  assigner_history: User;
  @ManyToOne(() => User, (user) => user.new_assigner_history)
  @JoinColumn({ name: 'new_assigner' })
  new_assigner_history: User;
  @ManyToOne(() => User, (user) => user.created_by_history)
  @JoinColumn({ name: 'created_by' })
  created_by_history: User;
  @ManyToOne(() => User, (user) => user.updated_by_history)
  @JoinColumn({ name: 'updated_by' })
  updated_by_history: User;
  @ManyToOne(() => Files, (file) => file.file_history)
  @JoinColumn({ name: 'file_id' })
  file_history: Files;
  @ManyToOne(() => Task, (task) => task.taskHistory)
  @JoinColumn({ name: 'task_id' })
  taskHistory: Task;
  @ManyToOne(() => Issue, (issue_id) => issue_id.task_issue_history)
  @JoinColumn({ name: 'issue_id' })
  task_issue_history: Issue;
  @ManyToOne(() => Category, (category_id) => category_id.task_category_history)
  @JoinColumn({ name: 'category_id' })
  task_category_history: Category;
  @ManyToOne(() => Issue, (new_issue_id) => new_issue_id.new_task_issue_history)
  @JoinColumn({ name: 'new_issue_id' })
  new_task_issue_history: Issue;
  @ManyToOne(
    () => Category,
    (new_category_id) => new_category_id.new_task_category_history,
  )
  @JoinColumn({ name: 'new_category_id' })
  new_task_category_history: Category;

  @ManyToOne(
    () => ProjectResourceAllocation,
    (resource_allocation) => resource_allocation.allocation_data,
  )
  @JoinColumn({ name: 'allocation_id' })
  allocation_data: ProjectResourceAllocation;

  @OneToMany(
    () => Notifications,
    (notification) => notification.task_history_notification,
  )
  task_history_notification: Notifications[];
}
