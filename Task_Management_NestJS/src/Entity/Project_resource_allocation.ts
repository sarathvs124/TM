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
import { Roles } from './Roles';
import { TaskHistory } from './Task_History';

@Entity({ name: 'projectResourceAllocations' })
export class ProjectResourceAllocation {
  @PrimaryGeneratedColumn()
  project_resource_allocation_id: number;
  @Column({ type: 'tinyint' })
  allocation_status: number;
  @Column({ type: 'tinyint' })
  status: number;
  @Column({ type: 'date' })
  from_date: Date;
  @Column({ type: 'date' })
  to_date: Date;
  @Column({ type: 'tinyint' })
  pin_status: number;
  @Column()
  pin_order: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;

  @ManyToOne(() => Roles, (role) => role.project_resource_alloc)
  @JoinColumn({ name: 'project_role' })
  role: Roles;
  @ManyToOne(() => Project, (project) => project.project_id_resource_alloc)
  @JoinColumn({ name: 'project_id' })
  project_id_resource_alloc: Project;
  @ManyToOne(() => User, (user) => user.allocated_user)
  @JoinColumn({ name: 'user_id' })
  allocated_user: User;
  @ManyToOne(() => User, (user) => user.allocation_assigned_by)
  @JoinColumn({ name: 'assigned_by' })
  allocation_assigned_by: User;

  @OneToMany(() => TaskHistory, (task_history) => task_history.allocation_data)
  allocation_data: TaskHistory[];
}
