import { Exclude } from 'class-transformer';
import { Playlist } from 'src/playlist/entities/playlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Playlist , (playList) => playList.user)
  playLists: Playlist[];
}
