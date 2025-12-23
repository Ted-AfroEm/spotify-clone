import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/entities/song.entity';
import { ArtistsModule } from './artists/artists.module';
import { UsersModule } from './users/users.module';
import { Artist } from './artists/entities/artist.entity';
import { User } from './users/entities/user.entity';
import { PlaylistModule } from './playlist/playlist.module';
import { Playlist } from './playlist/entities/playlist.entity';
import { AuthModule } from './auth/auth.module';

const devConfig = {
  port: 3000,
};
const proConfig = {
  port: 400,
};
@Module({
  imports: [
    SongsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pgadmin',
      password: '1234',
      database: 'spotify-clone-db',
      entities: [Song, Artist, User, Playlist],
      synchronize: true,
    }),
    UsersModule,
    ArtistsModule,
    PlaylistModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService,
    },
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig : proConfig;
      },
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // you can specify which routes / HTTP methods it should apply to:
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    // optionally you can exclude certain paths:
    // .exclude({ path: 'auth', method: RequestMethod.ALL })
  }
}
