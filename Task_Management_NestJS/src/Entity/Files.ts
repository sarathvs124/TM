import { Folders } from './Folders';
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
import { Project } from './Project';
import { Task } from './Task';

@Entity({ name: 'files' })
export class Files {
  @PrimaryGeneratedColumn()
  file_id: number;
  @Column({ type: 'varchar', length: 256 })
  file_name: string;
  @Column({ type: 'varchar', length: 256 })
  file_path: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ type: 'varchar', length: 30 })
  file_type: string;

  @ManyToOne(() => Project, (project) => project.project_id_file)
  @JoinColumn({ name: 'project_id' })
  project_id_file: Project;
  @ManyToOne(() => Task, (task) => task.task_id_file)
  @JoinColumn({ name: 'task_id' })
  task_id_file: Task;
  @ManyToOne(() => User, (user) => user.created_by_file)
  @JoinColumn({ name: 'created_by' })
  created_by_file: User;
  @ManyToOne(() => User, (user) => user.updated_by_file)
  @JoinColumn({ name: 'updated_by' })
  updated_by_file: User;
  @ManyToOne(() => Folders, (folders) => folders.folder_id_files)
  @JoinColumn({ name: 'folder_id' })
  folder_id_files: Folders;

  @OneToMany(() => TaskHistory, (task_history) => task_history.file_history)
  file_history: TaskHistory[];
}
