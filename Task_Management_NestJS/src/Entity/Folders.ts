import { Files } from './Files';
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

@Entity({ name: 'folders' })
export class Folders {
  @PrimaryGeneratedColumn()
  folder_id: number;
  @Column({ type: 'varchar', length: 50 })
  folder_name: string;
  @Column({ type: 'varchar', length: 256 })
  directory: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ type: 'tinyint', nullable: true })
  folder_type: number;

  @ManyToOne(() => Folders, (folder) => folder.parent_folder)
  @JoinColumn({ name: 'parent_folder_id' })
  parent_folder: Folders;
  @ManyToOne(() => Project, (project) => project.project_id_folders)
  @JoinColumn({ name: 'project_id' })
  project_id_folders: Project;
  @ManyToOne(() => User, (user) => user.created_by_folders)
  @JoinColumn({ name: 'created_by' })
  created_by_folders: User;
  @ManyToOne(() => User, (user) => user.updated_by_folders)
  @JoinColumn({ name: 'updated_by' })
  updated_by_folders: User;

  @OneToMany(() => Files, (files) => files.folder_id_files)
  folder_id_files: Files[];
  @OneToMany(() => Project, (project) => project.project_folder)
  project_folder: Project[];
}
