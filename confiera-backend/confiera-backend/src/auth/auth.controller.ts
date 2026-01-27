import { Controller, Post, Body, Get, Query, Req, Res, Ip, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Ip() ip: string
    ) {
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const { accessToken, refreshToken, user } = await this.authService.login(dto, ip, userAgent);

        // Secure Refresh Token Cookie
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return { accessToken, user };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Ip() ip: string
    ) {
        const refreshToken = (req as any).cookies['refresh_token'];
        const userAgent = req.headers['user-agent'] || 'Unknown';

        const tokens = await this.authService.refreshTokens(refreshToken, ip, userAgent);

        // Update cookie with rotated token
        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { accessToken: tokens.accessToken };
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = (req as any).cookies['refresh_token'];
        await this.authService.logout(refreshToken);
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }
}
