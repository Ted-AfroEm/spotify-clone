import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
// import type { Connection } from 'src/common/constants/connection';

@Injectable()
export class SongsService {
  private readonly songs: CreateSongDto[] = [];
  private readonly logger = new Logger(SongsService.name);

  constructor(
    @InjectRepository(Song) private songRepository: Repository<Song>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');
    return paginate<Song>(this.songRepository, options);
  }

  async create(songDTO: CreateSongDto): Promise<Song> {
    try {
      const song = this.songRepository.create({
        ...songDTO,
        releasedDate: new Date(songDTO.releasedDate),
      });

      const savedSong = await this.songRepository.save(song);
      this.logger.log(`Song created successfully: ${savedSong.title}`);

      return savedSong;
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(`Failed to create song: ${err.message}`, err.stack);
      } else {
        this.logger.error(`Failed to create song: ${String(err)}`);
      }
      throw new BadRequestException('Failed to create song');
    }
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
