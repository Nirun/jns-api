import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
    constructor(private authService: AuthService) {
        super({ header: 'X-API-KEY', prefix: '' }, false);
    }

    async validate(apiKey: string) {
        const user = await this.authService.validateApiKey(apiKey);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
