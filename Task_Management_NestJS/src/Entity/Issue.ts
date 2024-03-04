import { TaskHistory } from './Task_History';
import { User } from '../Entity/User';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from './Task';

@Entity({ name: 'issue' })
export class Issue {
  @PrimaryGeneratedColumn()
  issue_id: number;
  @Column({ type: 'varchar', length: 256 })
  issue_name: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column({ nullable: true, type: 'tinyint' })
  order: number;
  @Column({ nullable: true, type: 'tinyint' })
  color: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;

  @ManyToOne(() => User, (user) => user.created_by_issue)
  @JoinColumn({ name: 'created_by' })
  created_by_issue: User;
  @ManyToOne(() => User, (user) => user.updated_by_issue)
  @JoinColumn({ name: 'updated_by' })
  updated_by_issue: User;

  @OneToMany(() => Task, (task) => task.task_issue)
  task_issue: Task[];
  @OneToMany(
    () => TaskHistory,
    (task_history) => task_history.task_issue_history,
  )
  task_issue_history: TaskHistory[];
  @OneToMany(
    () => TaskHistory,
    (task_history) => task_history.new_task_issue_history,
  )
  new_task_issue_history: TaskHistory[];
}
