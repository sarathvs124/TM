import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project';
import { Task } from './Task';

@Entity({ name: 'task_relationship' })
export class TaskRelationship {
  @PrimaryGeneratedColumn()
  task_relationship_id: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ type: 'tinyint' })
  status: number;
  @ManyToOne(() => Project, (project) => project.project_id_task_relationship)
  @JoinColumn({ name: 'project_id' })
  project_id_task_relationship: Project;
  @ManyToOne(() => Task, (task) => task.task_id_parent)
  @JoinColumn({ name: 'parent_task_id' })
  task_id_parent: Task;
  @ManyToOne(() => Task, (task) => task.task_id_child)
  @JoinColumn({ name: 'child_task_id' })
  task_id_child: Task;
}
