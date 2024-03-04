import { ProjectHistory } from './Project_history';
import { RecentlyViewed } from './Recently_viewed';
import { Files } from './Files';
import { Folders } from './Folders';
import { Task } from './Task';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { TaskHistory } from './Task_History';
import { ProjectResourceAllocation } from './Project_resource_allocation';
import { Notifications } from './Notifications';
import { PinProject } from './Pin_project';
import { TaskRelationship } from './TaskRelationship';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number;
  @Column({ type: 'varchar', length: 50 })
  project_name: string;
  @Column({ type: 'varchar', length: 15 })
  project_code: string;
  @Column({ type: 'text' })
  project_description: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column({ type: 'tinyint', nullable: true })
  project_status: number;
  @Column({ type: 'date', nullable: true })
  end_date: Date;
  @Column({ type: 'date', nullable: true })
  start_date: Date;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ nullable: true })
  total_resource: number;
  @Column({ nullable: true })
  total_task: number;

  @ManyToOne(() => User, (user) => user.project_created_by)
  @JoinColumn({ name: 'created_by' })
  project_created_by: User;
  @ManyToOne(() => User, (user) => user.project_updated_by)
  @JoinColumn({ name: 'updated_by' })
  project_updated_by: User;
  @ManyToOne(() => Folders, (folder) => folder.project_folder)
  @JoinColumn({ name: 'folder_id' })
  project_folder: Folders;

  @OneToMany(() => Task, (task) => task.project_id)
  task: Task[];
  @OneToMany(() => TaskHistory, (taskHistory) => taskHistory.task_history)
  task_history: TaskHistory[];
  @OneToMany(
    () => ProjectResourceAllocation,
    (resource_allocation) => resource_allocation.project_id_resource_alloc,
  )
  project_id_resource_alloc: ProjectResourceAllocation[];
  @OneToMany(() => Folders, (folder) => folder.project_id_folders)
  project_id_folders: Folders[];
  @OneToMany(() => Files, (file) => file.project_id_file)
  project_id_file: Files[];
  @OneToMany(
    () => Notifications,
    (notification) => notification.project_id_notification,
  )
  project_id_notification: Notifications[];
  @OneToMany(() => PinProject, (pin_project) => pin_project.project_id_pin)
  project_id_pin: PinProject[];
  @OneToMany(
    () => TaskRelationship,
    (taskRelation) => taskRelation.project_id_task_relationship,
  )
  project_id_task_relationship: TaskRelationship[];
  @OneToMany(
    () => RecentlyViewed,
    (recently_viewed) => recently_viewed.project_recently_viewed,
  )
  project_recently_viewed: RecentlyViewed[];
  @OneToMany(
    () => ProjectHistory,
    (project_history) => project_history.project_id_history,
  )
  project_id_history: ProjectHistory[];
}
