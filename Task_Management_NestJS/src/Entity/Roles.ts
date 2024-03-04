import { ProjectResourceAllocation } from '../Entity/Project_resource_allocation';
import { User } from './User';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectHistory } from './Project_history';

@Entity({ name: 'roles' })
export class Roles {
  @PrimaryGeneratedColumn()
  role_id: number;
  @Column({ nullable: true })
  role_name: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
  @Column({ type: 'tinyint' })
  authority: number;

  @OneToMany(() => User, (user) => user.role)
  user: User[];
  @OneToMany(() => ProjectResourceAllocation, (alloc) => alloc.role)
  project_resource_alloc: ProjectResourceAllocation[];
  @OneToMany(
    () => ProjectHistory,
    (project_history) => project_history.resource_allocation_role,
  )
  resource_allocation_role: ProjectHistory[];
  @OneToMany(
    () => ProjectHistory,
    (project_history) => project_history.new_resource_allocation_role,
  )
  new_resource_allocation_role: ProjectHistory[];
}
