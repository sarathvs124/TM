import { Project } from './Project';
import { Task } from '../Entity/Task';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'recently_viewed' })
export class RecentlyViewed {
  @PrimaryGeneratedColumn()
  recently_viewed_id: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column()
  view_date: Date;
  @Column({ type: 'tinyint' })
  status: number;
  @ManyToOne(() => Task, (task_id) => task_id.task_recently_viewed)
  @JoinColumn({ name: 'task_id' })
  task_recently_viewed: Task;
  @ManyToOne(() => Project, (project_id) => project_id.project_recently_viewed)
  @JoinColumn({ name: 'project_id' })
  project_recently_viewed: Project;
  @ManyToOne(() => User, (user_id) => user_id.user_recently_viewed)
  @JoinColumn({ name: 'user_id' })
  user_recently_viewed: User;
}
