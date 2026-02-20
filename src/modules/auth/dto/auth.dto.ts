import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'johndoe', description: 'The unique username for the user' })
    username: string;

    @ApiProperty({ example: 'password123', description: 'The password for the user' })
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
    username: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    password: string;
}
