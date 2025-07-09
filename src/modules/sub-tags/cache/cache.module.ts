// src/cache/cache.module.ts
import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 30,
      max: 100,
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}
