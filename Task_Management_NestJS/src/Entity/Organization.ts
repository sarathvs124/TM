import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn()
  organization_id: number;
  @Column({ nullable: true })
  organization_name: string;
  @Column({ type: 'tinyint' })
  status: number;
  @Column()
  created_date: Date;
  @Column()
  updated_date: Date;
}
