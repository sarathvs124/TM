import { User } from '../Entity/User';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './Roles';
import { Project } from './Project';

@Entity({ name: 'project_history' })
export class ProjectHistory {
  @PrimaryGeneratedColumn()
  project_history_id: number;
  @Column({ nullable: true })
  project_name: string;
  @Column({ nullable: true })
  project_code: string;
  @Column({ nullable: true })
  new_project_name: string;
  @Column({ nullable: true })
  project_description: string;
  @Column({ nullable: true })
  new_project_description: string;
  @Column({ nullable: true, type: 'tinyint' })
  project_status: number;
  @Column({ nullable: true, type: 'tinyint' })
  new_project_status: number;
  @Column({ type: 'date', nullable: true })
  end_date: Date;
  @Column({ type: 'date', nullable: true })
  start_date: Date;
  @Column({ type: 'date', nullable: true })
  new_end_date: Date;
  @Column({ type: 'date', nullable: true })
  new_start_date: Date;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ type: 'tinyint' })
  project_history_status: number;
  @Column({ type: 'tinyint' })
  action: number;
  @Column({ nullable: true, type: 'tinyint' })
  resource_allocation_status: number;
  @Column({ nullable: true, type: 'tinyint' })
  new_resource_allocation_status: number;
  @Column({ nullable: true, type: 'date' })
  allocation_from_date: Date;
  @Column({ nullable: true, type: 'date' })
  allocation_to_date: Date;
  @Column({ nullable: true, type: 'date' })
  new_allocation_from_date: Date;
  @Column({ nullable: true, type: 'date' })
  new_allocation_to_date: Date;

  @ManyToOne(() => Project, (project) => project.project_id_history)
  @JoinColumn({ name: 'project_id' })
  project_id_history: Project;
  @ManyToOne(() => User, (user) => user.allocated_resource)
  @JoinColumn({ name: 'allocated_user' })
  allocated_resource: User;
  @ManyToOne(() => Roles, (role) => role.resource_allocation_role)
  @JoinColumn({ name: 'project_role' })
  resource_allocation_role: Roles;
  @ManyToOne(() => Roles, (role) => role.new_resource_allocation_role)
  @JoinColumn({ name: 'new_project_role' })
  new_resource_allocation_role: Roles;
  @ManyToOne(() => User, (user) => user.created_by_project_history)
  @JoinColumn({ name: 'created_by' })
  created_by_project_history: User;
  @ManyToOne(() => User, (user) => user.updated_by_project_history)
  @JoinColumn({ name: 'updated_by' })
  updated_by_project_history: User;
}
