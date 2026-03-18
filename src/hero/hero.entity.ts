import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('heroes')
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  civilName: string;

  @Column({ type: 'varchar', length: 100 })
  heroName: string;

  @Column()
  age: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  team?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photoUrl?: string;
}
