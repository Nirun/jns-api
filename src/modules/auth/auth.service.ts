import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.prisma.users_api.findUnique({
            where: { username },
        });
        if (user && (await bcrypt.compare(pass, user.password_hash))) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                api_key: user.api_key,
            },
        };
    }

    async validateApiKey(apiKey: string): Promise<any> {
        const user = await this.prisma.users_api.findUnique({
            where: { api_key: apiKey },
        });
        if (user) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async register(username: string, pass: string) {
        const existingUser = await this.prisma.users_api.findUnique({
            where: { username },
        });
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const password_hash = await bcrypt.hash(pass, 10);
        const user = await this.prisma.users_api.create({
            data: {
                username,
                password_hash,
            },
        });

        const { password_hash: _, ...result } = user;
        return result;
    }
}
