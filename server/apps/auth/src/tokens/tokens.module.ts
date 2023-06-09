import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from '../../models/tokens.model';
import { TokensController } from './tokens.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [TokensService],
  exports: [TokensService],
  imports: [
    SequelizeModule.forFeature([Token]),
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [TokensController],
})
export class TokensModule {}
