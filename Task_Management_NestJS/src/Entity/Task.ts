import { RecentlyViewed } from './Recently_viewed';
import { Issue } from './Issue';
import { Category } from './Category';
import { Files } from './Files';
import { TaskHistory } from './Task_History';
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
import { Notifications } from './Notifications';
import { TaskRelationship } from './TaskRelationship';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  task_id: number;
  @Column({ type: 'varchar', length: 280 })
  task_name: string;
  @Column({ type: 'text' })
  task_description: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column({ type: 'tinyint' })
  task_status: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ type: 'tinyint' })
  priority: number;
  @Column({ nullable: true })
  actual_hours: string;
  @Column({ nullable: true })
  estimated_hours: string;
  @Column({ type: 'date', nullable: true })
  start_date: Date;
  @Column({ type: 'date', nullable: true })
  end_date: Date;
  @Column({ type: 'tinyint', nullable: true })
  task_relation: number;
  @Column({ type: 'tinyint', nullable: true })
  attachment_status: number;

  @ManyToOne(() => Project, (project_id) => project_id.task)
  @JoinColumn({ name: 'project_id' })
  project_id: Project;
  @ManyToOne(() => User, (user) => user.assignee)
  @JoinColumn({ name: 'assignee' })
  assignee: User;
  @ManyToOne(() => User, (user) => user.assigner)
  @JoinColumn({ name: 'assigner' })
  assigner: User;
  @ManyToOne(() => User, (user) => user.created_by)
  @JoinColumn({ name: 'created_by' })
  created_by: User;
  @ManyToOne(() => User, (user) => user.updated_by)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;
  @ManyToOne(() => Category, (category_id) => category_id.task_category)
  @JoinColumn({ name: 'category_id' })
  task_category: Category;
  @ManyToOne(() => Issue, (issue_id) => issue_id.task_issue)
  @JoinColumn({ name: 'issue_id' })
  task_issue: Issue;
  @ManyToOne(() => Task, (parent_task) => parent_task.parent_task_id)
  @JoinColumn({ name: 'parent_id' })
  parent_task_id: Issue;

  @OneToMany(() => TaskHistory, (task_history) => task_history.taskHistory)
  taskHistory: TaskHistory[];
  @OneToMany(() => Files, (file) => file.task_id_file)
  task_id_file: Files[];
  @OneToMany(
    () => Notifications,
    (notification) => notification.task_id_notification,
  )
  task_id_notification: Notifications[];
  @OneToMany(
    () => TaskRelationship,
    (taskRelation) => taskRelation.task_id_parent,
  )
  task_id_parent: TaskRelationship[];
  @OneToMany(
    () => TaskRelationship,
    (taskRelation) => taskRelation.task_id_child,
  )
  task_id_child: TaskRelationship[];
  @OneToMany(
    () => RecentlyViewed,
    (recently_viewed) => recently_viewed.task_recently_viewed,
  )
  task_recently_viewed: RecentlyViewed[];
}
