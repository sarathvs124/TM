import { User } from '../Entity/User';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  profile_id: number;
  @Column({ nullable: true, name: 'first_name', type: 'varchar', length: 52 })
  first_name: string;
  @Column({ nullable: true, type: 'varchar', length: 52 })
  last_name: string;
  @Column({ nullable: true, type: 'varchar', length: 15 })
  phone_no: string;
  @Column({ nullable: true })
  profile_photo: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column({ nullable: false })
  created_date: Date;
  @Column({ nullable: false })
  updated_date: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
