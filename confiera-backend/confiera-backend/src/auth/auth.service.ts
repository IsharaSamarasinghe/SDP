import { Injectable, ForbiddenException, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma, User, TokenType, AccountStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
        private mailService: MailService,
    ) { }

    async signup(dto: SignupDto) {
        // Domain validation for University of Kelaniya
        if (dto.organization === 'University of Kelaniya' && dto.email && !dto.email.toLowerCase().endsWith('kln.ac.lk')) {
            throw new BadRequestException('University of Kelaniya email must be a valid kln.ac.lk domain email');
        }

        // Check if user exists
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) throw new BadRequestException('Email already in use');

        // Hash password (Argon2id preferred)
        const passwordHash = await argon2.hash(dto.password);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                organization: dto.organization,
                country: dto.country,
                countryCode: dto.countryCode,
                studentId: dto.studentId,
                nic: dto.nic,
                ieeeId: dto.ieeeId,
                address: dto.address,
                accountStatus: AccountStatus.PENDING_VERIFICATION,
                emailVerifiedAt: null,
            },
        });

        // Assign default role (Participant)
        const role = await this.prisma.role.upsert({
            where: { roleName: 'Participant' },
            update: {},
            create: { roleName: 'Participant' },
        });

        await this.prisma.userRole.create({
            data: {
                userId: user.userId,
                roleId: role.roleId,
            },
        });

        // Generate Verification Token
        const verificationToken = this.generateRandomToken();
        const tokenHash = this.hashToken(verificationToken);

        await this.prisma.userToken.create({
            data: {
                userId: user.userId,
                tokenType: TokenType.EMAIL_VERIFY,
                tokenHash: tokenHash,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        // Send Verification Email
        await this.mailService.sendVerificationEmail(user.email, verificationToken);

        return { message: 'User created. Please check your email to verify account.' };
    }

    async login(dto: LoginDto, ip: string, userAgent: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { roles: { include: { role: true } } },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const pwMatches = await argon2.verify(user.passwordHash, dto.password);
        if (!pwMatches) throw new UnauthorizedException('Invalid credentials');

        if (user.accountStatus !== AccountStatus.ACTIVE) {
            // Optional: block login. 
            // For better UX, we might allow login but restrict access via Guards, 
            // OR just block here. The user requested "choose safer approach". Blocking is safer/simpler.
            if (user.accountStatus === AccountStatus.SUSPENDED) throw new ForbiddenException('Account suspended');
            if (user.accountStatus === AccountStatus.PENDING_VERIFICATION) throw new ForbiddenException('Please verify your email first');
        }

        const { accessToken, refreshToken, sessionId } = await this.generateTokens(user.userId, user.email, user.roles.map(r => r.role.roleName));

        // Create/Update Session
        const refreshTokenHash = await argon2.hash(refreshToken);
        const sessionIdBuffer = Buffer.from(sessionId, 'hex'); // binary(16)

        await this.prisma.session.create({
            data: {
                sessionId: sessionIdBuffer,
                userId: user.userId,
                refreshTokenHash,
                ipAddress: ip ? Buffer.from(ip) : null,
                userAgent: userAgent?.substring(0, 255),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                lastActiveAt: new Date(),
            }
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.userId.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles.map(r => r.role.roleName)
            }
        };
    }

    async verifyEmail(token: string) {
        const tokenHash = this.hashToken(token);
        // In optimized SQL we might query by hash directly, but we need to check validity
        // Since we don't know the userId from the token itself (only random string), we search by tokenHash
        // (Prisma doesn't easily support looking up by loose fields unless unique, but tokenHash isn't unique in schema by strict constraint, though effectively is)
        // Actually, we can findFirst.

        const record = await this.prisma.userToken.findFirst({
            where: {
                tokenType: TokenType.EMAIL_VERIFY,
                tokenHash: tokenHash,
                usedAt: null,
                expiresAt: { gt: new Date() }
            }
        });

        if (!record) throw new BadRequestException('Invalid or expired verification token');

        // Mark used
        await this.prisma.userToken.update({
            where: { tokenId: record.tokenId },
            data: { usedAt: new Date() }
        });

        // Activate user
        await this.prisma.user.update({
            where: { userId: record.userId },
            data: {
                accountStatus: AccountStatus.ACTIVE,
                emailVerifiedAt: new Date(),
            }
        });

        return { message: 'Email verified successfully' };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { roles: { include: { role: true } } }
        });

        // Avoid enumeration: return success even if not found
        if (!user) return { message: 'If that email exists, a reset link has been sent.' };

        // Role check: Only Participant or Author
        const allowedRoles = ['Participant', 'Author'];
        const hasAllowedRole = user.roles.some(ur => allowedRoles.includes(ur.role.roleName));
        if (!hasAllowedRole) return { message: 'If that email exists, a reset link has been sent.' };

        const token = this.generateRandomToken();
        const tokenHash = this.hashToken(token);

        await this.prisma.userToken.create({
            data: {
                userId: user.userId,
                tokenType: TokenType.PASSWORD_RESET,
                tokenHash: tokenHash,
                expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
            }
        });

        // Send Reset Email
        await this.mailService.sendPasswordResetEmail(user.email, token);

        return { message: 'If that email exists, a reset link has been sent.' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const tokenHash = this.hashToken(dto.token);
        const record = await this.prisma.userToken.findFirst({
            where: {
                tokenType: TokenType.PASSWORD_RESET,
                tokenHash: tokenHash,
                usedAt: null,
                expiresAt: { gt: new Date() }
            }
        });

        if (!record) throw new BadRequestException('Invalid or expired reset token');

        await this.prisma.userToken.update({
            where: { tokenId: record.tokenId },
            data: { usedAt: new Date() }
        });

        const passwordHash = await argon2.hash(dto.newPassword);
        await this.prisma.user.update({
            where: { userId: record.userId },
            data: { passwordHash }
        });

        // Revoke all sessions
        await this.prisma.session.updateMany({
            where: { userId: record.userId, revokedAt: null },
            data: { revokedAt: new Date() }
        });

        return { message: 'Password reset successfully' };
    }

    async logout(refreshToken: string) {
        if (!refreshToken) return;

        try {
            const payload = this.jwtService.decode(refreshToken);
            if (payload && payload['sid']) {
                await this.prisma.session.update({
                    where: { sessionId: Buffer.from(payload['sid'], 'hex') },
                    data: { revokedAt: new Date() }
                });
            }
        } catch (e) {
            // invalid token
        }
    }

    async refreshTokens(refreshToken: string, ip: string, userAgent: string) {
        if (!refreshToken) throw new UnauthorizedException('No Refresh Token');

        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
        } catch (e) {
            throw new UnauthorizedException('Invalid Refresh Token');
        }

        const sessionIdStr = payload['sid'];
        if (!sessionIdStr) throw new UnauthorizedException('Invalid Token Structure');

        const sessionId = Buffer.from(sessionIdStr, 'hex');

        const session = await this.prisma.session.findUnique({
            where: { sessionId },
        });

        if (!session) throw new UnauthorizedException('Session not found');
        if (session.revokedAt) throw new UnauthorizedException('Session revoked');
        if (session.expiresAt < new Date()) throw new UnauthorizedException('Session expired');

        // Verify hash
        if (!session.refreshTokenHash) {
            throw new UnauthorizedException('Invalid session state');
        }
        const isValid = await argon2.verify(session.refreshTokenHash, refreshToken);
        if (!isValid) {
            // Token Reuse Detection! Revoke session
            await this.prisma.session.update({
                where: { sessionId },
                data: { revokedAt: new Date() }
            });
            throw new UnauthorizedException('Invalid Refresh Token');
        }

        // Rotate
        const user = await this.prisma.user.findUnique({
            where: { userId: session.userId },
            include: { roles: { include: { role: true } } },
        });
        if (!user) throw new UnauthorizedException('User not found');

        const tokens = await this.generateTokens(user.userId, user.email, user.roles.map(r => r.role.roleName), sessionIdStr);

        // Update session
        await this.prisma.session.update({
            where: { sessionId },
            data: {
                refreshTokenHash: await argon2.hash(tokens.refreshToken),
                rotatedAt: new Date(),
                lastActiveAt: new Date(),
                ipAddress: ip ? Buffer.from(ip) : null,
                userAgent: userAgent?.substring(0, 255),
            }
        });

        return tokens;
    }

    // --- Helpers ---

    async generateTokens(userId: bigint, email: string, roles: string[], existingSessionId?: string) {
        const sessionId = existingSessionId || crypto.randomUUID().replace(/-/g, ''); // hex string

        const payload = {
            sub: userId.toString(),
            email,
            roles,
            sid: sessionId
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });

        return { accessToken, refreshToken, sessionId };
    }

    private generateRandomToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}
