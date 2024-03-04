import { User } from '../Entity/User';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project';

@Entity({ name: 'pin_project' })
export class PinProject {
  @PrimaryGeneratedColumn()
  pin_id: number;
  @Column({ type: 'tinyint' })
  pin_status: number;
  @Column({ type: 'tinyint' })
  status: number;
  @Column()
  pin_order: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;

  @ManyToOne(() => Project, (project) => project.project_id_pin)
  @JoinColumn({ name: 'project_id' })
  project_id_pin: Project;
  @ManyToOne(() => User, (user) => user.user_id_pin)
  @JoinColumn({ name: 'user_id' })
  user_id_pin: User;
}
