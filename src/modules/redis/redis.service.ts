import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleInit {
    private client: Redis;

    onModuleInit() {
        this.client = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }

    async get<T>(key: string): Promise<T | null> {
        return await this.client.get<T>(key);
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.set(key, value, { ex: ttl });
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }
}
