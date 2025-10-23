import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/entities/artist.entity';
// import type { Connection } from 'src/common/constants/connection';

@Injectable()
export class SongsService {
  private readonly songs: CreateSongDto[] = [];
  private readonly logger = new Logger(SongsService.name);

  constructor(
    @InjectRepository(Song) private songRepository: Repository<Song>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');
    return paginate<Song>(this.songRepository, options);
  }

  async create(songDTO: CreateSongDto): Promise<Song> {
    const artistIds: number[] = songDTO.artists as number[];

    const artists = await this.artistRepository.findBy({
      id: In(artistIds),
    });

    const song = this.songRepository.create({
      ...songDTO,
      releasedDate: new Date(songDTO.releasedDate),
      artists: artists,
    });

    const savedSong = await this.songRepository.save(song);

    this.logger.log(`Song created successfully`);

    return savedSong;
  }

  findOne(id: number): Promise<Song | null> {
    return this.songRepository.findOneBy({ id });
  }

  findAll(): Promise<Song[]> {
    return this.songRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.songRepository.delete(id);
  }

  update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
    return this.songRepository.update(id, recordToUpdate);
  }
}
