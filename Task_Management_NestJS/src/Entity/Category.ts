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

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;
  @Column({ type: 'varchar', length: 256 })
  category_name: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column({ nullable: true, type: 'tinyint' })
  order: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;

  @ManyToOne(() => User, (user) => user.created_by_category)
  @JoinColumn({ name: 'created_by' })
  created_by_category: User;
  @ManyToOne(() => User, (user) => user.updated_by_category)
  @JoinColumn({ name: 'updated_by' })
  updated_by_category: User;

  @OneToMany(() => Task, (task) => task.task_category)
  task_category: Task[];
  @OneToMany(
    () => TaskHistory,
    (task_history) => task_history.task_category_history,
  )
  task_category_history: TaskHistory[];
  @OneToMany(
    () => TaskHistory,
    (task_history) => task_history.new_task_category_history,
  )
  new_task_category_history: TaskHistory[];
}
