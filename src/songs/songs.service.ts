import { Inject, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import type { Connection } from 'src/common/constants/connection';

@Injectable()
export class SongsService {
  private readonly songs: CreateSongDto[] = [];

  constructor(@Inject('CONNECTION') connection: Connection) {
    console.log('connection string', connection.CONNECTION_STRING);
  }

  create(createSongDTO: CreateSongDto) {
    this.songs.push(createSongDTO);
    return this.songs;
  }

  findAll() {
    throw new Error('Error in Db while feting record');
    return this.songs;
  }
}
