import { User } from '../Entity/User';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project';
import { Task } from './Task';
import { TaskHistory } from './Task_History';

@Entity({ name: 'notifications' })
export class Notifications {
  @PrimaryGeneratedColumn()
  notification_id: number;
  @Column({ type: 'mediumtext' })
  content: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column({ type: 'tinyint' })
  view_status: number;
  @Column({ type: 'tinyint', nullable: true })
  read_status: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ type: 'tinyint', nullable: true })
  action: number;

  @ManyToOne(() => Project, (project) => project.project_id_notification)
  @JoinColumn({ name: 'project_id' })
  project_id_notification: Project;
  @ManyToOne(() => Task, (task) => task.task_id_notification)
  @JoinColumn({ name: 'task_id' })
  task_id_notification: Task;
  @ManyToOne(() => User, (user) => user.user_id_notification)
  @JoinColumn({ name: 'user_id' })
  user_id_notification: User;
  @ManyToOne(() => User, (user) => user.user_created_notification)
  @JoinColumn({ name: 'created_by' })
  user_created_notification: User;
  @ManyToOne(
    () => TaskHistory,
    (taskHistory) => taskHistory.task_history_notification,
  )
  @JoinColumn({ name: 'task_history' })
  task_history_notification: TaskHistory;
}
