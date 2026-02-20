import { Controller, Post, Body, UsePipes, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { RegisterDto, RegisterSchema } from './dto/register.dto';
import { ZodValidationPipe } from '@shared/pipes/zod-validation.pipe';
import { Public } from '@shared/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(LoginSchema))
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Public()
    @Post('register')
    @UsePipes(new ZodValidationPipe(RegisterSchema))
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }
}
