import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('register')
export class RegisterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;
}
