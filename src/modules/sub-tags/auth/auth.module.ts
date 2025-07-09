import { Module  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { QueueModule } from '../queue/queue.module'; 
// import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      QueueModule, 
    ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
