import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Song } from 'src/songs/entities/song.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist) private playListRepo: Repository<Playlist>,
    @InjectRepository(Song) private songRepo: Repository<Song>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ){}
  async create(createPlaylistDto: CreatePlaylistDto) {

    const playList = new Playlist();
    playList.name = createPlaylistDto.name;

    const songs = await this.songRepo.findBy({ id: In(createPlaylistDto.songs) });

    playList.songs = songs;

    const user = await this.userRepo.findOneBy({ id: createPlaylistDto.user });
    
    if(!user){
      throw new NotFoundException('User not found');
    }

    playList.user = user;
    return this.playListRepo.save(playList);
  }

  findAll() {
    return `This action returns all playlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
